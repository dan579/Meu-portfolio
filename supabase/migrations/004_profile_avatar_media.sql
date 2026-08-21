-- ==============================================================================
-- MIGRATION 004: Profile Avatar Media Asset Reference (Phase 4.2)
-- ==============================================================================

-- 1. Add avatar_media_id foreign key column to profiles table referencing media_assets
ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS avatar_media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL;

-- 2. Create index for fast avatar media lookups
CREATE INDEX IF NOT EXISTS idx_profiles_avatar_media_id ON profiles(avatar_media_id);
