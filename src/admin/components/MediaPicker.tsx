import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.ts';
import { MediaAsset } from '../../content/types.ts';
import {
  UploadCloud,
  Image as ImageIcon,
  Search,
  Check,
  Trash2,
  X,
  AlertCircle,
  Loader2,
  FileImage,
  RefreshCw,
  Eye,
  Info,
} from 'lucide-react';

interface MediaPickerProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelect?: (asset: MediaAsset) => void;
  selectedAssetId?: string;
  isModal?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export const MediaPicker: React.FC<MediaPickerProps> = ({
  isOpen = true,
  onClose,
  onSelect,
  selectedAssetId,
  isModal = true,
}) => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<MediaAsset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form metadata for upload
  const [altPt, setAltPt] = useState('');
  const [altEn, setAltEn] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch media assets
  const fetchAssets = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (err: any) {
      console.error('Error loading media assets:', err);
      setErrorMessage(err.message || 'Erro ao carregar banco de mídia.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
    }
  }, [isOpen, fetchAssets]);

  // Handle file validation and upload
  const processUpload = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setErrorMessage(
        `Tipo de arquivo não suportado (${file.type || 'desconhecido'}). Envie imagens em JPEG, PNG, WEBP, GIF ou SVG.`
      );
      return;
    }

    // 2. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setErrorMessage(
        `O arquivo selecionado possui ${sizeMB} MB e excede o limite máximo permitido de 5.0 MB.`
      );
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage('Supabase não configurado. Configure as variáveis de ambiente para fazer upload.');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(20);

      // Generate sanitized unique storage path
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
      const cleanBaseName = file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      const uniqueFileName = `${Date.now()}-${cleanBaseName}.${fileExt}`;
      const storagePath = `uploads/${uniqueFileName}`;

      setUploadProgress(45);

      // Upload file to 'media' bucket
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Falha no upload do storage: ${uploadError.message}`);
      }

      setUploadProgress(75);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(storagePath);

      const publicUrl = publicUrlData.publicUrl;

      // Insert record into media_assets table
      const newAssetPayload = {
        storage_path: storagePath,
        public_url: publicUrl,
        file_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        alt_text_pt: altPt.trim() || file.name,
        alt_text_en: altEn.trim() || file.name,
      };

      const { data: insertedData, error: dbError } = await supabase
        .from('media_assets')
        .insert(newAssetPayload)
        .select()
        .single();

      if (dbError) {
        throw new Error(`Erro ao registrar metadados: ${dbError.message}`);
      }

      setUploadProgress(100);
      setSuccessMessage(`Upload de "${file.name}" concluído com sucesso!`);
      setAltPt('');
      setAltEn('');

      // Refresh asset list and automatically select newly uploaded image
      await fetchAssets();

      if (onSelect && insertedData) {
        onSelect(insertedData);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMessage(err.message || 'Erro durante o envio da imagem.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  // Delete media asset
  const handleDeleteAsset = async () => {
    if (!assetToDelete) return;
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      // 1. Delete storage object
      const { error: storageErr } = await supabase.storage
        .from('media')
        .remove([assetToDelete.storage_path]);

      if (storageErr) {
        console.warn('Aviso: Não foi possível remover do storage:', storageErr);
      }

      // 2. Delete database record
      const { error: dbErr } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', assetToDelete.id);

      if (dbErr) {
        if (dbErr.code === '23503') {
          throw new Error('Esta imagem não pode ser excluída pois está associada à galeria de um projeto ativo.');
        }
        throw dbErr;
      }

      setSuccessMessage(`Asset "${assetToDelete.file_name}" excluído.`);
      setAssetToDelete(null);
      await fetchAssets();
    } catch (err: any) {
      console.error('Delete error:', err);
      setErrorMessage(err.message || 'Erro ao excluir asset.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter assets
  const filteredAssets = assets.filter((asset) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      asset.file_name.toLowerCase().includes(query) ||
      (asset.alt_text_pt && asset.alt_text_pt.toLowerCase().includes(query)) ||
      (asset.alt_text_en && asset.alt_text_en.toLowerCase().includes(query))
    );
  });

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (isModal && !isOpen) return null;

  const content = (
    <div className="flex flex-col h-full space-y-4">
      {/* Messages */}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400/80 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-400/80 hover:text-emerald-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Upload Zone & Metadata */}
      <div className="bg-[#141418] border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <UploadCloud className="w-4 h-4 text-blue-400" />
            Enviar Nova Imagem (Máx. 5MB • JPEG, PNG, WEBP)
          </span>
          <button
            type="button"
            onClick={fetchAssets}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            title="Recarregar galeria"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>

        {/* Drag & Drop Box */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-800 hover:border-slate-700 bg-[#0D0D10]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />

          {uploading ? (
            <div className="space-y-3 w-full max-w-xs">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
              <div className="space-y-1">
                <span className="text-xs text-white font-medium block">
                  Enviando arquivo para o Supabase Storage...
                </span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                <FileImage className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-200">
                Arraste uma imagem aqui ou clique para selecionar
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Formatos aceitos: JPG, PNG, WEBP, GIF (Limite: 5MB)
              </p>
            </div>
          )}
        </div>

        {/* Optional Alt Texts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <input
            type="text"
            placeholder="Texto alternativo acessível (PT)..."
            value={altPt}
            onChange={(e) => setAltPt(e.target.value)}
            disabled={uploading}
            className="bg-[#0D0D10] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Accessible alt text (EN)..."
            value={altEn}
            onChange={(e) => setAltEn(e.target.value)}
            disabled={uploading}
            className="bg-[#0D0D10] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Library Filter & Count */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141418] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="text-xs text-slate-400 font-mono self-end sm:self-center">
          {filteredAssets.length} {filteredAssets.length === 1 ? 'asset disponível' : 'assets disponíveis'}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="flex-1 overflow-y-auto min-h-[260px] max-h-[420px] pr-1">
        {loading ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-500 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span className="text-xs font-mono">Carregando catálogo de mídia...</span>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="h-48 border border-slate-800/80 rounded-xl bg-[#0F0F12] flex flex-col items-center justify-center text-slate-500 text-center p-6 space-y-2">
            <ImageIcon className="w-8 h-8 text-slate-600" />
            <span className="text-xs font-medium text-slate-300">
              {searchQuery ? 'Nenhum asset encontrado para a busca' : 'Nenhuma imagem enviada ainda'}
            </span>
            <p className="text-[11px] text-slate-500 max-w-xs">
              Faça upload de screenshots de projetos, diagramas de arquitetura ou assets para compor as galerias.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredAssets.map((asset) => {
              const isSelected = selectedAssetId === asset.id;

              return (
                <div
                  key={asset.id}
                  className={`group relative bg-[#111113] border rounded-xl overflow-hidden flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-950/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Thumbnail */}
                  <div
                    className="relative aspect-video bg-[#0A0A0C] overflow-hidden cursor-pointer flex items-center justify-center"
                    onClick={() => onSelect && onSelect(asset)}
                  >
                    <img
                      src={asset.public_url}
                      alt={asset.alt_text_pt || asset.file_name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full shadow-lg">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewAsset(asset);
                        }}
                        className="bg-black/70 hover:bg-slate-800 text-white p-1.5 rounded-lg text-xs"
                        title="Visualizar Detalhes"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAssetToDelete(asset);
                        }}
                        className="bg-red-950/80 hover:bg-red-900 border border-red-800/40 text-red-300 p-1.5 rounded-lg text-xs"
                        title="Excluir Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Info Footer */}
                  <div className="p-2.5 space-y-1 bg-[#141418] border-t border-slate-800/80">
                    <p className="text-[11px] font-semibold text-slate-200 truncate" title={asset.file_name}>
                      {asset.file_name}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{formatBytes(asset.size_bytes)}</span>
                      <span>{asset.mime_type.replace('image/', '')}</span>
                    </div>

                    {onSelect && (
                      <button
                        type="button"
                        onClick={() => onSelect(asset)}
                        className={`w-full mt-1.5 text-[10px] font-bold py-1 px-2 rounded flex items-center justify-center gap-1 transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Selecionado</span>
                          </>
                        ) : (
                          <span>Escolher Imagem</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {assetToDelete && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-slate-800 rounded-xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Excluir Asset de Mídia?</h4>
                <p className="text-xs text-slate-400">Esta ação removerá o arquivo do Storage e do banco de dados.</p>
              </div>
            </div>

            <div className="p-3 bg-[#0D0D10] rounded-lg border border-slate-800 space-y-1 text-xs">
              <span className="font-semibold text-slate-200 block truncate">{assetToDelete.file_name}</span>
              <span className="text-slate-500 font-mono text-[11px] block">{assetToDelete.storage_path}</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setAssetToDelete(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteAsset}
                className="px-4 py-1.5 text-xs bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg flex items-center gap-1.5"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Confirmar Exclusão</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Preview Modal */}
      {previewAsset && (
        <div
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setPreviewAsset(null)}
        >
          <div
            className="bg-[#121215] border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#17171C]">
              <div className="truncate pr-4">
                <h3 className="text-sm font-bold text-white truncate">{previewAsset.file_name}</h3>
                <span className="text-[11px] text-slate-400 font-mono">{formatBytes(previewAsset.size_bytes)} • {previewAsset.mime_type}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-black/70 flex items-center justify-center overflow-auto max-h-[60vh]">
              <img
                src={previewAsset.public_url}
                alt={previewAsset.alt_text_pt || previewAsset.file_name}
                referrerPolicy="no-referrer"
                className="max-h-[55vh] max-w-full object-contain rounded-lg border border-slate-800"
              />
            </div>

            <div className="p-4 bg-[#141418] border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-blue-400 font-mono text-[11px]">
                <Info className="w-3.5 h-3.5" />
                <span>URL Pública:</span>
              </div>
              <input
                type="text"
                readOnly
                value={previewAsset.public_url}
                className="w-full bg-[#0D0D10] border border-slate-800 rounded px-3 py-1.5 font-mono text-[11px] text-slate-300 select-all"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!isModal) {
    return content;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#0F0F12] border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#141418]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Biblioteca de Mídia & Assets</h3>
              <p className="text-[11px] text-slate-400">Selecione uma imagem existente ou faça upload direto</p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto flex-1">{content}</div>
      </div>
    </div>
  );
};
