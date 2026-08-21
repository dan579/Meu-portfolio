import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase.ts';

export const AdminAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, 'Session:', !!session);
      if (event === 'SIGNED_IN' && session) {
        navigate('/admin', { replace: true });
      } else if (event === 'SIGNED_OUT') {
        navigate('/admin/login', { replace: true });
      }
    });

    const timeout = setTimeout(() => {
      navigate('/admin/login', { replace: true });
    }, 15000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#09090B] text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111113] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/60 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4 py-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-lg font-bold text-white tracking-tight">
              Processando Autenticação
            </h1>
            <p className="text-xs text-slate-400">
              Validando credenciais do Google e estabelecendo sessão segura...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
