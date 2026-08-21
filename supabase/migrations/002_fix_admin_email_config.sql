-- ==============================================================================
-- MIGRATION 002: FIX ADMIN EMAIL CONFIGURATION IN is_authorized_admin()
-- ==============================================================================
-- Description:
-- Removes any hardcoded literal email address from database code and delegates
-- authorization strictly to the database-level setting `app.admin_email`.
--
-- MANUAL PREREQUISITE (Run once in Supabase SQL Editor with your real admin email):
-- ALTER DATABASE postgres SET app.admin_email = 'seuemail@exemplo.com';
-- ==============================================================================

-- Update the security definer function to check ONLY against app.admin_email
CREATE OR REPLACE FUNCTION is_authorized_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.role() = 'authenticated' AND
        current_setting('app.admin_email', true) = auth.jwt() ->> 'email'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
