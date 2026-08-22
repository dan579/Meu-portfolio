import React from 'react';
import { useProfile, useUILabels } from '../../content/ContentProvider.tsx';
import { Server, Terminal, Info, CheckCircle2 } from 'lucide-react';

interface WorkCompositionCardProps {
  compact?: boolean;
}

export const WorkCompositionCard: React.FC<WorkCompositionCardProps> = ({ compact = false }) => {
  const profile = useProfile();
  const labels = useUILabels();
  const { infraLabel, systemsLabel, description, note, infraFocusAreas, systemsFocusAreas } = profile.workFocus;

  return (
    <div
      id="work-composition-widget"
      className="bg-[#111113] border border-slate-800/80 rounded-xl p-6 relative overflow-hidden transition-all duration-300 hover:border-slate-700/80 shadow-lg shadow-black/20 flex flex-col justify-between"
    >
      <div>
        {/* Widget Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span>{labels.common.workCompositionTitle}</span>
          </h3>
          <span className="text-[10px] text-blue-400/90 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded font-mono font-semibold">
            Sinergia Técnica
          </span>
        </div>

        {/* Dual Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
          {/* Pillar 1: Infra */}
          <div className="bg-[#16161B] border border-slate-800 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Server className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-white tracking-tight">{infraLabel}</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Sustentação de servidores Windows/Linux, virtualização Proxmox, roteamento pfSense e monitoramento com Zabbix.
            </p>
          </div>

          {/* Pillar 2: Systems */}
          <div className="bg-[#16161B] border border-slate-800 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-white tracking-tight">{systemsLabel}</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Engenharia de software com React, TypeScript, modelagem de banco de dados relacional SQL e automação.
            </p>
          </div>
        </div>

        {/* Qualitative Synthesis Description */}
        <div className="bg-[#141418]/60 border border-slate-800/60 rounded-lg p-3.5 mb-3 text-xs text-slate-300 leading-relaxed">
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
