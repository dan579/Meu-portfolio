import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects, useUILabels } from '../content/ContentProvider.tsx';
import { TechBadge } from '../components/common/TechBadge.tsx';
import {
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const projects = useProjects();
  const labels = useUILabels();
  const [filter, setFilter] = useState<'all' | 'in-development' | 'completed'>('all');

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.status === filter);

  return (
    <div className="space-y-8" id="projects-page-container">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4" />
          <span>Portfólio & Engenharia</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Projetos & Case Studies <span className="text-blue-500">.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
          Aplicações reais desenhadas com foco em isolamento de dados, lógica de negócio avançada, arquiteturas desacopladas e soluções para ambientes corporativos.
        </p>
      </div>

      {/* Filter status */}
      <div className="flex gap-2 pb-2 border-b border-slate-800/80">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          Todos ({projects.length})
        </button>
        <button
          onClick={() => setFilter('in-development')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            filter === 'in-development'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          Em Desenvolvimento
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            filter === 'completed'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          Concluídos
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.slug}
            id={`project-card-${project.slug}`}
            className="group bg-[#111113] border border-slate-800/90 hover:border-blue-500/40 rounded-xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5"
          >
            <div>
              {/* Visual Preview Banner */}
              <div className="w-full bg-[#16161B] border border-slate-800 rounded-lg mb-4 flex flex-col justify-between overflow-hidden group-hover:border-slate-700 transition-colors relative">
                <div className="absolute inset-0 bg-blue-600/[0.03] group-hover:bg-blue-600/[0.08] transition-colors pointer-events-none" />

                {/* Top header bar with Chrome Dots and Badge */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/70 bg-[#121216] relative z-10">
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/70" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
                  </div>
                  {project.badge && (
                    <span className="text-[9px] font-mono font-medium text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded truncate max-w-[200px]">
                      {project.badge}
                    </span>
                  )}
                </div>

                {/* Title & Category Center Body */}
                <div className="px-4 py-4 flex flex-col items-center justify-center text-center relative z-10">
                  <span className="text-slate-300 group-hover:text-blue-300 font-mono font-extrabold text-sm tracking-wider uppercase transition-colors line-clamp-2">
                    {project.title}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono mt-1 max-w-[90%] truncate">
                    {project.category}
                  </span>

                  {/* Simulated Mini Status */}
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400 bg-[#0E0E11] px-2.5 py-1 rounded border border-slate-800 font-mono">
                    {project.status === 'completed' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">{project.statusLabel}</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-blue-400" />
                        <span className="text-blue-400">{project.statusLabel}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Title & Category */}
              <div className="space-y-1 mb-2">
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-blue-400 font-medium">{project.subtitle}</p>
              </div>

              {/* 1-line short summary */}
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                {project.shortSummary}
              </p>

              {/* Tech Stack Chips */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.technologies.slice(0, 3).map((tech) => (
                  <TechBadge key={tech.name} variant="subtle" size="xs">
                    {tech.name}
                  </TechBadge>
                ))}
                {project.technologies.length > 3 && (
                  <span className="text-[10px] text-slate-500 font-mono self-center">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Link to Case Study */}
            <Link
              to={`/projetos/${project.slug}`}
              id={`open-case-btn-${project.slug}`}
              className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-[#16161B] hover:bg-blue-600 hover:text-white border border-slate-800 hover:border-blue-500 text-xs font-semibold text-slate-300 transition-all duration-200 group-hover:border-slate-700"
            >
              <span>{labels.common.viewCaseStudy}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
