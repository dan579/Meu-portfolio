import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../admin/AdminAuthContext.tsx';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  AlertCircle,
  Mail,
  KeyRound,
  LogIn,
  Eye,
  EyeOff
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { user, isAuthorized, adminEmail, isConfigured, loginWithPassword } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If already authenticated and authorized, redirect to /admin
  useEffect(() => {
    if (user && isAuthorized) {
      const origin = (location.state as any)?.from?.pathname || '/admin';
      navigate(origin, { replace: true });
    }
  }, [user, isAuthorized, navigate, location]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg('Por favor, digite a sua senha de administrador.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await loginWithPassword(adminEmail, password);

    if (error) {
      if (error.message?.includes('Invalid login credentials') || error.message?.includes('invalid_grant')) {
        setErrorMsg('Senha incorreta ou usuário não encontrado. Verifique as credenciais.');
      } else {
        setErrorMsg(error.message || 'Falha ao autenticar com e-mail e senha.');
      }
      setLoading(false);
      return;
    }

    if (data?.session) {
      const origin = (location.state as any)?.from?.pathname || '/admin';
      navigate(origin, { replace: true });
    } else {
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

        {/* Password Login Form */}
        <form onSubmit={handlePasswordLogin} className="space-y-4 pt-1">
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

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Senha de Acesso
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-9 pr-10 py-2.5 bg-[#16161B] border border-slate-700 focus:border-blue-500 rounded-xl text-xs text-slate-200 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="login-submit-btn"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg hover:shadow-blue-500/20 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>{loading ? 'Autenticando...' : 'Entrar'}</span>
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
