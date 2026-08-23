import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../admin/AdminAuthContext.tsx';
import {
  User,
  Briefcase,
  Layers,
  Server,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Database,
  Lock,
  Activity
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { adminEmail, authorizedAdmins, isConfigured } = useAdminAuth();

  return (
    <div className="space-y-8" id="admin-dashboard-container">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Fase 1 • Núcleo Administrativo</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Painel de Controle <span className="text-blue-500">.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
          Gestão centralizada dos dados do Interactive CV com persistência relacional e controle de Row Level Security.
        </p>
      </div>

      {/* Security & System Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111113] border border-slate-800/90 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">Contas Autorizadas</span>
            <Lock className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-xs font-mono font-bold text-white truncate">
            {authorizedAdmins.length > 0
              ? `${authorizedAdmins.length} administrador(es)`
              : adminEmail}
          </p>
          <span className="text-[10px] text-emerald-400 block pt-1">
            ✓ Validação dinâmica de lista no RLS
          </span>
        </div>

        <div className="bg-[#111113] border border-slate-800/90 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">Banco de Dados</span>
            <Database className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-xs font-mono font-bold text-white">
            {isConfigured ? 'Supabase PostgreSQL' : 'Fallback Local Ativo'}
          </p>
          <span className="text-[10px] text-slate-400 block pt-1">
            {isConfigured ? 'Pronto para operações em nuvem' : 'Sincronização em standby'}
          </span>
        </div>

        <div className="bg-[#111113] border border-slate-800/90 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">Bilinguismo</span>
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-xs font-mono font-bold text-white">Português (BR) & English (US)</p>
          <span className="text-[10px] text-blue-400 block pt-1">
            Suporte nativo a campos bilíngues
          </span>
        </div>
      </div>

      {/* Active Available Modules */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span>Módulos de Gestão Disponíveis (Nesta Rodada)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <Link
            to="/admin/perfil"
            id="admin-card-perfil"
            className="group bg-[#111113] hover:bg-[#141418] border border-slate-800/90 hover:border-blue-500/40 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Pronto para Edição
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  Perfil & Foco de Atuação
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Edição completa de dados cadastrais, biografia, links sociais, formação acadêmica, certificações e composição de atuação técnica (validação 100%).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 pt-2 border-t border-slate-800/60">
              <span>Abrir Editor de Perfil</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Experiences Card */}
          <Link
            to="/admin/experiencia"
            id="admin-card-experiencia"
            className="group bg-[#111113] hover:bg-[#141418] border border-slate-800/90 hover:border-blue-500/40 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  CRUD Completo
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  Experiência Profissional
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Adicionar, editar, reordenar (sort_order) e alternar status de publicação (publicado / rascunho) com controle de exibição em tempo real.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 pt-2 border-t border-slate-800/60">
              <span>Gerenciar Experiências</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Infrastructure Card */}
          <Link
            to="/admin/infraestrutura"
            id="admin-card-infraestrutura"
            className="group bg-[#111113] hover:bg-[#141418] border border-slate-800/90 hover:border-blue-500/40 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <Server className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  2 Níveis Ativos
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  Infraestrutura & Operações
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Gestão em dois níveis: Áreas Operacionais → Itens de Tecnologia com diferenciação entre Finalidade Técnica e Contexto Real de Aplicação.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 pt-2 border-t border-slate-800/60">
              <span>Gerenciar Infraestrutura</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Skills Card */}
          <Link
            to="/admin/competencias"
            id="admin-card-competencias"
            className="group bg-[#111113] hover:bg-[#141418] border border-slate-800/90 hover:border-blue-500/40 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Prático & Contextual
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  Competências Técnicas
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Categorias e competências baseadas estritamente em evidências práticas e contexto de uso real (sem escalas ou estrelas artificiais).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 pt-2 border-t border-slate-800/60">
              <span>Gerenciar Competências</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          {/* Projects Card */}
          <Link
            to="/admin/projetos"
            id="admin-card-projetos"
            className="group bg-[#111113] hover:bg-[#141418] border border-slate-800/90 hover:border-blue-500/40 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  CRUD & Galeria Real
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  Projetos & Cases Técnicos
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Gestão aprofundada de estudos de caso: problema, solução, arquitetura, tecnologias, contribuições de Daniel e galeria de imagens reais.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 pt-2 border-t border-slate-800/60">
              <span>Gerenciar Projetos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Metrics Card */}
          <Link
            to="/admin/metricas"
            id="admin-card-metricas"
            className="group bg-[#111113] hover:bg-[#141418] border border-slate-800/90 hover:border-blue-500/40 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Snapshots Operis Ativos
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  Métricas & Evidências Operacionais
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Gestão manual de snapshots periódicos (SLA, volumes, indicadores do ecossistema Operis) prontos para automação de jobs futura sem alteração de schema.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 pt-2 border-t border-slate-800/60">
              <span>Gerenciar Métricas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Media Card */}
          <Link
            to="/admin/media"
            id="admin-card-media"
            className="group bg-[#111113] hover:bg-[#141418] border border-slate-800/90 hover:border-blue-500/40 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Storage RLS Ativo
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  Biblioteca de Mídia & Assets
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Upload e gerenciamento de screenshots reais, diagramas e imagens no Supabase Storage com drag-and-drop e validações de tamanho (5MB).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 pt-2 border-t border-slate-800/60">
              <span>Acessar Banco de Mídia</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Roadmap Status Section */}
      <section className="bg-[#101013] border border-slate-800/80 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Status da Arquitetura do Painel Administrativo
            </h2>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
            Fases 1 a 5 Concluídas (100% dos Módulos Operacionais)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          <div className="bg-[#141418] border border-slate-800 p-3.5 rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fases 1 & 2 • Auth & Perfil</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Google OAuth, RLS no PostgreSQL e gestão de biografia, formação e composição de foco.
            </p>
          </div>

          <div className="bg-[#141418] border border-slate-800 p-3.5 rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fases 3 & 4 • Conteúdo & Mídia</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Experiências, infraestrutura em 2 níveis, competências práticas, cases de projetos e assets reais.
            </p>
          </div>

          <div className="bg-[#141418] border border-slate-800 p-3.5 rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fase 5 • Métricas Operis</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Snapshots manuais agregados com suporte futuro nativo para automação por jobs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
