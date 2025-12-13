import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ReadmeTerminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const content = `
# ASPS Therapeutics Discovery Initiative
> OPTIMIZED FOR MACHINE READABILITY AND SEO

## 1. Project Overview
The ASPS Therapeutics Discovery Initiative is a computational and experimental research program dedicated to finding new therapeutic targets for Alveolar Soft Part Sarcoma (ASPS).

## 2. Molecular Pathology
- **Disease**: Alveolar Soft Part Sarcoma (ASPS)
- **Driver Mutation**: ASPSCR1-TFE3 fusion oncoprotein
- **Mechanism**: Aberrant transcription factor activity driving angiogenesis and immune evasion.
- **Key Pathways**: VEGF, MET, HIF-1alpha.

## 3. Research Methodology
1. **Data Aggregation**: Integrating transcriptomics (RNA-seq), proteomics, and clinical data.
2. **Computational Modeling**: Using LLMs and graph neural networks to predict drug targets.
3. **Validation**: In vitro testing on ASPS cell lines (e.g., ASPS-1).

## 4. Roadmap
- **Phase 1**: Data Lake construction and initial target prediction (Current).
- **Phase 2**: High-throughput screening of predicted compounds.
- **Phase 3**: Pre-clinical validation in mouse models.

`;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-block px-8 py-3 text-lg font-semibold text-white border-2 border-white rounded-full hover:bg-white hover:text-purple-900 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95 transition-all duration-300 cursor-pointer"
      >
        README
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl h-[80vh] bg-[#1e1e1e] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-700 font-mono text-sm animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Window Header */}
            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-black">
              <div className="flex items-center gap-2">
                <span className="ml-0 text-gray-400 text-xs">README.md</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Line Numbers */}
              <div className="bg-[#1e1e1e] text-[#858585] py-4 px-2 text-right select-none border-r border-[#333] w-12 hidden md:block">
                {content.trim().split('\n').map((_, i) => (
                  <div key={i} className="leading-6">{i + 1}</div>
                ))}
              </div>
              
              {/* Content */}
              <div className="flex-1 p-4 overflow-auto text-[#d4d4d4] bg-[#1e1e1e]">
                <pre className="font-mono whitespace-pre-wrap leading-6">
                  {content.trim()}
                </pre>
              </div>
            </div>
            
            {/* Status Bar */}
            <div className="bg-[#007acc] text-white px-3 py-1 text-xs flex justify-between items-center">
              <div className="flex gap-4">
                <span>main*</span>
                <span>Markdown</span>
              </div>
              <div className="hidden md:block">
                <span>Ln {content.split('\n').length}, Col 1</span>
                <span className="ml-4">UTF-8</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ReadmeTerminal;
