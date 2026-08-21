import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.tsx';
import { MobileHeader } from './MobileHeader.tsx';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090B] text-slate-200 flex flex-col md:flex-row overflow-x-hidden font-sans">
      {/* Mobile Top Navigation */}
      <MobileHeader />

      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block shrink-0 sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* Subtle decorative glow accents from Sleek theme */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -left-24 w-80 h-80 bg-blue-500/[0.02] rounded-full blur-3xl" />

        <div className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10 relative z-10 flex flex-col justify-between">
          <div className="flex-1">
            <Outlet />
          </div>

          {/* Minimalist footer with credits and current year */}
          <footer className="mt-16 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500 font-mono">
            <div>
              <span>Daniel Santos da Silva • </span>
              <span className="text-slate-400">Interactive CV (Decoupled Content Architecture)</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <a
                href="/admin"
                className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1"
                title="Acesso Administrativo"
              >
                <span>Painel Admin</span>
              </a>
              <span>•</span>
              <span className="text-blue-400/80">React 19 + Supabase</span>
              <span>•</span>
              <span className="text-slate-500">2026</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};
