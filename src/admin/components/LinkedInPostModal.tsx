import React, { useCallback, useEffect, useState } from 'react';
import { Copy, Check, Loader2, AlertCircle, RefreshCw, X, Sparkles, Download, Image as ImageIcon } from 'lucide-react';
import { generateLinkedInPost, LinkedInPostProjectInput } from '../../lib/linkedinPostGenerator.ts';
import { generateLinkedInImage, GeneratedLinkedInImage } from '../../lib/linkedinImageGenerator.ts';

interface LinkedInPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: LinkedInPostProjectInput;
}

export const LinkedInPostModal: React.FC<LinkedInPostModalProps> = ({ isOpen, onClose, project }) => {
  // Texto
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postText, setPostText] = useState('');
  const [copied, setCopied] = useState(false);

  // Imagem
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [image, setImage] = useState<GeneratedLinkedInImage | null>(null);

  const runGenerateText = useCallback(
    async (lang: 'pt' | 'en') => {
      setLoading(true);
      setError(null);
      setCopied(false);
      try {
        const text = await generateLinkedInPost({ language: lang, project });
        setPostText(text);
      } catch (err: any) {
        setError(err?.message || 'Não foi possível gerar o post agora.');
      } finally {
        setLoading(false);
      }
    },
    [project]
  );

  const runGenerateImage = useCallback(async () => {
    setImageLoading(true);
    setImageError(null);
    try {
      const result = await generateLinkedInImage(project);
      setImage(result);
    } catch (err: any) {
      setImageError(err?.message || 'Não foi possível gerar a imagem agora.');
    } finally {
      setImageLoading(false);
    }
  }, [project]);

  useEffect(() => {
    if (isOpen) {
      setPostText('');
      setError(null);
      setLanguage('pt');
      setImage(null);
      setImageError(null);
      runGenerateText('pt');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleLanguageChange = (lang: 'pt' | 'en') => {
    if (lang === language) return;
    setLanguage(lang);
    runGenerateText(lang);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Não foi possível copiar automaticamente. Selecione o texto manualmente.');
    }
  };

  const handleDownloadImage = () => {
    if (!image) return;
    const extension = image.mimeType.includes('png') ? 'png' : 'jpg';
    const link = document.createElement('a');
    link.href = image.dataUrl;
    link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-linkedin.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#0F0F12] border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#141418]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Gerar Post para LinkedIn</h3>
              <p className="text-xs text-slate-400">
                Texto e imagem gerados por IA a partir dos dados deste projeto — revise antes de publicar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* --- Seção de texto --- */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleLanguageChange('pt')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  language === 'pt'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1A1A22] text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                Português
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  language === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1A1A22] text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                English
              </button>

              <button
                type="button"
                onClick={() => runGenerateText(language)}
                disabled={loading}
                className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1A1A22] hover:bg-slate-800 border border-slate-800 text-blue-400 hover:text-blue-300 flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Gerar novamente</span>
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-lg px-3 py-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder={loading ? 'Gerando rascunho...' : 'O texto gerado aparecerá aqui — você pode editar livremente antes de copiar.'}
              disabled={loading}
              rows={10}
              className="w-full bg-[#141418] border border-slate-800 rounded-lg px-3.5 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-y leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <p className="text-[11px] text-slate-500 max-w-md">
                Rascunho gerado por IA (Gemini). Revise fatos, tom e formatação antes de publicar.
              </p>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!postText || loading}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-blue-600/20 shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-800" />

          {/* --- Seção de imagem --- */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                Imagem para o post (opcional)
              </h4>
              <button
                type="button"
                onClick={runGenerateImage}
                disabled={imageLoading}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1A1A22] hover:bg-slate-800 border border-slate-800 text-blue-400 hover:text-blue-300 flex items-center gap-1.5 disabled:opacity-50"
              >
                {imageLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{image ? 'Gerar outra imagem' : 'Gerar imagem com IA'}</span>
              </button>
            </div>

            {imageError && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-lg px-3 py-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{imageError}</span>
              </div>
            )}

            {imageLoading && (
              <div className="flex items-center justify-center gap-2 text-slate-500 text-xs py-8 border border-dashed border-slate-800 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gerando imagem...</span>
              </div>
            )}

            {!imageLoading && image && (
              <div className="space-y-2">
                <img
                  src={image.dataUrl}
                  alt={`Imagem gerada para o post do projeto ${project.title}`}
                  className="w-full rounded-lg border border-slate-800"
                />
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-slate-500">
                    Imagem ilustrativa gerada por IA — confira se ela representa bem o projeto antes de usar.
                  </p>
                  <button
                    type="button"
                    onClick={handleDownloadImage}
                    className="bg-[#1A1A22] hover:bg-slate-800 border border-slate-800 text-blue-400 hover:text-blue-300 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar Imagem</span>
                  </button>
                </div>
              </div>
            )}

            {!imageLoading && !image && !imageError && (
              <p className="text-[11px] text-slate-500">
                Clique em "Gerar imagem com IA" para criar uma imagem ilustrativa para acompanhar o post.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
