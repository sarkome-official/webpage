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
The ASPS Therapeutics Discovery Initiative (Sarkome) operates as a "Single Asset Entity" focused on identifying, validating, and licensing therapeutic assets for ASPS. We replace traditional R&D infrastructure with an agentic AI core that filters global biomedical data to generate high-confidence Target Product Profiles (TPPs).

## 2. Molecular Pathology
- **Disease**: Alveolar Soft Part Sarcoma (ASPS)
- **Driver Mutation**: t(X;17)(p11;q25) translocation -> ASPSCR1-TFE3 fusion oncoprotein.
- **Mechanism**: Constitutively active transcription factor upregulating MET signaling, angiogenesis (VEGF), and immune evasion.
- **Vulnerabilities**: Extreme angiogenesis dependence and transcriptional addiction to the TFE3 fusion program.

## 3. Research Methodology: The Agentic Core
### Agent A: The Miner (Knowledge Extraction)
Scrapes PubMed/ChEMBL to find hidden relationships between TFE3 and potential inhibitors using Large Language Models.

### Agent B: The Physicist (Structural Validation)
Uses AlphaFold 3 and DiffDock to simulate binding affinity (Gibbs Free Energy) of candidates against the ASPSCR1-TFE3 IDR.

### Agent C: The Skeptic (Safety & Toxicity)
Filters for oral bioavailability (<500 Da), PAINS, and known toxicity using Tox21 and FDA databases.

## 4. Roadmap
- **Phase 1 (2026 Q1)**: Signal Identification. Data lake construction, agent deployment, and TPP generation.
- **Phase 2 (2026 Q2–Q4)**: Biological Proof. Wet-lab validation of top 3 compounds via CROs.
- **Phase 3 (2027)**: Regulatory Asset Generation. ADME/Tox panels and Pre-IND meeting request.

## 5. Machine-Readable Endpoints
- /machine/knowledge.json
- /machine/asps-targets.json
- /machine/datasets.json
`;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-readme"
      >
        README
      </button>

      <noscript>
        <div className="mt-2">
          <a href="/machine/readme.md" className="text-sm text-white/80">View README (plain)</a>
        </div>
      </noscript>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl h-[80vh] bg-[#1e1e1e] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-700 font-mono text-sm animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Window Header */}
            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-black">
              <div className="flex items-center gap-2">
                <span className="ml-0 text-gray-400 text-xs">README.md — sarkome</span>
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
