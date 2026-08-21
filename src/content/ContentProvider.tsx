import { createContext, useContext } from 'react';
import {
  ContactInfo,
  ExperienceItem,
  InfrastructureArea,
  Language,
  MetricSnapshot,
  Profile,
  ProjectCase,
  SkillCategory,
  UILabels
} from './types.ts';

export interface ContentContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  labels: UILabels;
  profile: Profile;
  experiences: ExperienceItem[];
  infrastructureAreas: InfrastructureArea[];
  skillCategories: SkillCategory[];
  projects: ProjectCase[];
  getProjectBySlug: (slug: string) => ProjectCase | undefined;
  metrics: MetricSnapshot[];
  contact: ContactInfo;
}

export const ContentContext = createContext<ContentContextType | null>(null);

/**
 * Base hook to access the unified content context.
 */
export function useContent(): ContentContextType {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

/**
 * Hook to read and toggle the active language.
 */
export function useLanguage(): { language: Language; setLanguage: (lang: Language) => void } {
  const { language, setLanguage } = useContent();
  return { language, setLanguage };
}

/**
 * Hook to access localized UI chrome labels.
 */
export function useUILabels(): UILabels {
  const { labels } = useContent();
  return labels;
}

/**
 * Hook to access Daniel's profile, bio, education, and work composition.
 */
export function useProfile(): Profile {
  const { profile } = useContent();
  return profile;
}

/**
 * Hook to access chronological work experiences and roles.
 */
export function useExperiences(): ExperienceItem[] {
  const { experiences } = useContent();
  return experiences;
}

/**
 * Hook to access organized infrastructure domains and technical usage context.
 */
export function useInfrastructure(): InfrastructureArea[] {
  const { infrastructureAreas } = useContent();
  return infrastructureAreas;
}

/**
 * Hook to access skill categories with real applied contexts (no arbitrary % bars).
 */
export function useSkillCategories(): SkillCategory[] {
  const { skillCategories } = useContent();
  return skillCategories;
}

/**
 * Hook to access all project case studies.
 */
export function useProjects(): ProjectCase[] {
  const { projects } = useContent();
  return projects;
}

/**
 * Hook to retrieve a specific project case by its slug.
 */
export function useProjectBySlug(slug: string | undefined): ProjectCase | undefined {
  const { getProjectBySlug } = useContent();
  if (!slug) return undefined;
  return getProjectBySlug(slug);
}

/**
 * Hook to access published aggregated metrics snapshots (e.g. from Operis).
 */
export function useMetrics(): MetricSnapshot[] {
  const { metrics } = useContent();
  return metrics;
}

/**
 * Hook to access contact and social profiles.
 */
export function useContact(): ContactInfo {
  const { contact } = useContent();
  return contact;
}
