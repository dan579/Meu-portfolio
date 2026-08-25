import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.tsx';
import { MobileHeader } from './MobileHeader.tsx';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 flex flex-col md:flex-row overflow-x-hidden font-sans relative selection:bg-blue-500/20 selection:text-blue-300">
      {/* Background Tech Dot Matrix & Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none bg-tech-dots opacity-60 z-0" />
      <div className="fixed top-0 left-1/3 w-[600px] h-[350px] pointer-events-none ambient-glow-top z-0" />
      <div className="fixed -bottom-20 right-10 w-[500px] h-[500px] pointer-events-none bg-blue-600/[0.02] rounded-full blur-3xl z-0" />

      {/* Mobile Top Navigation */}
      <MobileHeader />

      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block shrink-0 sticky top-0 h-screen z-20">
        <Sidebar />
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden">
        <div className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between">
          <div className="flex-1">
            <Outlet />
          </div>

          {/* Minimalist footer with credits and current year */}
          <footer className="mt-16 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/70" />
              <span>Daniel Santos da Silva • </span>
              <span className="text-slate-400">Interactive CV (Decoupled Content Architecture)</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <a
                href="/admin"
                className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1 hover:underline underline-offset-4"
                title="Acesso Administrativo"
              >
                <span>Painel Admin</span>
              </a>
              <span className="text-slate-700">•</span>
              <span className="text-blue-400/90 font-medium">React 19 + Supabase</span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-500">2026</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};
