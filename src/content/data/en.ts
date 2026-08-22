import { ContentData } from '../types.ts';

export const enData: ContentData = {
  profile: {
    name: 'Daniel Santos da Silva',
    shortName: 'Daniel Santos',
    initials: 'DS',
    currentRole: 'IT Support Technician (Tier 1)',
    targetRole: 'Systems & Infrastructure Analyst',
    headline: 'IT Support Specialist transitioning to Systems & Infrastructure Analyst',
    shortSummary: 'IT professional with hands-on enterprise support, network administration, Windows/Linux server management, and virtualization experience, expanding capabilities into modern software engineering (React/TS, SQL) and system architecture.',
    fullBio: [
      'I actively maintain and optimize the technological ecosystem at UNIFENAS (Belo Horizonte campus), supporting hundreds of academic, administrative, and clinical users daily.',
      'My routine ranges from managing high-priority incidents via GLPI, managing enterprise identities and policies via Active Directory, to managing networks with pfSense and MikroTik, as well as proactive service availability monitoring with Zabbix.',
      'In parallel with infrastructure, I engineer complete software solutions with TypeScript, React, relational SQL database modeling, and scalable architectures. My goal is to solidify the transition into Systems and Infrastructure Analyst roles, merging deep networking foundations with modern software engineering.'
    ],
    location: 'Belo Horizonte, MG • Brazil',
    email: 'contato@danielsantos.dev',
    linkedin: 'https://linkedin.com/in/daniel-santos-silva',
    linkedinDisplay: 'linkedin.com/in/daniel-santos-silva',
    github: 'https://github.com/danielsantos-dev',
    githubDisplay: 'github.com/danielsantos-dev',
    availability: 'Available for career transition opportunities and technical projects',
    workFocus: {
      infraLabel: 'Infrastructure & Networking',
      systemsLabel: 'Systems & Software Development',
      description: 'Integrated technical approach bridging enterprise infrastructure management, Windows/Linux server administration, virtualization, and network operations with modern software engineering (React, TypeScript, SQL). Hands-on frontline support experience directly enhances system architecture with focus on operational resilience, security, and real-world workflow efficiency.',
      note: 'Technical focus structured around real competency synergy — avoiding arbitrary proficiency scores.',
      infraFocusAreas: ['Active Directory & GPOs', 'Windows & Linux Servers', 'Virtualization (Proxmox VE)', 'Networking, pfSense & MikroTik', 'Zabbix Infrastructure Monitoring'],
      systemsFocusAreas: ['Frontend (React & TypeScript)', 'Relational SQL Modeling', 'Process Automation', 'Web APIs & Architecture', 'IT Asset & Ticket Management'],
    },
    education: [
      {
        id: 'edu-1',
        institution: 'Universidade José do Rosário Vellano (UNIFENAS)',
        degree: 'Bachelor of Science (B.S.)',
        field: 'Information Systems / Computer Science',
        period: '2022 — Present',
        status: 'In progress',
        description: 'Focus on Software Engineering, Data Structures, Computer Networks, Relational Databases, and Information Security.',
        highlights: [
          'Practical development of campus automated scheduling systems',
          'In-depth study of TCP/IP stack, network topologies, and routing protocols'
        ]
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'Network Administration & Windows Server Services',
        issuer: 'Infrastructure Applied Training',
        year: '2023'
      },
      {
        id: 'cert-2',
        name: 'Virtualization Fundamentals with Proxmox VE',
        issuer: 'Open Source Specialization',
        year: '2024'
      },
      {
        id: 'cert-3',
        name: 'Modern Fullstack Web Development (TypeScript/React)',
        issuer: 'Technical Certification',
        year: '2024'
      }
    ]
  },

  experiences: [
    {
      id: 'exp-unifenas',
      role: 'IT Support Technician (Tier 1)',
      company: 'UNIFENAS (José do Rosário Vellano University)',
      location: 'Belo Horizonte, MG, Brazil',
      period: '2023 — Present',
      current: true,
      type: 'On-site • Academic & Higher Education Institution',
      summary: 'Responsible for campus-wide IT operational support, assisting faculty, students, and administrative staff, ensuring high uptime for computing labs, smart classrooms, and core infrastructure.',
      responsibilities: [
        'Handling and triaging Tier 1/2 incidents through GLPI while adhering strictly to agreed institutional SLAs.',
        'Managing corporate identities in Active Directory (user provisioning, security group management, shared folder NTFS permissions, and GPO rollouts).',
        'Configuring and troubleshooting Windows 10/11 workstations and Linux environments across 15+ computer labs and administrative offices.',
        'Supporting network equipment (managed switches, MikroTik routers, and UniFi APs), identifying connectivity bottlenecks and latency issues.',
        'Continuous monitoring of server health and internet uplinks using Zabbix, acting preemptively on threshold alerts.',
        'Administering institutional accounts on Google Workspace for Education (provisioning, group permissions, and access auditing).'
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
        'PowerShell'
      ],
      keyAchievements: [
        'Reduced average ticket resolution turnaround by 30% via standardized OS deployment images and automated diagnostic scripts.',
        'Led asset inventory mapping for institutional auditing integrating GLPI and OCS Inventory.'
      ]
    }
  ],

  infrastructureAreas: [
    {
      id: 'infra-servers',
      areaName: 'Servers & Virtualization',
      iconName: 'Server',
      description: 'Architecture and maintenance of on-premise servers and hypervisor nodes ensuring high availability and workload isolation.',
      items: [
        {
          id: 'item-proxmox',
          technology: 'Proxmox VE',
          purpose: 'Server virtualization and isolated service hosting across staging and production lab environments.',
          appliedContext: 'Creation and maintenance of KVM Virtual Machines and LXC containers, snapshot management, dynamic resource allocation (CPU/RAM/Storage pools), and automated image backup routines.',
          tags: ['Virtualization', 'KVM', 'LXC', 'Storage Pools']
        },
        {
          id: 'item-ad-winserver',
          technology: 'Active Directory & Windows Server',
          purpose: 'Centralized identity management, domain authentication, and security policy enforcement.',
          appliedContext: 'Domain tree administration, creation and propagation of Group Policy Objects (GPOs) for desktop lockdown, Role-Based Access Control (RBAC), and NTFS network file share permissions.',
          tags: ['Identity', 'GPO', 'DNS Server', 'DHCP Server', 'File Server']
        },
        {
          id: 'item-hyperv',
          technology: 'Hyper-V',
          purpose: 'Execution of legacy workloads and secondary domain controllers.',
          appliedContext: 'Provisioning Windows Server guest instances with dedicated virtual switches and VHDX disk management.',
          tags: ['Hypervisor', 'Windows Server']
        }
      ]
    },
    {
      id: 'infra-networking',
      areaName: 'Networking & Connectivity',
      iconName: 'Network',
      description: 'Traffic segmentation, edge security, multi-WAN failover, and high-density enterprise wireless coverage.',
      items: [
        {
          id: 'item-pfsense',
          technology: 'pfSense',
          purpose: 'Edge firewall, stateful ingress/egress rules, NAT translation, and secure remote VPN tunneling.',
          appliedContext: 'Firewall rules per VLAN interface, bandwidth shaping, Multi-WAN gateway failover with dual fiber links, and OpenVPN road-warrior tunnels.',
          tags: ['Firewall', 'Multi-WAN Failover', 'NAT', 'OpenVPN']
        },
        {
          id: 'item-mikrotik',
          technology: 'MikroTik RouterOS',
          purpose: 'Advanced routing, QoS queue management, and packet classification.',
          appliedContext: 'Configuration of 802.1Q trunk VLANs to isolate academic, staff, and guest traffic; static routing, DHCP server pools, and firewall filters.',
          tags: ['VLANs', 'Queues QoS', 'RouterOS', 'Routing']
        },
        {
          id: 'item-unifi',
          technology: 'UniFi Network Controller',
          purpose: 'Unified management of enterprise Wi-Fi Access Points and high-density coverage.',
          appliedContext: 'Radio frequency channel mapping to eliminate interference, segregated SSIDs with Client Isolation, and zero-handoff roaming management.',
          tags: ['Wi-Fi 6', 'Guest Portal', 'SSID Management', 'RF Tuning']
        }
      ]
    },
    {
      id: 'infra-monitoring',
      areaName: 'Monitoring & Incident Operations',
      iconName: 'Activity',
      description: 'Full-stack infrastructure observability, preemptive alert dispatching, and SLA incident lifecycle tracking.',
      items: [
        {
          id: 'item-zabbix',
          technology: 'Zabbix',
          purpose: 'Real-time availability monitoring, metric collection, and early outage detection.',
          appliedContext: 'Deployment of Zabbix agents on critical Linux/Windows nodes, SNMP polling on edge switches, and custom triggers for disk exhaustion, CPU spikes, and link packet loss.',
          tags: ['SNMP', 'Zabbix Agents', 'Proactive Alerts', 'Dashboard']
        },
        {
          id: 'item-glpi',
          technology: 'GLPI (ITSM)',
          purpose: 'Helpdesk ticketing, automated asset inventory lifecycle, and SLA compliance.',
          appliedContext: 'Daily triage, routing, escalation, and closure of IT support tickets; knowledge base documentation and hardware asset tracking.',
          tags: ['ITIL/ITSM', 'SLA Tracking', 'Asset Management', 'Knowledge Base']
        }
      ]
    },
    {
      id: 'infra-workplace',
      areaName: 'Corporate Workplace & Cloud Services',
      iconName: 'ShieldCheck',
      description: 'Collaboration suite provisioning and institutional data protection protocols.',
      items: [
        {
          id: 'item-google-workspace',
          technology: 'Google Workspace for Education',
          purpose: 'Administration of enterprise emails, collaborative groups, and authentication policies.',
          appliedContext: 'Batch provisioning of university accounts, 2FA security enforcement, shared drive permissions hierarchy, and audit log analysis.',
          tags: ['SaaS Admin', '2FA', 'Account Provisioning']
        },
        {
          id: 'item-backup',
          technology: 'Backup & Disaster Recovery Routines',
          purpose: 'Data integrity assurance and minimizing RPO/RTO in emergency failure scenarios.',
          appliedContext: 'Scheduled differential backups of network file shares to off-site NAS storage, paired with automated Proxmox hypervisor snapshots and periodic test restores.',
          tags: ['Disaster Recovery', 'Snapshots', 'NAS Storage']
        }
      ]
    }
  ],

  skillCategories: [
    {
      id: 'skill-cat-infra',
      title: 'Infrastructure & Networking',
      description: 'Applied technical skills in network engineering, systems administration, and security.',
      skills: [
        {
          name: 'Active Directory / GPO',
          appliedContext: 'Group policy enforcement and uniform security configurations across 300+ nodes.',
          category: 'infra'
        },
        {
          name: 'pfSense & MikroTik',
          appliedContext: 'VLAN network segmentation and stateful restrictive firewalling.',
          category: 'infra'
        },
        {
          name: 'Proxmox VE & Hyper-V',
          appliedContext: 'Hosting internal institutional services in VM/container environments.',
          category: 'infra'
        },
        {
          name: 'Zabbix & SNMP',
          appliedContext: 'Metric collection, trigger engineering, and incident notifications.',
          category: 'infra'
        }
      ]
    },
    {
      id: 'skill-cat-dev',
      title: 'Software Engineering & Databases',
      description: 'Application development capabilities, business logic implementation, and relational modeling.',
      skills: [
        {
          name: 'TypeScript & JavaScript',
          appliedContext: 'Strict end-to-end typing in frontend and backend layers to eliminate runtime faults.',
          category: 'systems'
        },
        {
          name: 'React & React Router',
          appliedContext: 'Dynamic single-page applications with decoupled content architecture.',
          category: 'systems'
        },
        {
          name: 'SQL & Relational Modeling',
          appliedContext: 'Schema design, foreign key integrity, and PostgreSQL Row-Level Security (RLS).',
          category: 'systems'
        },
        {
          name: 'Flutter & Dart',
          appliedContext: 'Cross-platform mobile prototyping and user interface design.',
          category: 'systems'
        }
      ]
    },
    {
      id: 'skill-cat-tools',
      title: 'Tools, Protocols & Methodologies',
      description: 'Professional engineering toolchain, version control, and operational standards.',
      skills: [
        {
          name: 'Git & GitHub',
          appliedContext: 'Structured branching workflows, semantic commit conventions, and peer reviews.',
          category: 'tools'
        },
        {
          name: 'PowerShell & Bash',
          appliedContext: 'Scripting repetitive administrative maintenance and automated log parsing.',
          category: 'tools'
        },
        {
          name: 'GLPI / ITIL Best Practices',
          appliedContext: 'Incident lifecycle control, service requests, and known-error tracking.',
          category: 'methods'
        }
      ]
    }
  ],

  projects: [
    {
      slug: 'operis',
      title: 'Operis',
      subtitle: 'Multi-tenant Enterprise SaaS for Operations & Service Level Management',
      shortSummary: 'Multi-tenant SaaS platform built with PostgreSQL Row-Level Security (RLS), deterministic SLA tracking engines, and documented staging homologation.',
      category: 'SaaS / System Architecture',
      status: 'in-development',
      statusLabel: 'Active Development',
      featured: true,
      badge: 'Flagship Case',
      problem: 'Service organizations struggle to adhere to contractual SLA commitments due to leaky multi-client data silos, lack of dynamic escalation logic, and opaque incident tracking across dispersed teams.',
      solution: 'Operis was engineered as an end-to-end multi-tenant SaaS application. Each tenant benefits from bulletproof database-level isolation, real-time visual countdown timers for SLA compliance, and structured operational audit logs.',
      architecture: {
        overview: 'Layered modular architecture emphasizing data isolation with native PostgreSQL/Supabase Row-Level Security, a reactive React + TypeScript frontend with deterministic state management, and event-driven backend functions for SLA updates.',
        highlights: [
          'Strict Row-Level Security (RLS): database policies strictly prohibit cross-tenant data leakage.',
          'Deterministic SLA Engine: business hours calculation taking holidays and paused tickets into account.',
          'Role-Based Access Control (RBAC): granular permissions matrix (Admin, Manager, Agent, Client).',
          'Documented Homologation Pipeline: formal test matrices covering edge cases and regression scenarios.'
        ],
        diagramDescription: 'React SPA Frontend → API Gateway & Auth JWT → Database RLS Policy Layer (PostgreSQL) → Storage & Push Notifications'
      },
      features: [
        'Complete multi-tenant isolation utilizing indexed tenant keys.',
        'SLA calculation engine accounting for operational business shifts and justified hold statuses.',
        'Real-time analytics dashboard with average response metrics and queue volume status.',
        'Immutable audit log tracking all critical state transitions.',
        'Tiered approval workflow for high-priority operational requests.'
      ],
      technologies: [
        { name: 'TypeScript', role: 'End-to-end type safety and domain modeling' },
        { name: 'React', role: 'Modern UI and reactive component state' },
        { name: 'PostgreSQL / SQL', role: 'Relational data structures & RLS policies' },
        { name: 'Tailwind CSS', role: 'Design token styling and mobile responsiveness' },
        { name: 'Git / CI', role: 'Version control and staging workflows' }
      ],
      danielRole: {
        title: 'Project Creator, Software Architect & Fullstack Developer',
        contributions: [
          'Modeled relational database schemas and authored strict RLS security policies in PostgreSQL.',
          'Engineered the core SLA calculation algorithms factoring business schedules and pauses.',
          'Built the entire responsive frontend in React/TypeScript with modular component architecture.',
          'Authored technical requirements, entity relationship diagrams, and staging test plans.'
        ]
      },
      gallery: [
        {
          title: 'Operis Overview Dashboard',
          description: 'Primary view showcasing open ticket queues, near-breach SLA alerts, and team performance metrics.',
          imageUrl: '',
          caption: 'Real-time dashboard with tenant isolation and queue overview'
        },
        {
          title: 'Row-Level Security Policy Matrix',
          description: 'Database filter hierarchy in PostgreSQL guaranteeing strict isolation across tenant spaces.',
          imageUrl: '',
          caption: 'Row-Level Security isolation architecture'
        },
        {
          title: 'Homologation Test Plan Matrix',
          description: 'Structured quality assurance sheets documenting SLA transitions, role validation, and ticket handoffs.',
          imageUrl: '',
          caption: 'Technical homologation and quality assurance documentation'
        }
      ],
      links: [
        {
          label: 'GitHub Repository (Staging / Private)',
          url: 'https://github.com/danielsantos-dev/operis',
          type: 'github'
        }
      ]
    },
    {
      slug: 'sistema-agendamento-unifenas',
      title: 'Academic Room Scheduling System',
      subtitle: 'Centralized Platform for University Labs, Classrooms & AV Equipment',
      shortSummary: 'Corporate academic application developed to eliminate manual spreadsheets and scheduling collisions across UNIFENAS campus learning spaces.',
      category: 'Enterprise Systems / Internal Solution',
      status: 'completed',
      statusLabel: 'Completed & Validated',
      featured: true,
      badge: 'Academic Solution',
      problem: 'The campus relied on disconnected spreadsheets and manual verbal coordination, resulting in frequent double-bookings of IT labs, specialized lecture halls, and audiovisual equipment during peak academic periods.',
      solution: 'Developed a centralized web scheduling portal where department coordinators and professors can inspect live availability grids, filter spaces by technical specs, and reserve slots with instant collision detection.',
      architecture: {
        overview: 'Responsive frontend optimized for rapid booking on desktops and mobile devices, connected to a backend that performs atomic availability checks and enforces preventive maintenance windows.',
        highlights: [
          'Anti-collision algorithm: strict temporal interval checking preventing overlapping reservations.',
          'Resource metadata indexing: filter by student seating capacity, GPU-equipped workstations, and AV gear.',
          'Calendar views: daily, weekly, and monthly timetable visualization with multi-building filters.',
          'Intuitive, accessible interface tailored for staff with diverse technical backgrounds.'
        ],
        diagramDescription: 'Web Calendar Grid → Interval Conflict Engine → Resource Database → Instant Reservation Confirmation'
      },
      features: [
        'Real-time lab and classroom occupancy timetable.',
        'Dynamic filter by student capacity and installed specialized software packages.',
        'Instant digital reservation voucher with unique lookup code.',
        'Administrative module for scheduling preventive maintenance and institutional events.',
        'Audit history for departmental reporting and utilization statistics.'
      ],
      technologies: [
        { name: 'TypeScript', role: 'Domain logic and temporal conflict algorithms' },
        { name: 'React', role: 'Dynamic UI and interactive calendar grid' },
        { name: 'SQL', role: 'Relational data models for spaces, slots, and bookings' },
        { name: 'Tailwind CSS', role: 'Accessible high-contrast UI' }
      ],
      danielRole: {
        title: 'Requirements Engineering, Software Development & Deployment',
        contributions: [
          'Conducted user research with academic departments to understand booking pain points.',
          'Implemented the temporal conflict detection algorithms in the application core.',
          'Designed high-efficiency user interfaces for quick reservation workflows.',
          'Delivered user onboarding and campus rollout documentation.'
        ]
      },
      gallery: [
        {
          title: 'Master Schedule Grid View',
          description: 'Calendar view showing room and computer lab occupancy across morning, afternoon, and evening shifts.',
          imageUrl: '',
          caption: 'Interactive calendar view of classroom availability'
        },
        {
          title: 'Equipment & Space Filter Matrix',
          description: 'Detailed search interface filtering by projector type, dedicated GPU nodes, and seating limit.',
          imageUrl: '',
          caption: 'Advanced space filtering workflow'
        }
      ],
      links: [
        {
          label: 'Source Code on GitHub',
          url: 'https://github.com/danielsantos-dev/agendamento-academico',
          type: 'github'
        }
      ]
    },
    {
      slug: 'interactive-cv',
      title: 'Interactive CV',
      subtitle: 'Interactive CV with Decoupled Content Provider Architecture',
      shortSummary: 'The web application you are currently viewing — architected with an abstract data layer ready for future headless CMS/Supabase integration with zero UI refactoring.',
      category: 'Modern Frontend / Software Engineering',
      status: 'in-development',
      statusLabel: 'Continuous Evolution',
      featured: true,
      badge: 'Meta Case',
      problem: 'Standard developer portfolios hardcode text strings directly into JSX components, making ongoing updates tedious, complicating localization, and necessitating full rewrites when upgrading to a real database or CMS.',
      solution: 'Interactive CV was engineered as a decoupled professional application. All data models (profile, experiences, infrastructure, projects, and skills) are isolated in abstract interfaces consumed exclusively via React hooks (ContentProvider).',
      architecture: {
        overview: 'Dependency-injected Provider/Consumer pattern. The current StaticContentProvider serves typed in-memory datasets and can be replaced with a CloudContentProvider (e.g. Supabase) without modifying a single UI component.',
        highlights: [
          'ContentProvider Abstraction: specialized hooks (`useProfile`, `useExperiences`, `useInfrastructure`, `useProjects`) isolate UI from storage.',
          'Native i18n support: clean separation between localized domain content and runtime UI chrome labels.',
          'Sleek Dark Interface: refined high-contrast palette (#09090B), subtle blue accents, and clean typography.',
          'Zero hardcoded strings in pages: all views render purely through hook subscriptions.'
        ],
        diagramDescription: 'Data Layer (Static Data / Future Supabase) → ContentProvider (React Context) → Domain Hooks → Pure UI Components'
      },
      features: [
        'Client-side SPA navigation with dynamic parameterized routes (`/projetos/:slug`).',
        'Instant language toggle (PT-BR / EN-US) preserving user navigation state.',
        'Dedicated Infrastructure section organized by operational purpose and real-world applied context.',
        'Standardized layered case study views (Problem, Solution, Architecture, Contributions).',
        'Visual work focus composition without misleading percentage proficiency meters.'
      ],
      technologies: [
        { name: 'React 19', role: 'Modern component rendering and state orchestration' },
        { name: 'TypeScript', role: 'Strict content interfaces and provider contracts' },
        { name: 'React Router', role: 'Seamless client-side SPA routing' },
        { name: 'Tailwind CSS v4', role: 'Refined dark design tokens and fluid typography' },
        { name: 'Lucide Icons', role: 'Semantic, lightweight SVG iconography' }
      ],
      danielRole: {
        title: 'Architect & Developer',
        contributions: [
          'Engineered the decoupled ContentProvider contract and TypeScript entity models.',
          'Implemented the static provider and specialized domain consumption hooks.',
          'Crafted the responsive Dark Sleek layout and UI components.',
          'Structured the technical case studies and curated the infrastructure catalog.'
        ]
      },
      gallery: [
        {
          title: 'Content Layer Decoupling Architecture',
          description: 'Architectural flow depicting the abstraction between data providers and presentation components.',
          imageUrl: '',
          caption: 'ContentProvider abstraction layer for future CMS migration'
        },
        {
          title: 'TypeScript Interface & Hook Schema',
          description: 'Type definitions and hook contracts ensuring strict compile-time safety.',
          imageUrl: '',
          caption: 'Type declarations in src/content/types.ts'
        }
      ],
      links: [
        {
          label: 'GitHub Repository',
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
    location: 'Belo Horizonte, MG • Brazil',
    cityStateCountry: 'Belo Horizonte, Minas Gerais, Brazil',
    availabilityStatus: 'Open to conversations regarding Systems Analyst, Tier 2 Support/Infrastructure, and Junior/Mid Fullstack Developer positions.',
    preferredContact: 'Email or direct message on LinkedIn',
    messageNote: 'I am actively building robust technical solutions and eager to contribute to engineering teams that value a holistic bridge between resilient infrastructure and high-quality software.'
  }
};
