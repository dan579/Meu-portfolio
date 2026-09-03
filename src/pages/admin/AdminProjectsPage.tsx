import React, { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.ts';
import { MediaPicker } from '../../admin/components/MediaPicker.tsx';
import { LinkedInPostModal } from '../../admin/components/LinkedInPostModal.tsx';
import { MediaAsset } from '../../content/types.ts';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Star,
  CheckCircle2,
  ExternalLink,
  Loader2,
  AlertCircle,
  Check,
  X,
  Image as ImageIcon,
  Sparkles,
  Link as LinkIcon,
  Cpu,
  UserCheck,
  FileText,
  Workflow,
  Wand2,
} from 'lucide-react';

interface ProjectRecord {
  id: string;
  slug: string;
  title: string;
  subtitle_pt: string;
  subtitle_en: string;
  short_summary_pt: string;
  short_summary_en: string;
  category_pt: string;
  category_en: string;
  project_status: 'in-development' | 'completed';
  status_label_pt: string;
  status_label_en: string;
  featured: boolean;
  badge_pt?: string;
  badge_en?: string;
  problem_pt: string;
  problem_en: string;
  solution_pt: string;
  solution_en: string;
  architecture_overview_pt: string;
  architecture_overview_en: string;
  architecture_highlights_pt: string[];
  architecture_highlights_en: string[];
  architecture_diagram_description_pt?: string;
  architecture_diagram_description_en?: string;
  features_pt: string[];
  features_en: string[];
  technologies: { name: string; role_pt?: string; role_en?: string; role?: string }[];
  daniel_role_title_pt: string;
  daniel_role_title_en: string;
  daniel_role_contributions_pt: string[];
  daniel_role_contributions_en: string[];
  gallery: {
    mediaAssetId?: string;
    imageUrl: string;
    title_pt?: string;
    title_en?: string;
    title?: string;
    description_pt?: string;
    description_en?: string;
    description?: string;
    caption_pt?: string;
    caption_en?: string;
    caption?: string;
  }[];
  links: { label: string; url: string; type: 'demo' | 'github' | 'docs' | 'internal' }[];
  sort_order: number;
  status: 'draft' | 'published' | 'archived';
  created_at?: string;
  updated_at?: string;
}

