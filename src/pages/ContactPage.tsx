import React, { useState } from 'react';
import { useContact, useProfile, useUILabels, useLanguage } from '../content/ContentProvider.tsx';
import { PdfDownloadButtons } from '../components/common/PdfDownloadButtons.tsx';
import {
  Mail,
  Linkedin,
  Github,
  MapPin,
  Check,
  Copy,
  Send,
  MessageSquare,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const contact = useContact();
  const profile = useProfile();
  const labels = useUILabels();
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const effectiveEmail = profile.email || contact.email || '';

  const handleCopyEmail = () => {
    if (!effectiveEmail) return;
    navigator.clipboard.writeText(effectiveEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full bg-[#061B3A] text-white py-14 sm:py-20 relative overflow-hidden" id="contact-page-container">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00D4E8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#0877E8]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-[#00D4E8] text-xs font-mono font-bold uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>{language === 'pt' ? 'Canais de Conexão' : 'Direct Channels'}</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            {labels.common.getInTouch}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
            {language === 'pt'
              ? 'Canais diretos para oportunidades profissionais em suporte, infraestrutura, desenvolvimento de sistemas ou consultoria técnica.'
              : 'Direct communication channels for opportunities in IT support, infrastructure, software engineering, or technical consulting.'}
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Direct Card */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-7 border border-white/10 hover:border-[#00D4E8]/40 transition-colors space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-[#00D4E8]/20 flex items-center justify-center text-[#00D4E8]">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-700/40 px-2.5 py-1 rounded">
                {language === 'pt' ? 'Canal Principal' : 'Primary Channel'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-slate-400">
                {language === 'pt' ? 'E-mail Direto' : 'Direct Email'}
              </span>
              <p className="font-heading font-extrabold text-base sm:text-lg text-white tracking-tight break-all">
                {effectiveEmail || '—'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={effectiveEmail ? `mailto:${effectiveEmail}` : '#'}
                id="send-email-mailto-btn"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#0877E8] hover:bg-[#0766c6] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'pt' ? 'Enviar E-mail' : 'Send Email'}</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                id="copy-email-btn"
                title={labels.common.copyEmail}
                disabled={!effectiveEmail}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-[10px] bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-40"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-300" />
                )}
              </button>
            </div>
          </div>

          {/* Professional Social Links Card */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-7 border border-white/10 hover:border-[#0877E8]/40 transition-colors space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-[#0877E8]/20 flex items-center justify-center text-[#0877E8]">
                <MessageSquare className="w-5 h-5 text-[#00D4E8]" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-300 bg-white/10 px-2.5 py-1 rounded">
                {language === 'pt' ? 'Redes Profissionais' : 'Social Networks'}
              </span>
            </div>

            <div className="space-y-3">
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  id="contact-linkedin-link"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0877E8]/20 flex items-center justify-center text-[#00D4E8]">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#00D4E8] transition-colors">
                        LinkedIn
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {profile.linkedinDisplay || profile.shortName}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                </a>
              )}

              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  id="contact-github-link"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-200">
                      <Github className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#00D4E8] transition-colors">
                        GitHub
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {profile.githubDisplay || 'Repositórios e Códigos'}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Download de Documentos PDF */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-7 border border-white/10 space-y-4 shadow-xl">
          <div className="space-y-1">
            <h3 className="font-heading font-extrabold text-base text-white">
              {language === 'pt' ? 'Documentos Oficiais para Download' : 'Official PDF Documents'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {language === 'pt'
                ? 'Currículo formatado para sistemas ATS e Portfólio completo com arquitetura e QR Code de validação.'
                : 'ATS-ready resume and comprehensive technical portfolio with architecture diagrams and QR verification.'}
            </p>
          </div>

          <PdfDownloadButtons variant="hero" />
        </div>
      </div>
    </div>
  );
};
