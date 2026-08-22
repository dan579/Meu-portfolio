import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../admin/AdminAuthContext.tsx';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  AlertCircle,
  Mail,
  Send,
  CheckCircle2
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { user, isAuthorized, adminEmail, isConfigured, loginWithMagicLink } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already authenticated and authorized, redirect to /admin
  useEffect(() => {
    if (user && isAuthorized) {
      const origin = (location.state as any)?.from?.pathname || '/admin';
      navigate(origin, { replace: true });
    }
  }, [user, isAuthorized, navigate, location]);

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const { error } = await loginWithMagicLink(adminEmail);
    if (error) {
      setErrorMsg(error.message || 'Falha ao enviar link de acesso.');
    } else {
      setSuccessMsg('Link enviado! Verifique seu e-mail.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111113] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/60 relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Painel de Administração
          </h1>
          <p className="text-xs text-slate-400">
            Interactive CV • Gestão de Conteúdo Relacional
          </p>
        </div>

        {/* Security Rule Notice */}
        <div className="bg-[#16161B] border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-blue-400 font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Regra de Conta Única & RLS</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            O acesso a este painel e todas as mutações no banco PostgreSQL são restritos exclusivamente ao e-mail autorizado:
          </p>
          <div className="bg-[#0C0C0E] border border-slate-800 px-2.5 py-1.5 rounded font-mono text-emerald-400 text-xs font-bold truncate">
            {adminEmail}
          </div>
        </div>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 text-xs text-emerald-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <div>
              <p className="font-bold text-white">{successMsg}</p>
              <p className="text-[11px] text-emerald-300/80 mt-0.5">
                Enviamos um link mágico de login direto para <span className="font-mono text-emerald-200">{adminEmail}</span>.
              </p>
            </div>
          </div>
        )}

        {/* Magic Link Form */}
        <form onSubmit={handleMagicLinkLogin} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              E-mail do Administrador
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={adminEmail}
                readOnly
                className="w-full pl-9 pr-3 py-2.5 bg-[#16161B] border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none cursor-not-allowed opacity-90"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="send-magic-link-btn"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg hover:shadow-blue-500/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{loading ? 'Enviando link...' : 'Enviar link de acesso'}</span>
          </button>
        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao site público</span>
          </a>

          <span className="font-mono text-[10px] text-slate-400">
            {isConfigured ? 'Supabase Conectado' : 'Configuração Pendente'}
          </span>
        </div>
      </div>
    </div>
  );
};
