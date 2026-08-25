import React, { useState } from 'react';
import { ProjectGalleryItem } from '../../content/types.ts';
import { CheckCircle2, Image as ImageIcon, Maximize2, X } from 'lucide-react';

interface MockupVisualizerProps {
  item: ProjectGalleryItem;
  projectSlug: string;
}

export const MockupVisualizer: React.FC<MockupVisualizerProps> = ({ item, projectSlug }) => {
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasImage = Boolean(item.imageUrl && !imageError);

  return (
    <>
      <div className="bg-[#111115]/90 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:border-slate-700/80 flex flex-col justify-between space-y-3.5 shadow-lg shadow-black/20">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 tracking-tight">
              {item.title}
            </h4>
            {hasImage && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-slate-400 hover:text-blue-400 p-1.5 rounded-lg hover:bg-[#16161c] transition-colors cursor-pointer"
                title="Ampliar visualização"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
        </div>

        {/* Mockup Frame */}
        <div className="bg-[#0D0D10] border border-slate-800/90 rounded-xl overflow-hidden flex flex-col">
          {/* Header bar / Window Chrome */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#141418] border-b border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/80" />
              <div className="w-2 h-2 rounded-full bg-amber-500/80" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
              <span className="text-[10px] text-slate-400 font-mono ml-1.5 truncate max-w-[180px] sm:max-w-xs">
                {projectSlug === 'operis'
                  ? 'operis.app/console'
                  : projectSlug === 'sistema-agendamento-unifenas'
                  ? 'agendamento.unifenas.br'
                  : 'interactive-cv.preview'}
              </span>
            </div>
            <span className="text-[9px] font-mono font-medium text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded-md uppercase tracking-wider">
              {hasImage ? 'Screenshot Real' : 'Mockup Blueprint'}
            </span>
          </div>

          {/* Body Content: Real Image or Blueprint Frame */}
          {hasImage ? (
            <div
              className="relative group cursor-pointer bg-[#0A0A0C] flex items-center justify-center min-h-[180px] max-h-[280px] overflow-hidden"
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={item.imageUrl}
                alt={item.caption || item.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-medium backdrop-blur-[2px]">
                <Maximize2 className="w-4 h-4 text-blue-400" />
                <span>Clique para ampliar</span>
              </div>
            </div>
          ) : (
            <div className="p-4 py-8 bg-[#0D0D10] font-mono text-xs flex flex-col items-center justify-center text-slate-500 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 max-w-xs">
                <span className="text-slate-300 text-[11px] font-semibold block">{item.title}</span>
                <span className="text-[10px] text-slate-400 block">{item.caption}</span>
              </div>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="text-[11px] text-slate-500 font-mono italic pt-2 border-t border-slate-800/60 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400/80 shrink-0" />
          <span className="line-clamp-1">{item.caption}</span>
        </div>
      </div>

      {/* Fullscreen Image Preview Modal */}
      {isModalOpen && hasImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#121215] border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#17171C]">
              <div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400">{item.caption}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)] bg-black/60 flex items-center justify-center">
              <img
                src={item.imageUrl}
                alt={item.caption || item.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[75vh] object-contain rounded-lg border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
