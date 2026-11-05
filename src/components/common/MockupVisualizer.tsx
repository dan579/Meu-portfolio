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
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:border-[#0877E8] flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="font-heading text-sm font-bold text-[#061B3A] flex items-center gap-2 tracking-tight">
              {item.title}
            </h4>
            {hasImage && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-slate-400 hover:text-[#0877E8] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Ampliar visualização"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed">{item.description}</p>
        </div>

        {/* Mockup Frame */}
        <div className="bg-[#061B3A] border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-inner">
          {/* Header bar / Window Chrome */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-[#09152a] border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-slate-300 font-mono ml-2 truncate max-w-[180px] sm:max-w-xs">
                {projectSlug === 'operis'
                  ? 'operis.app/console'
                  : projectSlug === 'sistema-agendamento-unifenas'
                  ? 'agendamento.unifenas.br'
                  : 'interactive-cv.preview'}
              </span>
            </div>
            <span className="text-[9px] font-mono font-bold text-[#00D4E8] bg-white/10 border border-white/10 px-2 py-0.5 rounded uppercase tracking-wider">
              {hasImage ? 'Screenshot Real' : 'Mockup Blueprint'}
            </span>
          </div>

          {/* Body Content: Real Image or Blueprint Frame */}
          {hasImage ? (
            <div
              className="relative group cursor-pointer bg-[#061B3A] flex items-center justify-center min-h-[180px] max-h-[280px] overflow-hidden"
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={item.imageUrl}
                alt={item.caption || item.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-xs">
                <Maximize2 className="w-4 h-4 text-[#00D4E8]" />
                <span>Clique para ampliar</span>
              </div>
            </div>
          ) : (
            <div className="p-6 py-10 bg-[#061B3A] font-mono text-xs flex flex-col items-center justify-center text-slate-300 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#00D4E8]">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 max-w-xs">
                <span className="text-white text-[11px] font-bold block">{item.title}</span>
                <span className="text-[10px] text-slate-300 block">{item.caption}</span>
              </div>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="text-[11px] text-[#64748B] font-mono italic pt-2 border-t border-slate-100 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#0877E8] shrink-0" />
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
            className="bg-[#061B3A] border border-white/20 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#041226]">
              <div>
                <h3 className="text-sm font-bold text-white font-heading">{item.title}</h3>
                <p className="text-xs text-slate-300">{item.caption}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)] bg-black/80 flex items-center justify-center">
              <img
                src={item.imageUrl}
                alt={item.caption || item.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[75vh] object-contain rounded-lg border border-white/15"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
