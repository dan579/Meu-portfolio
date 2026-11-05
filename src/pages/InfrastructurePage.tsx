import React, { useState } from 'react';
import { useInfrastructure, useUILabels, useLanguage } from '../content/ContentProvider.tsx';
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
  const { language } = useLanguage();
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
    <div className="w-full bg-[#061B3A] text-white py-14 sm:py-20 relative overflow-hidden" id="infrastructure-page-container">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/3 w-[600px] h-[400px] bg-[#00D4E8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-[#00D4E8] text-xs font-mono font-bold uppercase tracking-wider">
            <Server className="w-4 h-4" />
            <span>{language === 'pt' ? 'Infraestrutura & Competências' : 'Infrastructure & Skills'}</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            {language === 'pt' ? 'Ecossistema Técnico & Operações' : 'Technical Ecosystem & Operations'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed font-normal">
            {language === 'pt'
              ? 'Catálogo estruturado por áreas operacionais. Cada tecnologia é acompanhada de sua finalidade técnica e do contexto real em que foi aplicada no campus.'
              : 'Structured by operational domain. Each technology includes its engineering purpose and real-world deployment context.'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-white/10">
          <button
            type="button"
            onClick={() => setActiveAreaFilter('all')}
            className={`px-4 py-2 rounded-[10px] text-xs font-mono font-bold tracking-wide transition-all cursor-pointer ${
              activeAreaFilter === 'all'
                ? 'bg-[#0877E8] text-white shadow-xs'
                : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            {language === 'pt' ? 'Todas as Áreas' : 'All Domains'} ({areas.reduce((acc, a) => acc + a.items.length, 0)})
          </button>
          {areas.map((area) => (
            <button
              key={area.id}
              type="button"
              onClick={() => setActiveAreaFilter(area.id)}
              className={`px-4 py-2 rounded-[10px] text-xs font-mono font-bold tracking-wide transition-all cursor-pointer ${
                activeAreaFilter === area.id
                  ? 'bg-[#0877E8] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
              }`}
            >
              {area.areaName} ({area.items.length})
            </button>
          ))}
        </div>

        {/* Areas Display */}
        <div className="space-y-8">
          {filteredAreas.map((area) => {
            const AreaIcon = getAreaIcon(area.iconName);
            return (
              <section
                key={area.id}
                id={`infra-section-${area.id}`}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-7 sm:p-9 border border-white/10 space-y-6 shadow-xl"
              >
                {/* Area Header */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-[#00D4E8]/20 flex items-center justify-center text-[#00D4E8] shrink-0">
                    <AreaIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-white tracking-tight">
                      {area.areaName}
                    </h2>
                    <span className="text-xs text-slate-300">
                      {area.items.length} {language === 'pt' ? 'tecnologias catalogadas' : 'technologies cataloged'}
                    </span>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {area.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/5 p-4.5 rounded-xl border border-white/10 hover:border-[#00D4E8]/40 transition-colors space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-heading font-bold text-sm text-[#00D4E8]">
                          {item.technology}
                        </span>
                        <TechBadge variant="dark" size="xs">
                          {area.areaName}
                        </TechBadge>
                      </div>

                      <div className="space-y-1 text-xs">
                        {item.purpose && (
                          <p className="text-slate-200 leading-relaxed font-normal">
                            <span className="font-semibold text-white">
                              {language === 'pt' ? 'Finalidade: ' : 'Purpose: '}
                            </span>
                            {item.purpose}
                          </p>
                        )}
                        {item.appliedContext && (
                          <p className="text-slate-400 leading-relaxed font-normal">
                            <span className="font-semibold text-slate-300">
                              {language === 'pt' ? 'Contexto de Aplicação: ' : 'Applied Context: '}
                            </span>
                            {item.appliedContext}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
