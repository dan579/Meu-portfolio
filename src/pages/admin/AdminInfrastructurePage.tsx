import React, { useState, useEffect } from 'react';
import { useInfrastructure } from '../../content/ContentProvider.tsx';
import { ptData } from '../../content/data/pt.ts';
import { enData } from '../../content/data/en.ts';
import { isSupabaseConfigured, supabase } from '../../lib/supabase.ts';
import {
  Server,
  Network,
  Activity,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  HardDrive,
  Terminal,
  Cloud,
  Lock,
  Wifi,
  Radio,
  Boxes,
  Settings,
  HelpCircle,
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
  Sparkles,
  Tag
} from 'lucide-react';

interface InfraTechRecord {
  id: string;
  area_id: string;
  technology: string;
  purpose_pt: string;
  purpose_en: string;
  applied_context_pt: string;
  applied_context_en: string;
  tags: string[];
  sort_order: number;
  status: 'draft' | 'published' | 'archived';
}

interface InfraAreaRecord {
  id: string;
  area_name_pt: string;
  area_name_en: string;
  icon_name: string;
  description_pt: string;
  description_en: string;
  sort_order: number;
  status: 'draft' | 'published' | 'archived';
}

const AVAILABLE_ICONS = [
  { name: 'Server', label: 'Servidor', icon: Server },
  { name: 'Network', label: 'Redes', icon: Network },
  { name: 'Activity', label: 'Monitoramento', icon: Activity },
  { name: 'ShieldCheck', label: 'Segurança', icon: ShieldCheck },
  { name: 'Cpu', label: 'Processamento', icon: Cpu },
  { name: 'Layers', label: 'Camadas', icon: Layers },
  { name: 'Database', label: 'Banco de Dados', icon: Database },
  { name: 'HardDrive', label: 'Storage', icon: HardDrive },
  { name: 'Terminal', label: 'Terminal / CLI', icon: Terminal },
  { name: 'Cloud', label: 'Cloud / Nuvem', icon: Cloud },
  { name: 'Lock', label: 'Acesso / Auth', icon: Lock },
  { name: 'Wifi', label: 'Sem Fio / Wi-Fi', icon: Wifi },
  { name: 'Radio', label: 'RF / Rádio', icon: Radio },
  { name: 'Boxes', label: 'Containers', icon: Boxes },
  { name: 'Settings', label: 'Operações', icon: Settings },
];

