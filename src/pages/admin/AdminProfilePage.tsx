import React, { useState, useEffect } from 'react';
import { useProfile } from '../../content/ContentProvider.tsx';
import { isSupabaseConfigured, supabase } from '../../lib/supabase.ts';
import { MediaPicker } from '../../admin/components/MediaPicker.tsx';
import { MediaAsset } from '../../content/types.ts';
import {
  User,
  Save,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  GraduationCap,
  Award,
  Globe,
  Sliders,
  Info,
  Layers,
  Sparkles,
  Image as ImageIcon,
  Camera,
  UploadCloud,
  X
} from 'lucide-react';
import { EducationItem, CertificationItem } from '../../content/types.ts';

export const AdminProfilePage: React.FC = () => {
  const currentProfile = useProfile();

  // Active language tab for editing bilingual fields
  const [activeLangTab, setActiveLangTab] = useState<'pt' | 'en'>('pt');

  // Form states
  const [name, setName] = useState(currentProfile.name);
  const [shortName, setShortName] = useState(currentProfile.shortName);
  const [initials, setInitials] = useState(currentProfile.initials);
  const [avatarMediaId, setAvatarMediaId] = useState<string | null>(currentProfile.avatarMediaId || null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentProfile.photoUrl || null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [location, setLocation] = useState(currentProfile.location);
  const [email, setEmail] = useState(currentProfile.email);
  const [linkedin, setLinkedin] = useState(currentProfile.linkedin);
  const [linkedinDisplay, setLinkedinDisplay] = useState(currentProfile.linkedinDisplay);
  const [github, setGithub] = useState(currentProfile.github);
  const [githubDisplay, setGithubDisplay] = useState(currentProfile.githubDisplay);

  // Bilingual Roles & Bio
  const [currentRolePt, setCurrentRolePt] = useState(currentProfile.currentRole);
  const [currentRoleEn, setCurrentRoleEn] = useState('IT Support Technician (L1)');
  const [targetRolePt, setTargetRolePt] = useState(currentProfile.targetRole);
  const [targetRoleEn, setTargetRoleEn] = useState('Systems & Infrastructure Analyst');
  const [headlinePt, setHeadlinePt] = useState(currentProfile.headline);
  const [headlineEn, setHeadlineEn] = useState('IT Support Technician transitioning to Systems & Infrastructure Analyst');
  const [shortSummaryPt, setShortSummaryPt] = useState(currentProfile.shortSummary);
  const [shortSummaryEn, setShortSummaryEn] = useState('IT professional with hands-on experience in corporate IT support...');
  const [fullBioPtText, setFullBioPtText] = useState(currentProfile.fullBio.join('\n\n'));
  const [fullBioEnText, setFullBioEnText] = useState(currentProfile.fullBio.join('\n\n'));
  const [availabilityPt, setAvailabilityPt] = useState(currentProfile.availability);
  const [availabilityEn, setAvailabilityEn] = useState('Available for new opportunities & career transition');

  // Work Focus (Validation: Sum = 100%)
  const [infraPercentage, setInfraPercentage] = useState<number>(currentProfile.workFocus.infraPercentage);
  const [systemsPercentage, setSystemsPercentage] = useState<number>(currentProfile.workFocus.systemsPercentage);
  const [infraLabelPt, setInfraLabelPt] = useState(currentProfile.workFocus.infraLabel);
  const [infraLabelEn, setInfraLabelEn] = useState('Infrastructure & Networks');
  const [systemsLabelPt, setSystemsLabelPt] = useState(currentProfile.workFocus.systemsLabel);
  const [systemsLabelEn, setSystemsLabelEn] = useState('Systems & Development');
  const [workFocusNotePt, setWorkFocusNotePt] = useState(currentProfile.workFocus.note);
  const [workFocusNoteEn, setWorkFocusNoteEn] = useState('Actual technical focus and scope distribution...');

  // Education list
  const [educationList, setEducationList] = useState<EducationItem[]>(currentProfile.education || []);

  // Certifications list
  const [certificationsList, setCertificationsList] = useState<CertificationItem[]>(currentProfile.certifications || []);

  // Saving state & feedback
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validation
  const sumWorkFocus = Number(infraPercentage) + Number(systemsPercentage);
  const isWorkFocusValid = sumWorkFocus === 100;

  // Sync with initial profile if loaded
  useEffect(() => {
    setName(currentProfile.name);
    setShortName(currentProfile.shortName);
    setInitials(currentProfile.initials);
    setAvatarMediaId(currentProfile.avatarMediaId || null);
    setAvatarUrl(currentProfile.photoUrl || null);
    setLocation(currentProfile.location);
    setEmail(currentProfile.email);
    setLinkedin(currentProfile.linkedin);
    setLinkedinDisplay(currentProfile.linkedinDisplay);
    setGithub(currentProfile.github);
    setGithubDisplay(currentProfile.githubDisplay);
    setInfraPercentage(currentProfile.workFocus.infraPercentage);
    setSystemsPercentage(currentProfile.workFocus.systemsPercentage);
    setEducationList(currentProfile.education || []);
    setCertificationsList(currentProfile.certifications || []);
  }, [currentProfile]);

  // Handle infra slider change and auto-adjust systems
  const handleInfraSliderChange = (newInfra: number) => {
    const clampedInfra = Math.max(0, Math.min(100, newInfra));
    setInfraPercentage(clampedInfra);
    setSystemsPercentage(100 - clampedInfra);
  };

  // Education helpers
  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: 'Instituição de Ensino',
      degree: 'Bacharelado / Graduação',
      field: 'Engenharia de Software / TI',
      period: '2024 — 2028',
      status: 'Em andamento',
      description: 'Descrição do curso e disciplinas principais.',
      highlights: ['Destaque acadêmico ou projeto prático'],
    };
    setEducationList([...educationList, newEdu]);
  };

  const handleUpdateEducation = (index: number, updated: Partial<EducationItem>) => {
    const updatedList = [...educationList];
    updatedList[index] = { ...updatedList[index], ...updated };
    setEducationList(updatedList);
  };

  const handleDeleteEducation = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  const handleMoveEducation = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === educationList.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...educationList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setEducationList(updated);
  };

  // Certification helpers
  const handleAddCertification = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: 'Nova Certificação Técnica',
      issuer: 'Emissor / Instituição',
      year: new Date().getFullYear().toString(),
    };
    setCertificationsList([...certificationsList, newCert]);
  };

  const handleUpdateCertification = (index: number, updated: Partial<CertificationItem>) => {
    const updatedList = [...certificationsList];
    updatedList[index] = { ...updatedList[index], ...updated };
    setCertificationsList(updatedList);
  };

  const handleDeleteCertification = (index: number) => {
    setCertificationsList(certificationsList.filter((_, i) => i !== index));
  };

  const handleMoveCertification = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === certificationsList.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...certificationsList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setCertificationsList(updated);
  };

  // Submit Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!isWorkFocusValid) {
      setErrorMessage(`A soma dos percentuais de foco de atuação precisa ser exatamente 100%. Soma atual: ${sumWorkFocus}%.`);
      return;
    }

    setSaving(true);

    try {
      const bioPtArray = fullBioPtText.split('\n\n').map(p => p.trim()).filter(Boolean);
      const bioEnArray = fullBioEnText.split('\n\n').map(p => p.trim()).filter(Boolean);

      if (isSupabaseConfigured) {
        // Upsert profile in Supabase
        const { error: profileError } = await supabase.from('profiles').upsert(
          {
            name,
            short_name: shortName,
            initials,
            avatar_media_id: avatarMediaId || null,
            current_role_pt: currentRolePt,
            current_role_en: currentRoleEn,
            target_role_pt: targetRolePt,
            target_role_en: targetRoleEn,
            headline_pt: headlinePt,
            headline_en: headlineEn,
            short_summary_pt: shortSummaryPt,
            short_summary_en: shortSummaryEn,
            full_bio_pt: bioPtArray,
            full_bio_en: bioEnArray,
            location,
            email,
            linkedin,
            linkedin_display: linkedinDisplay,
            github,
            github_display: githubDisplay,
            availability_pt: availabilityPt,
            availability_en: availabilityEn,
            work_focus_infra_percentage: Number(infraPercentage),
            work_focus_systems_percentage: Number(systemsPercentage),
            work_focus_infra_label_pt: infraLabelPt,
            work_focus_infra_label_en: infraLabelEn,
            work_focus_systems_label_pt: systemsLabelPt,
            work_focus_systems_label_en: systemsLabelEn,
            work_focus_note_pt: workFocusNotePt,
            work_focus_note_en: workFocusNoteEn,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'email' }
        );

        if (profileError) {
          throw profileError;
        }

        // Save education items
        for (let i = 0; i < educationList.length; i++) {
          const edu = educationList[i];
          await supabase.from('education_items').upsert({
            id: edu.id,
            institution: edu.institution,
            degree_pt: edu.degree,
            degree_en: edu.degree,
            field_pt: edu.field,
            field_en: edu.field,
            period_pt: edu.period,
            period_en: edu.period,
            status_pt: edu.status,
            status_en: edu.status,
            description_pt: edu.description || '',
            description_en: edu.description || '',
            highlights_pt: edu.highlights || [],
            highlights_en: edu.highlights || [],
            sort_order: i + 1,
            status: 'published',
            updated_at: new Date().toISOString(),
          });
        }

        // Save certifications
        for (let i = 0; i < certificationsList.length; i++) {
          const c = certificationsList[i];
          await supabase.from('certification_items').upsert({
            id: c.id,
            name_pt: c.name,
            name_en: c.name,
            issuer: c.issuer,
            year: c.year,
            credential_url: c.credentialUrl || '',
            badge: c.badge || '',
            sort_order: i + 1,
            status: 'published',
            updated_at: new Date().toISOString(),
          });
        }
      }

      // Trigger custom update event so CloudContentProvider syncs in real-time
      window.dispatchEvent(new CustomEvent('cv_content_updated'));

      setSuccessMessage('Perfil e foco de atuação salvos com sucesso!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setErrorMessage(err.message || 'Falha ao salvar dados do perfil no banco');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveProfile} className="space-y-8" id="admin-profile-form">
      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <User className="w-4 h-4" />
            <span>Administração • Perfil</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Perfil & Foco de Atuação
          </h1>
        </div>

        <button
          type="submit"
          disabled={saving || !isWorkFocusValid}
          id="profile-save-btn"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Gravando no Banco...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </>
          )}
        </button>
      </div>

      {/* Alert Notifications */}
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

      {/* Language Switcher Tabs for Multilingual fields */}
      <div className="flex items-center justify-between bg-[#111113] border border-slate-800 p-2 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 pl-2">
          <Globe className="w-4 h-4 text-blue-400" />
          <span>Idioma dos Textos Descritivos:</span>
        </div>

        <div className="flex items-center gap-1 bg-[#16161B] p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveLangTab('pt')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeLangTab === 'pt'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Português (PT-BR)
          </button>
          <button
            type="button"
            onClick={() => setActiveLangTab('en')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeLangTab === 'en'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            English (EN-US)
          </button>
        </div>
      </div>

      {/* 1. Identification & Contact */}
      <section className="bg-[#111113] border border-slate-800/90 rounded-xl p-6 space-y-6">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          <span>1. Dados Cadastrais, Foto & Contato</span>
        </h2>

        {/* Photo Avatar Management via Supabase Storage MediaPicker */}
        <div className="bg-[#16161B] border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Round Avatar Preview */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-[2px] shadow-xl shadow-blue-500/10 overflow-hidden flex items-center justify-center bg-[#111113]">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name || 'Avatar'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#111113] flex items-center justify-center text-2xl font-extrabold text-blue-400 tracking-wider">
                  {initials || 'DS'}
                </div>
              )}
            </div>
            {avatarUrl && (
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#16161B]" title="Foto ativa vinculada" />
            )}
          </div>

          {/* Photo Controls & Recommendations */}
          <div className="space-y-3 flex-1">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Foto de Perfil (Avatar Oficial)</h3>
                <span className="text-[10px] font-mono font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                  Supabase Storage • RLS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                A foto de perfil é gerenciada como asset real de mídia do Supabase Storage e exibida na barra lateral, no cabeçalho e na apresentação pública.
              </p>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                💡 <strong className="text-slate-400 font-semibold">Recomendado:</strong> imagem quadrada, proporção 1:1, mínimo 400x400px (Máx. 5MB • JPG, PNG, WEBP, SVG).
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                id="btn-change-avatar"
                onClick={() => setIsMediaPickerOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{avatarUrl ? 'Alterar Foto de Perfil' : 'Selecionar Foto de Perfil'}</span>
              </button>

              {avatarUrl && (
                <button
                  type="button"
                  id="btn-remove-avatar"
                  onClick={() => {
                    setAvatarMediaId(null);
                    setAvatarUrl(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1F1F24] hover:bg-rose-950/40 border border-slate-700 hover:border-rose-800 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Remover Foto (Usar Iniciais)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Nome de Exibição
            </label>
            <input
              type="text"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Iniciais (Avatar)
            </label>
            <input
              type="text"
              value={initials}
              onChange={(e) => setInitials(e.target.value)}
              className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              maxLength={4}
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              E-mail de Contato
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Status de Disponibilidade
            </label>
            {activeLangTab === 'pt' ? (
              <input
                type="text"
                value={availabilityPt}
                onChange={(e) => setAvailabilityPt(e.target.value)}
                className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                required
              />
            ) : (
              <input
                type="text"
                value={availabilityEn}
                onChange={(e) => setAvailabilityEn(e.target.value)}
                className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                required
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              LinkedIn URL
            </label>
            <input
              type="text"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              GitHub URL
            </label>
            <input
              type="text"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 2. Headline & Biografia */}
      <section className="bg-[#111113] border border-slate-800/90 rounded-xl p-6 space-y-4">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>2. Cargos, Headline & Biografia</span>
          </span>
          <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            Editando: {activeLangTab === 'pt' ? 'Português' : 'English'}
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Cargo Atual ({activeLangTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={activeLangTab === 'pt' ? currentRolePt : currentRoleEn}
              onChange={(e) =>
                activeLangTab === 'pt' ? setCurrentRolePt(e.target.value) : setCurrentRoleEn(e.target.value)
              }
              className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Cargo Alvo ({activeLangTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={activeLangTab === 'pt' ? targetRolePt : targetRoleEn}
              onChange={(e) =>
                activeLangTab === 'pt' ? setTargetRolePt(e.target.value) : setTargetRoleEn(e.target.value)
              }
              className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Headline Profissional ({activeLangTab.toUpperCase()})
          </label>
          <input
            type="text"
            value={activeLangTab === 'pt' ? headlinePt : headlineEn}
            onChange={(e) =>
              activeLangTab === 'pt' ? setHeadlinePt(e.target.value) : setHeadlineEn(e.target.value)
            }
            className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Resumo Curto (Short Summary - {activeLangTab.toUpperCase()})
          </label>
          <textarea
            rows={2}
            value={activeLangTab === 'pt' ? shortSummaryPt : shortSummaryEn}
            onChange={(e) =>
              activeLangTab === 'pt' ? setShortSummaryPt(e.target.value) : setShortSummaryEn(e.target.value)
            }
            className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none leading-relaxed"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Biografia Completa (Parágrafos separados por duas quebras de linha - {activeLangTab.toUpperCase()})
          </label>
          <textarea
            rows={5}
            value={activeLangTab === 'pt' ? fullBioPtText : fullBioEnText}
            onChange={(e) =>
              activeLangTab === 'pt' ? setFullBioPtText(e.target.value) : setFullBioEnText(e.target.value)
            }
            className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono text-[11px] leading-relaxed"
            required
          />
        </div>
      </section>

      {/* 3. Work Focus (Composição de Atuação Técnica) - STRICT 100% VALIDATION */}
      <section className="bg-[#111113] border border-slate-800/90 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>3. Composição de Atuação Técnica (Work Focus)</span>
          </h2>
          <span
            className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
              isWorkFocusValid
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            Soma: {sumWorkFocus}% {isWorkFocusValid ? '(Válido: 100%)' : '(Inválido: Deve ser 100%)'}
          </span>
        </div>

        {/* Visual Bar representation */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${infraPercentage}%` }}
              className="bg-blue-500 h-full transition-all duration-300"
            />
            <div
              style={{ width: `${systemsPercentage}%` }}
              className="bg-emerald-500 h-full transition-all duration-300"
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span className="text-blue-400 font-bold">
              {infraLabelPt}: {infraPercentage}%
            </span>
            <span className="text-emerald-400 font-bold">
              {systemsLabelPt}: {systemsPercentage}%
            </span>
          </div>
        </div>

        {/* Slider input */}
        <div className="space-y-2 pt-2">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Ajuste Dinâmico da Proporção
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={infraPercentage}
            onChange={(e) => handleInfraSliderChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Numeric inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-1">
              % Infraestrutura & Redes
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={infraPercentage}
              onChange={(e) => handleInfraSliderChange(Number(e.target.value))}
              className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              % Sistemas & Desenvolvimento
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={systemsPercentage}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSystemsPercentage(val);
                setInfraPercentage(100 - val);
              }}
              className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Note field with explicit guidance label */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
            <Info className="w-4 h-4 text-blue-400" />
            <span>Nota Explicativa da Composição (Não indica limitação ou ranking de competência)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Este texto reforça para recrutadores que este gráfico representa a distribuição prática do tempo e escopo de atuação técnica, não uma nota arbitrária.
          </p>
          <textarea
            rows={3}
            value={activeLangTab === 'pt' ? workFocusNotePt : workFocusNoteEn}
            onChange={(e) =>
              activeLangTab === 'pt' ? setWorkFocusNotePt(e.target.value) : setWorkFocusNoteEn(e.target.value)
            }
            className="w-full bg-[#16161B] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none leading-relaxed"
            required
          />
        </div>
      </section>

      {/* 4. Formação Acadêmica (Education) */}
      <section className="bg-[#111113] border border-slate-800/90 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>4. Formação Acadêmica & Graduação ({educationList.length})</span>
          </h2>

          <button
            type="button"
            onClick={handleAddEducation}
            id="add-education-item-btn"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#18181D] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>Adicionar Curso</span>
          </button>
        </div>

        <div className="space-y-4">
          {educationList.map((edu, index) => (
            <div
              key={edu.id || index}
              className="bg-[#15151A] border border-slate-800 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-white">Item #{index + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveEducation(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded bg-[#101013] text-slate-400 hover:text-white disabled:opacity-30"
                    title="Mover para cima"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveEducation(index, 'down')}
                    disabled={index === educationList.length - 1}
                    className="p-1 rounded bg-[#101013] text-slate-400 hover:text-white disabled:opacity-30"
                    title="Mover para baixo"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteEducation(index)}
                    className="p-1 rounded bg-rose-950/40 text-rose-400 hover:bg-rose-900/60"
                    title="Remover"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Instituição</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleUpdateEducation(index, { institution: e.target.value })}
                    className="w-full bg-[#101013] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Curso / Grau</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleUpdateEducation(index, { degree: e.target.value })}
                    className="w-full bg-[#101013] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Área / Campo</label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => handleUpdateEducation(index, { field: e.target.value })}
                    className="w-full bg-[#101013] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Período</label>
                  <input
                    type="text"
                    value={edu.period}
                    onChange={(e) => handleUpdateEducation(index, { period: e.target.value })}
                    className="w-full bg-[#101013] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Status</label>
                  <input
                    type="text"
                    value={edu.status}
                    onChange={(e) => handleUpdateEducation(index, { status: e.target.value })}
                    className="w-full bg-[#101013] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Certificações (Certifications) */}
      <section className="bg-[#111113] border border-slate-800/90 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            <span>5. Certificações & Cursos Técnicos ({certificationsList.length})</span>
          </h2>

          <button
            type="button"
            onClick={handleAddCertification}
            id="add-cert-item-btn"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#18181D] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>Adicionar Certificação</span>
          </button>
        </div>

        <div className="space-y-3">
          {certificationsList.map((c, index) => (
            <div
              key={c.id || index}
              className="bg-[#15151A] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Nome da Certificação</label>
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => handleUpdateCertification(index, { name: e.target.value })}
                    className="w-full bg-[#101013] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Emissor / Órgão</label>
                  <input
                    type="text"
                    value={c.issuer}
                    onChange={(e) => handleUpdateCertification(index, { issuer: e.target.value })}
                    className="w-full bg-[#101013] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Ano de Conclusão</label>
                  <input
                    type="text"
                    value={c.year}
                    onChange={(e) => handleUpdateCertification(index, { year: e.target.value })}
                    className="w-full bg-[#101013] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleMoveCertification(index, 'up')}
                  disabled={index === 0}
                  className="p-1 rounded bg-[#101013] text-slate-400 hover:text-white disabled:opacity-30"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveCertification(index, 'down')}
                  disabled={index === certificationsList.length - 1}
                  className="p-1 rounded bg-[#101013] text-slate-400 hover:text-white disabled:opacity-30"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCertification(index)}
                  className="p-1 rounded bg-rose-950/40 text-rose-400 hover:bg-rose-900/60"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Media Picker Modal for Avatar Selection */}
      <MediaPicker
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        selectedAssetId={avatarMediaId || undefined}
        onSelect={(asset: MediaAsset) => {
          setAvatarMediaId(asset.id);
          setAvatarUrl(asset.public_url);
          setIsMediaPickerOpen(false);
        }}
      />
    </form>
  );
};
