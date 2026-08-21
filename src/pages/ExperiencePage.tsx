import React from 'react';
import { useExperiences, useUILabels } from '../content/ContentProvider.tsx';
import { TechBadge } from '../components/common/TechBadge.tsx';
import {
  Briefcase,
  Calendar,
  MapPin,
  Building2,
  CheckCircle2,
  Trophy,
  Terminal
} from 'lucide-react';

export const ExperiencePage: React.FC = () => {
  const experiences = useExperiences();
  const labels = useUILabels();

  return (
    <div className="space-y-8" id="experience-page-container">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Briefcase className="w-4 h-4" />
          <span>Trajetória Prática</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Experiência Profissional <span className="text-blue-500">.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
          Histórico de atuação, rotina operacional, tecnologias aplicadas e resultados em ambientes corporativos e acadêmicos.
        </p>
      </div>

      {/* Experience List */}
      <div className="space-y-6">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            id={`exp-card-${exp.id}`}
            className="bg-[#111113] border border-slate-800/90 rounded-xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800/70">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-white tracking-tight">{exp.role}</h2>
                  {exp.current && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {labels.common.currentPosition}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    {exp.company}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {exp.location}
                  </span>
                  <span>•</span>
                  <span className="text-slate-500 font-mono">{exp.type}</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16161B] border border-slate-800 text-xs font-mono text-blue-400 shrink-0">
                <Calendar className="w-3.5 h-3.5" />
                <span>{exp.period}</span>
              </div>
            </div>

            {/* Role Summary */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {exp.summary}
            </p>

            {/* Responsibilities */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>{labels.common.responsibilities}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {exp.responsibilities.map((resp, idx) => (
                  <div
                    key={idx}
                    className="bg-[#151519] border border-slate-800/60 p-3 rounded-lg flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Achievements */}
            {exp.keyAchievements && exp.keyAchievements.length > 0 && (
              <div className="bg-blue-600/[0.04] border border-blue-500/20 rounded-lg p-4 space-y-2">
                <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5 text-blue-400" />
                  <span>Destaques & Entregas Operacionais</span>
                </h4>
                <ul className="space-y-1.5">
                  {exp.keyAchievements.map((item, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technologies Used in this role */}
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
                {labels.common.technologiesUsed}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {exp.technologies.map((tech) => (
                  <TechBadge key={tech} variant="default" size="sm">
                    {tech}
                  </TechBadge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
