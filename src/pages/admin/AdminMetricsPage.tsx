import React, { useState, useEffect } from 'react';
import { useMetrics } from '../../content/ContentProvider.tsx';
import { isSupabaseConfigured, supabase } from '../../lib/supabase.ts';
import {
  BarChart3,
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
  Calendar,
  ShieldAlert,
  Info,
  Activity,
  FileText
} from 'lucide-react';

interface MetricItemDraft {
  id?: string;
  label_pt: string;
  label_en: string;
  value: string;
  context_pt: string;
  context_en: string;
  sort_order: number;
}

interface MetricSnapshotRecord {
  id: string;
  period_label_pt: string;
  period_label_en: string;
  period_start: string;
  period_end: string;
  source_system: string;
  entry_method: 'manual' | 'automated';
  summary_pt: string;
  summary_en: string;
  status: 'draft' | 'published' | 'archived';
  sort_order: number;
  created_at?: string;
  items?: MetricItemDraft[];
}

export const AdminMetricsPage: React.FC = () => {
  const currentMetrics = useMetrics();
  const [snapshots, setSnapshots] = useState<MetricSnapshotRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnapshot, setEditingSnapshot] = useState<MetricSnapshotRecord | null>(null);
  const [modalLangTab, setModalLangTab] = useState<'pt' | 'en'>('pt');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [formPeriodLabelPt, setFormPeriodLabelPt] = useState('');
  const [formPeriodLabelEn, setFormPeriodLabelEn] = useState('');
  const [formPeriodStart, setFormPeriodStart] = useState('');
  const [formPeriodEnd, setFormPeriodEnd] = useState('');
  const [formSummaryPt, setFormSummaryPt] = useState('');
  const [formSummaryEn, setFormSummaryEn] = useState('');
  const [formStatus, setFormStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [formSortOrder, setFormSortOrder] = useState(0);

  // Items Draft inside Snapshot Modal
  const [formItems, setFormItems] = useState<MetricItemDraft[]>([]);

  // Load snapshots from Supabase
  const loadSnapshots = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('metrics_snapshots')
          .select('*, items:metric_items(*)')
          .order('sort_order', { ascending: true })
          .order('period_start', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const formatted = data.map((snap: any) => ({
            id: snap.id,
            period_label_pt: snap.period_label_pt,
            period_label_en: snap.period_label_en,
            period_start: snap.period_start,
            period_end: snap.period_end,
            source_system: snap.source_system || 'Operis',
            entry_method: snap.entry_method || 'manual',
            summary_pt: snap.summary_pt || '',
            summary_en: snap.summary_en || '',
            status: snap.status || 'draft',
            sort_order: snap.sort_order ?? 0,
            created_at: snap.created_at,
            items: Array.isArray(snap.items)
              ? snap.items.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
              : [],
          }));
          setSnapshots(formatted);
          setLoading(false);
          return;
        }
      }

      // If empty or offline, map from context
      if (currentMetrics && currentMetrics.length > 0) {
        const mapped: MetricSnapshotRecord[] = currentMetrics.map((m, idx) => ({
          id: m.id,
          period_label_pt: m.periodLabel,
          period_label_en: m.periodLabel,
          period_start: m.periodStart,
          period_end: m.periodEnd,
          source_system: m.sourceSystem || 'Operis',
          entry_method: m.entryMethod || 'manual',
          summary_pt: m.summary || '',
          summary_en: m.summary || '',
          status: m.status,
          sort_order: m.sortOrder ?? idx,
          created_at: m.createdAt,
          items: m.items.map((it) => ({
            id: it.id,
            label_pt: it.label,
            label_en: it.label,
            value: it.value,
            context_pt: it.context || '',
            context_en: it.context || '',
            sort_order: it.sortOrder,
          })),
        }));
        setSnapshots(mapped);
      } else {
        setSnapshots([]);
      }
    } catch (err: any) {
      console.error('Error loading metrics snapshots:', err);
      setErrorMessage(err.message || 'Erro ao carregar snapshots de métricas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSnapshots();
  }, []);

  // Open modal to create new snapshot
  const handleOpenCreate = () => {
    setEditingSnapshot(null);
    setFormPeriodLabelPt('');
    setFormPeriodLabelEn('');
    setFormPeriodStart(new Date().toISOString().slice(0, 10));
    setFormPeriodEnd(new Date().toISOString().slice(0, 10));
    setFormSummaryPt('');
    setFormSummaryEn('');
    setFormStatus('draft');
    setFormSortOrder(snapshots.length);
    setFormItems([
      {
        label_pt: '',
        label_en: '',
        value: '',
        context_pt: '',
        context_en: '',
        sort_order: 0,
      }
    ]);
    setModalLangTab('pt');
    setIsModalOpen(true);
  };

  // Open modal to edit existing snapshot
  const handleOpenEdit = (snap: MetricSnapshotRecord) => {
    setEditingSnapshot(snap);
    setFormPeriodLabelPt(snap.period_label_pt);
    setFormPeriodLabelEn(snap.period_label_en);
    setFormPeriodStart(snap.period_start);
    setFormPeriodEnd(snap.period_end);
    setFormSummaryPt(snap.summary_pt);
    setFormSummaryEn(snap.summary_en);
    setFormStatus(snap.status);
    setFormSortOrder(snap.sort_order);
    setFormItems(
      snap.items && snap.items.length > 0
        ? snap.items.map((it, idx) => ({ ...it, sort_order: it.sort_order ?? idx }))
        : [
            {
              label_pt: '',
              label_en: '',
              value: '',
              context_pt: '',
              context_en: '',
              sort_order: 0,
            }
          ]
    );
    setModalLangTab('pt');
    setIsModalOpen(true);
  };

  // Add Item to current modal draft
  const handleAddItem = () => {
    setFormItems((prev) => [
      ...prev,
      {
        label_pt: '',
        label_en: '',
        value: '',
        context_pt: '',
        context_en: '',
        sort_order: prev.length,
      },
    ]);
  };

  // Remove Item from draft
  const handleRemoveItem = (index: number) => {
    setFormItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Move item up/down
  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= formItems.length) return;

    setFormItems((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy.map((it, idx) => ({ ...it, sort_order: idx }));
    });
  };

  // Update specific item field
  const handleItemFieldChange = (index: number, field: keyof MetricItemDraft, value: any) => {
    setFormItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Save Snapshot + Items to Supabase
  const handleSaveSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (!formPeriodLabelPt.trim() || !formPeriodStart || !formPeriodEnd) {
        throw new Error('Preencha os campos obrigatórios: Rótulo do Período e Datas de Início/Fim.');
      }

      // Filter out empty items
      const validItems = formItems.filter(
        (it) => it.label_pt.trim() || it.value.trim()
      );

      if (isSupabaseConfigured) {
        let snapshotId = editingSnapshot?.id;

        const snapshotPayload = {
          period_label_pt: formPeriodLabelPt.trim(),
          period_label_en: (formPeriodLabelEn.trim() || formPeriodLabelPt.trim()),
          period_start: formPeriodStart,
          period_end: formPeriodEnd,
          source_system: 'Operis',
          entry_method: 'manual', // Hardcoded as required by architecture
          summary_pt: formSummaryPt.trim() || null,
          summary_en: formSummaryEn.trim() || null,
          status: formStatus,
          sort_order: formSortOrder,
        };

        if (editingSnapshot) {
          // Update Snapshot
          const { error: updateSnapError } = await supabase
            .from('metrics_snapshots')
            .update(snapshotPayload)
            .eq('id', editingSnapshot.id);

          if (updateSnapError) throw updateSnapError;
          snapshotId = editingSnapshot.id;
        } else {
          // Insert Snapshot
          const { data: newSnap, error: insertSnapError } = await supabase
            .from('metrics_snapshots')
            .insert(snapshotPayload)
            .select()
            .single();

          if (insertSnapError) throw insertSnapError;
          snapshotId = newSnap.id;
        }

        // Replace or sync metric_items
        if (snapshotId) {
          // Delete old items for clean sync
          const { error: delError } = await supabase
            .from('metric_items')
            .delete()
            .eq('snapshot_id', snapshotId);

          if (delError) console.warn('Note deleting old items:', delError);

          // Insert new valid items
          if (validItems.length > 0) {
            const itemsToInsert = validItems.map((it, idx) => ({
              snapshot_id: snapshotId,
              label_pt: it.label_pt.trim(),
              label_en: (it.label_en.trim() || it.label_pt.trim()),
              value: it.value.trim(),
              context_pt: it.context_pt.trim() || null,
              context_en: it.context_en.trim() || null,
              sort_order: idx,
            }));

            const { error: insertItemsError } = await supabase
              .from('metric_items')
              .insert(itemsToInsert);

            if (insertItemsError) throw insertItemsError;
          }
        }
      }

      setSuccessMessage('Snapshot de métricas salvo com sucesso no banco de dados!');
      setIsModalOpen(false);
      await loadSnapshots();

      // Trigger public refresh
      window.dispatchEvent(new Event('cv_content_updated'));
    } catch (err: any) {
      console.error('Error saving snapshot:', err);
      setErrorMessage(err.message || 'Falha ao salvar snapshot.');
    } finally {
      setSaving(false);
    }
  };

  // Toggle quick status (draft <-> published)
  const handleToggleStatus = async (snap: MetricSnapshotRecord) => {
    const nextStatus = snap.status === 'published' ? 'draft' : 'published';
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('metrics_snapshots')
          .update({ status: nextStatus })
          .eq('id', snap.id);

        if (error) throw error;
      }

      setSnapshots((prev) =>
        prev.map((s) => (s.id === snap.id ? { ...s, status: nextStatus } : s))
      );
      setSuccessMessage(`Status alterado para "${nextStatus === 'published' ? 'Publicado' : 'Rascunho'}"`);
      window.dispatchEvent(new Event('cv_content_updated'));
    } catch (err: any) {
      console.error('Error toggling status:', err);
      setErrorMessage(err.message || 'Erro ao alterar status.');
    }
  };

  // Delete snapshot
  const handleDeleteSnapshot = async (id: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('metrics_snapshots')
          .delete()
          .eq('id', id);

        if (error) throw error;
      }

      setSnapshots((prev) => prev.filter((s) => s.id !== id));
      setDeleteConfirmId(null);
      setSuccessMessage('Snapshot removido com sucesso!');
      window.dispatchEvent(new Event('cv_content_updated'));
    } catch (err: any) {
      console.error('Error deleting snapshot:', err);
      setErrorMessage(err.message || 'Erro ao remover snapshot.');
    }
  };

  // Move snapshot up/down in list
  const handleMoveSnapshot = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= snapshots.length) return;

    const updated = [...snapshots];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Update sort_order locally
    const reordered = updated.map((item, idx) => ({ ...item, sort_order: idx }));
    setSnapshots(reordered);

    try {
      if (isSupabaseConfigured) {
        for (const item of reordered) {
          await supabase
            .from('metrics_snapshots')
            .update({ sort_order: item.sort_order })
            .eq('id', item.id);
        }
      }
      setSuccessMessage('Ordenação de snapshots atualizada!');
      window.dispatchEvent(new Event('cv_content_updated'));
    } catch (err: any) {
      console.error('Error reordering snapshots:', err);
      setErrorMessage(err.message || 'Erro ao persistir reordenação.');
    }
  };

  return (
    <div className="space-y-6" id="admin-metrics-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Métricas & Evidências Operacionais (Operis)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Snapshots de Métricas Profissionais
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Registro consciente e quantitativo de volumes, tempos e indicadores consolidados de sustentação.
          </p>
        </div>

        <button
          type="button"
          id="btn-create-metric-snapshot"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Snapshot de Período</span>
        </button>
      </div>

      {/* Mandatory Process Warning Banner (Fixed, non-removable) */}
      <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Diretriz de Segurança & Confidencialidade
          </h2>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            Preencha apenas dados agregados e já calculados por você fora deste sistema. Nunca insira aqui informações individuais de terceiros, dados institucionais sensíveis ou registros operacionais que não tenham finalidade de demonstração profissional.
          </p>
        </div>
      </div>

      {/* Alert Messages */}
      {successMessage && (
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Snapshots List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">
          Carregando snapshots de métricas...
        </div>
      ) : snapshots.length === 0 ? (
        <div className="bg-[#111113] border border-dashed border-slate-800 rounded-xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-sm font-bold text-white">Nenhum snapshot de métricas cadastrado</h3>
            <p className="text-xs text-slate-400 mt-1">
              Crie seu primeiro período de métricas com dados agregados de atendimento e suporte para exibição no CV público.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Primeiro Snapshot</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {snapshots.map((snap, idx) => (
            <div
              key={snap.id}
              className={`bg-[#111113] border rounded-xl p-5 transition-all space-y-4 ${
                snap.status === 'published'
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-amber-900/30 bg-[#111113]/60'
              }`}
            >
              {/* Snapshot Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{snap.period_label_pt}</h3>
                      {snap.period_label_en && snap.period_label_en !== snap.period_label_pt && (
                        <span className="text-[10px] text-slate-500 font-mono">({snap.period_label_en})</span>
                      )}
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                          snap.status === 'published'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}
                      >
                        {snap.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                        Origem: {snap.source_system} • Entrada: {snap.entry_method}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Intervalo: <span className="font-mono text-slate-300">{snap.period_start}</span> até{' '}
                      <span className="font-mono text-slate-300">{snap.period_end}</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(snap)}
                    className={`p-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      snap.status === 'published'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                    }`}
                    title={snap.status === 'published' ? 'Tornar Rascunho' : 'Publicar no site público'}
                  >
                    {snap.status === 'published' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveSnapshot(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 disabled:opacity-30 cursor-pointer"
                    title="Mover para cima"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveSnapshot(idx, 'down')}
                    disabled={idx === snapshots.length - 1}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 disabled:opacity-30 cursor-pointer"
                    title="Mover para baixo"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(snap)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-blue-600/20 text-slate-300 hover:text-blue-400 border border-slate-800 hover:border-blue-500/30 transition-colors cursor-pointer"
                    title="Editar Snapshot e Métricas"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(snap.id)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/50 transition-colors cursor-pointer"
                    title="Remover Snapshot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Context Summary */}
              {snap.summary_pt && (
                <p className="text-xs text-slate-300 leading-relaxed bg-[#16161B] p-3 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Resumo do Período:
                  </span>
                  {snap.summary_pt}
                </p>
              )}

              {/* Metric Items Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Indicadores Gravados ({snap.items?.length || 0})</span>
                </div>

                {snap.items && snap.items.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {snap.items.map((item, itemIdx) => (
                      <div
                        key={item.id || itemIdx}
                        className="bg-[#141418] border border-slate-800 rounded-lg p-3.5 space-y-1.5"
                      >
                        <div className="text-lg font-extrabold text-white font-mono tracking-tight text-blue-400">
                          {item.value}
                        </div>
                        <div className="text-xs font-bold text-slate-200">
                          {item.label_pt}
                        </div>
                        {item.context_pt && (
                          <div className="text-[11px] text-slate-400 leading-snug">
                            {item.context_pt}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Nenhum item cadastrado neste snapshot.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-rose-900/40 rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Confirmar Exclusão</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tem certeza que deseja remover este snapshot e todas as suas métricas associadas? Esta ação não pode ser desfeita.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSnapshot(deleteConfirmId)}
                className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Confirmar Remoção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snapshot Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121215] border border-slate-800 rounded-2xl max-w-3xl w-full my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-[#16161B]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {editingSnapshot ? 'Editar Snapshot de Métricas' : 'Novo Snapshot de Período'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Origem: Operis • Método de Entrada: Manual
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Language Switcher for Bilingual Fields */}
                <div className="flex bg-[#101013] border border-slate-800 rounded-lg p-0.5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setModalLangTab('pt')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      modalLangTab === 'pt' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    PT
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalLangTab('en')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      modalLangTab === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveSnapshot} className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Mandatory Notice in Form */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-[11px] text-amber-200/90 leading-relaxed">
                💡 <strong className="text-amber-300">Lembrete:</strong> Preencha apenas dados agregados e já calculados fora do sistema. Nunca insira informações institucionais restritas ou dados de terceiros.
              </div>

              {/* 1. Period Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>1. Identificação do Período & Status</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {modalLangTab === 'pt' ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Rótulo do Período (PT) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formPeriodLabelPt}
                        onChange={(e) => setFormPeriodLabelPt(e.target.value)}
                        placeholder="Ex: Jan–Jun 2026 ou 1º Semestre 2026"
                        className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Period Label (EN)
                      </label>
                      <input
                        type="text"
                        value={formPeriodLabelEn}
                        onChange={(e) => setFormPeriodLabelEn(e.target.value)}
                        placeholder="Ex: Jan–Jun 2026 or Q1/Q2 2026"
                        className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Status de Publicação *
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e: any) => setFormStatus(e.target.value)}
                      className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="draft">Rascunho (Não visível publicamente)</option>
                      <option value="published">Publicado (Visível no site)</option>
                      <option value="archived">Arquivado</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Data de Início do Período *
                    </label>
                    <input
                      type="date"
                      required
                      value={formPeriodStart}
                      onChange={(e) => setFormPeriodStart(e.target.value)}
                      className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Data de Término do Período *
                    </label>
                    <input
                      type="date"
                      required
                      value={formPeriodEnd}
                      onChange={(e) => setFormPeriodEnd(e.target.value)}
                      className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Context Summary */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {modalLangTab === 'pt' ? 'Resumo de Contexto (PT)' : 'Context Summary (EN)'}
                  </label>
                  {modalLangTab === 'pt' ? (
                    <textarea
                      rows={2}
                      value={formSummaryPt}
                      onChange={(e) => setFormSummaryPt(e.target.value)}
                      placeholder="Ex: Volume de atendimentos e sustentação do ecossistema computacional no primeiro semestre de 2026."
                      className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <textarea
                      rows={2}
                      value={formSummaryEn}
                      onChange={(e) => setFormSummaryEn(e.target.value)}
                      placeholder="Ex: Operational volume and infrastructure maintenance during the first half of 2026."
                      className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  )}
                </div>
              </div>

              {/* 2. Metric Items Builder */}
              <div className="space-y-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                    <span>2. Itens de Métrica & Indicadores ({formItems.length})</span>
                  </h4>

                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Indicador</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#16161B] border border-slate-800 rounded-xl p-4 space-y-3 relative group"
                    >
                      {/* Item Top Bar */}
                      <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60">
                        <span className="font-mono font-bold text-slate-300">
                          #{idx + 1} • Indicador
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveItem(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                          >
                            <MoveUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveItem(idx, 'down')}
                            disabled={idx === formItems.length - 1}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                          >
                            <MoveDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 rounded hover:bg-rose-950/40 text-slate-400 hover:text-rose-400"
                            title="Remover indicador"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Value & Label Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Valor (Texto Livre) *
                          </label>
                          <input
                            type="text"
                            required
                            value={item.value}
                            onChange={(e) => handleItemFieldChange(idx, 'value', e.target.value)}
                            placeholder="Ex: 94%, 1.240 chamados, 2h 15min"
                            className="w-full bg-[#111113] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            {modalLangTab === 'pt' ? 'Rótulo / Nome da Métrica (PT) *' : 'Metric Label (EN) *'}
                          </label>
                          {modalLangTab === 'pt' ? (
                            <input
                              type="text"
                              required
                              value={item.label_pt}
                              onChange={(e) => handleItemFieldChange(idx, 'label_pt', e.target.value)}
                              placeholder="Ex: Cumprimento de SLA em Atendimentos"
                              className="w-full bg-[#111113] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                          ) : (
                            <input
                              type="text"
                              value={item.label_en}
                              onChange={(e) => handleItemFieldChange(idx, 'label_en', e.target.value)}
                              placeholder="Ex: SLA Compliance in Ticket Resolution"
                              className="w-full bg-[#111113] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>
                      </div>

                      {/* Context / Explanation */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          {modalLangTab === 'pt' ? 'Contexto / Significado da Métrica (PT)' : 'Context / Meaning of Metric (EN)'}
                        </label>
                        {modalLangTab === 'pt' ? (
                          <input
                            type="text"
                            value={item.context_pt}
                            onChange={(e) => handleItemFieldChange(idx, 'context_pt', e.target.value)}
                            placeholder="Ex: Percentual de solicitações acadêmicas e operacionais resolvidas no prazo de primeiro atendimento."
                            className="w-full bg-[#111113] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                          />
                        ) : (
                          <input
                            type="text"
                            value={item.context_en}
                            onChange={(e) => handleItemFieldChange(idx, 'context_en', e.target.value)}
                            placeholder="Ex: Percentage of academic and operational tickets resolved within the initial response threshold."
                            className="w-full bg-[#111113] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer / Save Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Gravando Snapshot...' : 'Salvar Snapshot'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
