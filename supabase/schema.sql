-- ==============================================================================
-- INTERACTIVE CV - SUPABASE (POSTGRESQL) SCHEMA & MIGRATION SCRIPT
-- ==============================================================================
-- Description: Complete relational schema for Daniel Santos da Silva's Interactive CV
-- Includes tables for Profile, Education, Certifications, Experiences, Infrastructure,
-- Skills, Projects, and Contact with bilingual support (PT/EN), status control,
-- sort ordering, full seed data, and Row Level Security (RLS) policies.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL DEFAULT 'Daniel Santos da Silva',
    short_name VARCHAR(100) NOT NULL DEFAULT 'Daniel Santos',
    initials VARCHAR(10) NOT NULL DEFAULT 'DS',
    current_role_pt VARCHAR(255) NOT NULL,
    current_role_en VARCHAR(255) NOT NULL,
    target_role_pt VARCHAR(255) NOT NULL,
    target_role_en VARCHAR(255) NOT NULL,
    headline_pt TEXT NOT NULL,
    headline_en TEXT NOT NULL,
    short_summary_pt TEXT NOT NULL,
    short_summary_en TEXT NOT NULL,
    full_bio_pt TEXT[] NOT NULL DEFAULT '{}',
    full_bio_en TEXT[] NOT NULL DEFAULT '{}',
    location VARCHAR(255) NOT NULL DEFAULT 'Belo Horizonte, MG • Brasil',
    email VARCHAR(255) NOT NULL DEFAULT 'contato@danielsantos.dev',
    linkedin VARCHAR(255) NOT NULL,
    linkedin_display VARCHAR(255) NOT NULL,
    github VARCHAR(255) NOT NULL,
    github_display VARCHAR(255) NOT NULL,
    availability_pt VARCHAR(255) NOT NULL,
    availability_en VARCHAR(255) NOT NULL,
    work_focus_infra_percentage INTEGER NOT NULL DEFAULT 60 CHECK (work_focus_infra_percentage >= 0 AND work_focus_infra_percentage <= 100),
    work_focus_systems_percentage INTEGER NOT NULL DEFAULT 40 CHECK (work_focus_systems_percentage >= 0 AND work_focus_systems_percentage <= 100),
    work_focus_infra_label_pt VARCHAR(255) NOT NULL DEFAULT 'Infraestrutura & Redes',
    work_focus_infra_label_en VARCHAR(255) NOT NULL DEFAULT 'Infrastructure & Networks',
    work_focus_systems_label_pt VARCHAR(255) NOT NULL DEFAULT 'Sistemas & Desenvolvimento',
    work_focus_systems_label_en VARCHAR(255) NOT NULL DEFAULT 'Systems & Development',
    work_focus_note_pt TEXT NOT NULL,
    work_focus_note_en TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_work_focus_sum CHECK (work_focus_infra_percentage + work_focus_systems_percentage = 100)
);

