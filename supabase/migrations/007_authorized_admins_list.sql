-- ==============================================================================
-- MIGRATION 007: Authorized Admins List & Multi-Admin Security Rule (Phase 4.6)
-- ==============================================================================
-- Description: Replaces the single static admin check with a dynamic, RLS-protected
-- `authorized_admins` table. Allows existing admins to grant and revoke access,
-- while strictly preserving database-level privilege escalation protection and
-- preventing lockout (cannot delete the last remaining administrator).
-- ==============================================================================

-- 1. Create table for authorized administrators
CREATE TABLE IF NOT EXISTS authorized_admins (
    email TEXT PRIMARY KEY,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    added_by TEXT
);

-- 2. Migrate existing admin from app_config or fallback to ensure zero downtime
DO $$
DECLARE
    current_admin TEXT;
BEGIN
    -- Try reading from app_config
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'app_config') THEN
        SELECT value INTO current_admin FROM app_config WHERE key = 'admin_email' LIMIT 1;
    END IF;

    -- If not found, try reading from database setting
    IF current_admin IS NULL OR current_admin = '' THEN
        BEGIN
            current_admin := current_setting('app.admin_email', true);
        EXCEPTION WHEN OTHERS THEN
            current_admin := NULL;
        END;
    END IF;

    -- If still not found, try reading from profiles
    IF current_admin IS NULL OR current_admin = '' THEN
        SELECT email INTO current_admin FROM profiles LIMIT 1;
    END IF;

    -- Insert into authorized_admins if we found an email
    IF current_admin IS NOT NULL AND current_admin <> '' THEN
        INSERT INTO authorized_admins (email, added_by)
        VALUES (LOWER(TRIM(current_admin)), 'migration_007')
        ON CONFLICT (email) DO NOTHING;
    END IF;

    -- If table is still empty, populate with fallback to prevent lockout
    IF NOT EXISTS (SELECT 1 FROM authorized_admins) THEN
        INSERT INTO authorized_admins (email, added_by)
        VALUES ('danielsan579@gmail.com', 'initial_bootstrap')
        ON CONFLICT (email) DO NOTHING;
    END IF;
END $$;

-- 3. Update is_authorized_admin() function to verify existence in authorized_admins
CREATE OR REPLACE FUNCTION is_authorized_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM authorized_admins
            WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Enable Row Level Security on authorized_admins
ALTER TABLE authorized_admins ENABLE ROW LEVEL SECURITY;

-- 5. Strict RLS Policies for authorized_admins
-- Only active authorized admins can view the list of admins
DROP POLICY IF EXISTS "Authorized admins can view admin list" ON authorized_admins;
CREATE POLICY "Authorized admins can view admin list"
    ON authorized_admins FOR SELECT
    USING (is_authorized_admin());

-- Only active authorized admins can insert a new admin
DROP POLICY IF EXISTS "Authorized admins can insert new admin" ON authorized_admins;
CREATE POLICY "Authorized admins can insert new admin"
    ON authorized_admins FOR INSERT
    WITH CHECK (is_authorized_admin());

-- Only active authorized admins can delete an admin
DROP POLICY IF EXISTS "Authorized admins can delete admin" ON authorized_admins;
CREATE POLICY "Authorized admins can delete admin"
    ON authorized_admins FOR DELETE
    USING (is_authorized_admin());

-- Only active authorized admins can update an admin
DROP POLICY IF EXISTS "Authorized admins can update admin" ON authorized_admins;
CREATE POLICY "Authorized admins can update admin"
    ON authorized_admins FOR UPDATE
    USING (is_authorized_admin())
    WITH CHECK (is_authorized_admin());

-- 6. Trigger to prevent deleting the last remaining administrator (Anti-Lockout Rule)
CREATE OR REPLACE FUNCTION prevent_delete_last_admin()
RETURNS TRIGGER AS $$
DECLARE
    admin_count INT;
BEGIN
    SELECT COUNT(*) INTO admin_count FROM authorized_admins;
    IF admin_count <= 1 THEN
        RAISE EXCEPTION 'Operação negada: Não é permitido remover o único administrador restante do sistema.';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_delete_last_admin ON authorized_admins;
CREATE TRIGGER trg_prevent_delete_last_admin
BEFORE DELETE ON authorized_admins
FOR EACH ROW
EXECUTE FUNCTION prevent_delete_last_admin();
