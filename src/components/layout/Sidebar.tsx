import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  useProfile,
  useLanguage,
  useUILabels
} from '../../content/ContentProvider.tsx';
import {
  Home,
  User,
  Briefcase,
  Server,
  Layers,
  Mail,
  MapPin,
  Linkedin,
  Github
} from 'lucide-react';

interface SidebarProps {
  onItemClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const profile = useProfile();
  const { language, setLanguage } = useLanguage();
  const labels = useUILabels();

  const navItems = [
    { path: '/', label: labels.nav.home, icon: Home },
    { path: '/sobre', label: labels.nav.about, icon: User },
    { path: '/experiencia', label: labels.nav.experience, icon: Briefcase },
    { path: '/infraestrutura', label: labels.nav.infrastructure, icon: Server },
    { path: '/projetos', label: labels.nav.projects, icon: Layers },
    { path: '/contato', label: labels.nav.contact, icon: Mail },
  ];

  return (
    <aside
      id="main-sidebar"
      className="w-72 bg-[#0C0C0E] border-r border-slate-800/80 flex flex-col h-full select-none"
    >
      {/* Profile Header Block */}
      <div className="p-6 flex flex-col items-center border-b border-slate-800/80 text-center">
        {/* Avatar with sleek ring */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-[2px] mb-3 shadow-lg shadow-blue-500/10 transition-transform duration-300 hover:scale-105 overflow-hidden">
          {profile.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-[#141418] flex items-center justify-center text-xl font-extrabold text-blue-400 tracking-wider">
              {profile.initials}
            </div>
          )}
        </div>

        <h2 className="text-base font-bold text-white tracking-tight">
          {profile.shortName}
        </h2>
        <p className="text-[11px] text-blue-400 font-medium tracking-wider uppercase mb-3.5 mt-0.5">
          Systems Analyst & Infra
        </p>

        {/* Language Switcher */}
        <div className="flex gap-1.5 p-1 bg-[#16161B] rounded-lg border border-slate-800">
          <button
            id="lang-btn-pt"
            type="button"
            onClick={() => setLanguage('pt')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider transition-all duration-200 cursor-pointer ${
              language === 'pt'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            PT-BR
          </button>
          <button
            id="lang-btn-en"
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider transition-all duration-200 cursor-pointer ${
              language === 'en'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EN-US
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              id={`nav-link-${item.path.replace('/', '') || 'home'}`}
              onClick={onItemClick}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/5'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Availability Status & Social Footer */}
      <div className="p-4 border-t border-slate-800/80 space-y-3 bg-[#0A0A0C]">
        <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="truncate font-medium">{labels.common.availableForProjects}</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/40">
          <span className="flex items-center gap-1 text-[10px]">
            <MapPin className="w-3 h-3 text-slate-500" />
            BH • Brasil
          </span>
          <div className="flex items-center gap-2">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-blue-400 transition-colors p-1"
              title="LinkedIn"
              id="sidebar-link-linkedin"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition-colors p-1"
              title="GitHub"
              id="sidebar-link-github"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};
