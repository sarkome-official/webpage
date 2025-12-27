import React, { useMemo } from "react";
import { LayoutGrid } from "lucide-react";
import { Card } from "@/components/ui/card";

type WhiteboardProblem = {
  phase: string;
  title: string;
  detail: string;
};

const PHASES_IN_ORDER = [
  "Phase I: The Molecular Driver (ASPSCR1-TFE3)",
  "Phase II: Epigenetic Chaos",
  "Phase III: Survival Pathways (Downstream)",
  "Phase IV: Immunology and Microenvironment",
  "Phase V: Pharmacology and Delivery",
  'Phase VI: The "Rare Disease" Problem',
] as const;

const PROBLEMS: WhiteboardProblem[] = [
  // Phase I
  {
    phase: PHASES_IN_ORDER[0],
    title: "Tertiary Structure",
    detail:
      "How exactly does the fusion protein fold compared to normal TFE3? (We currently lack a complete crystal structure).",
  },
  {
    phase: PHASES_IN_ORDER[0],
    title: "Selective Degradation",
    detail:
      "How can we design a PROTAC (degrader molecule) that eliminates the fusion without affecting healthy proteins?",
  },
  {
    phase: PHASES_IN_ORDER[0],
    title: "Genomic Binding Sites",
    detail:
      "Precisely mapping where the fusion lands on the genome using ChIP-seq techniques.",
  },
  {
    phase: PHASES_IN_ORDER[0],
    title: "Dimerization Inhibition",
    detail: "Can we prevent the protein from binding to itself to become active?",
  },
  {
    phase: PHASES_IN_ORDER[0],
    title: "DNA-Protein Disruption",
    detail:
      "How to block the protein's finger that grips the DNA without affecting other vital transcription factors?",
  },

  // Phase II
  {
    phase: PHASES_IN_ORDER[1],
    title: "Co-factor Recruitment",
    detail:
      "Identifying which enzymes (such as BRD4 or the Mediator complex) are hijacked by the fusion to open chromatin.",
  },
  {
    phase: PHASES_IN_ORDER[1],
    title: "Super-Enhancers",
    detail:
      "How to dismantle the genetic super-activators created by the fusion to keep the cancer cell alive.",
  },
  {
    phase: PHASES_IN_ORDER[1],
    title: "Histone Acetylation",
    detail:
      "Identifying the specific histones being over-acetylated to utilize selective HAT inhibitors.",
  },
  {
    phase: PHASES_IN_ORDER[1],
    title: "Chromatin Remodeling",
    detail:
      "Which complexes (such as SWI/SNF) are allowing the DNA to remain accessible to the cancer?",
  },
  {
    phase: PHASES_IN_ORDER[1],
    title: "Epigenetic Memory",
    detail:
      "If we eliminate the fusion protein, does the DNA remember being cancer, or does it return to normal?",
  },

  // Phase III
  {
    phase: PHASES_IN_ORDER[2],
    title: "The MET Enigma",
    detail:
      "Why is the MET gene always on, and how can we block it permanently without generating resistance?",
  },
  {
    phase: PHASES_IN_ORDER[2],
    title: "Extreme Angiogenesis",
    detail:
      "ASPS is among the most highly vascularized tumors. How can we starve the tumor without damaging healthy vessels?",
  },
  {
    phase: PHASES_IN_ORDER[2],
    title: "Cell Cycle Control",
    detail:
      "Validating whether CDK4/6 inhibition (such as Palbociclib) is a cure or merely a pause in growth.",
  },
  {
    phase: PHASES_IN_ORDER[2],
    title: "Mitochondrial Biogenesis",
    detail:
      "ASPS has a unique metabolism. How can we block its energy factories (mitochondria) without affecting the rest of the body?",
  },
  {
    phase: PHASES_IN_ORDER[2],
    title: "Differentiation Suppression",
    detail: "Can we force the ASPS cell to mature and stop dividing?",
  },

  // Phase IV
  {
    phase: PHASES_IN_ORDER[3],
    title: "The Immunotherapy Paradox",
    detail:
      "Why does ASPS respond well to checkpoint inhibitors (PD-L1) despite having a low mutation burden?",
  },
  {
    phase: PHASES_IN_ORDER[3],
    title: "T-cell Infiltration",
    detail:
      "How to attract more white blood cells to the center of the tumor, which is typically an immunologically cold zone?",
  },
  {
    phase: PHASES_IN_ORDER[3],
    title: "Immune Evasion",
    detail:
      "What chemical signals does the tumor send to put to sleep the immune system cells?",
  },
  {
    phase: PHASES_IN_ORDER[3],
    title: "Organotropism (Metastasis)",
    detail:
      "Why does this cancer prefer to travel to the lungs and brain? What are the cells seeking there?",
  },
  {
    phase: PHASES_IN_ORDER[3],
    title: "Pre-metastatic Niche",
    detail:
      "How do we detect and block the site where the cancer intends to anchor before it arrives?",
  },

  // Phase V
  {
    phase: PHASES_IN_ORDER[4],
    title: "Blood-Brain Barrier (BBB)",
    detail:
      "Brain metastases are common; we need drugs that successfully cross the brain barrier.",
  },
  {
    phase: PHASES_IN_ORDER[4],
    title: "Resistance to TKIs",
    detail:
      "How to prevent the tumor from learning to ignore current drugs (Sunitinib/Pazopanib)?",
  },
  {
    phase: PHASES_IN_ORDER[4],
    title: "Systemic Toxicity",
    detail:
      "How to ensure an epigenetic drug does not shut down necessary genes in the heart or liver?",
  },
  {
    phase: PHASES_IN_ORDER[4],
    title: "Pharmacokinetics",
    detail:
      "How to maintain constant drug levels in the blood to prevent the tumor from growing during breaks in treatment?",
  },
  {
    phase: PHASES_IN_ORDER[4],
    title: "Synergistic Combinations",
    detail: "Which two drugs, when combined, create a 1+1 = 10 effect?",
  },

  // Phase VI
  {
    phase: PHASES_IN_ORDER[5],
    title: "Faithful Animal Models",
    detail:
      "Creating mice that develop the tumor exactly like a human (PDX models).",
  },
  {
    phase: PHASES_IN_ORDER[5],
    title: "Immortal Cell Lines",
    detail:
      "It is incredibly difficult to culture ASPS cells in the lab; we need better cultivation tools.",
  },
  {
    phase: PHASES_IN_ORDER[5],
    title: "Liquid Biopsy",
    detail:
      "Creating a blood test that detects ASPSCR1-TFE3 DNA before the tumor becomes visible.",
  },
  {
    phase: PHASES_IN_ORDER[5],
    title: "Large-Scale Data",
    detail:
      "Being so rare, we need a unified global database to find patterns among the few existing patients.",
  },
  {
    phase: PHASES_IN_ORDER[5],
    title: "Bioethics and Trials",
    detail:
      "How to conduct valid clinical trials when there are only a few hundred patients worldwide?",
  },
];

