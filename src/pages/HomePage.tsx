import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  useProfile,
  useProjects,
  useUILabels,
  useContent
} from '../content/ContentProvider.tsx';
import { downloadResumePdf, downloadPortfolioPdf } from '../pdf/pdfGenerator.ts';
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
  Download,
  BookOpen,
  ChevronDown
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const content = useContent();
  const profile = useProfile();
  const projects = useProjects();
  const labels = useUILabels();
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<'resume' | 'portfolio' | null>(null);
  const [downloadedFormat, setDownloadedFormat] = useState<'resume' | 'portfolio' | null>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        downloadMenuRef.current &&
        !downloadMenuRef.current.contains(event.target as Node)
      ) {
        setIsDownloadMenuOpen(false);
      }
    };

    if (isDownloadMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDownloadMenuOpen]);

  const handleDownloadResume = async () => {
    setIsDownloadMenuOpen(false);
    try {
      setDownloadingFormat('resume');
      await downloadResumePdf(content);
      setDownloadedFormat('resume');
      setTimeout(() => setDownloadedFormat(null), 3000);
    } catch (err) {
      console.error('Erro ao baixar Currículo:', err);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleDownloadPortfolio = async () => {
    setIsDownloadMenuOpen(false);
    try {
      setDownloadingFormat('portfolio');
      await downloadPortfolioPdf(content);
      setDownloadedFormat('portfolio');
      setTimeout(() => setDownloadedFormat(null), 3000);
    } catch (err) {
      console.error('Erro ao baixar Portfólio:', err);
    } finally {
      setDownloadingFormat(null);
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

            {/* Download CV Dropdown */}
            <div className="relative" ref={downloadMenuRef}>
              <button
                onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
                disabled={downloadingFormat !== null}
                id="hero-download-cv-btn"
                aria-expanded={isDownloadMenuOpen}
                aria-haspopup="true"
                className="w-full inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-[#16161c] hover:bg-[#1f1f27] border border-slate-800/90 hover:border-blue-500/40 text-slate-200 hover:text-white text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 hover:-translate-y-0.5 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  {downloadingFormat !== null ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                  ) : downloadedFormat ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                  )}
                  <span>
                    {downloadingFormat !== null
                      ? 'Gerando PDF...'
                      : downloadedFormat === 'resume'
                      ? 'Currículo Baixado'
                      : downloadedFormat === 'portfolio'
                      ? 'Portfólio Baixado'
                      : 'Baixar CV (PDF)'}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    isDownloadMenuOpen ? 'rotate-180 text-blue-400' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDownloadMenuOpen && (
                <div
                  id="hero-download-menu"
                  className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-72 sm:w-80 bg-[#16161c] border border-slate-800 rounded-xl shadow-2xl shadow-black/80 p-2 z-50 space-y-1.5 backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  {/* Option 1: Currículo Tradicional */}
                  <button
                    type="button"
                    onClick={handleDownloadResume}
                    id="hero-dropdown-resume-btn"
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#1f1f28] border border-transparent hover:border-blue-500/30 transition-all duration-150 text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                          Currículo Tradicional (PDF)
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Formato ATS · Enxuto
                        </div>
                      </div>
                    </div>
                    <Download className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-y-0.5 transition-all shrink-0 ml-2" />
                  </button>

                  {/* Option 2: Portfólio Completo */}
                  <button
                    type="button"
                    onClick={handleDownloadPortfolio}
                    id="hero-dropdown-portfolio-btn"
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#1f1f28] border border-transparent hover:border-emerald-500/30 transition-all duration-150 text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                          Portfólio Completo (PDF)
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Com projetos, arquitetura e QR Code
                        </div>
                      </div>
                    </div>
                    <Download className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-y-0.5 transition-all shrink-0 ml-2" />
                  </button>
                </div>
              )}
            </div>

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

      {/* Primary Stack Overview Card */}
      <section>
        <div className="bg-[#111115]/90 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300 shadow-lg shadow-black/20">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {labels.common.primaryStack}
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Infra + Software</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div>
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
