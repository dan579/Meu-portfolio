import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useProfile,
  useProjects,
  useUILabels,
  useContent
} from '../content/ContentProvider.tsx';
import { downloadResumePdf } from '../pdf/pdfGenerator.ts';
import { WorkCompositionCard } from '../components/common/WorkCompositionCard.tsx';
import { TechBadge } from '../components/common/TechBadge.tsx';
import {
  ArrowRight,
  Mail,
  Linkedin,
  Github,
  MapPin,
  Briefcase,
  Layers,
  Sparkles,
  Server,
  Code,
  FileText,
  Loader2,
  Check,
  Download
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const content = useContent();
  const profile = useProfile();
  const projects = useProjects();
  const labels = useUILabels();
  const [downloadingCv, setDownloadingCv] = useState(false);
  const [cvDownloaded, setCvDownloaded] = useState(false);

  const handleDownloadCv = async () => {
    try {
      setDownloadingCv(true);
      await downloadResumePdf(content);
      setCvDownloaded(true);
      setTimeout(() => setCvDownloaded(false), 3000);
    } catch (err) {
      console.error('Erro ao baixar CV:', err);
    } finally {
      setDownloadingCv(false);
    }
  };

  return (
    <div className="space-y-10" id="home-page-container">
      {/* Hero / Identity Quick Header */}
      <section className="relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-2">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{profile.currentRole} • Transição para Analista de Sistemas / Infra</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {profile.name} <span className="text-blue-500">.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
              {profile.shortSummary}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {profile.location}
              </span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                {profile.availability}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <Link
              to="/contato"
              id="hero-contact-btn"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold tracking-wide transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/35 hover:-translate-y-0.5"
            >
              <Mail className="w-4 h-4" />
              <span>{labels.common.getInTouch}</span>
            </Link>

            <button
              onClick={handleDownloadCv}
              disabled={downloadingCv}
              id="hero-download-cv-btn"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#16161c] hover:bg-[#1f1f27] border border-slate-800/90 hover:border-blue-500/40 text-slate-200 hover:text-white text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 hover:-translate-y-0.5 shadow-sm"
            >
              {downloadingCv ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
              ) : cvDownloaded ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Download className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span>{cvDownloaded ? 'CV Baixado' : 'Baixar CV (PDF)'}</span>
            </button>

            <div className="flex items-center gap-2">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                id="hero-linkedin-btn"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#14141a] hover:bg-[#1c1c24] border border-slate-800/90 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn</span>
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                id="hero-github-btn"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#14141a] hover:bg-[#1c1c24] border border-slate-800/90 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Work Composition Card + Primary Stack */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkCompositionCard />

        {/* Primary Stack Overview Card */}
        <div className="bg-[#111115]/90 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300 shadow-lg shadow-black/20">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {labels.common.primaryStack}
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Infra + Software</span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] text-slate-400 font-mono font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-blue-400" />
                  Infraestrutura & Redes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Active Directory', 'Windows Server', 'Proxmox VE', 'pfSense', 'MikroTik', 'Zabbix', 'GLPI'].map((tech) => (
                    <TechBadge key={tech} variant="default" size="xs">
                      {tech}
                    </TechBadge>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/60">
                <span className="text-[11px] text-slate-400 font-mono font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-blue-400" />
                  Desenvolvimento & Bancos
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['React', 'TypeScript', 'PostgreSQL / SQL', 'Tailwind CSS', 'Git & GitHub', 'Flutter'].map((tech) => (
                    <TechBadge key={tech} variant="accent" size="xs">
                      {tech}
                    </TechBadge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
            <Link
              to="/infraestrutura"
              className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 font-mono text-[11px] hover:underline underline-offset-4"
            >
              <span>Ver catálogo detalhado de infraestrutura</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Highlight */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {labels.common.featuredProjects}
            </h3>
          </div>

          <Link
            to="/projetos"
            id="view-all-projects-link"
            className="text-xs text-blue-400 hover:text-blue-300 font-mono font-semibold inline-flex items-center gap-1 transition-colors hover:underline underline-offset-4"
          >
            <span>{labels.common.viewAllProjects}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <Link
              key={proj.slug}
              to={`/projetos/${proj.slug}`}
              id={`featured-project-card-${proj.slug}`}
              className="group bg-[#111115]/90 backdrop-blur-sm border border-slate-800/80 hover:border-blue-500/40 rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-500/[0.04] hover:-translate-y-0.5"
            >
              <div>
                {/* Project Cover Block */}
                <div className="w-full bg-[#16161c] border border-slate-800/80 rounded-xl mb-4 flex flex-col justify-between group-hover:border-slate-700 transition-colors relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-600/[0.02] group-hover:bg-blue-600/[0.06] transition-colors pointer-events-none" />
                  
                  {/* Top Header bar with window dots and badge */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/70 bg-[#121217] relative z-10">
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/70" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
                    </div>
                    {proj.badge && (
                      <span className="text-[9px] font-mono font-medium text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded truncate max-w-[180px]">
                        {proj.badge}
                      </span>
                    )}
                  </div>

                  {/* Mockup Title Center Body */}
                  <div className="px-3 py-3.5 flex flex-col items-center justify-center text-center relative z-10 min-h-[58px]">
                    <span className="text-slate-200 group-hover:text-blue-300 font-mono font-bold text-xs tracking-wider uppercase transition-colors line-clamp-2">
                      {proj.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-full">
                      {proj.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight">
                    {proj.title}
                  </h4>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      proj.status === 'completed'
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/25'
                        : 'text-blue-400 bg-blue-500/10 border border-blue-500/25'
                    }`}
                  >
                    {proj.statusLabel}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                  {proj.shortSummary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Case Study</span>
                <span className="text-blue-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Experience & Full Trajectory */}
      <section className="bg-gradient-to-r from-[#111115] via-[#14141c] to-[#111115] border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg shadow-black/20">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-400">
            <Briefcase className="w-4 h-4" />
            <span>Trajetória Prática na UNIFENAS</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Experiência em suporte corporativo, gestão de ativos e automação
          </h3>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Veja as responsabilidades diárias, resolução de incidentes N1/N2, administração de domínio Active Directory e atendimento a centenas de usuários.
          </p>
        </div>

        <Link
          to="/experiencia"
          id="home-cta-experience-btn"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a1a24] hover:bg-[#222230] text-white text-xs font-bold transition-all duration-200 border border-slate-700/80 hover:border-blue-500/40 hover:-translate-y-0.5 shadow-sm"
        >
          <span>Ver Linha do Tempo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
};