-- ------------------------------------------------------------------------------
-- 2. EDUCATION ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS education_items (
    id VARCHAR(100) PRIMARY KEY,
    institution VARCHAR(255) NOT NULL,
    degree_pt VARCHAR(255) NOT NULL,
    degree_en VARCHAR(255) NOT NULL,
    field_pt VARCHAR(255) NOT NULL,
    field_en VARCHAR(255) NOT NULL,
    period_pt VARCHAR(100) NOT NULL,
    period_en VARCHAR(100) NOT NULL,
    status_pt VARCHAR(100) NOT NULL,
    status_en VARCHAR(100) NOT NULL,
    description_pt TEXT,
    description_en TEXT,
    highlights_pt TEXT[] DEFAULT '{}',
    highlights_en TEXT[] DEFAULT '{}',
    sort_order INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. CERTIFICATION ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certification_items (
    id VARCHAR(100) PRIMARY KEY,
    name_pt VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    year VARCHAR(20) NOT NULL,
    credential_url TEXT,
    badge VARCHAR(100),
    sort_order INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. EXPERIENCES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS experiences (
    id VARCHAR(100) PRIMARY KEY,
    role_pt VARCHAR(255) NOT NULL,
    role_en VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    period_pt VARCHAR(100) NOT NULL,
    period_en VARCHAR(100) NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT false,
    type_pt VARCHAR(255) NOT NULL,
    type_en VARCHAR(255) NOT NULL,
    summary_pt TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    responsibilities_pt TEXT[] NOT NULL DEFAULT '{}',
    responsibilities_en TEXT[] NOT NULL DEFAULT '{}',
    technologies TEXT[] NOT NULL DEFAULT '{}',
    key_achievements_pt TEXT[] DEFAULT '{}',
    key_achievements_en TEXT[] DEFAULT '{}',
    sort_order INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. INFRASTRUCTURE AREAS & TECH ITEMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS infrastructure_areas (
    id VARCHAR(100) PRIMARY KEY,
    area_name_pt VARCHAR(255) NOT NULL,
    area_name_en VARCHAR(255) NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    description_pt TEXT NOT NULL,
    description_en TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS infrastructure_tech_items (
    id VARCHAR(100) PRIMARY KEY,
    area_id VARCHAR(100) REFERENCES infrastructure_areas(id) ON DELETE CASCADE,
    technology VARCHAR(255) NOT NULL,
    purpose_pt TEXT NOT NULL,
    purpose_en TEXT NOT NULL,
    applied_context_pt TEXT NOT NULL,
    applied_context_en TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    sort_order INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. SKILL CATEGORIES & SKILL ITEMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skill_categories (
    id VARCHAR(100) PRIMARY KEY,
    title_pt VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_pt TEXT NOT NULL,
    description_en TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skill_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id VARCHAR(100) REFERENCES skill_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    applied_context_pt TEXT NOT NULL,
    applied_context_en TEXT NOT NULL,
    category_key VARCHAR(50) NOT NULL CHECK (category_key IN ('infra', 'systems', 'devops', 'tools', 'methods')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. PROJECTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle_pt VARCHAR(255) NOT NULL,
    subtitle_en VARCHAR(255) NOT NULL,
    short_summary_pt TEXT NOT NULL,
    short_summary_en TEXT NOT NULL,
    category_pt VARCHAR(100) NOT NULL,
    category_en VARCHAR(100) NOT NULL,
    project_status VARCHAR(50) NOT NULL DEFAULT 'in-development' CHECK (project_status IN ('in-development', 'completed')),
    status_label_pt VARCHAR(100) NOT NULL,
    status_label_en VARCHAR(100) NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT false,
    badge_pt VARCHAR(100),
    badge_en VARCHAR(100),
    problem_pt TEXT NOT NULL,
    problem_en TEXT NOT NULL,
    solution_pt TEXT NOT NULL,
    solution_en TEXT NOT NULL,
    architecture_overview_pt TEXT NOT NULL,
    architecture_overview_en TEXT NOT NULL,
    architecture_highlights_pt TEXT[] NOT NULL DEFAULT '{}',
    architecture_highlights_en TEXT[] NOT NULL DEFAULT '{}',
    architecture_diagram_description_pt TEXT,
    architecture_diagram_description_en TEXT,
    features_pt TEXT[] NOT NULL DEFAULT '{}',
    features_en TEXT[] NOT NULL DEFAULT '{}',
    technologies JSONB NOT NULL DEFAULT '[]',
    daniel_role_title_pt VARCHAR(255) NOT NULL,
    daniel_role_title_en VARCHAR(255) NOT NULL,
    daniel_role_contributions_pt TEXT[] NOT NULL DEFAULT '{}',
    daniel_role_contributions_en TEXT[] NOT NULL DEFAULT '{}',
    gallery JSONB NOT NULL DEFAULT '[]',
    links JSONB NOT NULL DEFAULT '[]',
    sort_order INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. CONTACT INFO TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    linkedin VARCHAR(255) NOT NULL,
    linkedin_url TEXT NOT NULL,
    github VARCHAR(255) NOT NULL,
    github_url TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    city_state_country_pt VARCHAR(255) NOT NULL,
    city_state_country_en VARCHAR(255) NOT NULL,
    availability_status_pt VARCHAR(255) NOT NULL,
    availability_status_en VARCHAR(255) NOT NULL,
    preferred_contact_pt VARCHAR(255) NOT NULL,
    preferred_contact_en VARCHAR(255) NOT NULL,
    message_note_pt TEXT NOT NULL,
    message_note_en TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- CRITICAL SECURITY RULE:
-- 1. Public unauthenticated access is allowed ONLY for reading published records.
-- 2. ALL INSERT / UPDATE / DELETE operations are strictly restricted to the authorized
--    single administrator account (matching database setting 'app.admin_email').
-- Even if an attacker manipulates client tokens or invokes the REST API directly,
-- the Postgres kernel will reject any modification unless the authenticated JWT email
-- matches the single authorized administrator email.
-- ==============================================================================

-- Helper function to check if the current requester is the authorized administrator
CREATE OR REPLACE FUNCTION is_authorized_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.role() = 'authenticated' AND
        current_setting('app.admin_email', true) = auth.jwt() ->> 'email'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE infrastructure_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE infrastructure_tech_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- RLS POLICIES FOR PROFILES
-- ------------------------------------------------------------------------------
-- Public can read the profile
CREATE POLICY "Public profiles read"
    ON profiles FOR SELECT
    USING (true);

-- Only single authorized admin can update/insert profile
CREATE POLICY "Admin manage profile"
    ON profiles FOR ALL
    USING (is_authorized_admin())
    WITH CHECK (is_authorized_admin());

-- ------------------------------------------------------------------------------
-- RLS POLICIES FOR EDUCATION & CERTIFICATIONS
-- ------------------------------------------------------------------------------
CREATE POLICY "Public education read published"
    ON education_items FOR SELECT
    USING (status = 'published' OR is_authorized_admin());

CREATE POLICY "Admin manage education"
    ON education_items FOR ALL
    USING (is_authorized_admin())
    WITH CHECK (is_authorized_admin());

CREATE POLICY "Public certs read published"
    ON certification_items FOR SELECT
    USING (status = 'published' OR is_authorized_admin());

CREATE POLICY "Admin manage certs"
    ON certification_items FOR ALL
    USING (is_authorized_admin())
    WITH CHECK (is_authorized_admin());

-- ------------------------------------------------------------------------------
-- RLS POLICIES FOR EXPERIENCES
-- ------------------------------------------------------------------------------
-- Public can only see published experiences. Draft/Archived items are completely hidden.
CREATE POLICY "Public experiences read published"
    ON experiences FOR SELECT
    USING (status = 'published' OR is_authorized_admin());

-- Only the authorized admin account can insert, update or delete experiences
CREATE POLICY "Admin manage experiences"
    ON experiences FOR ALL
    USING (is_authorized_admin())
    WITH CHECK (is_authorized_admin());

-- ------------------------------------------------------------------------------
-- RLS POLICIES FOR INFRASTRUCTURE & SKILLS
-- ------------------------------------------------------------------------------
CREATE POLICY "Public infra areas read"
    ON infrastructure_areas FOR SELECT
    USING (status = 'published' OR is_authorized_admin());

CREATE POLICY "Admin manage infra areas"
    ON infrastructure_areas FOR ALL
    USING (is_authorized_admin())
    WITH CHECK (is_authorized_admin());

CREATE POLICY "Public infra tech read"
    ON infrastructure_tech_items FOR SELECT
    USING (status = 'published' OR is_authorized_admin());

CREATE POLICY "Admin manage infra tech"
    ON infrastructure_tech_items FOR ALL
    USING (is_authorized_admin())
    WITH CHECK (is_authorized_admin());

CREATE POLICY "Public skill categories read"
    ON skill_categories FOR SELECT
    USING (status = 'published' OR is_authorized_admin());

CREATE POLICY "Admin manage skill categories"
    ON skill_categories FOR ALL
    USING (is_authorized_admin())
    WITH CHECK (is_authorized_admin());

CREATE POLICY "Public skill items read"
    ON skill_items FOR SELECT
    USING (status = 'published' OR is_authorized_admin());

CREATE POLICY "Admin manage skill items"
    ON skill_items FOR ALL
    USING (is_authorized_admin())
    WITH CHECK (is_authorized_admin());

-- ------------------------------------------------------------------------------
-- RLS POLICIES FOR PROJECTS
-- ------------------------------------------------------------------------------
CREATE POLICY "Public projects read published"
    ON projects FOR SELECT
    USING (status = 'published' OR is_authorized_admin());

CREATE POLICY "Admin manage projects"
    ON projects FOR ALL
    USING (is_authorized_admin())
    WITH CHECK (is_authorized_admin());

-- ------------------------------------------------------------------------------
-- RLS POLICIES FOR CONTACT INFO
-- ------------------------------------------------------------------------------
CREATE POLICY "Public contact read"
    ON contact_info FOR SELECT
    USING (true);

CREATE POLICY "Admin manage contact"
    ON contact_info FOR ALL
    USING (is_authorized_admin())
    WITH CHECK (is_authorized_admin());

-- ==============================================================================
-- INITIAL SEED DATA MIGRATION (COMPLETE DATASET)
-- ==============================================================================

-- 1. Profile Seed
INSERT INTO profiles (
    name, short_name, initials,
    current_role_pt, current_role_en,
    target_role_pt, target_role_en,
    headline_pt, headline_en,
    short_summary_pt, short_summary_en,
    full_bio_pt, full_bio_en,
    location, email,
    linkedin, linkedin_display,
    github, github_display,
    availability_pt, availability_en,
    work_focus_infra_percentage, work_focus_systems_percentage,
    work_focus_infra_label_pt, work_focus_infra_label_en,
    work_focus_systems_label_pt, work_focus_systems_label_en,
    work_focus_note_pt, work_focus_note_en
) VALUES (
    'Daniel Santos da Silva',
    'Daniel Santos',
    'DS',
    'Técnico de Suporte de TI (N1)',
    'IT Support Technician (L1)',
    'Analista de Sistemas / Infraestrutura',
    'Systems & Infrastructure Analyst',
    'Técnico de Suporte de TI em transição para Analista de Sistemas e Infraestrutura',
    'IT Support Technician transitioning to Systems & Infrastructure Analyst',
    'Profissional de TI com experiência prática em suporte corporativo, administração de redes, servidores Windows/Linux e virtualização, expandindo competências em desenvolvimento de software moderno (React/TS, SQL) e arquitetura de sistemas.',
    'IT professional with hands-on experience in corporate IT support, network administration, Windows/Linux server management, and virtualization, expanding skills in modern software development (React/TS, SQL) and systems architecture.',
    ARRAY[
        'Atuo diariamente na sustentação e otimização do ecossistema tecnológico da UNIFENAS (Belo Horizonte), atendendo centenas de usuários acadêmicos e administrativos.',
        'Minha rotina abrange desde o gerenciamento de chamados de alta prioridade via GLPI, administração de contas e políticas via Active Directory, até a manutenção de redes com pfSense e MikroTik, além de monitoramento contínuo de disponibilidade de serviços com Zabbix.',
        'Em paralelo à infraestrutura, construo soluções completas de software aplicando TypeScript, React, modelagem relacional SQL e arquiteturas escaláveis. Meu objetivo é consolidar a transição para posições de Analista de Sistemas e Infraestrutura, unindo a visão sistêmica de redes ao ciclo de desenvolvimento de software.'
    ],
    ARRAY[
        'I work daily in maintaining and optimizing the technological ecosystem of UNIFENAS (Belo Horizonte), supporting hundreds of academic and administrative users.',
        'My routine spans high-priority ticket management via GLPI, corporate identity and policy administration in Active Directory, network operations with pfSense and MikroTik, and proactive service availability monitoring with Zabbix.',
        'In parallel with infrastructure, I engineer complete software solutions applying TypeScript, React, relational SQL modeling, and scalable architectures. My goal is to consolidate my transition into Systems & Infrastructure Analyst roles, combining networking systems vision with software development lifecycle.'
    ],
    'Belo Horizonte, MG • Brasil',
    'contato@danielsantos.dev',
    'https://linkedin.com/in/daniel-santos-silva',
    'linkedin.com/in/daniel-santos-silva',
    'https://github.com/danielsantos-dev',
    'github.com/danielsantos-dev',
    'Disponível para novas oportunidades e transição de carreira',
    'Available for new opportunities & career transition',
    60,
    40,
    'Infraestrutura & Redes',
    'Infrastructure & Networking',
    'Sistemas & Desenvolvimento',
    'Systems & Software Engineering',
    'Composição real de dedicação e escopo de atuação técnica. Representa a distribuição prática do tempo entre sustentação de infraestrutura e engenharia de software — não indica limitação técnica ou escala arbitrária de proficiência.',
    'Actual technical focus and scope distribution. Represents real-world time allocation between infrastructure operations and software engineering — does not indicate skill limitation or arbitrary proficiency metrics.'
);

-- 2. Education Items Seed
INSERT INTO education_items (
    id, institution, degree_pt, degree_en, field_pt, field_en,
    period_pt, period_en, status_pt, status_en, description_pt, description_en,
    highlights_pt, highlights_en, sort_order, status
) VALUES (
    'edu-1',
    'Universidade José do Rosário Vellano (UNIFENAS)',
    'Bacharelado / Graduação',
    'Bachelor of Science (B.S.)',
    'Sistemas de Informação / Ciência da Computação',
    'Information Systems / Computer Science',
    '2022 — Atual',
    '2022 — Present',
    'Em andamento',
    'In progress',
    'Foco em Engenharia de Software, Estrutura de Dados, Redes de Computadores, Bancos de Dados Relacionais e Segurança da Informação.',
    'Focus on Software Engineering, Data Structures, Computer Networks, Relational Databases, and Information Security.',
    ARRAY[
        'Desenvolvimento de projetos práticos de automação e agendamento de recursos acadêmicos',
        'Estudo aprofundado de redes TCP/IP, topologias e protocolos de roteamento'
    ],
    ARRAY[
        'Development of practical automation and academic resource scheduling projects',
        'In-depth study of TCP/IP networking, topologies, and routing protocols'
    ],
    1,
    'published'
);

-- 3. Certifications Seed
INSERT INTO certification_items (
    id, name_pt, name_en, issuer, year, sort_order, status
) VALUES
(
    'cert-1',
    'Administração de Redes e Serviços Windows Server',
    'Windows Server Network and Services Administration',
    'Formação Prática em Infraestrutura',
    '2023',
    1,
    'published'
),
(
    'cert-2',
    'Fundamentos de Virtualização com Proxmox VE',
    'Virtualization Fundamentals with Proxmox VE',
    'Especialização Open Source',
    '2024',
    2,
    'published'
),
(
    'cert-3',
    'Desenvolvimento Web Fullstack Moderno (TypeScript/React)',
    'Modern Fullstack Web Development (TypeScript/React)',
    'Certificação Técnica',
    '2024',
    3,
    'published'
);

-- 4. Experiences Seed
INSERT INTO experiences (
    id, role_pt, role_en, company, location,
    period_pt, period_en, is_current,
    type_pt, type_en,
    summary_pt, summary_en,
    responsibilities_pt, responsibilities_en,
    technologies, key_achievements_pt, key_achievements_en,
    sort_order, status
) VALUES (
    'exp-unifenas',
    'Técnico de Suporte de TI (N1)',
    'IT Support Technician (L1)',
    'UNIFENAS (Universidade José do Rosário Vellano)',
    'Belo Horizonte, MG',
    '2023 — Presente',
    '2023 — Present',
    true,
    'Presencial • Instituição Acadêmica / Universitária',
    'On-site • Academic & University Institution',
    'Responsável pela sustentação operacional de TI do campus, prestando atendimento técnico a docentes, alunos e setores administrativos, com foco na disponibilidade de laboratórios, salas de aula e infraestrutura corporativa.',
    'Responsible for the campus IT operational sustainment, delivering technical support to professors, students, and administrative staff, with a strong focus on high-availability of labs, classrooms, and corporate infrastructure.',
    ARRAY[
        'Atendimento e triagem de chamados N1/N2 via GLPI com cumprimento rigoroso de SLAs acordados com a instituição.',
        'Gerenciamento de identidades corporativas no Active Directory (criação de usuários, grupos de segurança, permissões em pastas de rede e aplicação de GPOs).',
        'Configuração e suporte a estações de trabalho Windows 10/11 e distribuições Linux em mais de 15 laboratórios didáticos e departamentos.',
        'Suporte a ativos de rede (switches gerenciáveis, roteadores MikroTik e pontos de acesso UniFi), identificando falhas de conectividade e lentidão.',
        'Monitoramento contínuo de servidores e links de internet através do Zabbix, atuando proativamente em alertas de indisponibilidade.',
        'Administração de contas institucionais no Google Workspace for Education (provisionamento de e-mails, grupos e acessos pedagógicos).'
    ],
    ARRAY[
        'L1/L2 incident triaging and resolution via GLPI adhering to strict university SLAs.',
        'Corporate identity management in Active Directory (user provisioning, security groups, network share ACLs, and GPO enforcement).',
        'Configuration and technical support for Windows 10/11 and Linux workstations across 15+ instructional labs and departments.',
        'Support for network appliances (managed switches, MikroTik routers, and UniFi APs), troubleshooting connectivity and bandwidth bottlenecks.',
        'Continuous monitoring of server telemetry and WAN links using Zabbix, acting proactively on outage triggers.',
        'Administration of institutional Google Workspace for Education tenants (provisioning accounts, mailing lists, and pedagogical access).'
    ],
    ARRAY[
        'Active Directory', 'Windows Server', 'Proxmox VE', 'GLPI',
        'Zabbix', 'pfSense', 'MikroTik', 'UniFi', 'Google Workspace', 'Powershell'
    ],
    ARRAY[
        'Redução do tempo médio de resolução de chamados em 30% através da padronização de imagens de sistema e scripts de automação.',
        'Participação ativa no mapeamento dos ativos de hardware para auditoria de inventário com GLPI e OCS Inventory.'
    ],
    ARRAY[
        'Reduced mean time to ticket resolution by 30% through OS image standardization and automation scripts.',
        'Active contributor in hardware asset discovery and tracking using GLPI and OCS Inventory.'
    ],
    1,
    'published'
);

-- 5. Infrastructure Areas & Tech Items Seed
INSERT INTO infrastructure_areas (
    id, area_name_pt, area_name_en, icon_name,
    description_pt, description_en, sort_order, status
) VALUES
(
    'infra-redes',
    'Redes, Segurança de Borda & Roteamento',
    'Network, Edge Security & Routing',
    'Network',
    'Planejamento, segmentação e operação de redes corporativas com foco em isolamento de tráfego, políticas de firewall e conectividade resiliente.',
    'Planning, segmentation, and operation of enterprise networks focusing on traffic isolation, firewall policies, and resilient connectivity.',
    1, 'published'
),
(
    'infra-servidores',
    'Servidores, Virtualização & Storage',
    'Servers, Virtualization & Storage',
    'Server',
    'Gestão de infraestrutura de computação híbrida, hipervisores open-source e provisionamento de serviços essenciais de diretório e arquivos.',
    'Hybrid compute infrastructure management, open-source hypervisors, and essential directory and file services provisioning.',
    2, 'published'
),
(
    'infra-monitoramento',
    'Monitoramento, Observabilidade & Gestão de Incidentes',
    'Monitoring, Observability & Incident Management',
    'Activity',
    'Coleta contínua de métricas, alertas proativos de indisponibilidade e governança de serviços por meio de ITSM estruturado.',
    'Continuous telemetry ingestion, proactive downtime alerting, and service governance through structured ITSM.',
    3, 'published'
),
(
    'infra-workplace',
    'Workplace Corporativo, Identidades & Automação',
    'Corporate Workplace, Identity & Automation',
    'ShieldCheck',
    'Padronização do parque de terminais de usuários, controle centralizado de acessos e automatização de rotinas de suporte.',
    'Workstation park standardization, centralized access control, and IT helpdesk routine automation.',
    4, 'published'
);

INSERT INTO infrastructure_tech_items (
    id, area_id, technology,
    purpose_pt, purpose_en,
    applied_context_pt, applied_context_en,
    tags, sort_order, status
) VALUES
(
    'item-pfsense', 'infra-redes', 'pfSense',
    'Firewall UTM, controle de tráfego de borda, VPNs seguras e roteamento.',
    'UTM firewall, edge traffic control, secure VPN tunnels, and gateway routing.',
    'Configuração de regras de NAT, bloqueio de portas não autorizadas, isolamento entre VLANs administrativa e acadêmica e túneis OpenVPN para acesso remoto seguro da equipe de TI.',
    'NAT rules configuration, unauthorized port filtering, administrative vs. academic VLAN isolation, and OpenVPN road-warrior tunnels for IT remote management.',
    ARRAY['Firewall', 'Segurança de Borda', 'VLAN', 'VPN'], 1, 'published'
),
(
    'item-mikrotik', 'infra-redes', 'MikroTik RouterOS',
    'Roteamento avançado, controle de banda (queues) e balanceamento de links.',
    'Advanced routing, bandwidth queue management, and multi-WAN failover.',
    'Administração de roteadores de borda para balanceamento de carga entre múltiplos provedores de internet e priorização de pacotes para videoconferências e servidores críticos.',
    'Edge router administration for multi-WAN failover/load balancing and packet QoS prioritization for video conferencing and core servers.',
    ARRAY['Roteamento', 'QoS', 'Failover', 'MikroTik'], 2, 'published'
),
(
    'item-unifi', 'infra-redes', 'Ubiquiti UniFi',
    'Gerenciamento centralizado de pontos de acesso Wi-Fi de alta densidade.',
    'Centralized controller for high-density enterprise Wi-Fi access points.',
    'Implementação de SSIDs isolados com captive portal para visitantes e autenticação WPA2-Enterprise para colaboradores e docentes em múltiplos prédios do campus.',
    'Deployment of isolated guest SSIDs with captive portal and WPA2-Enterprise RADIUS authentication for faculty and staff across campus buildings.',
    ARRAY['Wi-Fi Corporativo', 'Alta Densidade', 'UniFi Controller'], 3, 'published'
),
(
    'item-proxmox', 'infra-servidores', 'Proxmox VE',
    'Hipervisor KVM/LXC open source de nível corporativo para virtualização de servidores.',
    'Enterprise-grade open source KVM/LXC hypervisor for server virtualization.',
    'Criação, backup programado e alocação dinâmica de recursos (vCPU, RAM e ZFS pools) para máquinas virtuais de banco de dados, servidores de aplicação e laboratórios virtuais de teste.',
    'Provisioning, scheduled snapshots/backups, and dynamic resource pooling (vCPUs, RAM, ZFS storage) for database VMs, application nodes, and staging testbeds.',
    ARRAY['Virtualização', 'KVM', 'LXC', 'Alta Disponibilidade'], 1, 'published'
),
(
    'item-ad', 'infra-servidores', 'Active Directory (AD DS)',
    'Serviço de diretório corporativo para autenticação, autorização e políticas de grupo.',
    'Enterprise directory service for authentication, authorization, and group policies.',
    'Estruturação de Unidades Organizacionais (OUs), provisionamento de credenciais, controle de privilégios de acesso a pastas compartilhadas e criação de GPOs para padronização de segurança.',
    'Organizational Unit (OU) architecture, credential lifecycle management, shared folder access control lists (ACLs), and security baseline GPO enforcement.',
    ARRAY['Identidades', 'GPO', 'Segurança', 'Windows Server'], 2, 'published'
),
(
    'item-zabbix', 'infra-monitoramento', 'Zabbix',
    'Monitoramento distribuído em tempo real de infraestrutura de rede, servidores e serviços.',
    'Distributed real-time monitoring of network topology, physical/virtual servers, and daemon uptime.',
    'Implantação de agentes Zabbix e templates SNMP para monitorar uso de CPU, memória, espaço em disco de storages, status de portas em switches e latência de links WAN com envio automático de alertas.',
    'Deployment of Zabbix agents and SNMP templates to monitor CPU load, memory thresholds, storage volumes, switch port flaps, and WAN latency with automated alert triggers.',
    ARRAY['Observabilidade', 'SNMP', 'Alertas Proativos', 'Métricas'], 1, 'published'
),
(
    'item-glpi', 'infra-monitoramento', 'GLPI + OCS Inventory',
    'Plataforma de Service Desk ITSM e gerenciamento de ativos de TI (ITAM).',
    'ITSM Service Desk and IT Asset Management (ITAM) platform.',
    'Gestão completa do ciclo de vida dos chamados técnicos, triagem de incidentes, catálogo de serviços e controle de inventário automatizado das máquinas do campus.',
    'Complete incident and request lifecycle management, service catalog workflows, and automated hardware/software inventory discovery.',
    ARRAY['ITSM', 'SLA', 'Gestão de Chamados', 'Inventário'], 2, 'published'
),
(
    'item-workspace', 'infra-workplace', 'Google Workspace for Education',
    'Suíte em nuvem para colaboração, e-mails institucionais e gestão de identidades acadêmicas.',
    'Cloud productivity suite for collaboration, institutional emails, and educational identity management.',
    'Administração de contas de e-mail institucional, grupos de distribuição, políticas de segurança de autenticação em 2 fatores (2FA) e gerenciamento de armazenamento compartilhado no Drive.',
    'Administration of institutional mailboxes, distribution lists, 2-factor authentication (2FA) enforcement policies, and shared Drive permissions.',
    ARRAY['Cloud Suite', '2FA', 'Gestão de Usuários'], 1, 'published'
),
(
    'item-powershell', 'infra-workplace', 'PowerShell & Bash Scripting',
    'Automação de tarefas operacionais, manutenção em lote e coleta de dados de sistema.',
    'Operational task automation, batch workstation maintenance, and system diagnostics collection.',
    'Desenvolvimento de scripts para auditoria de permissões de pastas, limpeza automatizada de arquivos temporários em laboratórios e instalação silenciosa de softwares corporativos.',
    'Development of automation scripts for folder permission auditing, automated temp file cleanups across instructional labs, and silent bulk software deployments.',
    ARRAY['Automação', 'Scripts', 'Manutenção em Lote'], 2, 'published'
);

-- 6. Skill Categories & Items Seed
INSERT INTO skill_categories (
    id, title_pt, title_en, description_pt, description_en, sort_order, status
) VALUES
(
    'cat-infra',
    'Infraestrutura & Redes',
    'Infrastructure & Networking',
    'Competências práticas aplicadas em ambientes corporativos de produção.',
    'Hands-on competencies applied across corporate production environments.',
    1, 'published'
),
(
    'cat-systems',
    'Sistemas & Engenharia de Software',
    'Systems & Software Engineering',
    'Desenvolvimento de aplicações web modernas, arquitetura de software e persistência relacional.',
    'Modern web application development, software architecture, and relational persistence.',
    2, 'published'
),
(
    'cat-tools',
    'Ferramentas, ITSM & Governança',
    'Tools, ITSM & Governance',
    'Práticas e softwares para sustentação, auditoria e conformidade técnica.',
    'Practices and software stacks for support sustainability, auditing, and compliance.',
    3, 'published'
);

INSERT INTO skill_items (category_id, name, applied_context_pt, applied_context_en, category_key, sort_order, status) VALUES
('cat-infra', 'pfSense & Firewalls', 'Criação de regras de tráfego, isolamento de VLANs e configuração de VPNs para acesso seguro.', 'Traffic rule orchestration, VLAN segmentation, and secure VPN remote gateways.', 'infra', 1, 'published'),
('cat-infra', 'MikroTik RouterOS', 'Gerenciamento de roteamento, controle de banda e contingência de links WAN.', 'Routing operations, bandwidth prioritization queues, and WAN redundancy failover.', 'infra', 2, 'published'),
('cat-infra', 'Active Directory (AD DS)', 'Gestão de usuários, grupos de segurança, controle de permissões e implantação de GPOs.', 'Identity provisioning, security groups, file server ACLs, and enterprise GPO rollout.', 'infra', 3, 'published'),
('cat-infra', 'Proxmox VE & KVM', 'Provisionamento de máquinas virtuais, backup de nós e alocação dinâmica de recursos.', 'VM and container provisioning, automated node backups, and dynamic hypervisor allocations.', 'infra', 4, 'published'),
('cat-infra', 'Zabbix & SNMP', 'Monitoramento contínuo de disponibilidade, telemetria de switches e envio de alertas proativos.', 'Continuous health checks, switch SNMP telemetry, and proactive alert escalations.', 'infra', 5, 'published'),
('cat-systems', 'TypeScript & JavaScript', 'Desenvolvimento com tipagem estática rigorosa, interfaces reutilizáveis e código sustentável.', 'Production development with strict static typing, reusable interfaces, and clean code.', 'systems', 1, 'published'),
('cat-systems', 'React & SPA Moderno', 'Construção de interfaces reativas, componentização desacoplada e gerenciamento de estado.', 'Reactive UI engineering, decoupled component systems, and ergonomic state management.', 'systems', 2, 'published'),
('cat-systems', 'Bancos de Dados & SQL Relacional', 'Modelagem de esquemas, criação de constraints de integridade e consultas analíticas.', 'Relational database schema modeling, integrity constraints, and query optimizations.', 'systems', 3, 'published'),
('cat-systems', 'Supabase & RLS Security', 'Configuração de Backend-as-a-Service, políticas de segurança por linha e autenticação OAuth.', 'Backend-as-a-Service integration, Row Level Security authorization, and OAuth auth flows.', 'systems', 4, 'published'),
('cat-tools', 'GLPI & OCS Inventory', 'Atendimento N1/N2 guiado por SLAs, catálogo de serviços e inventário de hardware.', 'L1/L2 ticket lifecycle adherence, ITIL service catalogs, and hardware inventory audits.', 'tools', 1, 'published'),
('cat-tools', 'Google Workspace Admin', 'Gestão de contas corporativas, delegação de privilégios e políticas de segurança.', 'Institutional user provisioning, access delegation, and security policy governance.', 'tools', 2, 'published'),
('cat-tools', 'Git & Versionamento', 'Fluxo de trabalho com branches, pull requests e rastreamento de versões de software e scripts.', 'Collaborative Git branching, pull requests, and systematic code change versioning.', 'tools', 3, 'published');

-- 7. Projects Seed
INSERT INTO projects (
    slug, title, subtitle_pt, subtitle_en, short_summary_pt, short_summary_en,
    category_pt, category_en, project_status, status_label_pt, status_label_en,
    featured, badge_pt, badge_en,
    problem_pt, problem_en,
    solution_pt, solution_en,
    architecture_overview_pt, architecture_overview_en,
    architecture_highlights_pt, architecture_highlights_en,
    architecture_diagram_description_pt, architecture_diagram_description_en,
    features_pt, features_en,
    technologies,
    daniel_role_title_pt, daniel_role_title_en,
    daniel_role_contributions_pt, daniel_role_contributions_en,
    gallery, links,
    sort_order, status
) VALUES
(
    'operis',
    'Operis',
    'Sistema de Gestão de Ordens de Serviço e Manutenção Técnica',
    'Service Order & Technical Maintenance Management System',
    'Solução de gestão técnica desenvolvida para centralizar abertura de ordens de serviço, triagem de incidentes, controle de equipamentos e histórico de manutenções com controle de acesso por níveis de usuário.',
    'Technical management software engineered to centralize service order dispatching, incident triaging, equipment tracking, and maintenance logs with role-based access control.',
    'Sistemas & Gestão Operacional',
    'Systems & Operations Management',
    'in-development',
    'Em Desenvolvimento Ativo',
    'In Active Development',
    true,
    'Destaque • Arquitetura Completa',
    'Featured • Complete Architecture',
    'Departamentos de manutenção e suporte frequentemente enfrentam desorganização no acompanhamento de ordens de serviço físicas ou planilhas descentralizadas, gerando perda de histórico de equipamentos, atrasos no cumprimento de prioridades e falta de visibilidade sobre o inventário de peças e serviços executados.',
    'Technical support departments frequently face disorganization when tracking maintenance requests through physical slips or fragmented spreadsheets. This causes lost equipment histories, missed SLA priorities, and a lack of real-time visibility into parts inventory and work logs.',
    'Desenvolvimento de uma aplicação web robusta, com autenticação segura, fluxo estruturado de status de OS (Aberto, Em Análise, Em Execução, Concluído), controle de prioridades (Baixa, Média, Alta, Crítica) e vínculo direto entre o chamado e o histórico do equipamento.',
    'Architected a resilient web application featuring authenticated access, structured work order state machines (Open, In Review, In Progress, Resolved), SLA priority dispatching, and relational linkage between tickets and equipment lifecycle histories.',
    'Arquitetura em camadas com frontend desacoplado em React/TypeScript, consumindo API com validação estrita de dados e banco de dados PostgreSQL estruturado com políticas de integridade referencial.',
    'Layered modern architecture with decoupled React/TypeScript frontend consuming typed API endpoints backed by PostgreSQL with strict relational integrity constraints and Row Level Security.',
    ARRAY[
        'Modelagem relacional normalizada conectando Usuários, Equipamentos, Ordens de Serviço e Histórico de Eventos.',
        'Políticas de autorização por perfil (Técnico, Administrador, Solicitante) protegendo rotas e ações críticas.',
        'Interface limpa de alta densidade informativa, otimizada para operadores de bancada e técnicos em campo.'
    ],
    ARRAY[
        'Normalized relational data model connecting Users, Assets, Work Orders, and Event Auditing logs.',
        'Role-Based Access Control (Technician, Administrator, Requester) guarding sensitive mutations and routes.',
        'High-density dashboard interface optimized for laboratory technicians and field support operators.'
    ],
    'Diagrama lógico: SPA Client (React/TS) ➔ Camada de Serviços & Validação ➔ Banco Relacional PostgreSQL com RLS ➔ Auditoria de Ações.',
    'Logical flowchart: SPA Client (React/TS) ➔ Service Layer & Validation ➔ Relational PostgreSQL with RLS ➔ Event Audit Logger.',
    ARRAY[
        'Abertura rápida de OS com categorização por tipo de ativo e nível de severidade.',
        'Painel Kanban e visão tabular filtrável por status, técnico responsável e data limite.',
        'Histórico cronológico imutável de intervenções técnicas realizadas em cada ativo.',
        'Registro de peças substituídas, tempo de atendimento e laudo técnico final.'
    ],
    ARRAY[
        'Rapid ticket creation with asset categorization and severity escalation.',
        'Dual Kanban and table views with multi-criteria filtering by status, assigned technician, and SLA deadlines.',
        'Immutable chronological audit trail of technical interventions per hardware asset.',
        'Spare parts logging, resolution timestamp calculation, and technical sign-off reports.'
    ],
    '[
        {"name": "React 19 & TypeScript", "role": "Frontend SPA & Tipagem Estrita"},
        {"name": "Tailwind CSS", "role": "Interface Responsiva de Alta Densidade"},
        {"name": "PostgreSQL & RLS", "role": "Persistência Relacional & Segurança"},
        {"name": "Supabase / Node.js", "role": "Backend, Autenticação & APIs"}
    ]'::jsonb,
    'Arquiteto & Desenvolvedor Principal',
    'Lead Architect & Developer',
    ARRAY[
        'Modelagem completa do banco de dados relacional e diagramas de entidade-relacionamento.',
        'Implementação de todo o ecossistema frontend em React com TypeScript.',
        'Configuração de regras de negócio para transição de estados das ordens de serviço.'
    ],
    ARRAY[
        'Complete relational database modeling and entity-relationship architecture.',
        'Frontend codebase implementation from scratch using React and strict TypeScript.',
        'Business logic rules implementation for state machine transitions across work orders.'
    ],
    '[
        {
            "title": "Painel de Controle de Ordens de Serviço",
            "description": "Visão geral com indicadores de chamados abertos, em atendimento e concluídos com métricas de tempo de resposta.",
            "placeholderType": "dashboard",
            "caption": "Dashboard com KPIs de atendimento e distribuição por prioridade."
        },
        {
            "title": "Fluxo de Transição de Estados da OS",
            "description": "Máquina de estados garantindo que cada intervenção técnica registre responsável, data e laudo comprobatório.",
            "placeholderType": "flow",
            "caption": "Diagrama de estados e validações de mudança de status."
        },
        {
            "title": "Registro e Diagnóstico de Equipamento",
            "description": "Tela de detalhamento de ativo com histórico completo de manutenções preventivas e corretivas.",
            "placeholderType": "terminal",
            "caption": "Ficha do equipamento com histórico e peças aplicadas."
        }
    ]'::jsonb,
    '[
        {"label": "Repositório do Projeto", "url": "https://github.com/danielsantos-dev/operis-core", "type": "github"},
        {"label": "Documentação de Arquitetura", "url": "https://github.com/danielsantos-dev/operis-core#readme", "type": "docs"}
    ]'::jsonb,
    1,
    'published'
),
(
    'agendamento-academico',
    'Sistema de Agendamento Acadêmico',
    'Plataforma de Reserva de Laboratórios de Informática e Recursos Multimídia',
    'Computer Lab & Multimedia Resource Academic Reservation Platform',
    'Plataforma criada para solucionar conflitos de reserva de laboratórios, projetores e salas didáticas em ambientes acadêmicos com validação de choques de horário.',
    'Platform designed to prevent resource collisions for computer labs, projectors, and classrooms in educational institutions through automated conflict validation.',
    'Sistemas & Automação Educacional',
    'Systems & Educational Automation',
    'completed',
    'Concluído & Validado',
    'Completed & Validated',
    true,
    'Caso Prático de Alto Impacto',
    'High Impact Practical Case',
    'Professores e coordenadores disputavam salas e equipamentos através de recados verbais ou agendas em papel, gerando duplicidade de agendamentos, atrasos no início de aulas práticas e ociosidade de recursos disponíveis.',
    'Faculty and coordinators previously reserved rooms and hardware via verbal notes or physical logs, causing overlapping reservations, delayed class starts, and underutilized labs.',
    'Criação de uma aplicação web com calendário interativo em tempo real, validação algorítmica de disponibilidade que impede marcações concomitantes para o mesmo recurso e confirmação por e-mail.',
    'Built an interactive calendar scheduling web app featuring programmatic conflict-prevention algorithms that prevent overlapping bookings for the same asset, coupled with confirmation notifications.',
    'Estrutura modular com frontend responsivo, motor de regras de negócio em TypeScript para cálculo de intervalos de tempo e integração com banco de dados para armazenamento de reservas e permissões.',
    'Modular architecture with responsive frontend, TypeScript business engine for time-interval collision checking, and relational database persistence for schedules and role permissions.',
    ARRAY[
        'Validação algorítmica em tempo real que bloqueia horários já ocupados antes da submissão.',
        'Múltiplas visualizações de calendário: dia, semana e visão consolidada por laboratório.',
        'Diferenciação de privilégios entre coordenação de curso, professores e equipe de suporte de TI.'
    ],
    ARRAY[
        'Real-time collision validation preventing conflicting time slot submissions.',
        'Multiple calendar perspectives: daily grid, weekly overview, and lab-by-lab breakdown.',
        'Role-based access tiers separating department heads, faculty, and IT support technicians.'
    ],
    'Diagrama de fluxo: Solicitação de Reserva ➔ Algoritmo de Validação de Choque de Horários ➔ Persistência de Reserva ➔ Notificação de Confirmação.',
    'Flowchart: Reservation Request ➔ Time Collision Validation Engine ➔ Database Commit ➔ Confirmation Dispatch.',
    ARRAY[
        'Catálogo visual de laboratórios com quantidade de computadores e softwares instalados.',
        'Filtro de recursos multimídia adicionais (Projetor, Caixas de Som, Adaptadores HDMI).',
        'Relatórios de taxa de ocupação para auxílio no planejamento de compra de novos ativos.'
    ],
    ARRAY[
        'Visual lab directory listing workstation count and installed specialized software.',
        'Filtering for multimedia hardware accessories (Projectors, Audio systems, HDMI adapters).',
        'Occupancy rate reporting to assist academic administration in capacity planning.'
    ],
    '[
        {"name": "TypeScript & React", "role": "Interface & Regras de Conflito de Horário"},
        {"name": "Tailwind CSS", "role": "Layout de Calendário & Responsividade"},
        {"name": "PostgreSQL", "role": "Armazenamento Relacional de Agendamentos"},
        {"name": "REST API", "role": "Comunicação e Validações de Servidor"}
    ]'::jsonb,
    'Idealizador & Desenvolvedor Fullstack',
    'Creator & Fullstack Developer',
    ARRAY[
        'Levantamento de requisitos com a equipe acadêmica e mapeamento das rotinas do campus.',
        'Programação do algoritmo de detecção de choque de horários.',
        'Criação das telas de calendário com foco em agilidade de navegação e clareza de visualização.'
    ],
    ARRAY[
        'Requirements elicitation with university faculty and academic administrative staff.',
        'Implementation of the algorithmic interval collision detection engine.',
        'Interactive calendar UI design prioritizing navigation speed and visual clarity.'
    ],
    '[
        {
            "title": "Visão Geral do Calendário de Reservas",
            "description": "Grid interativo por dia e laboratório indicando horários livres e ocupados com código de cores.",
            "placeholderType": "dashboard",
            "caption": "Visão semanal de ocupação dos laboratórios didáticos."
        },
        {
            "title": "Formulário Inteligente com Validação de Conflito",
            "description": "Interface que avisa instantaneamente se o recurso selecionado já possui aula marcada no intervalo.",
            "placeholderType": "flow",
            "caption": "Validação de disponibilidade em tempo real."
        },
        {
            "title": "Painel de Administração de Recursos e Permissões",
            "description": "Configuração de horários de funcionamento, manutenções programadas e restrições de acesso.",
            "placeholderType": "terminal",
            "caption": "Módulo de controle de parâmetros e capacidade dos espaços."
        }
    ]'::jsonb,
    '[
        {"label": "Repositório do Projeto", "url": "https://github.com/danielsantos-dev/academic-scheduler", "type": "github"},
        {"label": "Documentação Técnica", "url": "https://github.com/danielsantos-dev/academic-scheduler#readme", "type": "docs"}
    ]'::jsonb,
    2,
    'published'
),
(
    'interactive-cv',
    'Interactive CV & Portfolio',
    'Plataforma de Apresentação Profissional com Arquitetura Desacoplada e Suporte Bilíngue',
    'Professional Presentation Platform with Decoupled Architecture & Bilingual Localization',
    'O próprio sistema em que você está navegando: um portfólio interativo de alta engenharia, arquitetado com provedor de conteúdo agnóstico, suporte nativo a PT-BR / EN-US e design escuro refinado.',
    'The very system you are currently navigating: a highly engineered interactive portfolio architected with an agnostic content provider, native PT-BR / EN-US localization, and a refined sleek dark aesthetic.',
    'Sistemas & Engenharia Web',
    'Systems & Web Engineering',
    'completed',
    'Produção & Operação',
    'Production & Live',
    true,
    'Arquitetura Modelo',
    'Reference Architecture',
    'Currículos tradicionais em PDF e sites estáticos genéricos falham em comunicar a profundidade técnica de quem atua na intersecção entre infraestrutura de redes/servidores e desenvolvimento de software moderno.',
    'Traditional PDF resumes and cookie-cutter static websites fail to communicate technical depth when demonstrating competence across both network/server infrastructure and modern software engineering.',
    'Desenvolvimento de uma Single Page Application com design contemporâneo, tipografia calculada e arquitetura desacoplada onde todas as páginas consomem contratos abstratos (useProfile, useExperiences, useProjects, useInfrastructure), permitindo alternância instantânea de idioma e transição suave de dados estáticos para banco em nuvem.',
    'Engineered a Single Page Application with calculated typography and decoupled architecture where all views consume abstract domain hooks (useProfile, useExperiences, useProjects, useInfrastructure), allowing instant language switching and seamless transition from static data to cloud databases.',
    'Separação estrita de responsabilidades: dados desacoplados em camada de domínio, hooks contextuais especializados, componentes atômicos sem lógica de persistência e suporte a futuras fontes de dados em nuvem.',
    'Strict separation of concerns: domain data layer decoupled from presentation, specialized context hooks, atomic presentation components without persistence leaks, and ready-to-plug cloud storage adapters.',
    ARRAY[
        'Internacionalização instantânea (PT-BR e EN-US) sem recarregar a página e sem quebrar rotas.',
        'Seção dedicada de Infraestrutura categorizada por contexto real de aplicação (sem barras arbitrárias).',
        'Estudos de caso aprofundados com estrutura Problema ➔ Solução ➔ Arquitetura ➔ Features ➔ Papel do Daniel ➔ Mockups.',
        'Acessibilidade e contraste em conformidade com WCAG AA sobre paleta escuro-grafite profunda.'
    ],
    ARRAY[
        'Instant runtime localization (PT-BR & EN-US) with zero route resets or page reloads.',
        'Dedicated Infrastructure catalog categorized by real-world operational context (no arbitrary percentage bars).',
        'In-depth case study architecture following Problem ➔ Solution ➔ Architecture ➔ Features ➔ Daniel Role ➔ Mockups.',
        'WCAG AA accessible high-contrast dark graphite palette with sleek slate borders.'
    ],
    'Diagrama: UI Views (Pages & Layout) ➔ Content Hooks (useProfile, useInfrastructure, etc.) ➔ Content Provider (Static / Supabase Cloud) ➔ Data Source.',
    'Architecture flow: UI Views (Pages & Layout) ➔ Content Hooks (useProfile, useInfrastructure, etc.) ➔ Content Provider (Static / Supabase Cloud) ➔ Data Source.',
    ARRAY[
        'Visualizador de composição de atuação técnica (60% Infra / 40% Sistemas) com contexto explícito.',
        'Visualizador de mockups interativos para projetos com diferentes tipos de diagramas e telas.',
        'Navegação fluida com roteador cliente e preservação de estado de visualização.'
    ],
    ARRAY[
        'Technical focus composition widget (60% Infra / 40% Systems) with explicit context.',
        'Interactive mockup visualizers tailored for dashboards, terminals, and architectural flows.',
        'Fluid client-side navigation with preserved state.'
    ],
    '[
        {"name": "React 19 & TypeScript", "role": "Arquitetura Frontend & Tipos Compartilhados"},
        {"name": "Tailwind CSS v4", "role": "Design System Sleek Dark & Responsividade"},
        {"name": "React Router v7", "role": "Roteamento SPA & Deep Linking"},
        {"name": "Lucide React", "role": "Ícones Vetoriais Padronizados"}
    ]'::jsonb,
    'Arquiteto de Software & Designer de Interface',
    'Software Architect & UI Designer',
    ARRAY[
        'Concepção arquitetural da camada desacoplada de dados.',
        'Design e implementação visual com paleta escura de alto contraste.',
        'Redação e estruturação de todo o conteúdo bilíngue com detalhamento técnico rigoroso.'
    ],
    ARRAY[
        'Architectural design of the decoupled content abstraction layer.',
        'Visual interface design and implementation in sleek dark graphite theme.',
        'Technical writing and structuring of all bilingual content with operational accuracy.'
    ],
    '[
        {
            "title": "Arquitetura Desacoplada de Provedor de Conteúdo",
            "description": "Esquema ilustrando o isolamento entre componentes visuais e fontes de dados através de contratos TypeScript.",
            "placeholderType": "architecture",
            "caption": "Diagrama de desacoplamento do ContentProvider."
        },
        {
            "title": "Catálogo de Infraestrutura por Domínio Operacional",
            "description": "Visualização em cards com propósito técnico, tags e contexto real de aplicação.",
            "placeholderType": "dashboard",
            "caption": "Exibição de tecnologias de rede e servidores."
        },
        {
            "title": "Estrutura de Estudo de Caso Aprofundado",
            "description": "Layout em camadas detalhando o ciclo de vida completo de engenharia de cada projeto.",
            "placeholderType": "code",
            "caption": "Página de detalhe de projeto com mockup visual e links."
        }
    ]'::jsonb,
    '[
        {"label": "Código Fonte no GitHub", "url": "https://github.com/danielsantos-dev/interactive-cv", "type": "github"},
        {"label": "Link da Aplicação", "url": "https://interactive-cv.danielsantos.dev", "type": "demo"}
    ]'::jsonb,
    3,
    'published'
);

