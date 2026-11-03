import { Language } from '../content/types.ts';

export interface PdfLabels {
  resumeDocTitle: string;
  resumeDocSubject: string;
  resumeKeywords: string;
  portfolioDocTitle: string;
  portfolioDocSubject: string;
  portfolioKeywords: string;
  professionalSummary: string;
  careerAndProfile: string;
  experience: string;
  technologies: string;
  education: string;
  certificationsAndCourses: string;
  certifications: string;
  technicalSkills: string;
  skillsAndContext: string;
  projects: string;
  problem: string;
  solution: string;
  architectureHighlights: string;
  infrastructure: string;
  resumeFooter: string;
  portfolioFooterTitle: string;
  portfolioFooterSub: string;
  page: (n: number, total: number) => string;
  resumeFilePrefix: string;
  portfolioFilePrefix: string;
  dateLocale: string;
}

export const pdfLabels: Record<Language, PdfLabels> = {
  pt: {
    resumeDocTitle: 'Currículo',
    resumeDocSubject: 'Currículo Profissional ATS',
    resumeKeywords: 'Analista de Sistemas, Infraestrutura, Suporte de TI, TypeScript, React, SQL, Redes',
    portfolioDocTitle: 'Portfólio Técnico',
    portfolioDocSubject: 'Portfólio de Sistemas e Infraestrutura',
    portfolioKeywords: 'Portfólio, Daniel Santos, Sistemas, Infraestrutura, Suporte Técnico, Supabase, Operis',
    professionalSummary: 'Resumo Profissional',
    careerAndProfile: 'Trajetória & Perfil Técnico',
    experience: 'Experiência Profissional',
    technologies: 'Tecnologias',
    education: 'Formação Acadêmica',
    certificationsAndCourses: 'Certificações & Cursos Técnicos',
    certifications: 'Certificações',
    technicalSkills: 'Competências Técnicas',
    skillsAndContext: 'Competências Técnicas & Contexto Prático',
    projects: 'Projetos & Estudos de Caso em Destaque',
    problem: 'Problema',
    solution: 'Solução',
    architectureHighlights: 'Destaques Arquiteturais',
    infrastructure: 'Infraestrutura & Operações',
    resumeFooter: 'Portfólio Interativo & Cases Completos',
    portfolioFooterTitle: 'Interactive CV & Portfólio de Daniel Santos',
    portfolioFooterSub: 'Acesse a versão interativa com os cases completos:',
    page: (n, total) => `Página ${n} de ${total}`,
    resumeFilePrefix: 'curriculo-daniel-santos',
    portfolioFilePrefix: 'portfolio-daniel-santos',
    dateLocale: 'pt-BR',
  },
  en: {
    resumeDocTitle: 'Resume',
    resumeDocSubject: 'ATS Professional Resume',
    resumeKeywords: 'Systems Analyst, Infrastructure, IT Support, TypeScript, React, SQL, Networking',
    portfolioDocTitle: 'Technical Portfolio',
    portfolioDocSubject: 'Systems and Infrastructure Portfolio',
    portfolioKeywords: 'Portfolio, Daniel Santos, Systems, Infrastructure, Technical Support, Supabase, Operis',
    professionalSummary: 'Professional Summary',
    careerAndProfile: 'Background & Technical Profile',
    experience: 'Professional Experience',
    technologies: 'Technologies',
    education: 'Education',
    certificationsAndCourses: 'Certifications & Technical Courses',
    certifications: 'Certifications',
    technicalSkills: 'Technical Skills',
    skillsAndContext: 'Technical Skills & Practical Context',
    projects: 'Featured Projects & Case Studies',
    problem: 'Problem',
    solution: 'Solution',
    architectureHighlights: 'Architecture Highlights',
    infrastructure: 'Infrastructure & Operations',
    resumeFooter: 'Interactive Portfolio & Full Case Studies',
    portfolioFooterTitle: 'Daniel Santos — Interactive CV & Portfolio',
    portfolioFooterSub: 'Explore the interactive version with full case studies:',
    page: (n, total) => `Page ${n} of ${total}`,
    resumeFilePrefix: 'resume-daniel-santos',
    portfolioFilePrefix: 'portfolio-daniel-santos',
    dateLocale: 'en-US',
  },
};
