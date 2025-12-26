import React from 'react';

export const MobileHeader: React.FC = () => {
  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-sidebar'));
  };

  return (
    <header className="h-16 border-b border-white/10 flex items-center px-4 md:hidden bg-zinc-950/50 backdrop-blur-md sticky top-0 z-30">
      <button
        id="sidebar-toggle"
        onClick={toggleSidebar}
        className="p-2 text-zinc-400 hover:text-white transition-colors"
        aria-label="Toggle Sidebar"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <div className="ml-4 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 p-1">
          <img src="/logo_purple_nobackground.svg" alt="Sarkome Logo" className="w-full h-full object-contain" />
        </div>
        <span className="font-mono text-[10px] font-bold tracking-widest uppercase">Sarkome<span className="text-indigo-400">Refinery</span></span>
      </div>
    </header>
  );
};
