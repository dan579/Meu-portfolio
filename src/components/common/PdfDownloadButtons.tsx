import React, { useState } from 'react';
import { FileText, Download, Loader2, BookOpen, Check } from 'lucide-react';
import { useContent } from '../../content/ContentProvider.tsx';
import { downloadResumePdf, downloadPortfolioPdf } from '../../pdf/pdfGenerator.ts';

interface PdfDownloadButtonsProps {
  variant?: 'admin' | 'public' | 'hero';
  className?: string;
}

export const PdfDownloadButtons: React.FC<PdfDownloadButtonsProps> = ({
  variant = 'public',
  className = '',
}) => {
  const content = useContent();
  const [loadingResume, setLoadingResume] = useState(false);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadResume = async () => {
    try {
      setLoadingResume(true);
      await downloadResumePdf(content);
      setDownloadSuccess('resume');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error('Erro ao gerar Currículo PDF:', err);
    } finally {
      setLoadingResume(false);
    }
  };

  const handleDownloadPortfolio = async () => {
    try {
      setLoadingPortfolio(true);
      await downloadPortfolioPdf(content);
      setDownloadSuccess('portfolio');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error('Erro ao gerar Portfólio PDF:', err);
    } finally {
      setLoadingPortfolio(false);
    }
  };

  if (variant === 'admin') {
    return (
      <div className={`bg-[#111115]/90 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-lg ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <Download className="w-4 h-4" />
              <span>Geração de PDF em Tempo Real (Fase 7)</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Documentos compilados dinamicamente com os dados mais recentes do Supabase.
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-md shrink-0 self-start sm:self-auto">
            Client-Side • @react-pdf/renderer
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Botão Currículo */}
          <button
            onClick={handleDownloadResume}
            disabled={loadingResume || loadingPortfolio}
            id="admin-download-resume-btn"
            className="flex items-center justify-between p-3.5 rounded-xl bg-[#16161c] hover:bg-[#1b1b24] border border-slate-800/80 hover:border-blue-500/40 transition-all duration-200 text-left group cursor-pointer disabled:opacity-50 hover:-translate-y-0.5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform shrink-0">
                {loadingResume ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                ) : downloadSuccess === 'resume' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                  Baixar Currículo (PDF)
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Formato ATS • Enxuto (até 2 págs)
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-y-0.5 transition-all shrink-0 ml-2" />
          </button>

          {/* Botão Portfólio */}
          <button
            onClick={handleDownloadPortfolio}
            disabled={loadingResume || loadingPortfolio}
            id="admin-download-portfolio-btn"
            className="flex items-center justify-between p-3.5 rounded-xl bg-[#16161c] hover:bg-[#1b1b24] border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-200 text-left group cursor-pointer disabled:opacity-50 hover:-translate-y-0.5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                {loadingPortfolio ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                ) : downloadSuccess === 'portfolio' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <BookOpen className="w-4 h-4" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Baixar Portfólio (PDF)
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Visual completo • Cases & QR Code (até 4 págs)
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-y-0.5 transition-all shrink-0 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  // Variant: Public / Contact
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Botão Currículo ATS */}
        <button
          onClick={handleDownloadResume}
          disabled={loadingResume || loadingPortfolio}
          id="public-download-resume-btn"
          className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-[#16161c] hover:bg-[#1c1c24] border border-slate-800/80 hover:border-blue-500/40 text-left transition-all duration-200 group cursor-pointer disabled:opacity-50 hover:-translate-y-0.5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
              {loadingResume ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : downloadSuccess === 'resume' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                Currículo Tradicional (PDF)
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Formato padrão ATS • 2 páginas
              </div>
            </div>
          </div>
          <Download className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-y-0.5 transition-all shrink-0 ml-2" />
        </button>

        {/* Botão Portfólio Completo */}
        <button
          onClick={handleDownloadPortfolio}
          disabled={loadingResume || loadingPortfolio}
          id="public-download-portfolio-btn"
          className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-[#16161c] hover:bg-[#1c1c24] border border-slate-800/80 hover:border-emerald-500/40 text-left transition-all duration-200 group cursor-pointer disabled:opacity-50 hover:-translate-y-0.5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              {loadingPortfolio ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : downloadSuccess === 'portfolio' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <BookOpen className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                Portfólio Completo (PDF)
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Com cases, arquitetura & QR Code
              </div>
            </div>
          </div>
          <Download className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-y-0.5 transition-all shrink-0 ml-2" />
        </button>
      </div>
    </div>
  );
};
