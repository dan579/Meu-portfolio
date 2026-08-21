import React, { useState, useMemo, useCallback } from 'react';
import { Language, ProjectCase } from './types.ts';
import { ptData } from './data/pt.ts';
import { enData } from './data/en.ts';
import { uiLabels } from './data/ui-labels.ts';
import { ContentContext, ContentContextType } from './ContentProvider.tsx';

interface StaticContentProviderProps {
  children: React.ReactNode;
  initialLanguage?: Language;
}

export const StaticContentProvider: React.FC<StaticContentProviderProps> = ({
  children,
  initialLanguage = 'pt',
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('interactive_cv_lang');
      if (saved === 'pt' || saved === 'en') return saved;
    } catch {
      // ignore
    }
    return initialLanguage;
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('interactive_cv_lang', lang);
    } catch {
      // ignore
    }
  }, []);

  const activeData = useMemo(() => {
    return language === 'pt' ? ptData : enData;
  }, [language]);

  const activeLabels = useMemo(() => {
    return uiLabels[language];
  }, [language]);

  const getProjectBySlug = useCallback(
    (slug: string): ProjectCase | undefined => {
      return activeData.projects.find((p) => p.slug === slug);
    },
    [activeData.projects]
  );

  const contextValue: ContentContextType = useMemo(
    () => ({
      language,
      setLanguage,
      labels: activeLabels,
      profile: activeData.profile,
      experiences: activeData.experiences,
      infrastructureAreas: activeData.infrastructureAreas,
      skillCategories: activeData.skillCategories,
      projects: activeData.projects,
      getProjectBySlug,
      metrics: activeData.metrics || [],
      contact: activeData.contact,
    }),
    [language, setLanguage, activeLabels, activeData, getProjectBySlug]
  );

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};
