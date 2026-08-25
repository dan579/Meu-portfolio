import React, { useState } from 'react';
import { useProfile, useLanguage } from '../../content/ContentProvider.tsx';
import { Sidebar } from './Sidebar.tsx';
import { Menu, X } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  const profile = useProfile();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Topbar */}
      <header className="md:hidden sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px] shadow-sm shadow-blue-500/20 shrink-0">
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#121217] flex items-center justify-center text-xs font-bold text-blue-400">
                {profile.initials}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xs font-bold text-white leading-tight tracking-tight">{profile.shortName}</h1>
            <p className="text-[10px] text-blue-400 font-mono leading-none">Interactive CV</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Lang switch on mobile header */}
          <div className="flex bg-[#14141a] rounded-lg border border-slate-800/80 p-0.5 text-[10px] font-mono font-bold">
            <button
              onClick={() => setLanguage('pt')}
              className={`px-2 py-0.5 rounded-md transition-colors ${language === 'pt' ? 'bg-blue-600/30 text-blue-300' : 'text-slate-500'}`}
            >
              PT
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-md transition-colors ${language === 'en' ? 'bg-blue-600/30 text-blue-300' : 'text-slate-500'}`}
            >
              EN
            </button>
          </div>

          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-[#14141a] border border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            aria-label="Abrir menu de navegação"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full bg-[#0C0C0E] z-10 shadow-2xl flex flex-col">
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <Sidebar onItemClick={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};
