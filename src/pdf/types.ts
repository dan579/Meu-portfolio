import {
  Profile,
  ExperienceItem,
  SkillCategory,
  ContactInfo
} from '../content/types.ts';

export interface ResumeData {
  profile: Profile;
  experiences: ExperienceItem[];
  skillCategories: SkillCategory[];
  contact: ContactInfo;
  siteUrl: string;
  generatedDate: string;
}

export interface PortfolioData {
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
