import React, { useState } from 'react';
import { useInfrastructure, useUILabels } from '../content/ContentProvider.tsx';
import { TechBadge } from '../components/common/TechBadge.tsx';
import {
  Server,
  Network,
  Activity,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Terminal,
  HelpCircle
} from 'lucide-react';

export const InfrastructurePage: React.FC = () => {
  const areas = useInfrastructure();
  const labels = useUILabels();
  const [activeAreaFilter, setActiveAreaFilter] = useState<string>('all');

  const getAreaIcon = (iconName: string) => {
    switch (iconName) {
      case 'Server':
        return Server;
      case 'Network':
        return Network;
      case 'Activity':
        return Activity;
      case 'ShieldCheck':
        return ShieldCheck;
      default:
        return Cpu;
    }
  };

  const filteredAreas = activeAreaFilter === 'all'
    ? areas
    : areas.filter(a => a.id === activeAreaFilter);

  return (
    <div className="space-y-8" id="infrastructure-page-container">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Server className="w-4 h-4" />
          <span>Infraestrutura & Operações</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Ecossistema de Infraestrutura <span className="text-blue-500">.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
          Catálogo estruturado por áreas operacionais. Cada tecnologia é acompanhada de sua finalidade técnica e do contexto real em que foi aplicada no campus.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-800/80">
        <button
          onClick={() => setActiveAreaFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            activeAreaFilter === 'all'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          Todas as Áreas ({areas.reduce((acc, a) => acc + a.items.length, 0)} tecnologias)
        </button>
        {areas.map((area) => (
          <button
            key={area.id}
            onClick={() => setActiveAreaFilter(area.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeAreaFilter === area.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            {area.areaName} ({area.items.length})
          </button>
        ))}
      </div>

      {/* Areas & Items Display */}
      <div className="space-y-8">
        {filteredAreas.map((area) => {
          const AreaIcon = getAreaIcon(area.iconName);
          return (
            <section
              key={area.id}
              id={`infra-section-${area.id}`}
              className="bg-[#111113] border border-slate-800/80 rounded-xl p-6 sm:p-8 space-y-6"
            >
              {/* Area Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <AreaIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      {area.areaName}
                    </h2>
                    <p className="text-xs text-slate-400">{area.description}</p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-slate-500 bg-[#16161B] px-3 py-1 rounded-md border border-slate-800 self-start sm:self-auto">
                  {area.items.length} tecnologias catalogadas
                </span>
              </div>

              {/* Technologies in this Area */}
              <div className="grid grid-cols-1 gap-4">
                {area.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#151519] border border-slate-800/70 hover:border-slate-700/80 rounded-lg p-4 sm:p-5 space-y-3 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        <h3 className="text-sm font-bold text-white tracking-tight">
                          {item.technology}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <TechBadge key={tag} variant="subtle" size="xs">
                            {tag}
                          </TechBadge>
                        ))}
                      </div>
                    </div>

                    {/* Purpose: O que ela é usada para fazer */}
                    <div className="bg-[#101013] border border-slate-800/60 p-3 rounded-md">
                      <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                        <span>Finalidade Técnica (O que faz)</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {item.purpose}
                      </p>
                    </div>

                    {/* Applied Context: Contexto real de uso */}
                    <div className="pl-3 border-l-2 border-slate-700/80 space-y-1">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Terminal className="w-3 h-3 text-slate-500" />
                        <span>Contexto Real de Aplicação</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {item.appliedContext}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