-- 8. Contact Info Seed
INSERT INTO contact_info (
    email, linkedin, linkedin_url, github, github_url,
    location, city_state_country_pt, city_state_country_en,
    availability_status_pt, availability_status_en,
    preferred_contact_pt, preferred_contact_en,
    message_note_pt, message_note_en
) VALUES (
    'contato@danielsantos.dev',
    'linkedin.com/in/daniel-santos-silva',
    'https://linkedin.com/in/daniel-santos-silva',
    'danielsantos-dev',
    'https://github.com/danielsantos-dev',
    'Belo Horizonte, MG • Brasil',
    'Belo Horizonte, MG • Brasil (Disponível para atuação presencial, híbrida ou remota)',
    'Belo Horizonte, MG • Brazil (Available for on-site, hybrid, or remote roles)',
    'Disponível para novas oportunidades e transição para Analista de Sistemas / Infraestrutura',
    'Available for new opportunities & transition to Systems / Infrastructure Analyst',
    'E-mail e LinkedIn',
    'Email & LinkedIn',
    'Busco oportunidades para aplicar e expandir minhas competências em suporte corporativo, administração de redes, servidores e engenharia de software, contribuindo para a estabilidade, segurança e inovação tecnológica da organização.',
    'I am looking for opportunities to apply and expand my competencies in enterprise support, networking, server administration, and software engineering, contributing to the organization stability, security, and technological innovation.'
);
