import React from 'react';
import { useProfile, useUILabels } from '../../content/ContentProvider.tsx';
import { Server, Terminal, Info } from 'lucide-react';

interface WorkCompositionCardProps {
  compact?: boolean;
}

export const WorkCompositionCard: React.FC<WorkCompositionCardProps> = ({ compact = false }) => {
  const profile = useProfile();
  const labels = useUILabels();
  const { infraPercentage, systemsPercentage, infraLabel, systemsLabel, note } = profile.workFocus;

  return (
    <div
      id="work-composition-widget"
      className="bg-[#111113] border border-slate-800/80 rounded-xl p-6 relative overflow-hidden transition-all duration-300 hover:border-slate-700/80 shadow-lg shadow-black/20"
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span>{labels.common.workCompositionTitle}</span>
        </h3>
        <span className="text-[10px] text-blue-400/80 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded font-mono">
          Rotina Técnica
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white tracking-tight">{infraPercentage}%</span>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-none">{infraLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-300 shrink-0">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white tracking-tight">{systemsPercentage}%</span>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-none">{systemsLabel}</p>
          </div>
        </div>
      </div>

      {/* Segmented allocation bar */}
      <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden flex mb-2.5">
        <div
          style={{ width: `${infraPercentage}%` }}
          className="h-full bg-blue-500 transition-all duration-500 rounded-l-full"
          title={`${infraLabel}: ${infraPercentage}%`}
        />
        <div
          style={{ width: `${systemsPercentage}%` }}
          className="h-full bg-slate-500 transition-all duration-500 rounded-r-full"
          title={`${systemsLabel}: ${systemsPercentage}%`}
        />
      </div>

      <div className="flex justify-between text-[11px] text-slate-500 font-mono mb-3">
        <span>Redes, Servidores & Virtualização</span>
        <span>TypeScript, React & SQL</span>
      </div>

      {!compact && (
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
