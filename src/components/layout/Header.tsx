import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useProfile, useLanguage, useUILabels } from '../../content/ContentProvider.tsx';
import { Menu, X, ArrowUpRight, Mail } from 'lucide-react';

export const Header: React.FC = () => {
  const profile = useProfile();
  const { language, setLanguage } = useLanguage();
  const labels = useUILabels();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: language === 'pt' ? 'Início' : 'Home' },
    { path: '/sobre', label: labels.nav.about },
    { path: '/experiencia', label: labels.nav.experience },
    { path: '/infraestrutura', label: language === 'pt' ? 'Competências' : 'Skills & Infra' },
    { path: '/projetos', label: labels.nav.projects },
    { path: '/contato', label: labels.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand / Logo + Professional Identity */}
          <Link
            to="/"
            className="flex items-center gap-3.5 group select-none py-1"
            aria-label="Daniel Santos da Silva - Página Inicial"
          >
            {/* DS Monogram Mark */}
            <div className="relative shrink-0">
              <img
                src="/assets/aistudio/Logo_DS_entrela_ado_em_azul_marinho_e_ciano_135d994c.png"
                alt="DS Logo"
                className="w-10 h-10 object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </div>

            {/* Name and Professional Subtitle */}
            <div className="flex flex-col justify-center">
              <span className="font-heading font-extrabold text-base sm:text-lg text-[#061B3A] tracking-tight leading-tight group-hover:text-[#0877E8] transition-colors">
                {profile.name}
              </span>
              <span className="text-[11px] sm:text-xs text-[#64748B] font-medium leading-tight mt-0.5">
                {language === 'pt'
                  ? 'Infraestrutura & Suporte Técnico • Sistemas e Automação'
                  : 'Infrastructure & Technical Support • Systems and Automation'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Navegação principal">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'text-[#0877E8] bg-[#0877E8]/8'
                      : 'text-[#253247] hover:text-[#0877E8] hover:bg-slate-100/70'
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0877E8]" />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Tools: Language Selector + Contact CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <div
              className="inline-flex items-center p-0.5 rounded-lg bg-[#F3F6FA] border border-slate-200"
              role="group"
              aria-label="Seletor de Idioma"
            >
              <button
                type="button"
                onClick={() => setLanguage('pt')}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md transition-all cursor-pointer ${
                  language === 'pt'
                    ? 'bg-white text-[#0877E8] shadow-xs'
                    : 'text-[#64748B] hover:text-[#253247]'
                }`}
                aria-pressed={language === 'pt'}
              >
                PT
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-[#0877E8] shadow-xs'
                    : 'text-[#64748B] hover:text-[#253247]'
                }`}
                aria-pressed={language === 'en'}
              >
                EN
              </button>
            </div>

            {/* Direct Contact Button */}
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#0877E8] hover:bg-[#0766c6] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{language === 'pt' ? 'Fale Comigo' : 'Get in Touch'}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Compact Lang Switcher for mobile */}
            <div className="inline-flex items-center p-0.5 rounded-md bg-[#F3F6FA] border border-slate-200 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                className="px-2 py-0.5 font-bold text-[#0877E8]"
                title="Trocar idioma / Switch language"
              >
                {language.toUpperCase()}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#253247] hover:text-[#0877E8] hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-18 bottom-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity flex flex-col">
          <div
            className="w-full bg-white border-b border-slate-200 shadow-xl px-5 py-6 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Navigation Links */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#0877E8]/10 text-[#0877E8] font-bold'
                        : 'text-[#253247] hover:bg-slate-100'
                    }`
                  }
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </NavLink>
              ))}
            </div>

            {/* Language Switcher and Contact CTA in Mobile */}
            <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748B]">
                  {language === 'pt' ? 'Idioma da interface' : 'Interface language'}:
                </span>
                <div className="inline-flex rounded-lg bg-[#F3F6FA] border border-slate-200 p-0.5">
                  <button
                    type="button"
                    onClick={() => setLanguage('pt')}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded-md ${
                      language === 'pt' ? 'bg-white text-[#0877E8] shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Português (PT)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded-md ${
                      language === 'en' ? 'bg-white text-[#0877E8] shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    English (EN)
                  </button>
                </div>
              </div>

              <Link
                to="/contato"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-[10px] bg-[#0877E8] text-white text-sm font-bold shadow-sm"
              >
                <Mail className="w-4 h-4" />
                <span>{language === 'pt' ? 'Entrar em Contato' : 'Get in Touch'}</span>
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
