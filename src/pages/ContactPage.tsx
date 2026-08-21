import React, { useState } from 'react';
import { useContact, useProfile, useUILabels } from '../content/ContentProvider.tsx';
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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8" id="contact-page-container">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Mail className="w-4 h-4" />
          <span>Comunicação & Conexão</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Entrar em Contato <span className="text-blue-500">.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
          Canais diretos para oportunidades profissionais, alinhamentos técnicos, consultoria ou networking.
        </p>
      </div>

      {/* Main Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Card with One-click Copy */}
        <div className="bg-[#111113] border border-slate-800/90 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              Canal Principal
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              E-mail Direto
            </h3>
            <p className="text-base font-mono font-bold text-white tracking-tight">
              {contact.email}
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleCopyEmail}
              id="copy-email-btn"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>{labels.common.emailCopied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{labels.common.copyEmail}</span>
                </>
              )}
            </button>

            <a
              href={`mailto:${contact.email}`}
              id="mailto-btn"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#16161B] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
            >
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Professional Network Links */}
        <div className="bg-[#111113] border border-slate-800/90 rounded-xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Linkedin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-[#16161B] border border-slate-800 px-2 py-0.5 rounded">
                Redes Profissionais
              </span>
            </div>

            <div className="space-y-3">
              <a
                href={contact.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                id="contact-linkedin-link"
                className="flex items-center justify-between p-3 rounded-lg bg-[#151519] border border-slate-800 hover:border-blue-500/40 text-xs font-medium text-slate-200 transition-all group"
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
                className="flex items-center justify-between p-3 rounded-lg bg-[#151519] border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-all group"
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
      <section className="bg-gradient-to-r from-[#111113] to-[#15151C] border border-slate-800/90 rounded-xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
          <Clock className="w-4 h-4" />
          <span>Status de Disponibilidade</span>
        </div>

        <h3 className="text-base font-bold text-white">
          {contact.availabilityStatus}
        </h3>

        <div className="bg-[#101013] border border-slate-800/80 p-4 rounded-lg text-xs sm:text-sm text-slate-300 leading-relaxed italic">
          &ldquo;{contact.messageNote}&rdquo;
        </div>
      </section>
    </div>
  );
};