const emptyProjectForm = (): Omit<ProjectRecord, 'id'> => ({
  slug: '',
  title: '',
  subtitle_pt: '',
  subtitle_en: '',
  short_summary_pt: '',
  short_summary_en: '',
  category_pt: 'Sistemas Corporativos / Solução Interna',
  category_en: 'Enterprise Systems / Internal Solution',
  project_status: 'in-development',
  status_label_pt: 'Em Desenvolvimento',
  status_label_en: 'In Active Development',
  featured: false,
  badge_pt: '',
  badge_en: '',
  problem_pt: '',
  problem_en: '',
  solution_pt: '',
  solution_en: '',
  architecture_overview_pt: '',
  architecture_overview_en: '',
  architecture_highlights_pt: [''],
  architecture_highlights_en: [''],
  architecture_diagram_description_pt: '',
  architecture_diagram_description_en: '',
  features_pt: [''],
  features_en: [''],
  technologies: [{ name: '', role_pt: '', role_en: '' }],
  daniel_role_title_pt: 'Arquiteto e Desenvolvedor Fullstack',
  daniel_role_title_en: 'Architect & Fullstack Developer',
  daniel_role_contributions_pt: [''],
  daniel_role_contributions_en: [''],
  gallery: [],
  links: [],
  sort_order: 0,
  status: 'published',
});

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null);
  const [formData, setFormData] = useState<Omit<ProjectRecord, 'id'>>(emptyProjectForm());
  const [activeTab, setActiveTab] = useState<'general' | 'content' | 'features' | 'gallery' | 'links'>('general');

  // Media Picker Sub-Modal State
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [linkedInProject, setLinkedInProject] = useState<ProjectRecord | null>(null);
  const [targetGalleryIndex, setTargetGalleryIndex] = useState<number | null>(null);

  // Delete Confirmation State
  const [projectToDelete, setProjectToDelete] = useState<ProjectRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load Projects
  const fetchProjects = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setFeedback({ type: 'error', message: err.message || 'Erro ao carregar projetos.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Generate slug from title
  const handleGenerateSlug = () => {
    if (!formData.title) return;
    const generated = formData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({ ...prev, slug: generated }));
  };

  // Open Modal for New Project
  const handleOpenNew = () => {
    setEditingProject(null);
    setFormData({
      ...emptyProjectForm(),
      sort_order: projects.length + 1,
    });
    setActiveTab('general');
    setIsModalOpen(true);
  };

  // Open Modal for Editing Project
  const handleOpenEdit = (project: ProjectRecord) => {
    setEditingProject(project);
    setFormData({
      slug: project.slug || '',
      title: project.title || '',
      subtitle_pt: project.subtitle_pt || '',
      subtitle_en: project.subtitle_en || '',
      short_summary_pt: project.short_summary_pt || '',
      short_summary_en: project.short_summary_en || '',
      category_pt: project.category_pt || '',
      category_en: project.category_en || '',
      project_status: project.project_status || 'in-development',
      status_label_pt: project.status_label_pt || '',
      status_label_en: project.status_label_en || '',
      featured: Boolean(project.featured),
      badge_pt: project.badge_pt || '',
      badge_en: project.badge_en || '',
      problem_pt: project.problem_pt || '',
      problem_en: project.problem_en || '',
      solution_pt: project.solution_pt || '',
      solution_en: project.solution_en || '',
      architecture_overview_pt: project.architecture_overview_pt || '',
      architecture_overview_en: project.architecture_overview_en || '',
      architecture_highlights_pt: project.architecture_highlights_pt?.length ? project.architecture_highlights_pt : [''],
      architecture_highlights_en: project.architecture_highlights_en?.length ? project.architecture_highlights_en : [''],
      architecture_diagram_description_pt: project.architecture_diagram_description_pt || '',
      architecture_diagram_description_en: project.architecture_diagram_description_en || '',
      features_pt: project.features_pt?.length ? project.features_pt : [''],
      features_en: project.features_en?.length ? project.features_en : [''],
      technologies: project.technologies?.length ? project.technologies : [{ name: '', role_pt: '', role_en: '' }],
      daniel_role_title_pt: project.daniel_role_title_pt || '',
      daniel_role_title_en: project.daniel_role_title_en || '',
      daniel_role_contributions_pt: project.daniel_role_contributions_pt?.length ? project.daniel_role_contributions_pt : [''],
      daniel_role_contributions_en: project.daniel_role_contributions_en?.length ? project.daniel_role_contributions_en : [''],
      gallery: Array.isArray(project.gallery) ? project.gallery : [],
      links: Array.isArray(project.links) ? project.links : [],
      sort_order: project.sort_order ?? 0,
      status: project.status || 'published',
    });
    setActiveTab('general');
    setIsModalOpen(true);
  };

  // Quick Status Toggle (published <-> draft)
  const handleToggleStatus = async (project: ProjectRecord) => {
    const nextStatus = project.status === 'published' ? 'draft' : 'published';
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', project.id);

      if (error) throw error;
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, status: nextStatus } : p))
      );
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      setFeedback({
        type: 'success',
        message: `Status do projeto "${project.title}" alterado para ${nextStatus === 'published' ? 'Publicado' : 'Rascunho'}.`,
      });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Erro ao alterar status.' });
    }
  };

  // Move Sort Order
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const currentProject = projects[index];
    const targetProject = projects[targetIndex];

    const currentOrder = currentProject.sort_order;
    const targetOrder = targetProject.sort_order === currentOrder
      ? (direction === 'up' ? currentOrder - 1 : currentOrder + 1)
      : targetProject.sort_order;

    try {
      await Promise.all([
        supabase.from('projects').update({ sort_order: targetOrder }).eq('id', currentProject.id),
        supabase.from('projects').update({ sort_order: currentOrder }).eq('id', targetProject.id),
      ]);
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      await fetchProjects();
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Erro ao reordenar projetos.' });
    }
  };

  // Save Project (Create / Update)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    // Filter empty string items from arrays
    const cleanPayload = {
      ...formData,
      architecture_highlights_pt: formData.architecture_highlights_pt.filter((s) => s.trim().length > 0),
      architecture_highlights_en: formData.architecture_highlights_en.filter((s) => s.trim().length > 0),
      features_pt: formData.features_pt.filter((s) => s.trim().length > 0),
      features_en: formData.features_en.filter((s) => s.trim().length > 0),
      technologies: formData.technologies.filter((t) => t.name.trim().length > 0),
      daniel_role_contributions_pt: formData.daniel_role_contributions_pt.filter((c) => c.trim().length > 0),
      daniel_role_contributions_en: formData.daniel_role_contributions_en.filter((c) => c.trim().length > 0),
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(cleanPayload)
          .eq('id', editingProject.id);

        if (error) throw error;
        setFeedback({ type: 'success', message: `Projeto "${cleanPayload.title}" atualizado com sucesso!` });
      } else {
        const { error } = await supabase
          .from('projects')
          .insert(cleanPayload);

        if (error) throw error;
        setFeedback({ type: 'success', message: `Projeto "${cleanPayload.title}" criado com sucesso!` });
      }

      setIsModalOpen(false);
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      await fetchProjects();
    } catch (err: any) {
      console.error('Error saving project:', err);
      setFeedback({ type: 'error', message: err.message || 'Erro ao salvar projeto.' });
    } finally {
      setSaving(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete.id);

      if (error) throw error;
      setFeedback({ type: 'success', message: `Projeto "${projectToDelete.title}" excluído.` });
      setProjectToDelete(null);
      window.dispatchEvent(new CustomEvent('cv_content_updated'));
      await fetchProjects();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Erro ao excluir projeto.' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Media Picker Selection Handler
  const handleMediaSelected = (asset: MediaAsset) => {
    if (targetGalleryIndex !== null && targetGalleryIndex >= 0 && targetGalleryIndex < formData.gallery.length) {
      // Replace existing gallery item image
      const updatedGallery = [...formData.gallery];
      updatedGallery[targetGalleryIndex] = {
        ...updatedGallery[targetGalleryIndex],
        mediaAssetId: asset.id,
        imageUrl: asset.public_url,
      };
      setFormData({ ...formData, gallery: updatedGallery });
    } else {
      // Add new gallery item
      const newItem = {
        mediaAssetId: asset.id,
        imageUrl: asset.public_url,
        title_pt: asset.alt_text_pt || asset.file_name.replace(/\.[^/.]+$/, ''),
        title_en: asset.alt_text_en || asset.file_name.replace(/\.[^/.]+$/, ''),
        title: asset.alt_text_pt || asset.file_name.replace(/\.[^/.]+$/, ''),
        description_pt: '',
        description_en: '',
        caption_pt: asset.alt_text_pt || asset.file_name,
        caption_en: asset.alt_text_en || asset.file_name,
      };
      setFormData({ ...formData, gallery: [...formData.gallery, newItem] });
    }

    setIsMediaPickerOpen(false);
    setTargetGalleryIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Gestão de Projetos & Cases</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Projetos & Portfólio Técnico
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie os cases detalhados com galeria de screenshots reais do Storage, arquitetura e contribuições.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors self-start sm:self-auto shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {feedback.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-80">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          <span className="text-xs font-mono">Carregando projetos cadastrados...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="border border-slate-800 rounded-xl bg-[#111113] p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">Nenhum projeto cadastrado</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Comece cadastrando o case do Operis, do Sistema de Agendamento ou outros projetos técnicos.
          </p>
          <button
            onClick={handleOpenNew}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-lg inline-flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Primeiro Projeto</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj, idx) => {
            const isPublished = proj.status === 'published';
            const galleryCount = Array.isArray(proj.gallery) ? proj.gallery.length : 0;
            const techCount = Array.isArray(proj.technologies) ? proj.technologies.length : 0;

            return (
              <div
                key={proj.id}
                className="bg-[#111113] border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 bg-[#16161B] px-2 py-0.5 rounded border border-slate-800">
                      #{proj.sort_order}
                    </span>

                    {/* Publication Status */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(proj)}
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${
                        isPublished
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                      }`}
                      title="Clique para alternar entre publicado e rascunho"
                    >
                      {isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isPublished ? 'Publicado' : 'Rascunho'}</span>
                    </button>

                    {/* Project Status */}
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        proj.project_status === 'completed'
                          ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                          : 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                      }`}
                    >
                      {proj.project_status === 'completed' ? 'Concluído' : 'Em Desenvolvimento'}
                    </span>

                    {/* Featured */}
                    {proj.featured && (
                      <span className="text-[10px] font-mono font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        Destaque
                      </span>
                    )}

                    <span className="text-[11px] text-slate-500 font-mono">
                      /projetos/{proj.slug}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{proj.title}</span>
                      {proj.badge_pt && (
                        <span className="text-[10px] bg-slate-800 text-slate-300 font-normal px-2 py-0.5 rounded">
                          {proj.badge_pt}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {proj.short_summary_pt || proj.subtitle_pt}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                      {galleryCount} {galleryCount === 1 ? 'imagem na galeria' : 'imagens na galeria'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-blue-400" />
                      {techCount} tecnologias
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-end gap-1.5 self-end md:self-center shrink-0">
                  {/* Reorder */}
                  <div className="flex items-center bg-[#16161B] border border-slate-800 rounded-lg p-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveOrder(idx, 'up')}
                      className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === projects.length - 1}
                      onClick={() => handleMoveOrder(idx, 'down')}
                      className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Public Link */}
                  <a
                    href={`/projetos/${proj.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-[#16161B] hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-blue-400 transition-colors"
                    title="Ver página pública do case"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {/* Divulgar Projeto */}
                  <button
                    type="button"
                    onClick={() => setLinkedInProject(proj)}
                    className="p-2 bg-[#16161B] hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-blue-400 transition-colors"
                    title="Divulgar projeto (gerar texto para LinkedIn)"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(proj)}
                    className="p-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
                    title="Editar Projeto"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setProjectToDelete(proj)}
                    className="p-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                    title="Excluir Projeto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className="bg-[#0F0F12] border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#141418]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingProject ? `Editar Case: ${editingProject.title}` : 'Criar Novo Case de Projeto'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Formulário completo bilíngue com suporte a galeria de imagens do Storage
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center px-6 border-b border-slate-800/80 bg-[#111114] overflow-x-auto gap-2 py-2">
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'general'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. Identificação & Status</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'content'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>2. Problema & Arquitetura</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('features')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'features'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>3. Features, Tech & Papel</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'gallery'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>4. Galeria de Imagens ({formData.gallery.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('links')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'links'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>5. Links ({formData.links.length})</span>
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProject} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: IDENTIFICATION & GENERAL STATUS */}
              {activeTab === 'general' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-300">
                        Título do Projeto *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Ex: Operis — Plataforma Helpdesk Multi-Tenant"
                          className="flex-1 bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleGenerateSlug}
                          className="px-3 py-2 bg-[#1A1A22] hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
                          title="Gerar slug automático a partir do título"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>Gerar Slug</span>
                        </button>
                      </div>
                    </div>

                    {/* Slug */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Slug de URL * (/projetos/[slug])
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        placeholder="ex: operis"
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Categoria (PT) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.category_pt}
                        onChange={(e) => setFormData({ ...formData, category_pt: e.target.value })}
                        placeholder="Ex: Sistemas Corporativos / Solução Interna"
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Category EN */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Category (EN) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.category_en}
                        onChange={(e) => setFormData({ ...formData, category_en: e.target.value })}
                        placeholder="Ex: Enterprise Systems / Internal Solution"
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Project Status */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Status de Desenvolvimento *
                      </label>
                      <select
                        value={formData.project_status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            project_status: e.target.value as 'in-development' | 'completed',
                            status_label_pt: e.target.value === 'completed' ? 'Concluído & Validado' : 'Em Desenvolvimento Ativo',
                            status_label_en: e.target.value === 'completed' ? 'Completed & Validated' : 'In Active Development',
                          })
                        }
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="in-development">Em Desenvolvimento (in-development)</option>
                        <option value="completed">Concluído (completed)</option>
                      </select>
                    </div>

                    {/* Publication Status */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Status de Publicação no Site *
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="published">Publicado (visível a todos)</option>
                        <option value="draft">Rascunho (apenas admin)</option>
                        <option value="archived">Arquivado</option>
                      </select>
                    </div>

                    {/* Status Labels (PT / EN) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Rótulo de Status Exibido (PT)
                      </label>
                      <input
                        type="text"
                        value={formData.status_label_pt}
                        onChange={(e) => setFormData({ ...formData, status_label_pt: e.target.value })}
                        placeholder="Ex: Em Desenvolvimento Ativo"
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Status Display Label (EN)
                      </label>
                      <input
                        type="text"
                        value={formData.status_label_en}
                        onChange={(e) => setFormData({ ...formData, status_label_en: e.target.value })}
                        placeholder="Ex: In Active Development"
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Featured & Badges */}
                    <div className="sm:col-span-2 bg-[#141418] p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="featured-checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-4 h-4 rounded bg-[#0D0D10] border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                        <label htmlFor="featured-checkbox" className="text-xs font-bold text-white cursor-pointer flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>Projeto em Destaque na Página Inicial</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="text-[11px] text-slate-400 font-medium">Badge Opcional (PT)</label>
                          <input
                            type="text"
                            value={formData.badge_pt || ''}
                            onChange={(e) => setFormData({ ...formData, badge_pt: e.target.value })}
                            placeholder="Ex: Case Principal / Destaque"
                            className="w-full bg-[#0D0D10] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 font-medium">Optional Badge (EN)</label>
                          <input
                            type="text"
                            value={formData.badge_en || ''}
                            onChange={(e) => setFormData({ ...formData, badge_en: e.target.value })}
                            placeholder="Ex: Flagship Case"
                            className="w-full bg-[#0D0D10] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Subtitle PT / EN */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Subtítulo do Case (PT)
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle_pt}
                        onChange={(e) => setFormData({ ...formData, subtitle_pt: e.target.value })}
                        placeholder="Ex: Sistema de Gestão de Incidentes com Isolamento Multi-Tenant"
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Case Subtitle (EN)
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle_en}
                        onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
                        placeholder="Ex: Multi-Tenant Incident Management with Row-Level Security"
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Short Summary PT / EN */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-300">
                        Resumo Curto (PT) *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={formData.short_summary_pt}
                        onChange={(e) => setFormData({ ...formData, short_summary_pt: e.target.value })}
                        placeholder="Síntese de 2 a 3 linhas sobre o projeto para o card da home..."
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-300">
                        Short Summary (EN) *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={formData.short_summary_en}
                        onChange={(e) => setFormData({ ...formData, short_summary_en: e.target.value })}
                        placeholder="2-3 sentence summary for the homepage card..."
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROBLEM, SOLUTION & ARCHITECTURE */}
              {activeTab === 'content' && (
                <div className="space-y-5">
                  {/* Problem */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Problema / Contexto de Origem (PT) *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.problem_pt}
                        onChange={(e) => setFormData({ ...formData, problem_pt: e.target.value })}
                        placeholder="Qual dor ou gargalo operacional motivou a criação do projeto?"
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Problem / Context (EN) *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.problem_en}
                        onChange={(e) => setFormData({ ...formData, problem_en: e.target.value })}
                        placeholder="What operational pain point motivated the project?"
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Solution */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Solução Proposta & Implementada (PT) *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.solution_pt}
                        onChange={(e) => setFormData({ ...formData, solution_pt: e.target.value })}
                        placeholder="Como a aplicação resolve o problema tecnicamente?"
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Solution Implemented (EN) *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.solution_en}
                        onChange={(e) => setFormData({ ...formData, solution_en: e.target.value })}
                        placeholder="How does the system resolve the issue technically?"
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Architecture Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Visão Geral da Arquitetura (PT) *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formData.architecture_overview_pt}
                        onChange={(e) => setFormData({ ...formData, architecture_overview_pt: e.target.value })}
                        placeholder="Estrutura de camadas, desacoplamento e fluxo de dados..."
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Architecture Overview (EN) *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formData.architecture_overview_en}
                        onChange={(e) => setFormData({ ...formData, architecture_overview_en: e.target.value })}
                        placeholder="Layered structure, decoupling and data flow..."
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Architecture Diagram Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Descrição do Fluxo / Diagrama (PT)
                      </label>
                      <input
                        type="text"
                        value={formData.architecture_diagram_description_pt || ''}
                        onChange={(e) => setFormData({ ...formData, architecture_diagram_description_pt: e.target.value })}
                        placeholder="Ex: React SPA → Supabase Auth → PostgreSQL RLS → JSON Response"
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Diagram Flow String (EN)
                      </label>
                      <input
                        type="text"
                        value={formData.architecture_diagram_description_en || ''}
                        onChange={(e) => setFormData({ ...formData, architecture_diagram_description_en: e.target.value })}
                        placeholder="Ex: React SPA → Supabase Auth → PostgreSQL RLS → JSON Response"
                        className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Highlights List */}
                  <div className="bg-[#141418] p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Destaques da Arquitetura (Highlights)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            architecture_highlights_pt: [...formData.architecture_highlights_pt, ''],
                            architecture_highlights_en: [...formData.architecture_highlights_en, ''],
                          });
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Item</span>
                      </button>
                    </div>

                    {formData.architecture_highlights_pt.map((hl, index) => (
                      <div key={index} className="flex gap-2 items-start bg-[#0D0D10] p-2.5 rounded-lg border border-slate-800">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={hl}
                            onChange={(e) => {
                              const updated = [...formData.architecture_highlights_pt];
                              updated[index] = e.target.value;
                              setFormData({ ...formData, architecture_highlights_pt: updated });
                            }}
                            placeholder={`Destaque #${index + 1} em Português...`}
                            className="w-full bg-[#141418] border border-slate-800 rounded px-3 py-1.5 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={formData.architecture_highlights_en[index] || ''}
                            onChange={(e) => {
                              const updated = [...formData.architecture_highlights_en];
                              updated[index] = e.target.value;
                              setFormData({ ...formData, architecture_highlights_en: updated });
                            }}
                            placeholder={`Highlight #${index + 1} in English...`}
                            className="w-full bg-[#141418] border border-slate-800 rounded px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedPt = formData.architecture_highlights_pt.filter((_, i) => i !== index);
                            const updatedEn = formData.architecture_highlights_en.filter((_, i) => i !== index);
                            setFormData({
                              ...formData,
                              architecture_highlights_pt: updatedPt.length ? updatedPt : [''],
                              architecture_highlights_en: updatedEn.length ? updatedEn : [''],
                            });
                          }}
                          className="text-red-400 hover:text-red-300 p-1 mt-1"
                          title="Remover linha"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: FEATURES, TECHNOLOGIES & DANIEL'S ROLE */}
              {activeTab === 'features' && (
                <div className="space-y-5">
                  {/* Features List */}
                  <div className="bg-[#141418] p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Funcionalidades Principais (Features)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            features_pt: [...formData.features_pt, ''],
                            features_en: [...formData.features_en, ''],
                          });
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Funcionalidade</span>
                      </button>
                    </div>

                    {formData.features_pt.map((feat, index) => (
                      <div key={index} className="flex gap-2 items-start bg-[#0D0D10] p-2.5 rounded-lg border border-slate-800">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) => {
                              const updated = [...formData.features_pt];
                              updated[index] = e.target.value;
                              setFormData({ ...formData, features_pt: updated });
                            }}
                            placeholder={`Funcionalidade #${index + 1} (PT)...`}
                            className="w-full bg-[#141418] border border-slate-800 rounded px-3 py-1.5 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={formData.features_en[index] || ''}
                            onChange={(e) => {
                              const updated = [...formData.features_en];
                              updated[index] = e.target.value;
                              setFormData({ ...formData, features_en: updated });
                            }}
                            placeholder={`Feature #${index + 1} (EN)...`}
                            className="w-full bg-[#141418] border border-slate-800 rounded px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedPt = formData.features_pt.filter((_, i) => i !== index);
                            const updatedEn = formData.features_en.filter((_, i) => i !== index);
                            setFormData({
                              ...formData,
                              features_pt: updatedPt.length ? updatedPt : [''],
                              features_en: updatedEn.length ? updatedEn : [''],
                            });
                          }}
                          className="text-red-400 hover:text-red-300 p-1 mt-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Technologies List */}
                  <div className="bg-[#141418] p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-blue-400" />
                        Tecnologias Utilizadas & Papel da Ferramenta
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            technologies: [...formData.technologies, { name: '', role_pt: '', role_en: '' }],
                          });
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Tecnologia</span>
                      </button>
                    </div>

                    {formData.technologies.map((tech, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#0D0D10] p-3 rounded-lg border border-slate-800 items-center">
                        <div>
                          <input
                            type="text"
                            value={tech.name}
                            onChange={(e) => {
                              const updated = [...formData.technologies];
                              updated[index] = { ...updated[index], name: e.target.value };
                              setFormData({ ...formData, technologies: updated });
                            }}
                            placeholder="Nome (ex: PostgreSQL)"
                            className="w-full bg-[#141418] border border-slate-800 rounded px-3 py-1.5 text-xs text-white font-bold"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={tech.role_pt || tech.role || ''}
                            onChange={(e) => {
                              const updated = [...formData.technologies];
                              updated[index] = { ...updated[index], role_pt: e.target.value, role: e.target.value };
                              setFormData({ ...formData, technologies: updated });
                            }}
                            placeholder="Papel no projeto (PT)"
                            className="w-full bg-[#141418] border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-300"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={tech.role_en || ''}
                            onChange={(e) => {
                              const updated = [...formData.technologies];
                              updated[index] = { ...updated[index], role_en: e.target.value };
                              setFormData({ ...formData, technologies: updated });
                            }}
                            placeholder="Role in project (EN)"
                            className="flex-1 bg-[#141418] border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.technologies.filter((_, i) => i !== index);
                              setFormData({ ...formData, technologies: updated.length ? updated : [{ name: '', role_pt: '', role_en: '' }] });
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Daniel's Role */}
                  <div className="bg-[#141418] p-4 rounded-xl border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                      <UserCheck className="w-4 h-4 text-blue-400" />
                      <span>Participação & Papel de Daniel</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium">Título do Papel (PT)</label>
                        <input
                          type="text"
                          value={formData.daniel_role_title_pt}
                          onChange={(e) => setFormData({ ...formData, daniel_role_title_pt: e.target.value })}
                          placeholder="Ex: Arquiteto de Software e Desenvolvedor Fullstack"
                          className="w-full bg-[#0D0D10] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium">Role Title (EN)</label>
                        <input
                          type="text"
                          value={formData.daniel_role_title_en}
                          onChange={(e) => setFormData({ ...formData, daniel_role_title_en: e.target.value })}
                          placeholder="Ex: Software Architect & Fullstack Developer"
                          className="w-full bg-[#0D0D10] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white mt-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">
                          Contribuições Específicas de Daniel
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              daniel_role_contributions_pt: [...formData.daniel_role_contributions_pt, ''],
                              daniel_role_contributions_en: [...formData.daniel_role_contributions_en, ''],
                            });
                          }}
                          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Adicionar Contribuição</span>
                        </button>
                      </div>

                      {formData.daniel_role_contributions_pt.map((contrib, index) => (
                        <div key={index} className="flex gap-2 items-start bg-[#0D0D10] p-2.5 rounded-lg border border-slate-800">
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={contrib}
                              onChange={(e) => {
                                const updated = [...formData.daniel_role_contributions_pt];
                                updated[index] = e.target.value;
                                setFormData({ ...formData, daniel_role_contributions_pt: updated });
                              }}
                              placeholder={`Contribuição #${index + 1} (PT)...`}
                              className="w-full bg-[#141418] border border-slate-800 rounded px-3 py-1.5 text-xs text-white"
                            />
                            <input
                              type="text"
                              value={formData.daniel_role_contributions_en[index] || ''}
                              onChange={(e) => {
                                const updated = [...formData.daniel_role_contributions_en];
                                updated[index] = e.target.value;
                                setFormData({ ...formData, daniel_role_contributions_en: updated });
                              }}
                              placeholder={`Contribution #${index + 1} (EN)...`}
                              className="w-full bg-[#141418] border border-slate-800 rounded px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedPt = formData.daniel_role_contributions_pt.filter((_, i) => i !== index);
                              const updatedEn = formData.daniel_role_contributions_en.filter((_, i) => i !== index);
                              setFormData({
                                ...formData,
                                daniel_role_contributions_pt: updatedPt.length ? updatedPt : [''],
                                daniel_role_contributions_en: updatedEn.length ? updatedEn : [''],
                              });
                            }}
                            className="text-red-400 hover:text-red-300 p-1 mt-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: REAL MEDIA GALLERY */}
              {activeTab === 'gallery' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-blue-400" />
                        Galeria de Screenshots & Mockups Reais
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Selecione imagens reais do Supabase Storage. Elas serão renderizadas diretamente na página pública do case.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setTargetGalleryIndex(null);
                        setIsMediaPickerOpen(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Imagem à Galeria</span>
                    </button>
                  </div>

                  {formData.gallery.length === 0 ? (
                    <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center space-y-3 bg-[#141418]">
                      <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
                      <span className="text-xs font-semibold text-slate-300 block">
                        Nenhuma imagem vinculada a este projeto
                      </span>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                        Abra o seletor de mídia para enviar prints de telas reais do dashboard, fluxos de uso ou diagramas.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setTargetGalleryIndex(null);
                          setIsMediaPickerOpen(true);
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-medium transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-blue-400" />
                        <span>Abrir Seletor de Mídia</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.gallery.map((item, gIdx) => (
                        <div
                          key={gIdx}
                          className="bg-[#141418] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start"
                        >
                          {/* Image Thumbnail Preview */}
                          <div className="w-full md:w-48 aspect-video bg-[#0A0A0C] rounded-lg border border-slate-800 overflow-hidden shrink-0 relative group">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.title_pt || item.title || 'Screenshot'}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-600">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setTargetGalleryIndex(gIdx);
                                setIsMediaPickerOpen(true);
                              }}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Trocar Imagem</span>
                            </button>
                          </div>

                          {/* Image Form Fields */}
                          <div className="flex-1 space-y-2.5 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400">Título da Imagem (PT)</label>
                                <input
                                  type="text"
                                  value={item.title_pt || item.title || ''}
                                  onChange={(e) => {
                                    const updated = [...formData.gallery];
                                    updated[gIdx] = { ...updated[gIdx], title_pt: e.target.value, title: e.target.value };
                                    setFormData({ ...formData, gallery: updated });
                                  }}
                                  placeholder="Ex: Visão do Dashboard Principal"
                                  className="w-full bg-[#0D0D10] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white mt-0.5"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400">Image Title (EN)</label>
                                <input
                                  type="text"
                                  value={item.title_en || ''}
                                  onChange={(e) => {
                                    const updated = [...formData.gallery];
                                    updated[gIdx] = { ...updated[gIdx], title_en: e.target.value };
                                    setFormData({ ...formData, gallery: updated });
                                  }}
                                  placeholder="Ex: Main Dashboard View"
                                  className="w-full bg-[#0D0D10] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white mt-0.5"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400">Descrição (PT)</label>
                                <input
                                  type="text"
                                  value={item.description_pt || item.description || ''}
                                  onChange={(e) => {
                                    const updated = [...formData.gallery];
                                    updated[gIdx] = { ...updated[gIdx], description_pt: e.target.value, description: e.target.value };
                                    setFormData({ ...formData, gallery: updated });
                                  }}
                                  placeholder="Ex: Painel com métricas consolidadas em tempo real"
                                  className="w-full bg-[#0D0D10] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white mt-0.5"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400">Description (EN)</label>
                                <input
                                  type="text"
                                  value={item.description_en || ''}
                                  onChange={(e) => {
                                    const updated = [...formData.gallery];
                                    updated[gIdx] = { ...updated[gIdx], description_en: e.target.value };
                                    setFormData({ ...formData, gallery: updated });
                                  }}
                                  placeholder="Ex: Real-time aggregated ticket metrics"
                                  className="w-full bg-[#0D0D10] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white mt-0.5"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400">Legenda Inferior (PT)</label>
                                <input
                                  type="text"
                                  value={item.caption_pt || item.caption || ''}
                                  onChange={(e) => {
                                    const updated = [...formData.gallery];
                                    updated[gIdx] = { ...updated[gIdx], caption_pt: e.target.value, caption: e.target.value };
                                    setFormData({ ...formData, gallery: updated });
                                  }}
                                  placeholder="Ex: Dashboard Operis em produção"
                                  className="w-full bg-[#0D0D10] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white mt-0.5"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400">Bottom Caption (EN)</label>
                                <input
                                  type="text"
                                  value={item.caption_en || ''}
                                  onChange={(e) => {
                                    const updated = [...formData.gallery];
                                    updated[gIdx] = { ...updated[gIdx], caption_en: e.target.value };
                                    setFormData({ ...formData, gallery: updated });
                                  }}
                                  placeholder="Ex: Live Operis dashboard console"
                                  className="w-full bg-[#0D0D10] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white mt-0.5"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Reorder & Remove */}
                          <div className="flex md:flex-col items-center gap-1.5 shrink-0 self-end md:self-center">
                            <button
                              type="button"
                              disabled={gIdx === 0}
                              onClick={() => {
                                const updated = [...formData.gallery];
                                const temp = updated[gIdx];
                                updated[gIdx] = updated[gIdx - 1];
                                updated[gIdx - 1] = temp;
                                setFormData({ ...formData, gallery: updated });
                              }}
                              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-20"
                              title="Subir posição"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={gIdx === formData.gallery.length - 1}
                              onClick={() => {
                                const updated = [...formData.gallery];
                                const temp = updated[gIdx];
                                updated[gIdx] = updated[gIdx + 1];
                                updated[gIdx + 1] = temp;
                                setFormData({ ...formData, gallery: updated });
                              }}
                              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-20"
                              title="Descer posição"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formData.gallery.filter((_, i) => i !== gIdx);
                                setFormData({ ...formData, gallery: updated });
                              }}
                              className="p-1.5 text-red-400 hover:text-red-300"
                              title="Remover imagem da galeria"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: LINKS & EXTERNAL RESOURCES */}
              {activeTab === 'links' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <LinkIcon className="w-4 h-4 text-blue-400" />
                        Links & Recursos Externos
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Adicione links para repositórios GitHub, documentações técnicas ou demonstrações.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          links: [...formData.links, { label: '', url: '', type: 'github' }],
                        });
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Link</span>
                    </button>
                  </div>

                  {formData.links.length === 0 ? (
                    <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center space-y-2 bg-[#141418]">
                      <LinkIcon className="w-6 h-6 text-slate-600 mx-auto" />
                      <span className="text-xs text-slate-400 block">Nenhum link cadastrado para este projeto</span>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {formData.links.map((link, lIdx) => (
                        <div
                          key={lIdx}
                          className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#141418] p-3 rounded-lg border border-slate-800 items-center"
                        >
                          <div>
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => {
                                const updated = [...formData.links];
                                updated[lIdx] = { ...updated[lIdx], label: e.target.value };
                                setFormData({ ...formData, links: updated });
                              }}
                              placeholder="Rótulo (ex: Repositório GitHub)"
                              className="w-full bg-[#0D0D10] border border-slate-800 rounded px-3 py-1.5 text-xs text-white font-medium"
                            />
                          </div>
                          <div>
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) => {
                                const updated = [...formData.links];
                                updated[lIdx] = { ...updated[lIdx], url: e.target.value };
                                setFormData({ ...formData, links: updated });
                              }}
                              placeholder="URL (ex: https://github.com/...)"
                              className="w-full bg-[#0D0D10] border border-slate-800 rounded px-3 py-1.5 text-xs text-white font-mono"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={link.type}
                              onChange={(e) => {
                                const updated = [...formData.links];
                                updated[lIdx] = { ...updated[lIdx], type: e.target.value as any };
                                setFormData({ ...formData, links: updated });
                              }}
                              className="flex-1 bg-[#0D0D10] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300"
                            >
                              <option value="github">GitHub</option>
                              <option value="demo">Demonstração / Live</option>
                              <option value="docs">Documentação</option>
                              <option value="internal">Interno</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formData.links.filter((_, i) => i !== lIdx);
                                setFormData({ ...formData, links: updated });
                              }}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-blue-600/20"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{editingProject ? 'Salvar Alterações do Projeto' : 'Publicar Novo Projeto'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEDIA PICKER MODAL (CALLED FROM GALLERY TAB) */}
      {isMediaPickerOpen && (
        <MediaPicker
          isOpen={isMediaPickerOpen}
          onClose={() => {
            setIsMediaPickerOpen(false);
            setTargetGalleryIndex(null);
          }}
          onSelect={handleMediaSelected}
        />
      )}

      {/* LINKEDIN POST GENERATOR MODAL */}
      {linkedInProject && (
        <LinkedInPostModal
          isOpen={!!linkedInProject}
          onClose={() => setLinkedInProject(null)}
          project={{
            title: linkedInProject.title,
            subtitle_pt: linkedInProject.subtitle_pt,
            subtitle_en: linkedInProject.subtitle_en,
            short_summary_pt: linkedInProject.short_summary_pt,
            short_summary_en: linkedInProject.short_summary_en,
            category_pt: linkedInProject.category_pt,
            category_en: linkedInProject.category_en,
            problem_pt: linkedInProject.problem_pt,
            problem_en: linkedInProject.problem_en,
            solution_pt: linkedInProject.solution_pt,
            solution_en: linkedInProject.solution_en,
            features_pt: (linkedInProject.features_pt || []).filter(Boolean),
            features_en: (linkedInProject.features_en || []).filter(Boolean),
            technologies: (linkedInProject.technologies || []).map((t) => t.name).filter(Boolean),
            project_url: `${window.location.origin}/projetos/${linkedInProject.slug}`,
          }}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {projectToDelete && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-slate-800 rounded-xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Excluir Case de Projeto?</h4>
                <p className="text-xs text-slate-400">Esta ação removerá o projeto e todos os seus dados do banco.</p>
              </div>
            </div>

            <div className="p-3 bg-[#0D0D10] rounded-lg border border-slate-800 space-y-1 text-xs">
              <span className="font-semibold text-slate-200 block">{projectToDelete.title}</span>
              <span className="text-slate-500 font-mono text-[11px] block">/projetos/{projectToDelete.slug}</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProjectToDelete(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteProject}
                className="px-4 py-1.5 text-xs bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg flex items-center gap-1.5"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Confirmar Exclusão</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