export const AdminInfrastructurePage: React.FC = () => {
  const [areas, setAreas] = useState<InfraAreaRecord[]>([]);
  const [techItems, setTechItems] = useState<InfraTechRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedAreaIds, setExpandedAreaIds] = useState<Record<string, boolean>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Area Modal State
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<InfraAreaRecord | null>(null);
  const [areaModalLang, setAreaModalLang] = useState<'pt' | 'en'>('pt');
  const [areaNamePt, setAreaNamePt] = useState('');
  const [areaNameEn, setAreaNameEn] = useState('');
  const [areaIconName, setAreaIconName] = useState('Server');
  const [areaDescPt, setAreaDescPt] = useState('');
  const [areaDescEn, setAreaDescEn] = useState('');
  const [areaStatus, setAreaStatus] = useState<'draft' | 'published'>('published');

  // Tech Item Modal State
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<InfraTechRecord | null>(null);
  const [techTargetAreaId, setTechTargetAreaId] = useState<string>('');
  const [techModalLang, setTechModalLang] = useState<'pt' | 'en'>('pt');
  const [techName, setTechName] = useState('');
  const [techPurposePt, setTechPurposePt] = useState('');
  const [techPurposeEn, setTechPurposeEn] = useState('');
  const [techAppliedContextPt, setTechAppliedContextPt] = useState('');
  const [techAppliedContextEn, setTechAppliedContextEn] = useState('');
  const [techTags, setTechTags] = useState('');
  const [techStatus, setTechStatus] = useState<'draft' | 'published'>('published');

  // Delete Confirm State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'area' | 'tech';
    id: string;
    name: string;
  } | null>(null);

  // Helper to render icon by name
  const renderIcon = (iconName: string, className = 'w-4 h-4') => {
    const found = AVAILABLE_ICONS.find((i) => i.name === iconName);
    const IconComp = found ? found.icon : Server;
    return <IconComp className={className} />;
  };

  // Load infrastructure areas and tech items
  const loadInfrastructure = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const [areasRes, itemsRes] = await Promise.all([
          supabase
            .from('infrastructure_areas')
            .select('*')
            .order('sort_order', { ascending: true }),
          supabase
            .from('infrastructure_tech_items')
            .select('*')
            .order('sort_order', { ascending: true }),
        ]);

        if (areasRes.error) throw areasRes.error;
        if (itemsRes.error) throw itemsRes.error;

        if (areasRes.data && areasRes.data.length > 0) {
          setAreas(areasRes.data as InfraAreaRecord[]);
          setTechItems((itemsRes.data as InfraTechRecord[]) || []);
          // Expand all by default
          const initialExpanded: Record<string, boolean> = {};
          areasRes.data.forEach((a: any) => {
            initialExpanded[a.id] = true;
          });
          setExpandedAreaIds(initialExpanded);
          setLoading(false);
          return;
        }
      }

      // Fallback from static seed datasets (PT & EN)
      const mappedAreas: InfraAreaRecord[] = ptData.infrastructureAreas.map((area, aIdx) => {
        const enMatch = enData.infrastructureAreas.find((ea) => ea.id === area.id);
        return {
          id: area.id,
          area_name_pt: area.areaName,
          area_name_en: enMatch ? enMatch.areaName : area.areaName,
          icon_name: area.iconName,
          description_pt: area.description,
          description_en: enMatch ? enMatch.description : area.description,
          sort_order: aIdx + 1,
          status: 'published',
        };
      });

      const mappedItems: InfraTechRecord[] = [];
      ptData.infrastructureAreas.forEach((area) => {
        const enMatchArea = enData.infrastructureAreas.find((ea) => ea.id === area.id);
        area.items.forEach((item, iIdx) => {
          const enMatchItem = enMatchArea?.items.find((ei) => ei.id === item.id);
          mappedItems.push({
            id: item.id,
            area_id: area.id,
            technology: item.technology,
            purpose_pt: item.purpose,
            purpose_en: enMatchItem ? enMatchItem.purpose : item.purpose,
            applied_context_pt: item.appliedContext,
            applied_context_en: enMatchItem ? enMatchItem.appliedContext : item.appliedContext,
            tags: item.tags,
            sort_order: iIdx + 1,
            status: 'published',
          });
        });
      });

      setAreas(mappedAreas);
      setTechItems(mappedItems);

      const initialExpanded: Record<string, boolean> = {};
      mappedAreas.forEach((a) => {
        initialExpanded[a.id] = true;
      });
      setExpandedAreaIds(initialExpanded);
    } catch (err: any) {
      console.error('Error loading infrastructure data:', err);
      setErrorMessage(err.message || 'Erro ao carregar dados de infraestrutura');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInfrastructure();
  }, []);

  const toggleAreaExpand = (areaId: string) => {
    setExpandedAreaIds((prev) => ({
      ...prev,
      [areaId]: !prev[areaId],
    }));
  };

  // -------------------------------------------------------------
  // AREA CRUD & HANDLERS
  // -------------------------------------------------------------
  const handleOpenNewAreaModal = () => {
    setEditingArea(null);
    setAreaNamePt('');
    setAreaNameEn('');
    setAreaIconName('Server');
    setAreaDescPt('');
    setAreaDescEn('');
    setAreaStatus('published');
    setAreaModalLang('pt');
    setIsAreaModalOpen(true);
  };

  const handleEditArea = (area: InfraAreaRecord) => {
    setEditingArea(area);
    setAreaNamePt(area.area_name_pt);
    setAreaNameEn(area.area_name_en || area.area_name_pt);
    setAreaIconName(area.icon_name || 'Server');
    setAreaDescPt(area.description_pt);
    setAreaDescEn(area.description_en || area.description_pt);
    setAreaStatus(area.status === 'draft' ? 'draft' : 'published');
    setAreaModalLang('pt');
    setIsAreaModalOpen(true);
  };

  const handleToggleAreaStatus = async (area: InfraAreaRecord) => {
    const newStatus = area.status === 'published' ? 'draft' : 'published';
    const updatedAreas = areas.map((a) =>
      a.id === area.id ? { ...a, status: newStatus as any } : a
    );
    setAreas(updatedAreas);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('infrastructure_areas')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', area.id);

        if (error) throw error;
      }

      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      setSuccessMessage(
        `Área "${area.area_name_pt}" alterada para ${newStatus === 'published' ? 'PUBLICADO' : 'RASCUNHO (Oculto)'}.`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error toggling area status:', err);
      setErrorMessage(err.message || 'Falha ao atualizar status da área');
    }
  };

  const handleMoveAreaOrder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === areas.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...areas];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const updatedWithOrder = reordered.map((item, idx) => ({
      ...item,
      sort_order: idx + 1,
    }));
    setAreas(updatedWithOrder);

    try {
      if (isSupabaseConfigured) {
        for (const item of updatedWithOrder) {
          await supabase
            .from('infrastructure_areas')
            .update({ sort_order: item.sort_order, updated_at: new Date().toISOString() })
            .eq('id', item.id);
        }
      }
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
    } catch (err: any) {
      console.error('Error updating area order:', err);
      setErrorMessage('Erro ao salvar nova ordem das áreas');
    }
  };

  const handleSaveAreaModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const recordId = editingArea
      ? editingArea.id
      : `infra-${areaNamePt.toLowerCase().replace(/[^a-z0-9]/g, '-') || Date.now()}`;
    const sortOrder = editingArea ? editingArea.sort_order : areas.length + 1;

    const payload: InfraAreaRecord = {
      id: recordId,
      area_name_pt: areaNamePt,
      area_name_en: areaNameEn || areaNamePt,
      icon_name: areaIconName,
      description_pt: areaDescPt,
      description_en: areaDescEn || areaDescPt,
      sort_order: sortOrder,
      status: areaStatus,
    };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('infrastructure_areas').upsert(
          {
            id: payload.id,
            area_name_pt: payload.area_name_pt,
            area_name_en: payload.area_name_en,
            icon_name: payload.icon_name,
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

      if (editingArea) {
        setAreas(areas.map((a) => (a.id === recordId ? payload : a)));
      } else {
        setAreas([...areas, payload]);
        setExpandedAreaIds((prev) => ({ ...prev, [recordId]: true }));
      }

      setIsAreaModalOpen(false);
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      setSuccessMessage(`Área "${payload.area_name_pt}" salva com sucesso!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error saving area:', err);
      setErrorMessage(err.message || 'Falha ao salvar área no banco');
    }
  };

  const handleDeleteArea = async (id: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('infrastructure_areas').delete().eq('id', id);
        if (error) throw error;
      }

      setAreas(areas.filter((a) => a.id !== id));
      setTechItems(techItems.filter((t) => t.area_id !== id));
      setDeleteConfirm(null);
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      setSuccessMessage('Área de infraestrutura e itens vinculados foram removidos.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error deleting area:', err);
      setErrorMessage(err.message || 'Erro ao remover área');
    }
  };

  // -------------------------------------------------------------
  // TECH ITEM CRUD & HANDLERS
  // -------------------------------------------------------------
  const handleOpenNewTechModal = (areaId: string) => {
    setEditingTech(null);
    setTechTargetAreaId(areaId);
    setTechName('');
    setTechPurposePt('');
    setTechPurposeEn('');
    setTechAppliedContextPt('');
    setTechAppliedContextEn('');
    setTechTags('');
    setTechStatus('published');
    setTechModalLang('pt');
    setIsTechModalOpen(true);
  };

  const handleEditTech = (item: InfraTechRecord) => {
    setEditingTech(item);
    setTechTargetAreaId(item.area_id);
    setTechName(item.technology);
    setTechPurposePt(item.purpose_pt);
    setTechPurposeEn(item.purpose_en || item.purpose_pt);
    setTechAppliedContextPt(item.applied_context_pt);
    setTechAppliedContextEn(item.applied_context_en || item.applied_context_pt);
    setTechTags((item.tags || []).join(', '));
    setTechStatus(item.status === 'draft' ? 'draft' : 'published');
    setTechModalLang('pt');
    setIsTechModalOpen(true);
  };

  const handleToggleTechStatus = async (item: InfraTechRecord) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    const updated = techItems.map((t) =>
      t.id === item.id ? { ...t, status: newStatus as any } : t
    );
    setTechItems(updated);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('infrastructure_tech_items')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', item.id);

        if (error) throw error;
      }

      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      setSuccessMessage(
        `Tecnologia "${item.technology}" alterada para ${newStatus === 'published' ? 'PUBLICADA' : 'RASCUNHO'}.`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error toggling tech status:', err);
      setErrorMessage(err.message || 'Falha ao atualizar status da tecnologia');
    }
  };

  const handleMoveTechOrder = async (areaId: string, itemIndex: number, direction: 'up' | 'down') => {
    const areaItems = techItems.filter((t) => t.area_id === areaId);
    if (direction === 'up' && itemIndex === 0) return;
    if (direction === 'down' && itemIndex === areaItems.length - 1) return;

    const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    const reorderedAreaItems = [...areaItems];
    const temp = reorderedAreaItems[itemIndex];
    reorderedAreaItems[itemIndex] = reorderedAreaItems[targetIndex];
    reorderedAreaItems[targetIndex] = temp;

    const updatedAreaItems = reorderedAreaItems.map((item, idx) => ({
      ...item,
      sort_order: idx + 1,
    }));

    const otherItems = techItems.filter((t) => t.area_id !== areaId);
    setTechItems([...otherItems, ...updatedAreaItems]);

    try {
      if (isSupabaseConfigured) {
        for (const item of updatedAreaItems) {
          await supabase
            .from('infrastructure_tech_items')
            .update({ sort_order: item.sort_order, updated_at: new Date().toISOString() })
            .eq('id', item.id);
        }
      }
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
    } catch (err: any) {
      console.error('Error updating tech order:', err);
      setErrorMessage('Erro ao salvar nova ordem das tecnologias');
    }
  };

  const handleSaveTechModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const tagsArray = techTags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const areaItems = techItems.filter((t) => t.area_id === techTargetAreaId);
    const recordId = editingTech
      ? editingTech.id
      : `item-${techName.toLowerCase().replace(/[^a-z0-9]/g, '-') || Date.now()}`;
    const sortOrder = editingTech ? editingTech.sort_order : areaItems.length + 1;

    const payload: InfraTechRecord = {
      id: recordId,
      area_id: techTargetAreaId,
      technology: techName,
      purpose_pt: techPurposePt,
      purpose_en: techPurposeEn || techPurposePt,
      applied_context_pt: techAppliedContextPt,
      applied_context_en: techAppliedContextEn || techAppliedContextPt,
      tags: tagsArray,
      sort_order: sortOrder,
      status: techStatus,
    };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('infrastructure_tech_items').upsert(
          {
            id: payload.id,
            area_id: payload.area_id,
            technology: payload.technology,
            purpose_pt: payload.purpose_pt,
            purpose_en: payload.purpose_en,
            applied_context_pt: payload.applied_context_pt,
            applied_context_en: payload.applied_context_en,
            tags: payload.tags,
            sort_order: payload.sort_order,
            status: payload.status,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

        if (error) throw error;
      }

      if (editingTech) {
        setTechItems(techItems.map((t) => (t.id === recordId ? payload : t)));
      } else {
        setTechItems([...techItems, payload]);
      }

      setIsTechModalOpen(false);
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      setSuccessMessage(`Tecnologia "${payload.technology}" salva com sucesso!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error saving tech item:', err);
      setErrorMessage(err.message || 'Falha ao salvar tecnologia no banco');
    }
  };

  const handleDeleteTech = async (id: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('infrastructure_tech_items').delete().eq('id', id);
        if (error) throw error;
      }

      setTechItems(techItems.filter((t) => t.id !== id));
      setDeleteConfirm(null);
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      setSuccessMessage('Tecnologia removida com sucesso.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error deleting tech item:', err);
      setErrorMessage(err.message || 'Erro ao remover tecnologia');
    }
  };

  return (
    <div className="space-y-8" id="admin-infra-container">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Server className="w-4 h-4" />
            <span>Administração • Ecossistema de Infraestrutura</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Gestão de Áreas & Tecnologias
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Controle hierárquico em 2 níveis: Áreas Operacionais → Itens de Tecnologia com diferenciação clara entre Finalidade Técnica e Contexto Real de Aplicação.
          </p>
        </div>

        <button
          onClick={handleOpenNewAreaModal}
          id="admin-add-area-btn"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Área Operacional</span>
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

      {/* Areas List */}
      <div className="space-y-6">
        {areas.length === 0 && !loading && (
          <div className="bg-[#111113] border border-slate-800 rounded-xl p-8 text-center space-y-3">
            <p className="text-xs text-slate-400">Nenhuma área de infraestrutura cadastrada.</p>
            <button
              onClick={handleOpenNewAreaModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Primeira Área</span>
            </button>
          </div>
        )}

        {areas.map((area, areaIdx) => {
          const isAreaPublished = area.status === 'published';
          const areaItems = techItems
            .filter((t) => t.area_id === area.id)
            .sort((a, b) => a.sort_order - b.sort_order);
          const isExpanded = !!expandedAreaIds[area.id];

          return (
            <div
              key={area.id}
              className={`bg-[#111113] border rounded-xl overflow-hidden transition-all ${
                isAreaPublished
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-amber-500/30 bg-[#14120D]/60'
              }`}
            >
              {/* Area Header Row */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 bg-[#141418]">
                <div className="flex items-start sm:items-center gap-3">
                  <button
                    onClick={() => toggleAreaExpand(area.id)}
                    className="p-1.5 rounded-lg bg-[#18181D] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white cursor-pointer mt-0.5 sm:mt-0"
                    title={isExpanded ? 'Colapsar Área' : 'Expandir Área'}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-blue-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    {renderIcon(area.icon_name, 'w-5 h-5')}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {area.area_name_pt}
                      </h3>
                      <span className="text-xs text-slate-400 font-normal">
                        ({area.area_name_en})
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          isAreaPublished
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                        }`}
                      >
                        {isAreaPublished ? 'ÁREA PUBLICADA' : 'ÁREA EM RASCUNHO'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {area.description_pt}
                    </p>
                  </div>
                </div>

                {/* Area Actions Toolbar */}
                <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleAreaStatus(area)}
                    id={`toggle-area-status-${area.id}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isAreaPublished
                        ? 'bg-[#18181D] hover:bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30'
                    }`}
                    title={isAreaPublished ? 'Mudar área para Rascunho' : 'Publicar área no site'}
                  >
                    {isAreaPublished ? (
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

                  {/* Add Tech in this area */}
                  <button
                    onClick={() => handleOpenNewTechModal(area.id)}
                    id={`add-tech-to-area-${area.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                    title="Adicionar Tecnologia nesta Área"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nova Tecnologia</span>
                  </button>

                  {/* Move Up */}
                  <button
                    onClick={() => handleMoveAreaOrder(areaIdx, 'up')}
                    disabled={areaIdx === 0}
                    className="p-2 rounded-lg bg-[#18181D] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Mover Área para Cima"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => handleMoveAreaOrder(areaIdx, 'down')}
                    disabled={areaIdx === areas.length - 1}
                    className="p-2 rounded-lg bg-[#18181D] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Mover Área para Baixo"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit Area */}
                  <button
                    onClick={() => handleEditArea(area)}
                    id={`edit-area-${area.id}`}
                    className="p-2 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 cursor-pointer"
                    title="Editar Área"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Area */}
                  <button
                    onClick={() =>
                      setDeleteConfirm({
                        type: 'area',
                        id: area.id,
                        name: area.area_name_pt,
                      })
                    }
                    className="p-2 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 cursor-pointer"
                    title="Excluir Área"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Technologies List (Accordion Content) */}
              {isExpanded && (
                <div className="p-5 space-y-4 bg-[#0E0E11]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Tecnologias Catalogadas ({areaItems.length})
                    </span>
                    {areaItems.length === 0 && (
                      <span className="text-xs text-slate-400 italic">
                        Nenhuma ferramenta adicionada nesta área ainda.
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3.5">
                    {areaItems.map((item, itemIdx) => {
                      const isTechPublished = item.status === 'published';
                      return (
                        <div
                          key={item.id}
                          className={`bg-[#151519] border rounded-lg p-4 space-y-3 transition-all ${
                            isTechPublished
                              ? 'border-slate-800/80 hover:border-slate-700/80'
                              : 'border-amber-500/20 bg-[#161410]/50'
                          }`}
                        >
                          {/* Tech Item Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="w-2 h-2 rounded-full bg-blue-400" />
                              <h4 className="text-sm font-bold text-white tracking-tight">
                                {item.technology}
                              </h4>
                              <span
                                className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                                  isTechPublished
                                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                    : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                }`}
                              >
                                {isTechPublished ? 'PUBLICADO' : 'RASCUNHO'}
                              </span>

                              {/* Tags */}
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 ml-2">
                                  {item.tags.map((t) => (
                                    <span
                                      key={t}
                                      className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1A1A22] border border-slate-800 text-slate-400"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Tech Item Actions */}
                            <div className="flex items-center gap-1.5 self-end sm:self-center">
                              {/* Toggle Item Status */}
                              <button
                                onClick={() => handleToggleTechStatus(item)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all cursor-pointer ${
                                  isTechPublished
                                    ? 'bg-[#18181D] hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
                                    : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30'
                                }`}
                                title={isTechPublished ? 'Ocultar tecnologia' : 'Publicar tecnologia'}
                              >
                                {isTechPublished ? (
                                  <>
                                    <EyeOff className="w-3 h-3 text-amber-400" />
                                    <span>Rascunho</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-3 h-3 text-emerald-400" />
                                    <span>Publicar</span>
                                  </>
                                )}
                              </button>

                              {/* Move Up */}
                              <button
                                onClick={() => handleMoveTechOrder(area.id, itemIdx, 'up')}
                                disabled={itemIdx === 0}
                                className="p-1.5 rounded-md bg-[#18181D] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                title="Mover Tecnologia para Cima"
                              >
                                <MoveUp className="w-3 h-3" />
                              </button>

                              {/* Move Down */}
                              <button
                                onClick={() => handleMoveTechOrder(area.id, itemIdx, 'down')}
                                disabled={itemIdx === areaItems.length - 1}
                                className="p-1.5 rounded-md bg-[#18181D] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                title="Mover Tecnologia para Baixo"
                              >
                                <MoveDown className="w-3 h-3" />
                              </button>

                              {/* Edit Tech */}
                              <button
                                onClick={() => handleEditTech(item)}
                                className="p-1.5 rounded-md bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 cursor-pointer"
                                title="Editar Tecnologia"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>

                              {/* Delete Tech */}
                              <button
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: 'tech',
                                    id: item.id,
                                    name: item.technology,
                                  })
                                }
                                className="p-1.5 rounded-md bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 cursor-pointer"
                                title="Excluir Tecnologia"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Purpose Block */}
                          <div className="bg-[#101013] border border-slate-800/60 p-2.5 rounded-md">
                            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                              <HelpCircle className="w-3 h-3" />
                              <span>Finalidade Técnica (O que ela faz)</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {item.purpose_pt}
                            </p>
                          </div>

                          {/* Applied Context Block */}
                          <div className="pl-2.5 border-l-2 border-slate-700/80 space-y-0.5">
                            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Terminal className="w-3 h-3 text-slate-500" />
                              <span>Contexto Real de Aplicação (Onde / Como foi usada)</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {item.applied_context_pt}
                            </p>
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
                  {deleteConfirm.type === 'area'
                    ? 'A área e todas as suas tecnologias vinculadas serão excluídas.'
                    : 'A tecnologia será removida permanentemente.'}
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
                  deleteConfirm.type === 'area'
                    ? handleDeleteArea(deleteConfirm.id)
                    : handleDeleteTech(deleteConfirm.id)
                }
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Confirmar e Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AREA MODAL (CREATE / EDIT) */}
      {isAreaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111113] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0E0E11]">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold text-white">
                  {editingArea ? 'Editar Área Operacional' : 'Nova Área de Infraestrutura'}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-[#16161B] p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAreaModalLang('pt')}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      areaModalLang === 'pt' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    type="button"
                    onClick={() => setAreaModalLang('en')}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      areaModalLang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    EN
                  </button>
                </div>

                <button
                  onClick={() => setIsAreaModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAreaModal} className="p-6 space-y-5 overflow-y-auto flex-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Nome da Área ({areaModalLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={areaModalLang === 'pt' ? areaNamePt : areaNameEn}
                  onChange={(e) =>
                    areaModalLang === 'pt' ? setAreaNamePt(e.target.value) : setAreaNameEn(e.target.value)
                  }
                  placeholder="Ex: Servidores & Virtualização"
                  className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Ícone Visual (Lista fixa Lucide)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-44 overflow-y-auto p-2 bg-[#16161B] border border-slate-800 rounded-xl">
                  {AVAILABLE_ICONS.map((item) => {
                    const isSelected = areaIconName === item.name;
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setAreaIconName(item.name)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-lg text-[10px] font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                            : 'bg-[#121215] border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                        <span className="truncate w-full text-center">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Descrição da Área ({areaModalLang.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  value={areaModalLang === 'pt' ? areaDescPt : areaDescEn}
                  onChange={(e) =>
                    areaModalLang === 'pt' ? setAreaDescPt(e.target.value) : setAreaDescEn(e.target.value)
                  }
                  placeholder="Ex: Administração de hipervisores, provisionamento de máquinas virtuais e containers..."
                  className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none leading-relaxed"
                  required
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-3 bg-[#16161B] border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-300 font-semibold">Status de Publicação da Área:</span>
                <select
                  value={areaStatus}
                  onChange={(e) => setAreaStatus(e.target.value as any)}
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
                  onClick={() => setIsAreaModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#16161B] hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="save-area-modal-btn"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Área</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TECH ITEM MODAL (CREATE / EDIT) */}
      {isTechModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111113] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0E0E11]">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold text-white">
                  {editingTech ? 'Editar Tecnologia / Ferramenta' : 'Nova Tecnologia de Infraestrutura'}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-[#16161B] p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setTechModalLang('pt')}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      techModalLang === 'pt' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    type="button"
                    onClick={() => setTechModalLang('en')}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      techModalLang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    EN
                  </button>
                </div>

                <button
                  onClick={() => setIsTechModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveTechModal} className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Nome da Tecnologia / Software
                  </label>
                  <input
                    type="text"
                    value={techName}
                    onChange={(e) => setTechName(e.target.value)}
                    placeholder="Ex: pfSense, Zabbix, Proxmox VE"
                    className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Tags Técnicas (Separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={techTags}
                    onChange={(e) => setTechTags(e.target.value)}
                    placeholder="Firewall, Failover Multi-WAN, NAT, OpenVPN"
                    className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* PURPOSE (O que ela faz) */}
              <div className="bg-[#15151A] border border-blue-500/20 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-400">
                  <HelpCircle className="w-4 h-4" />
                  <label className="text-xs font-bold uppercase tracking-wide">
                    Finalidade Técnica — Purpose ({techModalLang.toUpperCase()})
                  </label>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Explique o que a ferramenta é usada para fazer tecnicamente no ecossistema (sua funcionalidade objetiva).
                </p>
                <textarea
                  rows={2}
                  value={techModalLang === 'pt' ? techPurposePt : techPurposeEn}
                  onChange={(e) =>
                    techModalLang === 'pt' ? setTechPurposePt(e.target.value) : setTechPurposeEn(e.target.value)
                  }
                  placeholder="Ex: Firewall de borda, controle de regras de entrada/saída, NAT e VPN para acesso remoto seguro."
                  className="w-full bg-[#101013] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none leading-relaxed"
                  required
                />
              </div>

              {/* APPLIED CONTEXT (Onde/Como foi usada) */}
              <div className="bg-[#15151A] border border-slate-700/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <label className="text-xs font-bold uppercase tracking-wide">
                    Contexto Real de Aplicação — Applied Context ({techModalLang.toUpperCase()})
                  </label>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Descreva onde e de que forma você de fato aplicou esta ferramenta na prática (regras criadas, servidores configurados, rotinas).
                </p>
                <textarea
                  rows={3}
                  value={techModalLang === 'pt' ? techAppliedContextPt : techAppliedContextEn}
                  onChange={(e) =>
                    techModalLang === 'pt'
                      ? setTechAppliedContextPt(e.target.value)
                      : setTechAppliedContextEn(e.target.value)
                  }
                  placeholder="Ex: Criação de regras de firewall por interface, limitação de banda, balanceamento de links redundantes (Multi-WAN failover) e túneis OpenVPN."
                  className="w-full bg-[#101013] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none leading-relaxed"
                  required
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-3 bg-[#16161B] border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-300 font-semibold">Status de Publicação da Tecnologia:</span>
                <select
                  value={techStatus}
                  onChange={(e) => setTechStatus(e.target.value as any)}
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
                  onClick={() => setIsTechModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#16161B] hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="save-tech-modal-btn"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Tecnologia</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
