import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext.tsx';
import { ShieldAlert, LogOut, ArrowLeft, Lock } from 'lucide-react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const { user, loading, isAuthorized, adminEmail, logout } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-slate-400">Verificando autorização de acesso...</p>
        </div>
      </div>
    );
  }

  // Not authenticated -> redirect to login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Authenticated but unauthorized (Email mismatch: Rule of Single Account)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#09090B] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#111113] border border-rose-900/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-rose-950/20">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Acesso Não Autorizado
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              O painel de administração é restrito exclusivamente ao proprietário do portfólio.
            </p>
          </div>

          <div className="bg-[#16161B] border border-slate-800 rounded-lg p-3 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Conta conectada:</span>
              <span className="text-rose-300 truncate max-w-[200px]">{user.email}</span>
            </div>
            <div className="flex justify-between text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Conta autorizada:</span>
              <span className="text-emerald-400">{adminEmail}</span>
            </div>
          </div>

          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-[11px] text-rose-300 leading-normal flex items-start gap-2">
            <Lock className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Regra de Segurança:</strong> As políticas de RLS do banco PostgreSQL recusam qualquer operação de escrita de contas não autorizadas.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => logout()}
              id="admin-unauthorized-logout-btn"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Desconectar Conta</span>
            </button>

            <a
              href="/"
              id="admin-unauthorized-back-btn"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#18181D] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Site Público</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated & Authorized
  return <>{children}</>;
};
