import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Hubot, X, Search, MessageSquare, Network, Brain, FlaskConical, Cpu, FileText, Gavel, CloudUpload, Code, ArrowLeft } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const toggleBtn = document.getElementById('sidebar-toggle');
      if (isOpen && sidebar && !sidebar.contains(event.target as Node) && toggleBtn && !toggleBtn.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Listen for custom toggle event
  useEffect(() => {
    const handleToggle = () => setIsOpen(!isOpen);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, [isOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        id="sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 flex flex-col bg-zinc-950/50 backdrop-blur-md transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <a href="/platform/query" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Hubot className="w-4 h-4" />
            </div>
            <span className="font-mono text-xs font-bold tracking-widest uppercase">Sarkome<span className="text-indigo-400">Refinery</span></span>
          </a>
          <button 
            className="ml-auto md:hidden text-zinc-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Investigation */}
          <div className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Investigation</h3>
            <a href="/platform/query" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-zinc-400 hover:text-white transition-colors group">
              <Search className="w-5 h-5 group-hover:text-indigo-400" />
              <span>Query Builder</span>
            </a>
            <a href="/platform/logs" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-zinc-400 hover:text-white transition-colors group">
              <MessageSquare className="w-5 h-5 group-hover:text-indigo-400" />
              <span>Sarkome Logs</span>
            </a>
          </div>

          {/* Intelligence */}
          <div className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Intelligence</h3>
            <a href="/platform/knowledge-graph" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-zinc-400 hover:text-white transition-colors group">
              <Network className="w-5 h-5 group-hover:text-indigo-400" />
              <span>Knowledge Graph</span>
            </a>
            <a href="/platform/agents" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-zinc-400 hover:text-white transition-colors group">
              <Brain className="w-5 h-5 group-hover:text-indigo-400" />
              <span>Agent Status</span>
            </a>
          </div>

          {/* Lab & Results */}
          <div className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Lab & Results</h3>
            <a href="/platform/simulation" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-zinc-400 hover:text-white transition-colors group">
              <FlaskConical className="w-5 h-5 group-hover:text-indigo-400" />
              <span>Metabolic Sim</span>
            </a>
            <a href="/platform/alphafold" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-zinc-400 hover:text-white transition-colors group">
              <Cpu className="w-5 h-5 group-hover:text-indigo-400" />
              <span>AlphaFold View</span>
            </a>
            <a href="/platform/report" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-zinc-400 hover:text-white transition-colors group">
              <FileText className="w-5 h-5 group-hover:text-indigo-400" />
              <span>Audit Report</span>
            </a>
          </div>

          {/* Governance & Ops */}
          <div className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Governance & Ops</h3>
            <a href="/platform/constitution" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-zinc-400 hover:text-white transition-colors group">
              <Gavel className="w-5 h-5 group-hover:text-indigo-400" />
              <span>Constitution</span>
            </a>
            <a href="/platform/ingestion" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-zinc-400 hover:text-white transition-colors group">
              <CloudUpload className="w-5 h-5 group-hover:text-indigo-400" />
              <span>Data Ingestion</span>
            </a>
            <a href="/platform/export" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-zinc-400 hover:text-white transition-colors group">
              <Code className="w-5 h-5 group-hover:text-indigo-400" />
              <span>Export & API</span>
            </a>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="text-[10px] text-zinc-500 font-mono mb-2 uppercase tracking-widest">Active Model</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-zinc-300">GPT-5.1-Codex-Max</span>
          </div>
        </div>
        
        <div className="p-4 border-t border-white/10">
          <a href="/" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </a>
        </div>
      </aside>
    </>
  );
};