export const WhiteboardView = () => {
  const grouped = useMemo(() => {
    const map = new Map<string, WhiteboardProblem[]>();
    for (const phase of PHASES_IN_ORDER) map.set(phase, []);
    for (const problem of PROBLEMS) {
      if (!map.has(problem.phase)) map.set(problem.phase, []);
      map.get(problem.phase)!.push(problem);
    }
    return PHASES_IN_ORDER.map((phase) => ({
      phase,
      problems: map.get(phase) || [],
    }));
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground font-sans overflow-hidden">
      <div className="p-4 md:p-8 border-b border-border bg-muted/10 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
              <LayoutGrid className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight truncate">
                ASPS Intelligence Whiteboard
              </h1>
              <p className="text-sm text-muted-foreground">
                First 30 problems to understand, structured by phase.
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {grouped.map((section) => (
            <div key={section.phase} className="space-y-3">
              <h2 className="text-sm md:text-base font-bold text-muted-foreground uppercase tracking-widest">
                {section.phase}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.problems.map((p) => {
                  const idx = PROBLEMS.indexOf(p);
                  return (
                    <Card
                      key={`${section.phase}-${p.title}`}
                      className="p-5 bg-muted/20 border-border"
                    >
                      <div className="text-foreground font-bold text-sm">
                        {idx + 1}. {p.title}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {p.detail}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
