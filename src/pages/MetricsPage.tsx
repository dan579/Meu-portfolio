import React from 'react';
import { useMetrics, useUILabels } from '../content/ContentProvider.tsx';
import {
  Activity,
  Calendar,
  Layers,
  ShieldCheck,
  Info,
  Sparkles,
  TrendingUp,
  Clock,
  Server
} from 'lucide-react';

export const MetricsPage: React.FC = () => {
  const metrics = useMetrics();
  const labels = useUILabels();

  return (
    <div className="space-y-8" id="metrics-page-container">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Activity className="w-4 h-4" />
          <span>Evidências Quantitativas</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {labels.common.metrics.metricsHeadline} <span className="text-blue-500">.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
          {labels.common.metrics.metricsSubtitle}
        </p>
      </div>

      {/* Origin System & Aggregate Note */}
      <div className="bg-[#111113] border border-blue-900/30 rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="text-xs font-bold text-blue-300 uppercase tracking-wider">
            Consolidação de Dados & Origem Operis
          </h2>
          <p className="text-xs text-slate-300/90 leading-relaxed">
            {labels.common.metrics.sourceNote}
          </p>
        </div>
      </div>

      {/* Snapshots Content */}
      {metrics.length === 0 ? (
        <div className="bg-[#111113] border border-dashed border-slate-800 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
            <Activity className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-sm font-bold text-white">
              {labels.common.metrics.noMetricsTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {labels.common.metrics.noMetricsDesc}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {metrics.map((snapshot) => (
            <div
              key={snapshot.id}
              id={`metric-snapshot-${snapshot.id}`}
              className="bg-[#111113] border border-slate-800/90 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
            >
              {/* Snapshot Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/70">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      {snapshot.periodLabel}
                    </h2>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {snapshot.sourceSystem}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {snapshot.periodStart} → {snapshot.periodEnd}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 bg-[#16161B] px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-center">
                  Registro: <span className="text-slate-300 font-semibold">{snapshot.entryMethod === 'manual' ? 'Consolidado Manualmente' : 'Automatizado'}</span>
                </div>
              </div>

              {/* Context Summary */}
              {snapshot.summary && (
                <div className="bg-[#141418] border border-slate-800/80 rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Escopo & Contexto do Período
                  </span>
                  {snapshot.summary}
                </div>
              )}

              {/* Metric Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {snapshot.items.map((item) => (
                  <div
                    key={item.id}
                    id={`metric-item-${item.id}`}
                    className="bg-[#16161B] border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-5 space-y-2.5 transition-colors"
                  >
                    <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight text-blue-400">
                      {item.value}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">
                        {item.label}
                      </h3>
                      {item.context && (
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {item.context}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
