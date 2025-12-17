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
# Sarkome: ASPSCR1-TFE3 Therapeutics

> Sarkome is a single-asset entity (SAE) dedicated to identifying, validating, and licensing a selective protein degrader (SAR-001) for Alveolar Soft Part Sarcoma (ASPS).

## 1. The Problem: The Epistemological Gap
In the context of ultra-rare diseases like ASPS, our current operating model—facilitating bibliographic search and data retrieval—is **epistemologically insufficient**.
- **Stochastic Hallucination**: LLMs operate on statistical probability, not biological truth.
- **Fragmented Causality**: Search engines cannot independently infer causality from scattered correlation.
- **Inability to Reason**: Standard systems fail at **multi-hop reasoning**.

## 2. The Target: ASPS
Alveolar Soft Part Sarcoma (ASPS) is an ultra-rare, malignant soft tissue sarcoma driven by a single chromosomal translocation: **t(X;17)(p11;q25)**, fusing **ASPSCR1** and **TFE3**.
- **Driver**: ASPSCR1-TFE3 fusion protein.
- **Mechanism**: Nuclear hijacking, epigenetic rewiring, and massive angiogenesis.
- **Challenge**: Chemotherapy resistance and "orphan" status.

## 3. The Platform: Discovery Engine
A Neuro-Symbolic pipeline designed to ingest unstructured data, reason about it logically, and validate findings via simulation.
- **Ingestion**: NLP agents extract semantic "triplets" from literature.
- **The Brain**: Biomedical Knowledge Graph (BKG) as the "Ground Truth".
- **Reasoning**: DeepProbLog fuses neural pattern matching with symbolic logic.
- **Validation**: *In Silico* filtering via AlphaFold-Multimer and Causal Inference.

## 4. Development Roadmap
- **Phase 1: Semantic Ingestion**: Constructing the Biomedical Knowledge Graph.
- **Phase 2: The Neuro-Symbolic Logic Engine**: Enabling the system to generate novel hypotheses.
- **Phase 3: *In Silico* Simulation**: Validating candidates via structural docking and digital twins.
- **Phase 4: The Wet-Lab Validation Loop**: Converting digital code into biological results.

## 5. Investment Thesis
- **Monogenic Driver**: Single fusion protein reduces biological complexity.
- **Validated Modality**: Targeted Protein Degradation (PROTACs).
- **Capital Efficient**: Virtual model eliminates fixed lab costs.
`;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-readme"
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
            <div className="flex-1 overflow-auto bg-[#1e1e1e]">
              <div className="flex min-h-full min-w-max">
                {/* Line Numbers */}
                <div className="bg-[#1e1e1e] text-[#858585] py-4 px-2 text-right select-none border-r border-[#333] w-12 hidden md:block shrink-0 sticky left-0 z-10">
                  {content.trim().split('\n').map((_, i) => (
                    <div key={i} className="leading-6">{i + 1}</div>
                  ))}
                </div>
                
                {/* Content */}
                <div className="flex-1 p-4 text-[#d4d4d4]">
                  <pre className="font-mono whitespace-pre leading-6">
                    {content.trim()}
                  </pre>
                </div>
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
