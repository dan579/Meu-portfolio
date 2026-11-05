import React from 'react';
import { Link } from 'react-router-dom';
import { useProfile, useLanguage, useUILabels } from '../../content/ContentProvider.tsx';
import { Linkedin, Github, Mail, Shield, MapPin, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const profile = useProfile();
  const { language } = useLanguage();
  const labels = useUILabels();
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { path: '/', label: language === 'pt' ? 'Início' : 'Home' },
    { path: '/sobre', label: labels.nav.about },
    { path: '/experiencia', label: labels.nav.experience },
    { path: '/infraestrutura', label: language === 'pt' ? 'Competências' : 'Skills & Infra' },
    { path: '/projetos', label: labels.nav.projects },
    { path: '/contato', label: labels.nav.contact },
  ];

  return (
    <footer className="bg-[#061B3A] text-white border-t border-[#1769AA]/30 relative overflow-hidden">
      {/* Subtle Cyan Glow Top Accent */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D4E8] to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Professional Presentation */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/Logo_DS_entrela_ado_em_azul_marinho_e_ciano_135d994c.png"
                alt="DS Logo"
                className="w-10 h-10 object-contain brightness-110"
              />
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white tracking-tight leading-tight">
                  {profile.name}
                </h3>
                <p className="text-xs text-[#00D4E8] font-medium leading-none mt-1">
                  DS Sistemas e Soluções • Portfólio Profissional
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 max-w-md leading-relaxed font-normal">
              {profile.shortSummary || (profile.fullBio && profile.fullBio[0])}
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-300 font-mono pt-1">
              <span className="inline-flex items-center gap-1.5 text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-[#00D4E8]" />
                {profile.location || 'Belo Horizonte, MG • Brasil'}
              </span>
              <span className="text-slate-500">•</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-300 font-sans">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {language === 'pt' ? 'Disponível para novos projetos' : 'Available for opportunities'}
              </span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#00D4E8]">
              {language === 'pt' ? 'Navegação' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-white transition-colors hover:translate-x-0.5 inline-flex items-center gap-1 text-slate-300 hover:text-[#00D4E8]"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Professional Channels */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#00D4E8]">
              {language === 'pt' ? 'Canais Profissionais' : 'Professional Channels'}
            </h4>
            <div className="space-y-2.5">
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-slate-200 group-hover:bg-[#0877E8] group-hover:text-white transition-colors">
                    <Linkedin className="w-3.5 h-3.5" />
                  </div>
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-white" />
                </a>
              )}

              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-slate-200 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                    <Github className="w-3.5 h-3.5" />
                  </div>
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-white" />
                </a>
              )}

              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-slate-200 group-hover:bg-[#0877E8] group-hover:text-white transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate max-w-[180px]">{profile.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Admin link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {currentYear} {profile.name}. {language === 'pt' ? 'Todos os direitos reservados.' : 'All rights reserved.'}
          </p>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-[11px] font-mono text-slate-400">
              {language === 'pt' ? 'Identidade visual DS Sistemas e Soluções' : 'DS Sistemas visual identity'}
            </span>
            <span className="text-slate-600">•</span>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#00D4E8] transition-colors"
              title="Acesso Administrativo"
            >
              <Shield className="w-3.5 h-3.5 text-[#00D4E8]" />
              <span>{language === 'pt' ? 'Painel Admin' : 'Admin Panel'}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
