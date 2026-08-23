import React from 'react';
import {
  useProfile,
  useSkillCategories,
  useUILabels
} from '../content/ContentProvider.tsx';
import { WorkCompositionCard } from '../components/common/WorkCompositionCard.tsx';
import { TechBadge } from '../components/common/TechBadge.tsx';
import {
  User,
  GraduationCap,
  Award,
  Compass,
  CheckCircle,
  FileCheck2,
  Terminal
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const profile = useProfile();
  const skillCategories = useSkillCategories();
  const labels = useUILabels();

  return (
    <div className="space-y-10" id="about-page-container">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <User className="w-4 h-4" />
          <span>Perfil & Carreira</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Sobre {profile.name} <span className="text-blue-500">.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
          Histórico profissional, mentalidade de engenharia, formação acadêmica e escopo de atuação técnica.
        </p>
      </div>

      {/* Trajetória Completa (Bio) */}
      <section className="bg-[#111113] border border-slate-800/80 rounded-xl p-6 sm:p-8 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-400" />
          <span>Trajetória & Posicionamento Profissional</span>
        </h3>

        <div className="space-y-3.5 text-sm text-slate-300 leading-relaxed">
          {profile.fullBio.map((paragraph, index) => (
            <p key={index} className="text-slate-300">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Composição de Atuação em Destaque */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {labels.common.workCompositionTitle}
        </h3>
        <WorkCompositionCard compact={false} />
      </section>

      {/* Formação & Certificações */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Educação */}
        <div className="bg-[#111113] border border-slate-800/80 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>Formação Acadêmica</span>
          </div>

          <div className="space-y-4">
            {profile.education.map((edu) => (
              <div key={edu.id} className="border-l-2 border-blue-500/50 pl-4 space-y-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{edu.institution}</h4>
                  <p className="text-xs text-blue-400 font-medium">
                    {edu.degree} • {edu.field}
                  </p>
                  <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                    {edu.period} ({edu.status})
                  </span>
                </div>

                {edu.description && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {edu.description}
                  </p>
                )}

                {edu.highlights && (
                  <ul className="space-y-1 pt-1">
                    {edu.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400/70 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Certificações & Cursos Técnicos */}
        <div className="bg-[#111113] border border-slate-800/80 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Award className="w-4 h-4 text-blue-400" />
            <span>Certificações & Especializações</span>
          </div>

          <div className="space-y-3">
            {profile.certifications?.map((cert) => (
              <div
                key={cert.id}
                className="bg-[#151519] border border-slate-800/70 rounded-lg p-3.5 flex items-start justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{cert.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{cert.issuer}</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-blue-400/90 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 shrink-0">
                  {cert.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competências com Contexto Real de Uso (Regra Estrita: Sem barras falsas de %) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Competências Aplicadas (Contexto Real)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Organizadas por aplicação prática, sem falsas métricas de porcentagem
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skillCategories.map((category) => (
            <div
              key={category.id}
              className="bg-[#111113] border border-slate-800/80 rounded-xl p-5 space-y-3 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                  {category.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug mb-3">
                  {category.description}
                </p>

                <div className="space-y-2.5">
                  {category.skills.map((skill, index) => (
                    <div key={index} className="bg-[#151519] border border-slate-800/60 p-2.5 rounded-lg">
                      <div className="text-xs font-semibold text-blue-300 mb-1">
                        {skill.name}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {skill.appliedContext}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
