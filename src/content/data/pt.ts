import { ContentData } from '../types.ts';

export const ptData: ContentData = {
  profile: {
    name: 'Daniel Santos da Silva',
    shortName: 'Daniel Santos',
    initials: 'DS',
    currentRole: 'Técnico de Suporte de TI (N1)',
    targetRole: 'Analista de Sistemas / Infraestrutura',
    headline: 'Técnico de Suporte de TI em transição para Analista de Sistemas e Infraestrutura',
    shortSummary: 'Profissional de TI com experiência prática em suporte corporativo, administração de redes, servidores Windows/Linux e virtualização, expandindo competências em desenvolvimento de software moderno (React/TS, SQL) e arquitetura de sistemas.',
    fullBio: [
      'Atuo diariamente na sustentação e otimização do ecossistema tecnológico da UNIFENAS (Belo Horizonte), atendendo centenas de usuários acadêmicos e administrativos.',
      'Minha rotina abrange desde o gerenciamento de chamados de alta prioridade via GLPI, administração de contas e políticas via Active Directory, até a manutenção de redes com pfSense e MikroTik, além de monitoramento contínuo de disponibilidade de serviços com Zabbix.',
      'Em paralelo à infraestrutura, construo soluções completas de software aplicando TypeScript, React, modelagem relacional SQL e arquiteturas escaláveis. Meu objetivo é consolidar a transição para posições de Analista de Sistemas e Infraestrutura, unindo a visão sistêmica de redes ao ciclo de desenvolvimento de software.'
    ],
    location: 'Belo Horizonte, MG • Brasil',
    email: 'contato@danielsantos.dev',
    linkedin: 'https://linkedin.com/in/daniel-santos-silva',
    linkedinDisplay: 'linkedin.com/in/daniel-santos-silva',
    github: 'https://github.com/danielsantos-dev',
    githubDisplay: 'github.com/danielsantos-dev',
    availability: 'Disponível para novas oportunidades e transição de carreira',
    workFocus: {
      infraLabel: 'Infraestrutura & Redes',
      systemsLabel: 'Sistemas & Desenvolvimento',
      description: 'Atuação integrada que combina a sustentação operacional de infraestrutura corporativa, servidores Windows/Linux, virtualização e redes com o desenvolvimento de software moderno (React, TypeScript, SQL). A experiência prática na ponta com suporte e incidentes enriquece diretamente a arquitetura de sistemas com visão de confiabilidade, segurança e usabilidade real.',
      note: 'Foco técnico estruturado por sinergia de competências reais — sem métricas arbitrárias de proficiência.',
      infraFocusAreas: ['Active Directory & Políticas', 'Servidores Windows & Linux', 'Virtualização (Proxmox VE)', 'Redes, pfSense & MikroTik', 'Monitoramento com Zabbix'],
      systemsFocusAreas: ['Frontend com React & TypeScript', 'Modelagem Relacional SQL', 'Automação de Processos', 'APIs & Arquitetura Web', 'Gestão de Ativos & Chamados'],
    },
    education: [
      {
        id: 'edu-1',
        institution: 'Universidade José do Rosário Vellano (UNIFENAS)',
        degree: 'Bacharelado / Graduação',
        field: 'Sistemas de Informação / Ciência da Computação',
        period: '2022 — Atual',
        status: 'Em andamento',
        description: 'Foco em Engenharia de Software, Estrutura de Dados, Redes de Computadores, Bancos de Dados Relacionais e Segurança da Informação.',
        highlights: [
          'Desenvolvimento de projetos práticos de automação e agendamento de recursos acadêmicos',
          'Estudo aprofundado de redes TCP/IP, topologias e protocolos de roteamento'
        ]
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'Administração de Redes e Serviços Windows Server',
        issuer: 'Formação Prática em Infraestrutura',
        year: '2023'
      },
      {
        id: 'cert-2',
        name: 'Fundamentos de Virtualização com Proxmox VE',
        issuer: 'Especialização Open Source',
        year: '2024'
      },
      {
        id: 'cert-3',
        name: 'Desenvolvimento Web Fullstack Moderno (TypeScript/React)',
        issuer: 'Certificação Técnica',
        year: '2024'
      }
    ]
  },

  experiences: [
    {
      id: 'exp-unifenas',
      role: 'Técnico de Suporte de TI (N1)',
      company: 'UNIFENAS (Universidade José do Rosário Vellano)',
      location: 'Belo Horizonte, MG',
      period: '2023 — Presente',
      current: true,
      type: 'Presencial • Instituição Acadêmica / Universitária',
      summary: 'Responsável pela sustentação operacional de TI do campus, prestando atendimento técnico a docentes, alunos e setores administrativos, com foco na disponibilidade de laboratórios, salas de aula e infraestrutura corporativa.',
      responsibilities: [
        'Atendimento e triagem de chamados N1/N2 via GLPI com cumprimento rigoroso de SLAs acordados com a instituição.',
        'Gerenciamento de identidades corporativas no Active Directory (criação de usuários, grupos de segurança, permissões em pastas de rede e aplicação de GPOs).',
        'Configuração e suporte a estações de trabalho Windows 10/11 e distribuições Linux em mais de 15 laboratórios didáticos e departamentos.',
        'Suporte a ativos de rede (switches gerenciáveis, roteadores MikroTik e pontos de acesso UniFi), identificando falhas de conectividade e lentidão.',
        'Monitoramento contínuo de servidores e links de internet através do Zabbix, atuando proativamente em alertas de indisponibilidade.',
        'Administração de contas institucionais no Google Workspace for Education (provisionamento de e-mails, grupos e acessos pedagógicos).'
      ],
      technologies: [
        'Active Directory',
        'Windows Server',
        'Proxmox VE',
        'GLPI',
        'Zabbix',
        'pfSense',
        'MikroTik',
        'UniFi',
        'Google Workspace',
        'Powershell'
      ],
      keyAchievements: [
        'Redução do tempo médio de resolução de chamados em 30% através da padronização de imagens de sistema e scripts de automação.',
        'Participação ativa no mapeamento dos ativos de hardware para auditoria de inventário com GLPI e OCS Inventory.'
      ]
    }
  ],

  infrastructureAreas: [
    {
      id: 'infra-servers',
      areaName: 'Servidores & Virtualização',
      iconName: 'Server',
      description: 'Arquitetura e manutenção de servidores locais e nós de virtualização para garantia de alta disponibilidade e isolamento de serviços.',
      items: [
        {
          id: 'item-proxmox',
          technology: 'Proxmox VE',
          purpose: 'Virtualização de servidores e isolamento de serviços em ambientes de laboratório e homologação.',
          appliedContext: 'Criação e manutenção de Máquinas Virtuais (KVM) e containers LXC, gerenciamento de snapshots, alocação dinâmica de recursos (CPU/RAM/Storage) e rotinas de backup de imagens completas.',
          tags: ['Virtualização', 'KVM', 'LXC', 'Storage Pools']
        },
        {
          id: 'item-ad-winserver',
          technology: 'Active Directory & Windows Server',
          purpose: 'Gerenciamento centralizado de identidades corporativas, autenticação e políticas de segurança.',
          appliedContext: 'Administração de floresta e domínio, criação e replicação de GPOs (Group Policy Objects) para padronização de desktops, controle de acesso baseado em grupos (RBAC) e servidor de arquivos (NTFS permissions).',
          tags: ['Identity', 'GPO', 'DNS Server', 'DHCP Server', 'File Server']
        },
        {
          id: 'item-hyperv',
          technology: 'Hyper-V',
          purpose: 'Execução de cargas legadas e servidores secundários de domínio.',
          appliedContext: 'Provisionamento de instâncias virtuais Windows Server com switches virtuais isolados e alocação de discos VHDX.',
          tags: ['Hypervisor', 'Windows Server']
        }
      ]
    },
    {
      id: 'infra-networking',
      areaName: 'Redes & Conectividade',
      iconName: 'Network',
      description: 'Segmentação de tráfego, controle de borda, balanceamento de links e cobertura wireless para centenas de dispositivos simultâneos.',
      items: [
        {
          id: 'item-pfsense',
          technology: 'pfSense',
          purpose: 'Firewall de borda, controle de regras de entrada/saída, NAT e VPN para acesso remoto seguro.',
          appliedContext: 'Criação de regras de firewall por interface, limitação de banda, balanceamento de links redundantes (Multi-WAN failover) e túneis OpenVPN.',
          tags: ['Firewall', 'Failover Multi-WAN', 'NAT', 'OpenVPN']
        },
        {
          id: 'item-mikrotik',
          technology: 'MikroTik RouterOS',
          purpose: 'Roteamento avançado, controle de filas (Queues) e marcação de pacotes.',
          appliedContext: 'Configuração de VLANs (802.1Q) para segregar tráfego acadêmico, administrativo e visitantes; configuração de DHCP pools e rotas estáticas.',
          tags: ['VLANs', 'Queues QoS', 'RouterOS', 'Routing']
        },
        {
          id: 'item-unifi',
          technology: 'UniFi Network Controller',
          purpose: 'Gestão unificada de Access Points corporativos e experiência de rede sem fio de alta densidade.',
          appliedContext: 'Mapeamento de canais de RF para evitar interferência, configuração de SSIDs distintos com isolamento de clientes (Guest Isolation) e controle de roaming.',
          tags: ['Wi-Fi 6', 'Guest Portal', 'SSID Management', 'RF Tuning']
        }
      ]
    },
    {
      id: 'infra-monitoring',
      areaName: 'Monitoramento & Gestão de Incidentes',
      iconName: 'Activity',
      description: 'Observabilidade da infraestrutura, prevenção de incidentes e controle do ciclo de vida de chamados.',
      items: [
        {
          id: 'item-zabbix',
          technology: 'Zabbix',
          purpose: 'Acompanhamento de disponibilidade e identificação precoce de indisponibilidades em tempo real.',
          appliedContext: 'Instalação de agentes Zabbix em servidores críticos, monitoramento via SNMP em switches de borda, criação de triggers de alerta para esgotamento de disco, pico de CPU e perda de pacotes em links principais.',
          tags: ['SNMP', 'Agentes Zabbix', 'Alertas Proativos', 'Dashboard']
        },
        {
          id: 'item-glpi',
          technology: 'GLPI (ITSM)',
          purpose: 'Gestão de chamados (Helpdesk), inventário automatizado de ativos e conformidade com SLA.',
          appliedContext: 'Operação diária de abertura, atribuição, escalonamento e encerramento de tickets, documentação de bases de conhecimento e rastreamento de hardware.',
          tags: ['ITIL/ITSM', 'SLA', 'Gestão de Ativos', 'Base de Conhecimento']
        }
      ]
    },
    {
      id: 'infra-workplace',
      areaName: 'Ambiente Corporativo & Serviços em Nuvem',
      iconName: 'ShieldCheck',
      description: 'Provisionamento de ferramentas colaborativas e políticas de proteção de dados corporativos.',
      items: [
        {
          id: 'item-google-workspace',
          technology: 'Google Workspace for Education',
          purpose: 'Administração de e-mails, grupos departamentais e controle de segurança de contas.',
          appliedContext: 'Criação em lote de contas acadêmicas, redefinição segura de credenciais com 2FA, gestão de permissões do Google Drive e configuração de políticas de auditoria.',
          tags: ['SaaS Admin', '2FA', 'Provisionamento de Contas']
        },
        {
          id: 'item-backup',
          technology: 'Rotinas de Backup & Recuperação',
          purpose: 'Garantia de integridade de dados e minimização do RPO/RTO em caso de desastres.',
          appliedContext: 'Execução de backups periódicos de servidores de arquivos em storage NAS externo e snapshots programados no Proxmox com validação de restauração.',
          tags: ['Disaster Recovery', 'Snapshots', 'NAS Storage']
        }
      ]
    }
  ],

  skillCategories: [
    {
      id: 'skill-cat-infra',
      title: 'Infraestrutura & Redes',
      description: 'Competências práticas aplicadas no gerenciamento de redes, servidores e segurança.',
      skills: [
        {
          name: 'Active Directory / GPO',
          appliedContext: 'Implementação de regras de grupo para padronização de segurança em +300 computadores.',
          category: 'infra'
        },
        {
          name: 'pfSense & MikroTik',
          appliedContext: 'Segmentação por VLANs e roteamento com regras de firewall restritivas.',
          category: 'infra'
        },
        {
          name: 'Proxmox VE & Hyper-V',
          appliedContext: 'Hospedagem de serviços internos em VMs e containers com isolamento de rede.',
          category: 'infra'
        },
        {
          name: 'Zabbix & SNMP',
          appliedContext: 'Criação de dashboards e alertas sonoros/Telegram para incidentes de infra.',
          category: 'infra'
        }
      ]
    },
    {
      id: 'skill-cat-dev',
      title: 'Engenharia de Software & Banco de Dados',
      description: 'Habilidades em desenvolvimento de aplicações web, lógica de negócio e persistência estruturada.',
      skills: [
        {
          name: 'TypeScript & JavaScript',
          appliedContext: 'Tipagem estrita em frontends e backends para evitar erros em tempo de execução.',
          category: 'systems'
        },
        {
          name: 'React & React Router',
          appliedContext: 'Construção de SPAs dinâmicas com arquitetura desacoplada e componentização limpa.',
          category: 'systems'
        },
        {
          name: 'SQL & Modelagem Relacional',
          appliedContext: 'Criação de schemas, foreign keys, índices e políticas de Row-Level Security (RLS).',
          category: 'systems'
        },
        {
          name: 'Flutter & Dart',
          appliedContext: 'Prototipação e desenvolvimento de interfaces móveis multiplataforma.',
          category: 'systems'
        }
      ]
    },
    {
      id: 'skill-cat-tools',
      title: 'Ferramentas, Protocolos & Metodologias',
      description: 'Padrões de trabalho, controle de versão e processos de suporte.',
      skills: [
        {
          name: 'Git & GitHub',
          appliedContext: 'Versionamento com branching organizado, commits semânticos e code reviews.',
          category: 'tools'
        },
        {
          name: 'PowerShell & Bash',
          appliedContext: 'Scripts para automação de tarefas repetitivas de suporte e coleta de logs.',
          category: 'tools'
        },
        {
          name: 'GLPI / Práticas ITIL',
          appliedContext: 'Gestão de ciclo de vida de incidentes, requisições de serviço e problemas recorrentes.',
          category: 'methods'
        }
      ]
    }
  ],

  projects: [
    {
      slug: 'operis',
      title: 'Operis',
      subtitle: 'SaaS Corporativo Multi-tenant para Gestão Operacional e Atendimento',
      shortSummary: 'Plataforma SaaS multi-inquilino construída com arquitetura de segurança por Row-Level Security (RLS), mecanismos dinâmicos de cálculo de SLA e fluxo de homologação rigorosamente documentado.',
      category: 'SaaS / Arquitetura de Sistemas',
      status: 'in-development',
      statusLabel: 'Em Desenvolvimento Ativo',
      featured: true,
      badge: 'Case Principal',
      problem: 'Empresas de serviços enfrentam gargalos no cumprimento de prazos contratuais de atendimento (SLA) devido à falta de isolamento seguro de dados entre múltiplos clientes e ausência de regras dinâmicas de escalonamento automático de tickets operacionais.',
      solution: 'O Operis foi projetado como um software como serviço (SaaS) multi-tenant de ponta a ponta. Cada tenant possui isolamento garantido no nível do banco de dados, painel customizável com contadores em tempo real de SLA, esteiras de homologação e auditoria granular de ações.',
      architecture: {
        overview: 'Arquitetura modular em camadas, priorizando segurança de dados com RLS nativo no PostgreSQL/Supabase, frontend reativo em React + TypeScript com gerenciamento de estado previsível, e funções de backend para processamento de eventos de SLA.',
        highlights: [
          'Row-Level Security (RLS) estrito: políticas de banco que impedem vazamento de dados entre empresas (tenants).',
          'Motor de SLA determinístico: cálculo de tempo útil (business hours) e contagem regressiva com alerta visual de violação iminente.',
          'Matriz de Permissões RBAC (Admin, Gestor, Agente, Cliente) validada em todas as mutações.',
          'Pipeline de Homologação documentado com casos de teste funcionais e validação de regressão.'
        ],
        diagramDescription: 'Frontend React (SPA) → API Gateway & Auth JWT → Camada de Políticas RLS no PostgreSQL → Storage e Notificações'
      },
      features: [
        'Isolamento multi-tenant completo com chaves de inquilino indexadas.',
        'Mecanismo de SLA com regras de calendário útil e tolerância a pausas justificadas.',
        'Dashboard analítico com métricas de tempo médio de atendimento e status dos chamados.',
        'Trilha de auditoria (audit logs) imutável para todas as alterações críticas de status.',
        'Fluxo de aprovação em etapas para requisições de alta prioridade.'
      ],
      technologies: [
        { name: 'TypeScript', role: 'Tipagem ponta a ponta e integridade de domínio' },
        { name: 'React', role: 'Interface moderna e componentes reativos' },
        { name: 'PostgreSQL / SQL', role: 'Estrutura relacional e políticas RLS' },
        { name: 'Tailwind CSS', role: 'Design system e responsividade rápida' },
        { name: 'Git / CI', role: 'Versionamento e esteira de testes' }
      ],
      danielRole: {
        title: 'Idealizador, Arquiteto de Software e Desenvolvedor Fullstack',
        contributions: [
          'Modelagem do esquema de banco de dados relacional e escrita das políticas de RLS no PostgreSQL.',
          'Definição e codificação do algoritmo de cálculo de SLA considerando feriados e jornadas de trabalho.',
          'Desenvolvimento da interface completa em React/TypeScript com componentes reutilizáveis.',
          'Elaboração de documentos de requisitos técnicos, diagrama de entidades e roteiro de homologação.'
        ]
      },
      gallery: [
        {
          title: 'Visão Geral do Dashboard Operis',
          description: 'Painel principal com visão consolidada de tickets em aberto, violação de SLA por fila e métricas de desempenho da equipe.',
          imageUrl: '',
          caption: 'Dashboard com métricas em tempo real e separação por tenant'
        },
        {
          title: 'Diagrama de Políticas de Isolamento RLS',
          description: 'Estrutura de filtragem no nível de linha (PostgreSQL) garantindo que consultas nunca acessem dados de outras organizações.',
          imageUrl: '',
          caption: 'Arquitetura de segurança Row-Level Security no banco de dados'
        },
        {
          title: 'Matriz de Homologação e Casos de Teste',
          description: 'Documentação estruturada de casos de teste para validação de fluxos de SLA, transferências e encerramentos.',
          imageUrl: '',
          caption: 'Documentação do plano de homologação técnica'
        }
      ],
      links: [
        {
          label: 'Repositório GitHub (Privado/Em homologação)',
          url: 'https://github.com/danielsantos-dev/operis',
          type: 'github'
        }
      ]
    },
    {
      slug: 'sistema-agendamento-unifenas',
      title: 'Sistema de Agendamento Acadêmico',
      subtitle: 'Plataforma para Reserva de Salas, Laboratórios de Informática e Equipamentos',
      shortSummary: 'Sistema desenvolvido para resolver conflitos de horários e eliminar planilhas manuais no agendamento de espaços didáticos e recursos audiovisuais da instituição.',
      category: 'Sistemas Corporativos / Solução Interna',
      status: 'completed',
      statusLabel: 'Concluído & Validado',
      featured: true,
      badge: 'Solução Acadêmica',
      problem: 'O campus dependia de reservas em planilhas e comunicação verbal descentralizada, gerando constantes duplicidades de agendamento de laboratórios, salas de aula especiais e projetores durante períodos de alta demanda.',
      solution: 'Desenvolvimento de uma aplicação web centralizada de agendamento, onde coordenadores e professores visualizam a grade em tempo real, filtram recursos disponíveis por especificações técnicas e reservam horários com validação instantânea contra sobreposições.',
      architecture: {
        overview: 'Frontend responsivo projetado para uso rápido em desktops e smartphones por docentes, integrado a backend com checagem atômica de disponibilidade de horários e regras de bloqueio preventivo para manutenção.',
        highlights: [
          'Algoritmo anti-conflito: validação estrita de intervalos de tempo para evitar reservas simultâneas no mesmo espaço.',
          'Categorização de recursos com atributos de capacidade, número de computadores e equipamentos multimídia disponíveis.',
          'Visualização em calendário diário, semanal e mensal com filtros por bloco e andar.',
          'Interface simples e intuitiva, desenhada para usuários com diferentes níveis de afinidade tecnológica.'
        ],
        diagramDescription: 'Grade de Horários Web → Validador de Conflitos de Intervalo → Banco de Dados de Recursos → Confirmação Automática'
      },
      features: [
        'Mapa visual de ocupação de laboratórios em tempo real.',
        'Filtro dinâmico por capacidade de alunos e softwares instalados.',
        'Notificação e comprovante de reserva com código identificador.',
        'Módulo administrativo para bloqueio de salas em datas de manutenção predial e eventos institucionais.',
        'Histórico detalhado de utilizações para relatórios gerenciais.'
      ],
      technologies: [
        { name: 'TypeScript', role: 'Lógica do sistema e validação de horários' },
        { name: 'React', role: 'Interface dinâmica e visualização em grade/calendário' },
        { name: 'SQL', role: 'Estruturação das tabelas de salas, blocos e reservas' },
        { name: 'Tailwind CSS', role: 'Interface limpa e de alta legibilidade' }
      ],
      danielRole: {
        title: 'Levantamento de Requisitos, Engenharia de Software e Implantação',
        contributions: [
          'Mapeamento direto com os setores acadêmicos para entender os gargalos da rotina diária de agendamento.',
          'Construção da lógica de detecção de colisões de agendamento no código da aplicação.',
          'Criação das interfaces de usuário focadas na agilidade de marcação pelos professores.',
          'Apresentação e treinamento aos usuários finais do campus.'
        ]
      },
      gallery: [
        {
          title: 'Visão de Grade de Agendamentos',
          description: 'Interface de calendário exibindo a ocupação de todos os laboratórios e salas de aula por turno (manhã, tarde, noite).',
          imageUrl: '',
          caption: 'Grade interativa de horários e ocupação de salas'
        },
        {
          title: 'Filtro e Seleção de Recursos Didáticos',
          description: 'Seleção detalhada com indicação de projetor, computadores com placas dedicadas e capacidade máxima.',
          imageUrl: '',
          caption: 'Módulo de busca avançada de salas por requisitos'
        }
      ],
      links: [
        {
          label: 'Código-Fonte no GitHub',
          url: 'https://github.com/danielsantos-dev/agendamento-academico',
          type: 'github'
        }
      ]
    },
    {
      slug: 'interactive-cv',
      title: 'Interactive CV',
      subtitle: 'Currículo Interativo com Arquitetura de Conteúdo Desacoplada',
      shortSummary: 'Aplicação web que você está navegando agora — projetada com uma camada de conteúdo agnóstica para futura integração com CMS/Supabase sem refatoração de UI.',
      category: 'Frontend Moderno / Engenharia de Software',
      status: 'in-development',
      statusLabel: 'Em Evolução Contínua',
      featured: true,
      badge: 'Meta Case',
      problem: 'Portfólios tradicionais frequentemente acoplam dados de texto diretamente na árvore de componentes React, tornando manutenções custosas, dificultando a internacionalização e exigindo reescrita completa ao migrar para um banco de dados real.',
      solution: 'O Interactive CV foi concebido como uma aplicação profissional desacoplada. Toda a camada de dados (perfil, experiências, infraestrutura, projetos e habilidades) reside em interfaces abstratas consumidas exclusivamente via hooks (ContentProvider).',
      architecture: {
        overview: 'Padrão Provider/Consumer com injeção de dependência. O StaticContentProvider alimenta a interface hoje via memória tipada, podendo ser substituído por um CloudContentProvider (ex: Supabase) sem que nenhum componente de tela seja alterado.',
        highlights: [
          'ContentProvider Abstraction: hooks customizados (`useProfile`, `useExperiences`, `useInfrastructure`, `useProjects`) isolam completamente a UI dos dados.',
          'Suporte nativo a i18n: separação entre conteúdo traduzido e rótulos de interface em tempo de execução.',
          'Design System Dark Sleek: interface com alto contraste, paleta escura (#09090B), acentos em azul e sem clutter visual.',
          'Zero dados em hardcode nas páginas: todas as seções e rotas dinâmicas renderizam a partir do provider.'
        ],
        diagramDescription: 'Camada de Dados (StaticData / Futuro Supabase) → ContentProvider (Context API) → Hooks Especializados → Componentes de UI Puros'
      },
      features: [
        'Roteamento client-side com rotas estáticas e dinâmicas (`/projetos/:slug`).',
        'Alternância instantânea de idioma (PT-BR / EN-US) mantendo o estado de navegação.',
        'Seção dedicada de Infraestrutura categorizada por finalidade de uso e contexto real.',
        'Estrutura em camadas para detalhamento de cases de projeto (Problema, Solução, Arquitetura, Participação).',
        'Visualização gráfica de composição de atuação profissional sem métricas falsas de proficiência.'
      ],
      technologies: [
        { name: 'React 19', role: 'Renderização moderna de componentes e estados' },
        { name: 'TypeScript', role: 'Interfaces rígidas de conteúdo e tipagem dos providers' },
        { name: 'React Router', role: 'Navegação SPA client-side sem recarregamento' },
        { name: 'Tailwind CSS v4', role: 'Estilização baseada em design tokens refinados' },
        { name: 'Lucide Icons', role: 'Iconografia limpa e semântica' }
      ],
      danielRole: {
        title: 'Arquiteto e Desenvolvedor',
        contributions: [
          'Design da arquitetura de conteúdo desacoplada e tipagem das entidades.',
          'Implementação dos providers estático e hooks de consumo de dados.',
          'Criação de todos os componentes de layout responsivo com tema Dark Sleek.',
          'Estruturação completa dos cases e curadoria do conteúdo técnico de infraestrutura.'
        ]
      },
      gallery: [
        {
          title: 'Diagrama de Desacoplamento da Camada de Conteúdo',
          description: 'Fluxo que demonstra a separação entre fontes de dados e os componentes da interface.',
          imageUrl: '',
          caption: 'Arquitetura de ContentProvider com abstração para futuro CMS'
        },
        {
          title: 'Estrutura de Tipos e Hooks Customizados',
          description: 'Visualização da tipagem TypeScript e interface de hooks consumidos pelas páginas.',
          imageUrl: '',
          caption: 'Definição tipada no src/content/types.ts'
        }
      ],
      links: [
        {
          label: 'Repositório no GitHub',
          url: 'https://github.com/danielsantos-dev/interactive-cv',
          type: 'github'
        }
      ]
    }
  ],

  metrics: [],

  contact: {
    email: 'contato@danielsantos.dev',
    linkedin: 'Daniel Santos',
    linkedinUrl: 'https://linkedin.com/in/daniel-santos-silva',
    github: 'danielsantos-dev',
    githubUrl: 'https://github.com/danielsantos-dev',
    location: 'Belo Horizonte, MG • Brasil',
    cityStateCountry: 'Belo Horizonte, Minas Gerais, Brasil',
    availabilityStatus: 'Aberto a conversas para vagas de Analista de Sistemas, Analista de Suporte/Infraestrutura N2 e Desenvolvedor Júnior/Pleno.',
    preferredContact: 'E-mail ou mensagem direta no LinkedIn',
    messageNote: 'Estou ativamente construindo soluções e pronto para somar em equipes que valorizam visão holística entre infraestrutura estável e engenharia de software de qualidade.'
  }
};
