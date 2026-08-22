export type Language = 'pt' | 'en';

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  period: string;
  status: string;
  description?: string;
  highlights?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
  badge?: string;
}

export interface Profile {
  name: string;
  shortName: string;
  initials: string;
  photoUrl?: string;
  avatarMediaId?: string;
  currentRole: string;
  targetRole: string;
  headline: string;
  shortSummary: string;
  fullBio: string[];
  location: string;
  email: string;
  linkedin: string;
  linkedinDisplay: string;
  github: string;
  githubDisplay: string;
  availability: string;
  workFocus: {
    infraLabel: string;
    systemsLabel: string;
    description: string;
    note?: string;
    infraFocusAreas?: string[];
    systemsFocusAreas?: string[];
  };
  education: EducationItem[];
  certifications?: CertificationItem[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  type: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  keyAchievements?: string[];
}

export interface InfrastructureTechItem {
  id: string;
  technology: string;
  purpose: string; // O que ela é usada para fazer
  appliedContext: string; // Contexto real de aplicação
  tags: string[];
}

export interface InfrastructureArea {
  id: string;
  areaName: string;
  iconName: string;
  description: string;
  items: InfrastructureTechItem[];
}

export interface SkillItem {
  name: string;
  appliedContext: string; // Contexto real de uso (sem porcentagens falsas)
  category: 'infra' | 'systems' | 'devops' | 'tools' | 'methods';
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: SkillItem[];
}

export interface ProjectTechnology {
  name: string;
  role: string; // ex: "Banco de dados & RLS", "Frontend SPA", "Monitoramento"
}

export interface MediaAsset {
  id: string;
  storage_path: string;
  public_url: string;
  file_name: string;
  mime_type: string;
  size_bytes?: number;
  alt_text_pt?: string;
  alt_text_en?: string;
  uploaded_at?: string;
}

export interface ProjectGalleryItem {
  mediaAssetId?: string;
  imageUrl: string; // Resolvido a partir de media_assets ou URL pública
  title: string;
  description: string;
  caption: string;
}

export interface ProjectCase {
  slug: string;
  title: string;
  subtitle: string;
  shortSummary: string;
  category: string;
  status: 'in-development' | 'completed';
  statusLabel: string;
  featured: boolean;
  badge?: string;
  problem: string;
  solution: string;
  architecture: {
    overview: string;
    highlights: string[];
    diagramDescription?: string;
  };
  features: string[];
  technologies: ProjectTechnology[];
  danielRole: {
    title: string;
    contributions: string[];
  };
  gallery: ProjectGalleryItem[];
  links?: {
    label: string;
    url: string;
    type: 'demo' | 'github' | 'docs' | 'internal';
  }[];
}

export interface ContactInfo {
  email: string;
  linkedin: string;
  linkedinUrl: string;
  github: string;
  githubUrl: string;
  location: string;
  cityStateCountry: string;
  availabilityStatus: string;
  preferredContact: string;
  messageNote: string;
}

export interface MetricItem {
  id: string;
  snapshotId?: string;
  label: string;
  value: string;
  context?: string;
  sortOrder: number;
}

export interface MetricSnapshot {
  id: string;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  sourceSystem: string;
  entryMethod: 'manual' | 'automated';
  summary?: string;
  status: 'draft' | 'published' | 'archived';
  sortOrder: number;
  createdAt?: string;
  items: MetricItem[];
}

export interface ContentData {
  profile: Profile;
  experiences: ExperienceItem[];
  infrastructureAreas: InfrastructureArea[];
  skillCategories: SkillCategory[];
  projects: ProjectCase[];
  metrics?: MetricSnapshot[];
  contact: ContactInfo;
}

export interface UILabels {
  nav: {
    home: string;
    about: string;
    experience: string;
    infrastructure: string;
    projects: string;
    metrics: string;
    contact: string;
  };
  common: {
    viewAllProjects: string;
    viewCaseStudy: string;
    backToProjects: string;
    currentPosition: string;
    availableForProjects: string;
    workCompositionTitle: string;
    workCompositionNote: string;
    primaryStack: string;
    featuredProjects: string;
    responsibilities: string;
    technologiesUsed: string;
    appliedContext: string;
    problem: string;
    solution: string;
    architecture: string;
    keyFeatures: string;
    danielParticipation: string;
    galleryMockups: string;
    linksResources: string;
    copyEmail: string;
    emailCopied: string;
    getInTouch: string;
    openInNewTab: string;
    projectStatus: {
      inDevelopment: string;
      completed: string;
    };
    metrics: {
      sourceNote: string;
      noMetricsTitle: string;
      noMetricsDesc: string;
      metricsHeadline: string;
      metricsSubtitle: string;
      periodLabel: string;
      sourceLabel: string;
    };
  };
}
