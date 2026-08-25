import React, { useState } from 'react';
import { useContact, useProfile, useUILabels } from '../content/ContentProvider.tsx';
import { PdfDownloadButtons } from '../components/common/PdfDownloadButtons.tsx';
import {
  Mail,
  Linkedin,
  Github,
  MapPin,
  Check,
  Copy,
  Clock,
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const contact = useContact();
  const profile = useProfile();
  const labels = useUILabels();
  const [copied, setCopied] = useState(false);

  const effectiveEmail = profile.email || contact.email || '';

  const handleCopyEmail = () => {
    if (!effectiveEmail) return;
    navigator.clipboard.writeText(effectiveEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8" id="contact-page-container">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
          <Mail className="w-4 h-4" />
          <span>Comunicação & Conexão</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Entrar em Contato <span className="text-blue-500">.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
          Canais diretos para oportunidades profissionais, alinhamentos técnicos, consultoria ou networking.
        </p>
      </div>

      {/* Main Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Card with One-click Copy */}
        <div className="bg-[#111115]/90 backdrop-blur-sm border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 sm:p-7 space-y-4 shadow-lg shadow-black/20 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-md">
              Canal Principal
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              E-mail Direto
            </h3>
            <p className="text-base font-mono font-bold text-white tracking-tight">
              {effectiveEmail || '—'}
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <a
              href={effectiveEmail ? `mailto:${effectiveEmail}` : '#'}
              id="send-email-mailto-btn"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{labels.common.getInTouch}</span>
            </a>

            <button
              onClick={handleCopyEmail}
              id="copy-email-btn"
              title={labels.common.copyEmail}
              disabled={!effectiveEmail}
              className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl bg-[#16161c] hover:bg-slate-800 border border-slate-800/90 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-40"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Professional Network Links */}
        <div className="bg-[#111115]/90 backdrop-blur-sm border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 sm:p-7 space-y-4 flex flex-col justify-between shadow-lg shadow-black/20 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Linkedin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-[#16161c] border border-slate-800/80 px-2.5 py-0.5 rounded-md">
                Redes Profissionais
              </span>
            </div>

            <div className="space-y-3">
              <a
                href={contact.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                id="contact-linkedin-link"
                className="flex items-center justify-between p-3 rounded-xl bg-[#16161c] border border-slate-800/80 hover:border-blue-500/40 text-xs font-medium text-slate-200 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Linkedin className="w-4 h-4 text-blue-400" />
                  <span>LinkedIn ({contact.linkedin})</span>
                </div>
                <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">↗</span>
              </a>

              <a
                href={contact.githubUrl}
                target="_blank"
                rel="noreferrer"
                id="contact-github-link"
                className="flex items-center justify-between p-3 rounded-xl bg-[#16161c] border border-slate-800/80 hover:border-slate-700 text-xs font-medium text-slate-200 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Github className="w-4 h-4 text-slate-400" />
                  <span>GitHub (@{contact.github})</span>
                </div>
                <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">↗</span>
              </a>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/60 flex items-center gap-2 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>{contact.cityStateCountry}</span>
          </div>
        </div>
      </div>

      {/* Availability Status & Perspective Note */}
      <section className="bg-[#111115]/90 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg shadow-black/20">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
          <Clock className="w-4 h-4" />
          <span>Status de Disponibilidade</span>
        </div>

        <h3 className="text-base font-bold text-white tracking-tight">
          {contact.availabilityStatus}
        </h3>

        <div className="bg-[#16161c] border border-slate-800/80 p-4 rounded-xl text-xs sm:text-sm text-slate-300 leading-relaxed italic">
          &ldquo;{contact.messageNote}&rdquo;
        </div>
      </section>

      {/* Dynamic PDF Downloads */}
      <section className="bg-[#111115]/90 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Downloads de Currículo & Portfólio</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Documentos gerados em tempo real com as informações e projetos mais recentes.
            </p>
          </div>
        </div>

        <PdfDownloadButtons variant="public" />
      </section>
    </div>
  );
};
