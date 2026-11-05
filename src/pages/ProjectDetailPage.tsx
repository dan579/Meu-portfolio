import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useProjectBySlug, useUILabels, useLanguage } from '../content/ContentProvider.tsx';
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
  Terminal,
  ShieldCheck
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = useProjectBySlug(slug);
  const labels = useUILabels();
  const { language } = useLanguage();

  if (!project) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="font-heading font-bold text-2xl text-[#061B3A]">
          {language === 'pt' ? 'Projeto não encontrado' : 'Project not found'}
        </h2>
        <p className="text-sm text-[#64748B]">
          {language === 'pt' ? 'O case study solicitado não existe no momento.' : 'The requested case study does not exist.'}
        </p>
        <Link
          to="/projetos"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#0877E8] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{labels.common.backToProjects}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F3F6FA] py-12 sm:py-16" id={`case-study-${project.slug}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Back Link & Header */}
        <div className="space-y-4">
          <Link
            to="/projetos"
            id="back-to-projects-btn"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0877E8] hover:text-[#061B3A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{labels.common.backToProjects}</span>
          </Link>

          {/* Project Title Block */}
          <div className="bg-white rounded-2xl p-7 sm:p-9 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono font-bold text-[#0877E8] bg-[#0877E8]/10 px-2.5 py-1 rounded">
                {project.category}
              </span>
              <span className="text-slate-300">•</span>
              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                  project.status === 'completed'
                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                    : 'text-[#0877E8] bg-[#0877E8]/10 border border-[#0877E8]/20'
                }`}
              >
                {project.statusLabel}
              </span>
              {project.badge && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-[#061B3A] border border-slate-200">
                  {project.badge}
                </span>
              )}
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#061B3A] tracking-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-[#253247] leading-relaxed font-normal">
              {project.subtitle}
            </p>

            {/* Quick Links & Technologies */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1.5">
                {(project.technologies || []).map((tech: any) => {
                  const name = typeof tech === 'string' ? tech : tech.name;
                  return (
                    <TechBadge key={name} variant="default" size="xs">
                      {name}
                    </TechBadge>
                  );
                })}
              </div>

              {/* Action Link Buttons */}
              {project.links && project.links.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {project.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-xs font-bold transition-colors shadow-xs ${
                        link.type === 'github'
                          ? 'bg-slate-100 hover:bg-slate-200 text-[#061B3A] border border-slate-200'
                          : 'bg-[#0877E8] text-white hover:bg-[#0766c6]'
                      }`}
                    >
                      {link.type === 'github' ? <Github className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Problema & Solução (2 Cards) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* O Problema */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-heading font-bold text-xs uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{labels.common.problem}</span>
            </div>
            <p className="text-sm text-[#253247] leading-relaxed font-normal">
              {project.problem}
            </p>
          </div>

          {/* A Solução */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#0877E8] font-heading font-bold text-xs uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-[#0877E8]" />
              <span>{labels.common.solution}</span>
            </div>
            <p className="text-sm text-[#253247] leading-relaxed font-normal">
              {project.solution}
            </p>
          </div>
        </section>

        {/* Arquitetura & Engenharia */}
        {project.architecture && (
          <section className="bg-white rounded-2xl p-7 sm:p-9 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-[#0877E8]/10 flex items-center justify-center text-[#0877E8]">
                <Network className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-bold text-lg text-[#061B3A]">
                {labels.common.architecture}
              </h2>
            </div>

            {project.architecture.overview && (
              <p className="text-sm text-[#253247] leading-relaxed font-normal">
                {project.architecture.overview}
              </p>
            )}

            {/* Highlights */}
            {project.architecture.highlights && project.architecture.highlights.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#64748B]">
                  {language === 'pt' ? 'Destaques Arquiteturais:' : 'Architecture Highlights:'}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.architecture.highlights.map((h: string, i: number) => (
                    <div
                      key={i}
                      className="bg-[#F3F6FA] p-3.5 rounded-xl border border-slate-200/80 flex items-start gap-2.5 text-xs text-[#253247] leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#0877E8] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Funcionalidades Principais */}
        {project.features && project.features.length > 0 && (
          <section className="bg-white rounded-2xl p-7 sm:p-9 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-[#0877E8]/10 flex items-center justify-center text-[#0877E8]">
                <Cpu className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-bold text-lg text-[#061B3A]">
                {labels.common.keyFeatures}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.features.map((feat: string, i: number) => (
                <div
                  key={i}
                  className="bg-[#F3F6FA] p-3.5 rounded-xl border border-slate-200/80 flex items-start gap-2 text-xs text-[#253247]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#0877E8] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Papel e Participação de Daniel */}
        {project.danielRole && (
          <section className="bg-white rounded-2xl p-7 sm:p-9 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-[#0877E8]/10 flex items-center justify-center text-[#0877E8]">
                <UserCheck className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-bold text-lg text-[#061B3A]">
                {labels.common.danielParticipation}
              </h2>
            </div>
            <div className="space-y-3">
              <span className="font-heading font-bold text-sm text-[#0877E8] block">
                {project.danielRole.title}
              </span>
              {project.danielRole.contributions && (
                <ul className="space-y-2">
                  {project.danielRole.contributions.map((c: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#253247]">
                      <CheckCircle2 className="w-4 h-4 text-[#0877E8] shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* Galeria de Mockups / Screenshots */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0877E8]/10 flex items-center justify-center text-[#0877E8]">
                <Image className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-bold text-xl text-[#061B3A]">
                {labels.common.galleryMockups}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.gallery.map((item: any, i: number) => (
                <MockupVisualizer key={i} item={item} projectSlug={project.slug} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
