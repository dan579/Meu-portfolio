import React from 'react';
import { MediaPicker } from '../../admin/components/MediaPicker.tsx';
import { Database, ShieldCheck, HardDrive, Info } from 'lucide-react';

export const AdminMediaPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Storage • Bucket: media</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Biblioteca de Mídia & Assets
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerenciamento centralizado de screenshots reais, diagramas de arquitetura e imagens de cases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Escrita Restrita RLS
          </span>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-[#111113] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5 sm:mt-0">
            <HardDrive className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-200 block">Armazenamento em Nuvem com Leitura Pública</span>
            <p className="text-[11px] text-slate-500">
              Arquivos enviados recebem URLs diretas resolvidas na CDN do Supabase. Use o seletor em qualquer projeto para vincular screenshots reais aos mockups.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono shrink-0 bg-[#16161B] px-3 py-1.5 rounded-lg border border-slate-800">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>Limite: 5MB / arquivo</span>
        </div>
      </div>

      {/* Embedded Media Manager */}
      <div className="bg-[#111113] border border-slate-800 rounded-xl p-6">
        <MediaPicker isModal={false} />
      </div>
    </div>
  );
};
