import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects, useUILabels, useLanguage } from '../content/ContentProvider.tsx';
import { TechBadge } from '../components/common/TechBadge.tsx';
import {
  Layers,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  Code
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const projects = useProjects();
  const labels = useUILabels();
  const { language } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'in-development' | 'completed'>('all');

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.status === filter);

  return (
    <div className="w-full bg-[#F3F6FA] py-12 sm:py-16" id="projects-page-container">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-[#0877E8] text-xs font-bold font-heading uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>{language === 'pt' ? 'Portfólio & Engenharia' : 'Portfolio & Systems'}</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#061B3A] tracking-tight">
            {language === 'pt' ? 'Projetos & Estudos de Caso' : 'Projects & Case Studies'}
          </h1>
          <p className="text-sm text-[#64748B] max-w-2xl leading-relaxed">
            {language === 'pt'
              ? 'Aplicações desenvolvidas com foco em resolução de problemas reais, regras de negócio robustas, integração de dados e arquitetura desacoplada.'
              : 'End-to-end applications built to solve operational problems with strong business logic and decoupled architectures.'}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 pb-3 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#0877E8] text-white shadow-xs'
                : 'bg-white text-[#253247] hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {language === 'pt' ? 'Todos os Cases' : 'All Cases'} ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('in-development')}
            className={`px-4 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
              filter === 'in-development'
                ? 'bg-[#0877E8] text-white shadow-xs'
                : 'bg-white text-[#253247] hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {labels.common.projectStatus.inDevelopment}
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-[#0877E8] text-white shadow-xs'
                : 'bg-white text-[#253247] hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {labels.common.projectStatus.completed}
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.slug}
              id={`project-card-${project.slug}`}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-[#0877E8] hover:shadow-lg transition-all duration-200"
            >
              <div className="space-y-4">
                {/* Visual Preview Header Block */}
                <div className="bg-[#F3F6FA] border border-slate-200/80 rounded-xl p-4 flex flex-col justify-center items-center text-center min-h-[96px] relative overflow-hidden group">
                  <span className="font-heading font-extrabold text-sm text-[#061B3A] tracking-tight line-clamp-1">
                    {project.title}
                  </span>
                  <span className="text-[11px] text-[#64748B] mt-0.5 line-clamp-1">
                    {project.category}
                  </span>
                  {project.badge && (
                    <span className="mt-2 text-[10px] font-mono font-bold text-[#0877E8] bg-white border border-[#0877E8]/20 px-2 py-0.5 rounded shadow-xs">
                      {project.badge}
                    </span>
                  )}
                </div>

                {/* Title and Status */}
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-heading font-bold text-lg text-[#061B3A] line-clamp-1">
                    {project.title}
                  </h3>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                      project.status === 'completed'
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                        : 'text-[#0877E8] bg-[#0877E8]/10 border border-[#0877E8]/20'
                    }`}
                  >
                    {project.statusLabel}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed line-clamp-3">
                  {project.shortSummary}
                </p>

                {/* Tech Badges */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.technologies.slice(0, 4).map((tech: any) => {
                      const name = typeof tech === 'string' ? tech : tech.name;
                      return (
                        <TechBadge key={name} variant="default" size="xs">
                          {name}
                        </TechBadge>
                      );
                    })}
                    {project.technologies.length > 4 && (
                      <span className="text-[10px] font-mono text-slate-400 self-center">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to={`/projetos/${project.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0877E8] hover:text-[#061B3A] transition-colors"
                >
                  <span>{language === 'pt' ? 'Ver Detalhes do Case' : 'View Case Details'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {project.links && project.links.length > 0 && (
                  <a
                    href={project.links[0].url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#0877E8] hover:bg-slate-100 transition-colors"
                    title={project.links[0].label || labels.common.openInNewTab}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
