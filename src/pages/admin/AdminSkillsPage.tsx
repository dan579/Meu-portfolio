import React, { useState, useEffect } from 'react';
import { ptData } from '../../content/data/pt.ts';
import { enData } from '../../content/data/en.ts';
import { isSupabaseConfigured, supabase } from '../../lib/supabase.ts';
import {
  Sparkles,
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
  ChevronDown,
  ChevronRight,
  Terminal,
  Layers,
  Tag,
  BookOpen,
  Info
} from 'lucide-react';

interface SkillItemRecord {
  id: string;
  category_id: string;
  name: string;
  applied_context_pt: string;
  applied_context_en: string;
  category_key: 'infra' | 'systems' | 'devops' | 'tools' | 'methods';
  sort_order: number;
  status: 'draft' | 'published' | 'archived';
}

interface SkillCategoryRecord {
  id: string;
  title_pt: string;
  title_en: string;
  description_pt: string;
  description_en: string;
  sort_order: number;
  status: 'draft' | 'published' | 'archived';
}

const CATEGORY_TAG_OPTIONS: {
  key: 'infra' | 'systems' | 'devops' | 'tools' | 'methods';
  label: string;
  badgeClass: string;
}[] = [
  {
    key: 'infra',
    label: 'Infraestrutura & Redes (infra)',
    badgeClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    key: 'systems',
    label: 'Sistemas & Software (systems)',
    badgeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    key: 'devops',
    label: 'DevOps & Automação (devops)',
    badgeClass: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  {
    key: 'tools',
    label: 'Ferramentas & Utilitários (tools)',
    badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    key: 'methods',
    label: 'Processos & ITIL (methods)',
    badgeClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
];

export const AdminSkillsPage: React.FC = () => {
  const [categories, setCategories] = useState<SkillCategoryRecord[]>([]);
  const [skills, setSkills] = useState<SkillItemRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedCatIds, setExpandedCatIds] = useState<Record<string, boolean>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SkillCategoryRecord | null>(null);
  const [catModalLang, setCatModalLang] = useState<'pt' | 'en'>('pt');
  const [catTitlePt, setCatTitlePt] = useState('');
  const [catTitleEn, setCatTitleEn] = useState('');
  const [catDescPt, setCatDescPt] = useState('');
  const [catDescEn, setCatDescEn] = useState('');
  const [catStatus, setCatStatus] = useState<'draft' | 'published'>('published');

  // Skill Item Modal State
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItemRecord | null>(null);
  const [skillTargetCatId, setSkillTargetCatId] = useState<string>('');
  const [skillModalLang, setSkillModalLang] = useState<'pt' | 'en'>('pt');
  const [skillName, setSkillName] = useState('');
  const [skillAppliedContextPt, setSkillAppliedContextPt] = useState('');
  const [skillAppliedContextEn, setSkillAppliedContextEn] = useState('');
  const [skillCategoryKey, setSkillCategoryKey] = useState<'infra' | 'systems' | 'devops' | 'tools' | 'methods'>('infra');
  const [skillStatus, setSkillStatus] = useState<'draft' | 'published'>('published');

  // Delete Confirm State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'category' | 'skill';
    id: string;
    name: string;
  } | null>(null);

  // Load skill categories and items
  const loadSkillsData = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const [catsRes, itemsRes] = await Promise.all([
          supabase
            .from('skill_categories')
            .select('*')
            .order('sort_order', { ascending: true }),
          supabase
            .from('skill_items')
            .select('*')
            .order('sort_order', { ascending: true }),
        ]);

        if (catsRes.error) throw catsRes.error;
        if (itemsRes.error) throw itemsRes.error;

        if (catsRes.data && catsRes.data.length > 0) {
          setCategories(catsRes.data as SkillCategoryRecord[]);
          setSkills((itemsRes.data as SkillItemRecord[]) || []);

          const initialExpanded: Record<string, boolean> = {};
          catsRes.data.forEach((c: any) => {
            initialExpanded[c.id] = true;
          });
          setExpandedCatIds(initialExpanded);
          setLoading(false);
          return;
        }
      }

      // Fallback from static datasets
      const mappedCats: SkillCategoryRecord[] = ptData.skillCategories.map((cat, cIdx) => {
        const enMatch = enData.skillCategories.find((ec) => ec.id === cat.id);
        return {
          id: cat.id,
          title_pt: cat.title,
          title_en: enMatch ? enMatch.title : cat.title,
          description_pt: cat.description,
          description_en: enMatch ? enMatch.description : cat.description,
          sort_order: cIdx + 1,
          status: 'published',
        };
      });

      const mappedSkills: SkillItemRecord[] = [];
      ptData.skillCategories.forEach((cat) => {
        const enMatchCat = enData.skillCategories.find((ec) => ec.id === cat.id);
        cat.skills.forEach((skill, sIdx) => {
          const enMatchSkill = enMatchCat?.skills.find((es) => es.name === skill.name);
          mappedSkills.push({
            id: `skill-${cat.id}-${sIdx + 1}`,
            category_id: cat.id,
            name: skill.name,
            applied_context_pt: skill.appliedContext,
            applied_context_en: enMatchSkill ? enMatchSkill.appliedContext : skill.appliedContext,
            category_key: skill.category,
            sort_order: sIdx + 1,
            status: 'published',
          });
        });
      });

      setCategories(mappedCats);
      setSkills(mappedSkills);

      const initialExpanded: Record<string, boolean> = {};
      mappedCats.forEach((c) => {
        initialExpanded[c.id] = true;
      });
      setExpandedCatIds(initialExpanded);
    } catch (err: any) {
      console.error('Error loading skills data:', err);
      setErrorMessage(err.message || 'Erro ao carregar competências');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkillsData();
  }, []);

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCatIds((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // -------------------------------------------------------------
  // CATEGORY CRUD & HANDLERS
  // -------------------------------------------------------------
  const handleOpenNewCategoryModal = () => {
    setEditingCategory(null);
    setCatTitlePt('');
    setCatTitleEn('');
    setCatDescPt('');
    setCatDescEn('');
    setCatStatus('published');
    setCatModalLang('pt');
    setIsCatModalOpen(true);
  };

  const handleEditCategory = (category: SkillCategoryRecord) => {
    setEditingCategory(category);
    setCatTitlePt(category.title_pt);
    setCatTitleEn(category.title_en || category.title_pt);
    setCatDescPt(category.description_pt);
    setCatDescEn(category.description_en || category.description_pt);
    setCatStatus(category.status === 'draft' ? 'draft' : 'published');
    setCatModalLang('pt');
    setIsCatModalOpen(true);
  };

  const handleToggleCategoryStatus = async (cat: SkillCategoryRecord) => {
    const newStatus = cat.status === 'published' ? 'draft' : 'published';
    const updated = categories.map((c) =>
      c.id === cat.id ? { ...c, status: newStatus as any } : c
    );
    setCategories(updated);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('skill_categories')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', cat.id);

        if (error) throw error;
      }

      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      setSuccessMessage(
        `Categoria "${cat.title_pt}" alterada para ${newStatus === 'published' ? 'PUBLICADA' : 'RASCUNHO (Oculta)'}.`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error toggling category status:', err);
      setErrorMessage(err.message || 'Falha ao atualizar status da categoria');
    }
  };

  const handleMoveCategoryOrder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === categories.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...categories];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const updatedWithOrder = reordered.map((item, idx) => ({
      ...item,
      sort_order: idx + 1,
    }));
    setCategories(updatedWithOrder);

    try {
      if (isSupabaseConfigured) {
        for (const item of updatedWithOrder) {
          await supabase
            .from('skill_categories')
            .update({ sort_order: item.sort_order, updated_at: new Date().toISOString() })
            .eq('id', item.id);
        }
      }
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
    } catch (err: any) {
      console.error('Error updating category order:', err);
      setErrorMessage('Erro ao salvar nova ordem das categorias');
    }
  };

  const handleSaveCategoryModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const recordId = editingCategory
      ? editingCategory.id
      : `skill-cat-${catTitlePt.toLowerCase().replace(/[^a-z0-9]/g, '-') || Date.now()}`;
    const sortOrder = editingCategory ? editingCategory.sort_order : categories.length + 1;

    const payload: SkillCategoryRecord = {
      id: recordId,
      title_pt: catTitlePt,
      title_en: catTitleEn || catTitlePt,
      description_pt: catDescPt,
      description_en: catDescEn || catDescPt,
      sort_order: sortOrder,
      status: catStatus,
    };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('skill_categories').upsert(
          {
            id: payload.id,
            title_pt: payload.title_pt,
            title_en: payload.title_en,
            description_pt: payload.description_pt,
            description_en: payload.description_en,
            sort_order: payload.sort_order,
            status: payload.status,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

        if (error) throw error;
      }

      if (editingCategory) {
        setCategories(categories.map((c) => (c.id === recordId ? payload : c)));
      } else {
        setCategories([...categories, payload]);
        setExpandedCatIds((prev) => ({ ...prev, [recordId]: true }));
      }

      setIsCatModalOpen(false);
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      setSuccessMessage(`Categoria "${payload.title_pt}" salva com sucesso!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error saving category:', err);
      setErrorMessage(err.message || 'Falha ao salvar categoria no banco');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('skill_categories').delete().eq('id', id);
        if (error) throw error;
      }

      setCategories(categories.filter((c) => c.id !== id));
      setSkills(skills.filter((s) => s.category_id !== id));
      setDeleteConfirm(null);
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      setSuccessMessage('Categoria e todas as competências associadas foram removidas.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error deleting category:', err);
      setErrorMessage(err.message || 'Erro ao remover categoria');
    }
  };

  // -------------------------------------------------------------
  // SKILL ITEM CRUD & HANDLERS
  // -------------------------------------------------------------
  const handleOpenNewSkillModal = (catId: string) => {
    setEditingSkill(null);
    setSkillTargetCatId(catId);
    setSkillName('');
    setSkillAppliedContextPt('');
    setSkillAppliedContextEn('');
    setSkillCategoryKey('infra');
    setSkillStatus('published');
    setSkillModalLang('pt');
    setIsSkillModalOpen(true);
  };

  const handleEditSkill = (item: SkillItemRecord) => {
    setEditingSkill(item);
    setSkillTargetCatId(item.category_id);
    setSkillName(item.name);
    setSkillAppliedContextPt(item.applied_context_pt);
    setSkillAppliedContextEn(item.applied_context_en || item.applied_context_pt);
    setSkillCategoryKey(item.category_key || 'infra');
    setSkillStatus(item.status === 'draft' ? 'draft' : 'published');
    setSkillModalLang('pt');
    setIsSkillModalOpen(true);
  };

  const handleToggleSkillStatus = async (item: SkillItemRecord) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    const updated = skills.map((s) =>
      s.id === item.id ? { ...s, status: newStatus as any } : s
    );
    setSkills(updated);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('skill_items')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', item.id);

        if (error) throw error;
      }

      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      setSuccessMessage(
        `Competência "${item.name}" alterada para ${newStatus === 'published' ? 'PUBLICADA' : 'RASCUNHO'}.`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error toggling skill status:', err);
      setErrorMessage(err.message || 'Falha ao atualizar status da competência');
    }
  };

  const handleMoveSkillOrder = async (catId: string, itemIndex: number, direction: 'up' | 'down') => {
    const catSkills = skills.filter((s) => s.category_id === catId);
    if (direction === 'up' && itemIndex === 0) return;
    if (direction === 'down' && itemIndex === catSkills.length - 1) return;

    const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    const reorderedCatSkills = [...catSkills];
    const temp = reorderedCatSkills[itemIndex];
    reorderedCatSkills[itemIndex] = reorderedCatSkills[targetIndex];
    reorderedCatSkills[targetIndex] = temp;

    const updatedCatSkills = reorderedCatSkills.map((item, idx) => ({
      ...item,
      sort_order: idx + 1,
    }));

    const otherSkills = skills.filter((s) => s.category_id !== catId);
    setSkills([...otherSkills, ...updatedCatSkills]);

    try {
      if (isSupabaseConfigured) {
        for (const item of updatedCatSkills) {
          await supabase
            .from('skill_items')
            .update({ sort_order: item.sort_order, updated_at: new Date().toISOString() })
            .eq('id', item.id);
        }
      }
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
    } catch (err: any) {
      console.error('Error updating skill order:', err);
      setErrorMessage('Erro ao salvar nova ordem das competências');
    }
  };

  const handleSaveSkillModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const catSkills = skills.filter((s) => s.category_id === skillTargetCatId);
    // Use existing ID or random UUID / timestamp
    const recordId = editingSkill
      ? editingSkill.id
      : (typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `skill-${Date.now()}`);
    const sortOrder = editingSkill ? editingSkill.sort_order : catSkills.length + 1;

    const payload: SkillItemRecord = {
      id: recordId,
      category_id: skillTargetCatId,
      name: skillName,
      applied_context_pt: skillAppliedContextPt,
      applied_context_en: skillAppliedContextEn || skillAppliedContextPt,
      category_key: skillCategoryKey,
      sort_order: sortOrder,
      status: skillStatus,
    };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('skill_items').upsert(
          {
            id: payload.id,
            category_id: payload.category_id,
            name: payload.name,
            applied_context_pt: payload.applied_context_pt,
            applied_context_en: payload.applied_context_en,
            category_key: payload.category_key,
            sort_order: payload.sort_order,
            status: payload.status,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

        if (error) throw error;
      }

      if (editingSkill) {
        setSkills(skills.map((s) => (s.id === recordId ? payload : s)));
      } else {
        setSkills([...skills, payload]);
      }

      setIsSkillModalOpen(false);
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      setSuccessMessage(`Competência "${payload.name}" salva com sucesso!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error saving skill item:', err);
      setErrorMessage(err.message || 'Falha ao salvar competência no banco');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('skill_items').delete().eq('id', id);
        if (error) throw error;
      }

      setSkills(skills.filter((s) => s.id !== id));
      setDeleteConfirm(null);
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      setSuccessMessage('Competência removida com sucesso.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error deleting skill item:', err);
      setErrorMessage(err.message || 'Erro ao remover competência');
    }
  };

  const getCategoryTagBadge = (key: string) => {
    const found = CATEGORY_TAG_OPTIONS.find((c) => c.key === key);
    return found || CATEGORY_TAG_OPTIONS[0];
  };

  return (
    <div className="space-y-8" id="admin-skills-container">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Administração • Competências Técnicas</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Gestão de Categorias & Competências
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Estrutura hierárquica baseada em evidências práticas e contexto real de aplicação (sem ratings ou porcentagens arbitrárias).
          </p>
        </div>

        <button
          onClick={handleOpenNewCategoryModal}
          id="admin-add-skill-category-btn"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Philosophy banner */}
      <div className="bg-[#121216] border border-blue-500/20 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white">Diretriz Técnica de Competências:</span>
          <p className="text-slate-400 leading-relaxed">
            As competências refletem vivência profissional autêntica demonstrada por <strong>Contexto Real de Aplicação</strong>. Não há notas, estrelas ou barras de 1 a 5 — o valor de cada competência está na descrição clara de onde e como ela foi empregada.
          </p>
        </div>
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

      {/* Categories List */}
      <div className="space-y-6">
        {categories.length === 0 && !loading && (
          <div className="bg-[#111113] border border-slate-800 rounded-xl p-8 text-center space-y-3">
            <p className="text-xs text-slate-400">Nenhuma categoria de competência cadastrada.</p>
            <button
              onClick={handleOpenNewCategoryModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Primeira Categoria</span>
            </button>
          </div>
        )}

        {categories.map((category, catIdx) => {
          const isCatPublished = category.status === 'published';
          const catSkills = skills
            .filter((s) => s.category_id === category.id)
            .sort((a, b) => a.sort_order - b.sort_order);
          const isExpanded = !!expandedCatIds[category.id];

          return (
            <div
              key={category.id}
              className={`bg-[#111113] border rounded-xl overflow-hidden transition-all ${
                isCatPublished
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-amber-500/30 bg-[#14120D]/60'
              }`}
            >
              {/* Category Header Row */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 bg-[#141418]">
                <div className="flex items-start sm:items-center gap-3">
                  <button
                    onClick={() => toggleCategoryExpand(category.id)}
                    className="p-1.5 rounded-lg bg-[#18181D] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white cursor-pointer mt-0.5 sm:mt-0"
                    title={isExpanded ? 'Colapsar Categoria' : 'Expandir Categoria'}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-blue-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {category.title_pt}
                      </h3>
                      <span className="text-xs text-slate-400 font-normal">
                        ({category.title_en})
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          isCatPublished
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                        }`}
                      >
                        {isCatPublished ? 'CATEGORIA PUBLICADA' : 'CATEGORIA EM RASCUNHO'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {category.description_pt}
                    </p>
                  </div>
                </div>

                {/* Category Actions Toolbar */}
                <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleCategoryStatus(category)}
                    id={`toggle-cat-status-${category.id}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isCatPublished
                        ? 'bg-[#18181D] hover:bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30'
                    }`}
                    title={isCatPublished ? 'Mudar categoria para Rascunho' : 'Publicar categoria no site'}
                  >
                    {isCatPublished ? (
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

                  {/* Add Skill */}
                  <button
                    onClick={() => handleOpenNewSkillModal(category.id)}
                    id={`add-skill-to-cat-${category.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                    title="Adicionar Competência nesta Categoria"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nova Competência</span>
                  </button>

                  {/* Move Up */}
                  <button
                    onClick={() => handleMoveCategoryOrder(catIdx, 'up')}
                    disabled={catIdx === 0}
                    className="p-2 rounded-lg bg-[#18181D] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Mover Categoria para Cima"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => handleMoveCategoryOrder(catIdx, 'down')}
                    disabled={catIdx === categories.length - 1}
                    className="p-2 rounded-lg bg-[#18181D] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Mover Categoria para Baixo"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit Category */}
                  <button
                    onClick={() => handleEditCategory(category)}
                    id={`edit-cat-${category.id}`}
                    className="p-2 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 cursor-pointer"
                    title="Editar Categoria"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Category */}
                  <button
                    onClick={() =>
                      setDeleteConfirm({
                        type: 'category',
                        id: category.id,
                        name: category.title_pt,
                      })
                    }
                    className="p-2 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 cursor-pointer"
                    title="Excluir Categoria"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Skills List (Accordion Content) */}
              {isExpanded && (
                <div className="p-5 space-y-4 bg-[#0E0E11]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Competências Registradas ({catSkills.length})
                    </span>
                    {catSkills.length === 0 && (
                      <span className="text-xs text-slate-400 italic">
                        Nenhuma competência cadastrada nesta categoria ainda.
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {catSkills.map((skill, sIdx) => {
                      const isSkillPublished = skill.status === 'published';
                      const badgeInfo = getCategoryTagBadge(skill.category_key);

                      return (
                        <div
                          key={skill.id}
                          className={`bg-[#151519] border rounded-lg p-4 space-y-2.5 flex flex-col justify-between transition-all ${
                            isSkillPublished
                              ? 'border-slate-800/80 hover:border-slate-700/80'
                              : 'border-amber-500/20 bg-[#161410]/50'
                          }`}
                        >
                          <div className="space-y-2">
                            {/* Skill Header */}
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-sm font-bold text-white tracking-tight">
                                  {skill.name}
                                </h4>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  <span
                                    className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded border ${badgeInfo.badgeClass}`}
                                  >
                                    {skill.category_key}
                                  </span>
                                  <span
                                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                      isSkillPublished
                                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                        : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                    }`}
                                  >
                                    {isSkillPublished ? 'PUB' : 'DRAFT'}
                                  </span>
                                </div>
                              </div>

                              {/* Action buttons */}
                              <div className="flex items-center gap-1 shrink-0">
                                {/* Toggle Status */}
                                <button
                                  onClick={() => handleToggleSkillStatus(skill)}
                                  className={`p-1 rounded border cursor-pointer ${
                                    isSkillPublished
                                      ? 'text-slate-400 hover:text-amber-400 border-slate-800 bg-[#18181D]'
                                      : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                                  }`}
                                  title={isSkillPublished ? 'Ocultar do site' : 'Publicar no site'}
                                >
                                  {isSkillPublished ? (
                                    <EyeOff className="w-3 h-3" />
                                  ) : (
                                    <Eye className="w-3 h-3" />
                                  )}
                                </button>

                                {/* Move Up */}
                                <button
                                  onClick={() => handleMoveSkillOrder(category.id, sIdx, 'up')}
                                  disabled={sIdx === 0}
                                  className="p-1 rounded bg-[#18181D] border border-slate-800 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                  title="Mover para Cima"
                                >
                                  <MoveUp className="w-3 h-3" />
                                </button>

                                {/* Move Down */}
                                <button
                                  onClick={() => handleMoveSkillOrder(category.id, sIdx, 'down')}
                                  disabled={sIdx === catSkills.length - 1}
                                  className="p-1 rounded bg-[#18181D] border border-slate-800 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                  title="Mover para Baixo"
                                >
                                  <MoveDown className="w-3 h-3" />
                                </button>

                                {/* Edit */}
                                <button
                                  onClick={() => handleEditSkill(skill)}
                                  className="p-1 rounded bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 cursor-pointer"
                                  title="Editar Competência"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>

                                {/* Delete */}
                                <button
                                  onClick={() =>
                                    setDeleteConfirm({
                                      type: 'skill',
                                      id: skill.id,
                                      name: skill.name,
                                    })
                                  }
                                  className="p-1 rounded bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/30 text-rose-400 cursor-pointer"
                                  title="Excluir Competência"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Applied Context */}
                            <div className="bg-[#101013] border border-slate-800/60 p-2.5 rounded-md">
                              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                                Contexto Real de Uso:
                              </span>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {skill.applied_context_pt}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-rose-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Confirmar Exclusão</h3>
                <p className="text-xs text-slate-400">
                  {deleteConfirm.type === 'category'
                    ? 'A categoria e todas as competências associadas serão removidas.'
                    : 'A competência selecionada será excluída permanentemente.'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-[#0F0F12] border border-slate-800 p-3 rounded-lg font-mono">
              Item: <strong>{deleteConfirm.name}</strong>
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg bg-[#1A1A22] hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() =>
                  deleteConfirm.type === 'category'
                    ? handleDeleteCategory(deleteConfirm.id)
                    : handleDeleteSkill(deleteConfirm.id)
                }
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Confirmar e Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL (CREATE / EDIT) */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111113] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0E0E11]">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold text-white">
                  {editingCategory ? 'Editar Categoria de Competências' : 'Nova Categoria de Competências'}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-[#16161B] p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCatModalLang('pt')}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      catModalLang === 'pt' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    type="button"
                    onClick={() => setCatModalLang('en')}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      catModalLang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    EN
                  </button>
                </div>

                <button
                  onClick={() => setIsCatModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCategoryModal} className="p-6 space-y-5 overflow-y-auto flex-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Título da Categoria ({catModalLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={catModalLang === 'pt' ? catTitlePt : catTitleEn}
                  onChange={(e) =>
                    catModalLang === 'pt' ? setCatTitlePt(e.target.value) : setCatTitleEn(e.target.value)
                  }
                  placeholder="Ex: Infraestrutura & Redes"
                  className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Descrição da Categoria ({catModalLang.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  value={catModalLang === 'pt' ? catDescPt : catDescEn}
                  onChange={(e) =>
                    catModalLang === 'pt' ? setCatDescPt(e.target.value) : setCatDescEn(e.target.value)
                  }
                  placeholder="Ex: Competências práticas aplicadas no gerenciamento de redes, servidores e segurança."
                  className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none leading-relaxed"
                  required
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-3 bg-[#16161B] border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-300 font-semibold">Status de Publicação da Categoria:</span>
                <select
                  value={catStatus}
                  onChange={(e) => setCatStatus(e.target.value as any)}
                  className="bg-[#101013] border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="published">Publicado (Visível no site)</option>
                  <option value="draft">Rascunho (Oculto)</option>
                </select>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#16161B] hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="save-cat-modal-btn"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Categoria</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SKILL ITEM MODAL (CREATE / EDIT) */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111113] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0E0E11]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold text-white">
                  {editingSkill ? 'Editar Competência' : 'Nova Competência'}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-[#16161B] p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSkillModalLang('pt')}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      skillModalLang === 'pt' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    type="button"
                    onClick={() => setSkillModalLang('en')}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      skillModalLang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    EN
                  </button>
                </div>

                <button
                  onClick={() => setIsSkillModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSkillModal} className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Nome da Competência
                  </label>
                  <input
                    type="text"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    placeholder="Ex: Active Directory / GPO, pfSense, TypeScript"
                    className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Tag de Categoria Técnica
                  </label>
                  <select
                    value={skillCategoryKey}
                    onChange={(e) => setSkillCategoryKey(e.target.value as any)}
                    className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    {CATEGORY_TAG_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* APPLIED CONTEXT (Free text only - NO numbers/ratings) */}
              <div className="bg-[#15151A] border border-slate-700/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <label className="text-xs font-bold uppercase tracking-wide">
                    Contexto Real de Aplicação — Applied Context ({skillModalLang.toUpperCase()})
                  </label>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Descreva objetivamente em que cenário real de projeto ou infraestrutura você aplicou essa habilidade (sem notas ou escalas falsas).
                </p>
                <textarea
                  rows={3}
                  value={skillModalLang === 'pt' ? skillAppliedContextPt : skillAppliedContextEn}
                  onChange={(e) =>
                    skillModalLang === 'pt'
                      ? setSkillAppliedContextPt(e.target.value)
                      : setSkillAppliedContextEn(e.target.value)
                  }
                  placeholder="Ex: Implementação de regras de grupo para padronização de segurança em +300 computadores."
                  className="w-full bg-[#101013] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none leading-relaxed"
                  required
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-3 bg-[#16161B] border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-300 font-semibold">Status da Competência:</span>
                <select
                  value={skillStatus}
                  onChange={(e) => setSkillStatus(e.target.value as any)}
                  className="bg-[#101013] border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="published">Publicado (Visível no site)</option>
                  <option value="draft">Rascunho (Oculto)</option>
                </select>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#16161B] hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="save-skill-modal-btn"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Competência</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
