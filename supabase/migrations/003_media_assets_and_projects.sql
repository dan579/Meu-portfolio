-- ==============================================================================
-- MIGRATION 003: Supabase Storage for Media Assets & Project Media Normalization
-- ==============================================================================

-- 1. Create Media Storage Bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'media',
    'media',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- 2. Storage RLS Policies
DROP POLICY IF EXISTS "Public Read Media Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Insert Media Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Media Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Media Storage" ON storage.objects;

-- Public can read all media files
CREATE POLICY "Public Read Media Storage"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'media');

-- Only authorized admin can upload media files
CREATE POLICY "Admin Insert Media Storage"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'media' AND
        is_authorized_admin()
    );

-- Only authorized admin can update media files
CREATE POLICY "Admin Update Media Storage"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'media' AND
        is_authorized_admin()
    )
    WITH CHECK (
        bucket_id = 'media' AND
        is_authorized_admin()
    );

-- Only authorized admin can delete media files
CREATE POLICY "Admin Delete Media Storage"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'media' AND
        is_authorized_admin()
    );

-- 3. Media Assets Metadata Table
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    storage_path TEXT NOT NULL,       -- Caminho no bucket (ex: 'uploads/screenshot-1.webp')
    public_url TEXT NOT NULL,         -- URL pública direta resolvida
    file_name TEXT NOT NULL,          -- Nome original do arquivo
    mime_type TEXT NOT NULL,          -- MIME type (ex: image/png, image/webp)
    size_bytes INTEGER,               -- Tamanho em bytes
    alt_text_pt TEXT,                 -- Texto alternativo acessível (PT)
    alt_text_en TEXT,                 -- Texto alternativo acessível (EN)
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on media_assets
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public media assets read" ON media_assets;
DROP POLICY IF EXISTS "Admin manage media assets" ON media_assets;

-- Anyone can read media assets metadata
CREATE POLICY "Public media assets read"
    ON media_assets FOR SELECT
    USING (true);

-- Only single authorized admin can insert/update/delete media assets
CREATE POLICY "Admin manage media assets"
    ON media_assets FOR ALL
    USING (is_authorized_admin())
    WITH CHECK (is_authorized_admin());

-- 4. Project Media Associative Table (Normalized Project Gallery)
CREATE TABLE IF NOT EXISTS project_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    media_asset_id UUID REFERENCES media_assets(id) ON DELETE RESTRICT,
    title_pt VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_pt TEXT NOT NULL,
    description_en TEXT NOT NULL,
    caption_pt VARCHAR(255) NOT NULL,
    caption_en VARCHAR(255) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public project media read" ON project_media;
DROP POLICY IF EXISTS "Admin manage project media" ON project_media;

CREATE POLICY "Public project media read"
    ON project_media FOR SELECT
    USING (true);

CREATE POLICY "Admin manage project media"
    ON project_media FOR ALL
    USING (is_authorized_admin())
    WITH CHECK (is_authorized_admin());

-- Indexes for optimal lookup performance
CREATE INDEX IF NOT EXISTS idx_media_assets_uploaded_at ON media_assets(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_media_project_id ON project_media(project_id);
CREATE INDEX IF NOT EXISTS idx_project_media_sort_order ON project_media(sort_order);
