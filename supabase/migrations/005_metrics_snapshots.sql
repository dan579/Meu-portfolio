-- ==============================================================================
-- MIGRATION 005: Metrics Snapshots & Items (Phase 5 - Operis Integration)
-- ==============================================================================

-- 1. Create metrics_snapshots Table
CREATE TABLE IF NOT EXISTS metrics_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_label_pt TEXT NOT NULL,      -- ex: "Jan–Jun 2026"
    period_label_en TEXT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    source_system TEXT NOT NULL DEFAULT 'Operis',
    entry_method TEXT NOT NULL DEFAULT 'manual' CHECK (entry_method IN ('manual','automated')),
    summary_pt TEXT,                    -- contextual sentence, ex: "Volume de chamados gerenciados no período"
    summary_en TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (source_system, period_start, period_end)
);

-- 2. Create metric_items Table
CREATE TABLE IF NOT EXISTS metric_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    snapshot_id UUID NOT NULL REFERENCES metrics_snapshots(id) ON DELETE CASCADE,
    label_pt TEXT NOT NULL,             -- ex: "Cumprimento de SLA"
    label_en TEXT NOT NULL,
    value TEXT NOT NULL,                -- free-form text: "94%", "1.240 tarefas", "2h 15min médio"
    context_pt TEXT,                    -- short explanation of what the metric indicates
    context_en TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- 3. Indexes for fast retrieval
CREATE INDEX IF NOT EXISTS idx_metrics_snapshots_status_sort ON metrics_snapshots(status, sort_order);
CREATE INDEX IF NOT EXISTS idx_metric_items_snapshot_sort ON metric_items(snapshot_id, sort_order);

-- 4. Enable Row Level Security
ALTER TABLE metrics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE metric_items ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if re-running
DROP POLICY IF EXISTS "public_read_published_snapshots" ON metrics_snapshots;
DROP POLICY IF EXISTS "public_read_items_of_published_snapshots" ON metric_items;
DROP POLICY IF EXISTS "admin_write_snapshots" ON metrics_snapshots;
DROP POLICY IF EXISTS "admin_write_items" ON metric_items;

-- 6. Public read: only published snapshots or authorized admin
CREATE POLICY "public_read_published_snapshots" ON metrics_snapshots
    FOR SELECT USING (status = 'published' OR is_authorized_admin());

CREATE POLICY "public_read_items_of_published_snapshots" ON metric_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM metrics_snapshots s
            WHERE s.id = metric_items.snapshot_id
            AND (s.status = 'published' OR is_authorized_admin())
        )
    );

-- 7. Admin write: authorized admin only
CREATE POLICY "admin_write_snapshots" ON metrics_snapshots
    FOR ALL USING (is_authorized_admin()) WITH CHECK (is_authorized_admin());

CREATE POLICY "admin_write_items" ON metric_items
    FOR ALL USING (is_authorized_admin()) WITH CHECK (is_authorized_admin());
