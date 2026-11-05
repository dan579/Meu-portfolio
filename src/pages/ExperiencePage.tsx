import React from 'react';
import { useExperiences, useUILabels, useLanguage } from '../content/ContentProvider.tsx';
import { TechBadge } from '../components/common/TechBadge.tsx';
import {
  Briefcase,
  Calendar,
  MapPin,
  Building2,
  CheckCircle2,
  Trophy,
  Terminal,
  ArrowRight
} from 'lucide-react';

export const ExperiencePage: React.FC = () => {
  const experiences = useExperiences();
  const labels = useUILabels();
  const { language } = useLanguage();

  return (
    <div className="w-full bg-white py-12 sm:py-16" id="experience-page-container">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-[#0877E8] text-xs font-bold font-heading uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            <span>{language === 'pt' ? 'Trajetória Prática' : 'Career Timeline'}</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#061B3A] tracking-tight">
            {language === 'pt' ? 'Experiência Profissional' : 'Professional Experience'}
          </h1>
          <p className="text-sm text-[#64748B] max-w-2xl leading-relaxed">
            {language === 'pt'
              ? 'Histórico de atuação na sustentação tecnológica, suporte corporativo, administração de redes e automação de processos.'
              : 'History of hands-on technical operations, enterprise support, network administration, and system automation.'}
          </p>
        </div>

        {/* Experience Cards */}
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={exp.id || index}
              id={`exp-card-${exp.id}`}
              className="bg-[#F3F6FA] rounded-2xl p-7 sm:p-9 border border-slate-200/90 shadow-xs space-y-6 transition-all hover:shadow-md hover:border-[#0877E8]/40"
            >
              {/* Top Row: Role, Company, Period */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-200/80">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="font-heading font-extrabold text-xl text-[#061B3A] tracking-tight">
                      {exp.role}
                    </h2>
                    {exp.current && (
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        {labels.common.currentPosition}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] font-medium">
                    <span className="flex items-center gap-1.5 text-[#061B3A] font-bold">
                      <Building2 className="w-4 h-4 text-[#0877E8]" />
                      {exp.company}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {exp.location}
                    </span>
                    {exp.type && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span>{exp.type}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Period Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-white border border-slate-200 text-xs font-mono font-bold text-[#0877E8] shrink-0 shadow-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{exp.period}</span>
                </div>
              </div>

              {/* Role Summary */}
              {exp.summary && (
                <p className="text-sm text-[#253247] leading-relaxed font-normal">
                  {exp.summary}
                </p>
              )}

              {/* Responsibilities */}
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#061B3A] flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-[#0877E8]" />
                    <span>{labels.common.responsibilities}</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {exp.responsibilities.map((resp, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-start gap-2.5 text-xs text-[#253247] leading-relaxed shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#0877E8] shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="pt-2 border-t border-slate-200/80 space-y-2">
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#64748B] block">
                    {labels.common.technologiesUsed}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.technologies.map((tech) => (
                      <TechBadge key={tech} variant="default" size="xs">
                        {tech}
                      </TechBadge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
