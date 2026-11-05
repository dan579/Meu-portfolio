import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext.tsx';
import {
  LayoutDashboard,
  User,
  Briefcase,
  ExternalLink,
  LogOut,
  Shield,
  Menu,
  X,
  Server,
  Layers,
  Sparkles,
  Database
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, adminEmail, isConfigured, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    {
      to: '/admin',
      label: 'Visão Geral',
      icon: LayoutDashboard,
      end: true,
      ready: true,
    },
    {
      to: '/admin/perfil',
      label: 'Perfil & Trajetória',
      icon: User,
      end: false,
      ready: true,
    },
    {
      to: '/admin/experiencia',
      label: 'Experiências (CRUD)',
      icon: Briefcase,
      end: false,
      ready: true,
    },
    {
      to: '/admin/infraestrutura',
      label: 'Infraestrutura',
      icon: Server,
      end: false,
      ready: true,
    },
    {
      to: '/admin/competencias',
      label: 'Competências',
      icon: Sparkles,
      end: false,
      ready: true,
    },
    {
      to: '/admin/projetos',
      label: 'Projetos & Cases',
      icon: Layers,
      end: false,
      ready: true,
    },
    {
      to: '/admin/media',
      label: 'Mídia & Assets',
      icon: Database,
      end: false,
      ready: true,
    },
  ];

  const upcomingSections: { label: string; icon: any }[] = [];

  return (
    <div className="min-h-screen bg-[#09090B] text-slate-200 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#061B3A] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/aistudio/Logo_DS_entrela_ado_em_azul_marinho_e_ciano_135d994c.png"
            alt="DS Logo"
            className="w-7 h-7 object-contain brightness-110"
          />
          <div>
            <span className="text-sm font-bold text-white tracking-tight font-heading">Admin Núcleo</span>
            <span className="text-[10px] block font-mono text-[#00D4E8]">DS Sistemas & CV</span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white/10 border border-white/15 text-white"
          aria-label="Toggle admin menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#061B3A] border-r border-white/10 flex flex-col justify-between p-4 transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand & Auth Status */}
          <div className="hidden md:flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/aistudio/Logo_DS_entrela_ado_em_azul_marinho_e_ciano_135d994c.png"
                alt="DS Logo"
                className="w-8 h-8 object-contain brightness-110"
              />
              <div>
                <h2 className="text-sm font-extrabold text-white tracking-tight font-heading">Admin Núcleo</h2>
                <p className="text-[10px] font-mono text-[#00D4E8]">DS Sistemas & Soluções</p>
              </div>
            </div>
          </div>

          {/* User Badge */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Administrador</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Ativo
              </span>
            </div>
            <p className="text-xs font-mono font-medium text-slate-200 truncate" title={user?.email || adminEmail}>
              {user?.email || adminEmail}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
              <Database className="w-3 h-3 text-blue-400" />
              <span>{isConfigured ? 'Supabase Conectado' : 'Modo Standalone / Cloud'}</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1.5">
              Módulos Ativos
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#0877E8] text-white shadow-md shadow-[#0877E8]/30 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Upcoming modules list */}
          <div className="space-y-2 pt-2 border-t border-slate-800/60">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Próxima Fase (Roadmap)
            </div>
            <div className="space-y-1">
              {upcomingSections.map((sec) => {
                const SecIcon = sec.icon;
                return (
                  <div
                    key={sec.label}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 bg-[#121215]/50 border border-slate-800/40 opacity-70 cursor-not-allowed"
                  >
                    <div className="flex items-center gap-2.5">
                      <SecIcon className="w-3.5 h-3.5" />
                      <span>{sec.label}</span>
                    </div>
                    <span className="text-[9px] font-mono uppercase bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-400">
                      Fase 2
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-800/60 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#141418] hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>Ver Site Público</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">↗</span>
          </a>

          <button
            onClick={handleLogout}
            id="admin-sidebar-logout-btn"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/20 text-rose-300 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair da Conta</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
