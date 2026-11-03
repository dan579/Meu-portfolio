import {
  Profile,
  ExperienceItem,
  SkillCategory,
  ContactInfo,
  Language,
} from '../content/types.ts';

export interface ResumeData {
  language: Language;
  profile: Profile;
  experiences: ExperienceItem[];
  skillCategories: SkillCategory[];
  contact: ContactInfo;
  siteUrl: string;
  generatedDate: string;
}

export interface PortfolioData {
  language: Language;
  profile: Profile;
  experiences: ExperienceItem[];
  projects: any[];
  infrastructureAreas: any[];
  skillCategories: SkillCategory[];
  contact: ContactInfo;
  siteUrl: string;
  qrCodeDataUrl?: string;
  generatedDate: string;
}
