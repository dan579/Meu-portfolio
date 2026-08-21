import React from 'react';
import { Link } from 'react-router-dom';
import {
  useProfile,
  useProjects,
  useUILabels
} from '../content/ContentProvider.tsx';
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
  Code
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const profile = useProfile();
  const projects = useProjects();
  const labels = useUILabels();

  return (
    <div className="space-y-10" id="home-page-container">
      {/* Hero / Identity Quick Header */}
      <section className="relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-2">
          <div className="flex flex-col sm:flex-row items-start gap-5 max-w-2xl">
            {profile.photoUrl && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-[2px] shadow-xl shadow-blue-500/15 shrink-0 overflow-hidden hidden sm:block">
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            )}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>{profile.currentRole} • Transição para Analista de Sistemas / Infra</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {profile.name} <span className="text-blue-500">.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
                {profile.shortSummary}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  {profile.location}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {profile.availability}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <Link
              to="/contato"
              id="hero-contact-btn"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wide transition-all shadow-lg shadow-blue-600/20"
            >
              <Mail className="w-4 h-4" />
              <span>{labels.common.getInTouch}</span>
            </Link>

            <div className="flex items-center gap-2">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                id="hero-linkedin-btn"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#141418] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn</span>
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                id="hero-github-btn"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#141418] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
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
        <div className="bg-[#111113] border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {labels.common.primaryStack}
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Infra + Software</span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Server className="w-3 h-3 text-blue-400" />
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

              <div className="pt-2 border-t border-slate-800/60">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Code className="w-3 h-3 text-blue-400" />
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
              className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 font-medium text-[11px]"
            >
              <span>Ver catálogo detalhado de infraestrutura</span>
              <ArrowRight className="w-3 h-3" />
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
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 transition-colors"
          >
            <span>{labels.common.viewAllProjects}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <Link
              key={proj.slug}
              to={`/projetos/${proj.slug}`}
              id={`featured-project-card-${proj.slug}`}
              className="group bg-[#111113] border border-slate-800/90 hover:border-blue-500/50 rounded-xl p-5 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div>
                {/* Project Cover Block */}
                <div className="w-full h-24 bg-[#16161B] border border-slate-800 rounded-lg mb-4 flex flex-col items-center justify-center p-3 text-center group-hover:border-slate-700 transition-colors relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-600/[0.03] group-hover:bg-blue-600/[0.08] transition-colors" />
                  <span className="text-slate-500 group-hover:text-blue-400 font-mono font-bold text-xs tracking-wider uppercase transition-colors relative z-10">
                    {proj.title}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono mt-0.5 relative z-10 truncate max-w-full">
                    {proj.category}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                    {proj.title}
                  </h4>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      proj.status === 'completed'
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                        : 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                    }`}
                  >
                    {proj.statusLabel}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                  {proj.shortSummary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Case Study</span>
                <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Experience & Full Trajectory */}
      <section className="bg-gradient-to-r from-[#111113] to-[#141418] border border-slate-800/80 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
            <Briefcase className="w-4 h-4" />
            <span>Trajetória Prática na UNIFENAS</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Experiência em suporte corporativo, gestão de ativos e automação
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Veja as responsabilidades diárias, resolução de incidentes N1/N2, administração de domínio Active Directory e atendimento a centenas de usuários.
          </p>
        </div>

        <Link
          to="/experiencia"
          id="home-cta-experience-btn"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700"
        >
          <span>Ver Linha do Tempo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
};
