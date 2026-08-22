-- ==============================================================================
-- MIGRATION 006: Replace Work Focus Percentages with Qualitative Description (Phase 4.3)
-- ==============================================================================
-- Description: Replaces arbitrary work focus percentage metrics with qualitative,
-- context-rich descriptive fields for the dual pillars of Infrastructure and Systems.
-- ==============================================================================

-- 1. Add qualitative description columns (bilingual)
ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS work_focus_description_pt TEXT,
    ADD COLUMN IF NOT EXISTS work_focus_description_en TEXT;

-- 2. Populate default qualitative descriptions
UPDATE profiles
SET 
    work_focus_description_pt = COALESCE(
        work_focus_description_pt,
        'Atuação integrada que combina a sustentação operacional de infraestrutura corporativa, servidores Windows/Linux, virtualização e redes com o desenvolvimento de software moderno (React, TypeScript, SQL). A experiência prática na ponta com suporte e incidentes enriquece diretamente a arquitetura de sistemas com visão de confiabilidade, segurança e usabilidade real.'
    ),
    work_focus_description_en = COALESCE(
        work_focus_description_en,
        'Integrated technical approach bridging enterprise infrastructure management, Windows/Linux server administration, virtualization, and network operations with modern software engineering (React, TypeScript, SQL). Hands-on frontline support experience directly enhances system architecture with focus on operational resilience, security, and real-world workflow efficiency.'
    )
WHERE work_focus_description_pt IS NULL OR work_focus_description_en IS NULL;

-- 3. Drop constraint on percentage sum to decouple from rigid numeric ratios
ALTER TABLE profiles
    DROP CONSTRAINT IF EXISTS check_work_focus_sum;

-- 4. Make percentage columns nullable for backwards compatibility
ALTER TABLE profiles
    ALTER COLUMN work_focus_infra_percentage DROP NOT NULL,
    ALTER COLUMN work_focus_systems_percentage DROP NOT NULL;
