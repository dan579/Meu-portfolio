-- ==============================================================================
-- 008_update_profile_unified.sql
-- Reposiciona o perfil (v2: Suporte/Infra como base real + Sistemas/Automação como segunda competência)
-- ==============================================================================

UPDATE profiles
SET
    headline_pt = 'Infraestrutura & Suporte Técnico • Sistemas e Automação',
    headline_en = 'Infrastructure & Technical Support • Systems and Automation',
    availability_pt = 'Disponível para novas oportunidades em Suporte, Infraestrutura e Sistemas',
    availability_en = 'Available for new opportunities in Support, Infrastructure and Systems',
    short_summary_pt = 'Profissional de TI com experiência prática em suporte técnico, infraestrutura, redes e sistemas, atuando na resolução de problemas e sustentação de ambientes tecnológicos. Também desenvolvo soluções, automações e sistemas próprios para transformar problemas operacionais em processos mais eficientes.',
    short_summary_en = 'IT professional with hands-on experience in technical support, infrastructure, networks and systems, working on problem resolution and keeping technology environments running. I also build solutions, automations and systems of my own to turn operational problems into more efficient processes.',
    full_bio_pt = ARRAY[
        'Sou profissional de Tecnologia da Informação com experiência prática em suporte técnico, infraestrutura, redes e sistemas. Atuo diretamente na sustentação de ambientes tecnológicos — resolvendo problemas de conectividade, servidores, Active Directory, monitoramento e ativos de rede no dia a dia. Paralelamente, desenvolvo sistemas, automações e produtos próprios, usando esse contato direto com a operação para identificar problemas reais e construir soluções completas para eles — da regra de negócio à interface. A automação é o elo natural entre essas duas frentes: boa parte do que automatizo nasce de gargalos que eu mesmo vejo na rotina de suporte e infraestrutura. Tenho também interesse crescente em Inteligência Artificial aplicada a sistemas e processos — um diferencial em construção, não o centro da minha atuação. O Operis, sistema que desenvolvo para gestão de processos operacionais, é o exemplo mais direto dessa combinação: nasce da minha vivência em suporte e infraestrutura e se materializa como sistema completo, da regra de negócio à interface.',
        'Minha rotina abrange desde o gerenciamento de chamados de alta prioridade via GLPI, administração de contas e políticas via Active Directory, até a manutenção de redes com pfSense e MikroTik, além de monitoramento contínuo de disponibilidade de serviços com Zabbix.'
    ],
    full_bio_en = ARRAY[
        'I''m an IT professional with hands-on experience in technical support, infrastructure, networks and systems. I work directly on keeping technology environments running — solving connectivity, server, Active Directory, monitoring and network asset issues day to day. In parallel, I build systems, automations and products of my own, using that direct contact with operations to spot real problems and build complete solutions for them — from business rule to interface. Automation is the natural bridge between the two: most of what I automate comes from bottlenecks I see firsthand in support and infrastructure work. I also have growing interest in AI applied to systems and processes — an emerging edge, not the center of what I do. Operis, a system I''m building for operations management, is the clearest example of this combination: it comes from my hands-on support and infrastructure experience and takes shape as a complete system, from business rule to interface.',
        'My routine ranges from managing high-priority incidents via GLPI, managing enterprise identities and policies via Active Directory, to managing networks with pfSense and MikroTik, as well as proactive service availability monitoring with Zabbix.'
    ],
    updated_at = NOW();
