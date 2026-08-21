import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CertificationItem,
  ContactInfo,
  EducationItem,
  ExperienceItem,
  InfrastructureArea,
  Language,
  MetricSnapshot,
  Profile,
  ProjectCase,
  SkillCategory,
  UILabels,
} from './types.ts';
import { ptData } from './data/pt.ts';
import { enData } from './data/en.ts';
import { uiLabels } from './data/ui-labels.ts';
import { ContentContext, ContentContextType } from './ContentProvider.tsx';
import { isSupabaseConfigured, supabase } from '../lib/supabase.ts';

interface CloudContentProviderProps {
  children: React.ReactNode;
  initialLanguage?: Language;
}

export const CloudContentProvider: React.FC<CloudContentProviderProps> = ({
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

  // Raw fetched data from Supabase
  const [dbData, setDbData] = useState<{
    profile: any | null;
    education: any[];
    certifications: any[];
    experiences: any[];
    infraAreas: any[];
    infraTechs: any[];
    skillCategories: any[];
    skillItems: any[];
    projects: any[];
    metricsSnapshots: any[];
    contact: any | null;
  }>({
    profile: null,
    education: [],
    certifications: [],
    experiences: [],
    infraAreas: [],
    infraTechs: [],
    skillCategories: [],
    skillItems: [],
    projects: [],
    metricsSnapshots: [],
    contact: null,
  });

  const [refreshIndex, setRefreshIndex] = useState(0);

  // Trigger to reload cloud data
  const triggerRefresh = useCallback(() => {
    setRefreshIndex((prev) => prev + 1);
  }, []);

  // Listen to custom window events for content changes
  useEffect(() => {
    const handleContentUpdate = () => {
      triggerRefresh();
    };
    window.addEventListener('cv_content_updated', handleContentUpdate);
    return () => {
      window.removeEventListener('cv_content_updated', handleContentUpdate);
    };
  }, [triggerRefresh]);

  // Fetch from Supabase
  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    let isMounted = true;

    async function loadCloudData() {
      try {
        const [
          profileRes,
          eduRes,
          certRes,
          expRes,
          infraAreaRes,
          infraTechRes,
          skillCatRes,
          skillItemRes,
          projRes,
          metricsRes,
          contactRes,
        ] = await Promise.all([
          supabase.from('profiles').select('*, avatar_media:avatar_media_id(id, public_url, file_name)').limit(1).maybeSingle(),
          supabase.from('education_items').select('*').eq('status', 'published').order('sort_order', { ascending: true }),
          supabase.from('certification_items').select('*').eq('status', 'published').order('sort_order', { ascending: true }),
          supabase.from('experiences').select('*').eq('status', 'published').order('sort_order', { ascending: true }),
          supabase.from('infrastructure_areas').select('*').eq('status', 'published').order('sort_order', { ascending: true }),
          supabase.from('infrastructure_tech_items').select('*').eq('status', 'published').order('sort_order', { ascending: true }),
          supabase.from('skill_categories').select('*').eq('status', 'published').order('sort_order', { ascending: true }),
          supabase.from('skill_items').select('*').eq('status', 'published').order('sort_order', { ascending: true }),
          supabase.from('projects').select('*').eq('status', 'published').order('sort_order', { ascending: true }),
          supabase.from('metrics_snapshots').select('*, items:metric_items(*)').eq('status', 'published').order('sort_order', { ascending: true }),
          supabase.from('contact_info').select('*').limit(1).maybeSingle(),
        ]);

        if (isMounted) {
          setDbData({
            profile: profileRes.data || null,
            education: eduRes.data || [],
            certifications: certRes.data || [],
            experiences: expRes.data || [],
            infraAreas: infraAreaRes.data || [],
            infraTechs: infraTechRes.data || [],
            skillCategories: skillCatRes.data || [],
            skillItems: skillItemRes.data || [],
            projects: projRes.data || [],
            metricsSnapshots: metricsRes.data || [],
            contact: contactRes.data || null,
          });
        }
      } catch (error) {
        console.warn('Could not fetch cloud data, falling back to static seed data:', error);
      }
    }

    loadCloudData();

    return () => {
      isMounted = false;
    };
  }, [refreshIndex]);

  // Static fallback data for current language
  const staticFallback = useMemo(() => {
    return language === 'pt' ? ptData : enData;
  }, [language]);

  const activeLabels: UILabels = useMemo(() => {
    return uiLabels[language];
  }, [language]);

  // Transform Profile
  const mappedProfile: Profile = useMemo(() => {
    if (!dbData.profile) {
      return staticFallback.profile;
    }

    const p = dbData.profile;
    const isPt = language === 'pt';

    const education: EducationItem[] = dbData.education.length > 0
      ? dbData.education.map((edu: any) => ({
          id: edu.id,
          institution: edu.institution,
          degree: isPt ? edu.degree_pt : edu.degree_en,
          field: isPt ? edu.field_pt : edu.field_en,
          period: isPt ? edu.period_pt : edu.period_en,
          status: isPt ? edu.status_pt : edu.status_en,
          description: isPt ? edu.description_pt : edu.description_en,
          highlights: isPt ? (edu.highlights_pt || []) : (edu.highlights_en || []),
        }))
      : staticFallback.profile.education;

    const certifications: CertificationItem[] = dbData.certifications.length > 0
      ? dbData.certifications.map((c: any) => ({
          id: c.id,
          name: isPt ? c.name_pt : c.name_en,
          issuer: c.issuer,
          year: c.year,
          credentialUrl: c.credential_url,
          badge: c.badge,
        }))
      : staticFallback.profile.certifications;

    const resolvedPhotoUrl =
      p.avatar_media?.public_url ||
      p.avatar_url ||
      p.photo_url ||
      (staticFallback.profile as any).photoUrl ||
      '';

    return {
      name: p.name || staticFallback.profile.name,
      shortName: p.short_name || staticFallback.profile.shortName,
      initials: p.initials || staticFallback.profile.initials,
      photoUrl: resolvedPhotoUrl,
      avatarMediaId: p.avatar_media_id || p.avatar_media?.id || undefined,
      currentRole: isPt ? (p.current_role_pt || staticFallback.profile.currentRole) : (p.current_role_en || staticFallback.profile.currentRole),
      targetRole: isPt ? (p.target_role_pt || staticFallback.profile.targetRole) : (p.target_role_en || staticFallback.profile.targetRole),
      headline: isPt ? (p.headline_pt || staticFallback.profile.headline) : (p.headline_en || staticFallback.profile.headline),
      shortSummary: isPt ? (p.short_summary_pt || staticFallback.profile.shortSummary) : (p.short_summary_en || staticFallback.profile.shortSummary),
      fullBio: isPt ? (p.full_bio_pt || staticFallback.profile.fullBio) : (p.full_bio_en || staticFallback.profile.fullBio),
      location: p.location || staticFallback.profile.location,
      email: p.email || staticFallback.profile.email,
      linkedin: p.linkedin || staticFallback.profile.linkedin,
      linkedinDisplay: p.linkedin_display || staticFallback.profile.linkedinDisplay,
      github: p.github || staticFallback.profile.github,
      githubDisplay: p.github_display || staticFallback.profile.githubDisplay,
      availability: isPt ? (p.availability_pt || staticFallback.profile.availability) : (p.availability_en || staticFallback.profile.availability),
      workFocus: {
        infraPercentage: p.work_focus_infra_percentage ?? staticFallback.profile.workFocus.infraPercentage,
        systemsPercentage: p.work_focus_systems_percentage ?? staticFallback.profile.workFocus.systemsPercentage,
        infraLabel: isPt
          ? (p.work_focus_infra_label_pt || staticFallback.profile.workFocus.infraLabel)
          : (p.work_focus_infra_label_en || staticFallback.profile.workFocus.infraLabel),
        systemsLabel: isPt
          ? (p.work_focus_systems_label_pt || staticFallback.profile.workFocus.systemsLabel)
          : (p.work_focus_systems_label_en || staticFallback.profile.workFocus.systemsLabel),
        note: isPt ? (p.work_focus_note_pt || staticFallback.profile.workFocus.note) : (p.work_focus_note_en || staticFallback.profile.workFocus.note),
      },
      education,
      certifications,
    };
  }, [dbData.profile, dbData.education, dbData.certifications, language, staticFallback.profile]);

  // Transform Experiences
  const mappedExperiences: ExperienceItem[] = useMemo(() => {
    if (!dbData.experiences || dbData.experiences.length === 0) {
      return staticFallback.experiences;
    }

    const isPt = language === 'pt';
    return dbData.experiences.map((exp: any) => ({
      id: exp.id,
      role: isPt ? exp.role_pt : exp.role_en,
      company: exp.company,
      location: exp.location,
      period: isPt ? exp.period_pt : exp.period_en,
      current: exp.is_current,
      type: isPt ? exp.type_pt : exp.type_en,
      summary: isPt ? exp.summary_pt : exp.summary_en,
      responsibilities: isPt ? (exp.responsibilities_pt || []) : (exp.responsibilities_en || []),
      technologies: exp.technologies || [],
      keyAchievements: isPt ? (exp.key_achievements_pt || []) : (exp.key_achievements_en || []),
    }));
  }, [dbData.experiences, language, staticFallback.experiences]);

  // Transform Infrastructure Areas
  const mappedInfrastructure: InfrastructureArea[] = useMemo(() => {
    if (!dbData.infraAreas || dbData.infraAreas.length === 0) {
      return staticFallback.infrastructureAreas;
    }

    const isPt = language === 'pt';
    return dbData.infraAreas.map((area: any) => {
      const items = dbData.infraTechs
        .filter((item: any) => item.area_id === area.id)
        .map((item: any) => ({
          id: item.id,
          technology: item.technology,
          purpose: isPt ? item.purpose_pt : item.purpose_en,
          appliedContext: isPt ? item.applied_context_pt : item.applied_context_en,
          tags: item.tags || [],
        }));

      return {
        id: area.id,
        areaName: isPt ? area.area_name_pt : area.area_name_en,
        iconName: area.icon_name,
        description: isPt ? area.description_pt : area.description_en,
        items: items.length > 0 ? items : [],
      };
    });
  }, [dbData.infraAreas, dbData.infraTechs, language, staticFallback.infrastructureAreas]);

  // Transform Skill Categories
  const mappedSkills: SkillCategory[] = useMemo(() => {
    if (!dbData.skillCategories || dbData.skillCategories.length === 0) {
      return staticFallback.skillCategories;
    }

    const isPt = language === 'pt';
    return dbData.skillCategories.map((cat: any) => {
      const skills = dbData.skillItems
        .filter((item: any) => item.category_id === cat.id)
        .map((item: any) => ({
          name: item.name,
          appliedContext: isPt ? item.applied_context_pt : item.applied_context_en,
          category: item.category_key,
        }));

      return {
        id: cat.id,
        title: isPt ? cat.title_pt : cat.title_en,
        description: isPt ? cat.description_pt : cat.description_en,
        skills,
      };
    });
  }, [dbData.skillCategories, dbData.skillItems, language, staticFallback.skillCategories]);

  // Transform Projects
  const mappedProjects: ProjectCase[] = useMemo(() => {
    if (!dbData.projects || dbData.projects.length === 0) {
      return staticFallback.projects;
    }

    const isPt = language === 'pt';
    return dbData.projects.map((proj: any) => ({
      slug: proj.slug,
      title: proj.title,
      subtitle: isPt ? proj.subtitle_pt : proj.subtitle_en,
      shortSummary: isPt ? proj.short_summary_pt : proj.short_summary_en,
      category: isPt ? proj.category_pt : proj.category_en,
      status: proj.project_status,
      statusLabel: isPt ? proj.status_label_pt : proj.status_label_en,
      featured: proj.featured,
      badge: isPt ? proj.badge_pt : proj.badge_en,
      problem: isPt ? proj.problem_pt : proj.problem_en,
      solution: isPt ? proj.solution_pt : proj.solution_en,
      architecture: {
        overview: isPt ? proj.architecture_overview_pt : proj.architecture_overview_en,
        highlights: isPt ? (proj.architecture_highlights_pt || []) : (proj.architecture_highlights_en || []),
        diagramDescription: isPt ? proj.architecture_diagram_description_pt : proj.architecture_diagram_description_en,
      },
      features: isPt ? (proj.features_pt || []) : (proj.features_en || []),
      technologies: Array.isArray(proj.technologies)
        ? proj.technologies.map((t: any) => ({
            name: t.name,
            role: isPt ? (t.role_pt || t.role || '') : (t.role_en || t.role || ''),
          }))
        : [],
      danielRole: {
        title: isPt ? proj.daniel_role_title_pt : proj.daniel_role_title_en,
        contributions: isPt ? (proj.daniel_role_contributions_pt || []) : (proj.daniel_role_contributions_en || []),
      },
      gallery: Array.isArray(proj.gallery)
        ? proj.gallery.map((g: any) => ({
            mediaAssetId: g.mediaAssetId || g.media_asset_id,
            imageUrl: g.imageUrl || g.image_url || '',
            title: isPt ? (g.title_pt || g.title || '') : (g.title_en || g.title || ''),
            description: isPt ? (g.description_pt || g.description || '') : (g.description_en || g.description || ''),
            caption: isPt ? (g.caption_pt || g.caption || '') : (g.caption_en || g.caption || ''),
          }))
        : [],
      links: Array.isArray(proj.links) ? proj.links : [],
    }));
  }, [dbData.projects, language, staticFallback.projects]);

  // Transform Metrics Snapshots
  const mappedMetrics: MetricSnapshot[] = useMemo(() => {
    if (!dbData.metricsSnapshots || dbData.metricsSnapshots.length === 0) {
      return staticFallback.metrics || [];
    }

    const isPt = language === 'pt';
    return dbData.metricsSnapshots.map((s: any) => ({
      id: s.id,
      periodLabel: isPt ? s.period_label_pt : s.period_label_en,
      periodStart: s.period_start,
      periodEnd: s.period_end,
      sourceSystem: s.source_system || 'Operis',
      entryMethod: s.entry_method || 'manual',
      summary: isPt ? (s.summary_pt || '') : (s.summary_en || ''),
      status: s.status,
      sortOrder: s.sort_order ?? 0,
      createdAt: s.created_at,
      items: Array.isArray(s.items)
        ? s.items
            .slice()
            .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map((it: any) => ({
              id: it.id,
              snapshotId: it.snapshot_id,
              label: isPt ? it.label_pt : it.label_en,
              value: it.value,
              context: isPt ? (it.context_pt || '') : (it.context_en || ''),
              sortOrder: it.sort_order ?? 0,
            }))
        : [],
    }));
  }, [dbData.metricsSnapshots, language, staticFallback.metrics]);

  // Transform Contact
  const mappedContact: ContactInfo = useMemo(() => {
    if (!dbData.contact) {
      return staticFallback.contact;
    }

    const c = dbData.contact;
    const isPt = language === 'pt';
    return {
      email: c.email || staticFallback.contact.email,
      linkedin: c.linkedin || staticFallback.contact.linkedin,
      linkedinUrl: c.linkedin_url || staticFallback.contact.linkedinUrl,
      github: c.github || staticFallback.contact.github,
      githubUrl: c.github_url || staticFallback.contact.githubUrl,
      location: c.location || staticFallback.contact.location,
      cityStateCountry: isPt ? (c.city_state_country_pt || staticFallback.contact.cityStateCountry) : (c.city_state_country_en || staticFallback.contact.cityStateCountry),
      availabilityStatus: isPt ? (c.availability_status_pt || staticFallback.contact.availabilityStatus) : (c.availability_status_en || staticFallback.contact.availabilityStatus),
      preferredContact: isPt ? (c.preferred_contact_pt || staticFallback.contact.preferredContact) : (c.preferred_contact_en || staticFallback.contact.preferredContact),
      messageNote: isPt ? (c.message_note_pt || staticFallback.contact.messageNote) : (c.message_note_en || staticFallback.contact.messageNote),
    };
  }, [dbData.contact, language, staticFallback.contact]);

  const getProjectBySlug = useCallback(
    (slug: string): ProjectCase | undefined => {
      return mappedProjects.find((p) => p.slug === slug);
    },
    [mappedProjects]
  );

  const contextValue: ContentContextType = useMemo(
    () => ({
      language,
      setLanguage,
      labels: activeLabels,
      profile: mappedProfile,
      experiences: mappedExperiences,
      infrastructureAreas: mappedInfrastructure,
      skillCategories: mappedSkills,
      projects: mappedProjects,
      getProjectBySlug,
      metrics: mappedMetrics,
      contact: mappedContact,
    }),
    [
      language,
      setLanguage,
      activeLabels,
      mappedProfile,
      mappedExperiences,
      mappedInfrastructure,
      mappedSkills,
      mappedProjects,
      getProjectBySlug,
      mappedMetrics,
      mappedContact,
    ]
  );

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};
