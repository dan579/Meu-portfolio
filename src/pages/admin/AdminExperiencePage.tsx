import React, { useState, useEffect } from 'react';
import { useExperiences } from '../../content/ContentProvider.tsx';
import { isSupabaseConfigured, supabase } from '../../lib/supabase.ts';
import { ExperienceItem } from '../../content/types.ts';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Save,
  X,
  Layers,
  Sparkles,
  Globe,
  Building,
  MapPin,
  Calendar
} from 'lucide-react';

interface ExperienceRecord {
  id: string;
  role_pt: string;
  role_en: string;
  company: string;
  location: string;
  period_pt: string;
  period_en: string;
  is_current: boolean;
  type_pt: string;
  type_en: string;
  summary_pt: string;
  summary_en: string;
  responsibilities_pt: string[];
  responsibilities_en: string[];
  technologies: string[];
  key_achievements_pt: string[];
  key_achievements_en: string[];
  sort_order: number;
  status: 'draft' | 'published' | 'archived';
}

export const AdminExperiencePage: React.FC = () => {
  const currentExperiences = useExperiences();
  const [experiences, setExperiences] = useState<ExperienceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Edit / Modal State
  const [editingItem, setEditingItem] = useState<ExperienceRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLangTab, setModalLangTab] = useState<'pt' | 'en'>('pt');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form fields inside modal
  const [formRolePt, setFormRolePt] = useState('');
  const [formRoleEn, setFormRoleEn] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formPeriodPt, setFormPeriodPt] = useState('');
  const [formPeriodEn, setFormPeriodEn] = useState('');
  const [formIsCurrent, setFormIsCurrent] = useState(false);
  const [formTypePt, setFormTypePt] = useState('');
  const [formTypeEn, setFormTypeEn] = useState('');
  const [formSummaryPt, setFormSummaryPt] = useState('');
  const [formSummaryEn, setFormSummaryEn] = useState('');
  const [formResponsibilitiesPt, setFormResponsibilitiesPt] = useState('');
  const [formResponsibilitiesEn, setFormResponsibilitiesEn] = useState('');
  const [formTechnologies, setFormTechnologies] = useState('');
  const [formAchievementsPt, setFormAchievementsPt] = useState('');
  const [formAchievementsEn, setFormAchievementsEn] = useState('');
  const [formStatus, setFormStatus] = useState<'draft' | 'published'>('published');

  // Load experiences from Supabase or map from existing context
  const loadExperiences = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setExperiences(data as ExperienceRecord[]);
          setLoading(false);
          return;
        }
      }

      // Fallback mapping from context
      const mapped: ExperienceRecord[] = currentExperiences.map((exp, idx) => ({
        id: exp.id,
        role_pt: exp.role,
        role_en: exp.role,
        company: exp.company,
        location: exp.location,
        period_pt: exp.period,
        period_en: exp.period,
        is_current: exp.current,
        type_pt: exp.type,
        type_en: exp.type,
        summary_pt: exp.summary,
        summary_en: exp.summary,
        responsibilities_pt: exp.responsibilities,
        responsibilities_en: exp.responsibilities,
        technologies: exp.technologies,
        key_achievements_pt: exp.keyAchievements || [],
        key_achievements_en: exp.keyAchievements || [],
        sort_order: idx + 1,
        status: 'published',
      }));
      setExperiences(mapped);
    } catch (err: any) {
      console.error('Error loading experiences:', err);
      setErrorMessage(err.message || 'Erro ao carregar lista de experiências');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  // Open modal for new item
  const handleAddNew = () => {
    setEditingItem(null);
    setFormRolePt('');
    setFormRoleEn('');
    setFormCompany('');
    setFormLocation('Belo Horizonte, MG');
    setFormPeriodPt('');
    setFormPeriodEn('');
    setFormIsCurrent(false);
    setFormTypePt('Presencial • Corporativo');
    setFormTypeEn('On-site • Enterprise');
    setFormSummaryPt('');
    setFormSummaryEn('');
    setFormResponsibilitiesPt('');
    setFormResponsibilitiesEn('');
    setFormTechnologies('');
    setFormAchievementsPt('');
    setFormAchievementsEn('');
    setFormStatus('published');
    setModalLangTab('pt');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (item: ExperienceRecord) => {
    setEditingItem(item);
    setFormRolePt(item.role_pt);
    setFormRoleEn(item.role_en || item.role_pt);
    setFormCompany(item.company);
    setFormLocation(item.location);
    setFormPeriodPt(item.period_pt);
    setFormPeriodEn(item.period_en || item.period_pt);
    setFormIsCurrent(item.is_current);
    setFormTypePt(item.type_pt);
    setFormTypeEn(item.type_en || item.type_pt);
    setFormSummaryPt(item.summary_pt);
    setFormSummaryEn(item.summary_en || item.summary_pt);
    setFormResponsibilitiesPt((item.responsibilities_pt || []).join('\n'));
    setFormResponsibilitiesEn((item.responsibilities_en || item.responsibilities_pt || []).join('\n'));
    setFormTechnologies((item.technologies || []).join(', '));
    setFormAchievementsPt((item.key_achievements_pt || []).join('\n'));
    setFormAchievementsEn((item.key_achievements_en || item.key_achievements_pt || []).join('\n'));
    setFormStatus(item.status === 'draft' ? 'draft' : 'published');
    setModalLangTab('pt');
    setIsModalOpen(true);
  };

  // Quick toggle status (Draft <-> Published)
  const handleToggleStatus = async (item: ExperienceRecord) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    const updatedList = experiences.map((exp) =>
      exp.id === item.id ? { ...exp, status: newStatus as any } : exp
    );
    setExperiences(updatedList);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('experiences')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', item.id);

        if (error) throw error;
      }

      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      setSuccessMessage(
        `Status de "${item.role_pt}" alterado para ${newStatus === 'published' ? 'PUBLICADO' : 'RASCUNHO'}.`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error toggling status:', err);
      setErrorMessage(err.message || 'Falha ao atualizar status no banco');
    }
  };

  // Reorder sort_order
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === experiences.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...experiences];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Recalculate sort_order integers
    const updatedWithOrder = reordered.map((item, idx) => ({
      ...item,
      sort_order: idx + 1,
    }));
    setExperiences(updatedWithOrder);

    try {
      if (isSupabaseConfigured) {
        for (const item of updatedWithOrder) {
          await supabase
            .from('experiences')
            .update({ sort_order: item.sort_order, updated_at: new Date().toISOString() })
            .eq('id', item.id);
        }
      }

      window.dispatchEvent(new CustomEvent('cv_content_updated'));
    } catch (err: any) {
      console.error('Error updating order:', err);
      setErrorMessage('Erro ao salvar nova ordem');
    }
  };

  // Delete experience
  const handleDelete = async (id: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('experiences').delete().eq('id', id);
        if (error) throw error;
      }

      setExperiences(experiences.filter((exp) => exp.id !== id));
      setDeleteConfirmId(null);
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      setSuccessMessage('Experiência removida com sucesso.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error deleting experience:', err);
      setErrorMessage(err.message || 'Erro ao remover experiência');
    }
  };

  // Save Modal (Create / Update)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const responsibilitiesPtArray = formResponsibilitiesPt.split('\n').map((s) => s.trim()).filter(Boolean);
    const responsibilitiesEnArray = formResponsibilitiesEn.split('\n').map((s) => s.trim()).filter(Boolean);
    const achievementsPtArray = formAchievementsPt.split('\n').map((s) => s.trim()).filter(Boolean);
    const achievementsEnArray = formAchievementsEn.split('\n').map((s) => s.trim()).filter(Boolean);
    const techArray = formTechnologies.split(',').map((s) => s.trim()).filter(Boolean);

    const recordId = editingItem ? editingItem.id : `exp-${Date.now()}`;
    const sortOrder = editingItem ? editingItem.sort_order : experiences.length + 1;

    const payload: ExperienceRecord = {
      id: recordId,
      role_pt: formRolePt,
      role_en: formRoleEn || formRolePt,
      company: formCompany,
      location: formLocation,
      period_pt: formPeriodPt,
      period_en: formPeriodEn || formPeriodPt,
      is_current: formIsCurrent,
      type_pt: formTypePt,
      type_en: formTypeEn || formTypePt,
      summary_pt: formSummaryPt,
      summary_en: formSummaryEn || formSummaryPt,
      responsibilities_pt: responsibilitiesPtArray,
      responsibilities_en: responsibilitiesEnArray.length > 0 ? responsibilitiesEnArray : responsibilitiesPtArray,
      technologies: techArray,
      key_achievements_pt: achievementsPtArray,
      key_achievements_en: achievementsEnArray.length > 0 ? achievementsEnArray : achievementsPtArray,
      sort_order: sortOrder,
      status: formStatus,
    };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('experiences').upsert(
          {
            id: payload.id,
            role_pt: payload.role_pt,
            role_en: payload.role_en,
            company: payload.company,
            location: payload.location,
            period_pt: payload.period_pt,
            period_en: payload.period_en,
            is_current: payload.is_current,
            type_pt: payload.type_pt,
            type_en: payload.type_en,
            summary_pt: payload.summary_pt,
            summary_en: payload.summary_en,
            responsibilities_pt: payload.responsibilities_pt,
            responsibilities_en: payload.responsibilities_en,
            technologies: payload.technologies,
            key_achievements_pt: payload.key_achievements_pt,
            key_achievements_en: payload.key_achievements_en,
            sort_order: payload.sort_order,
            status: payload.status,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

        if (error) throw error;
      }

      if (editingItem) {
        setExperiences(experiences.map((exp) => (exp.id === recordId ? payload : exp)));
      } else {
        setExperiences([...experiences, payload]);
      }

      setIsModalOpen(false);
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      setSuccessMessage(`Experiência "${payload.role_pt}" gravada com sucesso!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error saving experience:', err);
      setErrorMessage(err.message || 'Falha ao salvar experiência no banco');
    }
  };

  return (
    <div className="space-y-8" id="admin-experiences-container">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Administração • Experiência</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Experiência Profissional (CRUD)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Adicione, edite, reordene e alterne o status de publicação (publicado / rascunho).
          </p>
        </div>

        <button
          onClick={handleAddNew}
          id="admin-add-experience-btn"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Experiência</span>
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-xs font-semibold text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-xs font-semibold text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Experiences List Table / Cards */}
      <div className="space-y-4">
        {experiences.length === 0 && !loading && (
          <div className="bg-[#111113] border border-slate-800 rounded-xl p-8 text-center space-y-3">
            <p className="text-xs text-slate-400">Nenhuma experiência cadastrada.</p>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Primeira Experiência</span>
            </button>
          </div>
        )}

        {experiences.map((exp, index) => {
          const isPublished = exp.status === 'published';
          return (
            <div
              key={exp.id}
              className={`bg-[#111113] border rounded-xl p-5 transition-all space-y-4 ${
                isPublished
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-amber-500/30 bg-[#14120D]/60'
              }`}
            >
              {/* Row Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#18181D] border border-slate-800 flex items-center justify-center text-blue-400 shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {exp.role_pt}
                      </h3>
                      {exp.is_current && (
                        <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.2 rounded">
                          Atual
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          isPublished
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                        }`}
                      >
                        {isPublished ? 'PUBLICADO' : 'RASCUNHO (Oculto)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                      <span className="text-slate-300 font-semibold">{exp.company}</span>
                      <span>•</span>
                      <span>{exp.location}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-slate-400">{exp.period_pt}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => handleToggleStatus(exp)}
                    id={`toggle-status-${exp.id}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isPublished
                        ? 'bg-[#18181D] hover:bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30'
                    }`}
                    title={isPublished ? 'Mudar para Rascunho (Ocultar do site público)' : 'Publicar no site'}
                  >
                    {isPublished ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                        <span>Rascunho</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Publicar</span>
                      </>
                    )}
                  </button>

                  {/* Move Up */}
                  <button
                    onClick={() => handleMoveOrder(index, 'up')}
                    disabled={index === 0}
                    className="p-2 rounded-lg bg-[#16161B] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Mover para Cima (Ordem)"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => handleMoveOrder(index, 'down')}
                    disabled={index === experiences.length - 1}
                    className="p-2 rounded-lg bg-[#16161B] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Mover para Baixo (Ordem)"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(exp)}
                    id={`edit-exp-${exp.id}`}
                    className="p-2 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 cursor-pointer"
                    title="Editar Experiência"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteConfirmId(exp.id)}
                    className="p-2 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 cursor-pointer"
                    title="Excluir Experiência"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Technologies summary pills */}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                  {exp.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16161B] border border-slate-800 text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Delete confirmation prompt */}
              {deleteConfirmId === exp.id && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 flex items-center justify-between gap-2 text-xs text-rose-300">
                  <span>Tem certeza que deseja excluir esta experiência?</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-xs cursor-pointer"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1 bg-[#16161B] hover:bg-slate-800 text-slate-300 rounded font-semibold text-xs cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111113] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0E0E11]">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold text-white">
                  {editingItem ? 'Editar Experiência' : 'Nova Experiência Profissional'}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {/* Modal Language Switcher */}
                <div className="flex items-center gap-1 bg-[#16161B] p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setModalLangTab('pt')}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      modalLangTab === 'pt' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalLangTab('en')}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      modalLangTab === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    EN
                  </button>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveModal} className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Cargo / Função ({modalLangTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={modalLangTab === 'pt' ? formRolePt : formRoleEn}
                    onChange={(e) =>
                      modalLangTab === 'pt' ? setFormRolePt(e.target.value) : setFormRoleEn(e.target.value)
                    }
                    placeholder="Ex: Técnico de Suporte de TI (N1)"
                    className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Empresa / Instituição
                  </label>
                  <input
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="Ex: UNIFENAS"
                    className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Belo Horizonte, MG"
                    className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Período ({modalLangTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={modalLangTab === 'pt' ? formPeriodPt : formPeriodEn}
                    onChange={(e) =>
                      modalLangTab === 'pt' ? setFormPeriodPt(e.target.value) : setFormPeriodEn(e.target.value)
                    }
                    placeholder="Ex: 2023 — Presente"
                    className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Tipo de Atuação ({modalLangTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={modalLangTab === 'pt' ? formTypePt : formTypeEn}
                    onChange={(e) =>
                      modalLangTab === 'pt' ? setFormTypePt(e.target.value) : setFormTypeEn(e.target.value)
                    }
                    placeholder="Ex: Presencial • Universitária"
                    className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Status and Current flags */}
              <div className="flex items-center gap-6 p-3 bg-[#16161B] border border-slate-800 rounded-xl">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsCurrent}
                    onChange={(e) => setFormIsCurrent(e.target.checked)}
                    className="rounded accent-blue-500"
                  />
                  <span>Posição Atual (Em atividade)</span>
                </label>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs text-slate-400">Status:</span>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="bg-[#101013] border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                  >
                    <option value="published">Publicado (Visível no site)</option>
                    <option value="draft">Rascunho (Oculto)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Resumo Geral da Atuação ({modalLangTab.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  value={modalLangTab === 'pt' ? formSummaryPt : formSummaryEn}
                  onChange={(e) =>
                    modalLangTab === 'pt' ? setFormSummaryPt(e.target.value) : setFormSummaryEn(e.target.value)
                  }
                  className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Responsabilidades & Rotinas (Uma por linha - {modalLangTab.toUpperCase()})
                </label>
                <textarea
                  rows={4}
                  value={modalLangTab === 'pt' ? formResponsibilitiesPt : formResponsibilitiesEn}
                  onChange={(e) =>
                    modalLangTab === 'pt'
                      ? setFormResponsibilitiesPt(e.target.value)
                      : setFormResponsibilitiesEn(e.target.value)
                  }
                  placeholder="Atendimento N1/N2 via GLPI...&#10;Gerenciamento de identidades no Active Directory..."
                  className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono text-[11px] leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Tecnologias & Ferramentas Utilizadas (Separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={formTechnologies}
                  onChange={(e) => setFormTechnologies(e.target.value)}
                  placeholder="Active Directory, Windows Server, Proxmox VE, GLPI, Zabbix, pfSense, MikroTik"
                  className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Conquistas & Resultados Chave (Opcional - Uma por linha - {modalLangTab.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  value={modalLangTab === 'pt' ? formAchievementsPt : formAchievementsEn}
                  onChange={(e) =>
                    modalLangTab === 'pt'
                      ? setFormAchievementsPt(e.target.value)
                      : setFormAchievementsEn(e.target.value)
                  }
                  placeholder="Redução do tempo médio de resolução de chamados em 30%..."
                  className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono text-[11px] leading-relaxed"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#16161B] hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  id="save-experience-modal-btn"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Experiência</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
