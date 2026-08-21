import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useProjectBySlug, useUILabels } from '../content/ContentProvider.tsx';
import { TechBadge } from '../components/common/TechBadge.tsx';
import { MockupVisualizer } from '../components/common/MockupVisualizer.tsx';
import {
  Layers,
  ArrowLeft,
  AlertCircle,
  Lightbulb,
  Network,
  CheckCircle2,
  Cpu,
  UserCheck,
  Image,
  ExternalLink,
  Github,
  Clock,
  ShieldCheck,
  Terminal
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = useProjectBySlug(slug);
  const labels = useUILabels();

  if (!project) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Projeto não encontrado</h2>
        <p className="text-xs text-slate-400">O case study solicitado não existe no momento.</p>
        <Link
          to="/projetos"
          className="inline-flex items-center gap-2 text-xs text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para lista de projetos</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10" id={`case-study-${project.slug}`}>
      {/* Back Navigation Bar */}
      <div>
        <Link
          to="/projetos"
          id="back-to-projects-btn"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{labels.common.backToProjects}</span>
        </Link>

        {/* Case Header */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
              {project.category}
            </span>
            <span className="text-slate-600">•</span>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                project.status === 'completed'
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                  : 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
              }`}
            >
              {project.statusLabel}
            </span>
            {project.badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600/20 text-blue-300 border border-blue-500/30">
                {project.badge}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {project.title} <span className="text-blue-500">.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-3xl leading-relaxed">
            {project.subtitle}
          </p>
        </div>
      </div>

      {/* Camada 1: O Problema */}
      <section
        id="case-section-problem"
        className="bg-[#111113] border border-slate-800/90 rounded-xl p-6 sm:p-8 space-y-3"
      >
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-widest">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{labels.common.problem}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {project.problem}
        </p>
      </section>

      {/* Camada 2: A Solução */}
      <section
        id="case-section-solution"
        className="bg-[#111113] border border-slate-800/90 rounded-xl p-6 sm:p-8 space-y-3"
      >
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <Lightbulb className="w-4 h-4 text-emerald-400" />
          <span>{labels.common.solution}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {project.solution}
        </p>
      </section>

      {/* Camada 3: Arquitetura & Engenharia */}
      <section
        id="case-section-architecture"
        className="bg-[#111113] border border-slate-800/90 rounded-xl p-6 sm:p-8 space-y-4"
      >
        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest">
          <Network className="w-4 h-4 text-blue-400" />
          <span>{labels.common.architecture}</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {project.architecture.overview}
        </p>

        {project.architecture.diagramDescription && (
          <div className="bg-[#151519] border border-slate-800 p-3 rounded-lg font-mono text-[11px] text-blue-300 flex items-center gap-2">
            <span className="text-slate-500 font-bold">Fluxo:</span>
            <span>{project.architecture.diagramDescription}</span>
          </div>
        )}

        <div className="space-y-2 pt-2">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
            Destaques de Engenharia & Segurança
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {project.architecture.highlights.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#141418] border border-slate-800/70 p-3 rounded-lg flex items-start gap-2.5 text-xs text-slate-300"
              >
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Camada 4: Funcionalidades Principais */}
      <section
        id="case-section-features"
        className="bg-[#111113] border border-slate-800/90 rounded-xl p-6 sm:p-8 space-y-4"
      >
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>{labels.common.keyFeatures}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {project.features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-[#151519] border border-slate-800/60 p-3.5 rounded-lg flex items-start gap-3 text-xs text-slate-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Camada 5: Tecnologias & Papel da Ferramenta */}
      <section
        id="case-section-technologies"
        className="bg-[#111113] border border-slate-800/90 rounded-xl p-6 sm:p-8 space-y-4"
      >
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <Cpu className="w-4 h-4 text-blue-400" />
          <span>{labels.common.technologiesUsed}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {project.technologies.map((t) => (
            <div
              key={t.name}
              className="bg-[#151519] border border-slate-800/70 p-3 rounded-lg space-y-1"
            >
              <span className="text-xs font-bold text-white block">{t.name}</span>
              <span className="text-[11px] text-slate-400 leading-tight block">{t.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Camada 6: Participação & Papel de Daniel */}
      <section
        id="case-section-daniel-role"
        className="bg-gradient-to-br from-[#111113] to-[#15151C] border border-blue-500/20 rounded-xl p-6 sm:p-8 space-y-4 shadow-lg shadow-blue-500/5"
      >
        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest">
          <UserCheck className="w-4 h-4 text-blue-400" />
          <span>{labels.common.danielParticipation}</span>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">{project.danielRole.title}</h3>
        </div>

        <div className="space-y-2">
          {project.danielRole.contributions.map((c, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
              <span className="text-blue-400 font-bold mt-0.5">▸</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Camada 7: Galeria de Imagens / Mockups */}
      <section
        id="case-section-gallery"
        className="space-y-4"
      >
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <Image className="w-4 h-4 text-blue-400" />
          <span>{labels.common.galleryMockups}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.gallery.map((item, idx) => (
            <MockupVisualizer key={idx} item={item} projectSlug={project.slug} />
          ))}
        </div>
      </section>

      {/* Camada 8: Links & Recursos */}
      {project.links && project.links.length > 0 && (
        <section
          id="case-section-links"
          className="bg-[#111113] border border-slate-800/90 rounded-xl p-6 space-y-3"
        >
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <ExternalLink className="w-4 h-4 text-blue-400" />
            <span>{labels.common.linksResources}</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {project.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#16161B] hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-blue-400 hover:text-white transition-all"
              >
                <Github className="w-4 h-4" />
                <span>{link.label}</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
