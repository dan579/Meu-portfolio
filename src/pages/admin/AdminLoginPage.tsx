import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../admin/AdminAuthContext.tsx';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { user, isAuthorized, adminEmail, isConfigured, loginWithGoogle } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check for error parameters in URL if OAuth returned an error
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(
      location.hash.startsWith('#') ? location.hash.substring(1) : location.hash
    );

    const error = searchParams.get('error') || hashParams.get('error');
    const errorDesc = searchParams.get('error_description') || hashParams.get('error_description');

    if (error) {
      setErrorMsg(errorDesc || error || 'Falha na autenticação via Google.');
    }
  }, [location]);

  // If already authenticated and authorized, redirect to /admin
  useEffect(() => {
    if (user && isAuthorized) {
      const origin = (location.state as any)?.from?.pathname || '/admin';
      navigate(origin, { replace: true });
    }
  }, [user, isAuthorized, navigate, location]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);

    const { error } = await loginWithGoogle();
    if (error) {
      setErrorMsg(error.message || 'Falha ao iniciar autenticação com Google');
      setLoading(false);
    }
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
            O acesso a este painel e todas as mutações no banco PostgreSQL são restritos exclusivamente ao e-mail:
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

        {/* Primary OAuth Action */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            id="login-with-google-btn"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{loading ? 'Processando sessão...' : 'Entrar com Google'}</span>
          </button>
        </div>

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
