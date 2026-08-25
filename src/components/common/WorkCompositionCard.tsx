import React from 'react';
import { useProfile, useUILabels } from '../../content/ContentProvider.tsx';
import { Server, Terminal, Info, CheckCircle2 } from 'lucide-react';

interface WorkCompositionCardProps {
  compact?: boolean;
}

export const WorkCompositionCard: React.FC<WorkCompositionCardProps> = ({ compact = false }) => {
  const profile = useProfile();
  const labels = useUILabels();
  const { infraLabel, systemsLabel, description, note } = profile.workFocus;

  return (
    <div
      id="work-composition-widget"
      className="bg-[#111115]/90 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/[0.03] flex flex-col justify-between"
    >
      <div>
        {/* Widget Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span>{labels.common.workCompositionTitle}</span>
          </h3>
          <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/25 px-2.5 py-0.5 rounded-md font-mono font-medium">
            Sinergia Técnica
          </span>
        </div>

        {/* Dual Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Pillar 1: Infra */}
          <div className="bg-[#16161c] border border-slate-800/80 hover:border-blue-500/30 rounded-xl p-4 space-y-2 transition-all duration-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Server className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white tracking-tight">{infraLabel}</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Sustentação de servidores Windows/Linux, virtualização Proxmox, roteamento pfSense e monitoramento com Zabbix.
            </p>
          </div>

          {/* Pillar 2: Systems */}
          <div className="bg-[#16161c] border border-slate-800/80 hover:border-emerald-500/30 rounded-xl p-4 space-y-2 transition-all duration-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Terminal className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white tracking-tight">{systemsLabel}</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Engenharia de software com React, TypeScript, modelagem de banco de dados relacional SQL e automação.
            </p>
          </div>
        </div>

        {/* Qualitative Synthesis Description */}
        <div className="bg-[#131317]/80 border border-slate-800/60 rounded-xl p-4 mb-3 text-xs text-slate-300 leading-relaxed">
          <p>{description}</p>
        </div>
      </div>

      {/* Context Note */}
      {!compact && note && (
        <div className="pt-3 border-t border-slate-800/60 flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
          <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-slate-400 italic">
            {note}
          </p>
        </div>
      )}
    </div>
  );
};
