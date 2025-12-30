import React from "react";
import { LayoutGrid, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

type Question = {
  title: string;
  text: string;
};

const QUESTIONS: Question[] = [
  {
    title: 'The "Hidden Hero" Question',
    text: "Among the thousands of approved drugs sitting on pharmacy shelves today, which one is a 'hidden hero'—currently indicated for a common ailment but secretly holding the molecular key to curing a 'hopeless' rare disease?"
  },
  {
    title: 'The "End of Trial-and-Error" Question',
    text: "By mapping the precise 'interacts' and 'side effect' edges between drugs like Risperidone and phenotypic traits, can we finally end the 'medication roulette' that forces patients to suffer through months of failed treatments before finding the one that works?"
  },
  {
    title: 'The "Silent Language" of Anatomy',
    text: "What 'hidden highways' exist between distant anatomical regions—where a protein perturbation in one organ whispers the first warning signs of a disease in another, years before symptoms even appear?"
  },
  {
    title: 'The "Orphan Disease" Breakthrough',
    text: "For the thousands of rare diseases that currently have 'no single known cause,' which clusters of genetic and environmental 'exposures' in PrimeKG reveal a shared biological story that could lead to the first-ever universal therapy for the 'forgotten' patients?"
  },
  {
    title: 'The "Personalized Destiny" Question',
    text: "How can we use the multimodal 'clinical descriptors' in PrimeKG to move past treating 'the average patient' and start treating 'the individual soul,' ensuring that a person's treatment is as unique as their own fingerprint?"
  },
  {
    title: 'The "Environmental Synergy" Question',
    text: "Where do the invisible threads of our environment (exposures) intersect with our genetic vulnerabilities to create a 'perfect storm' of disease—and more importantly, how can we use PrimeKG to build a shield against that storm?"
  },
  {
    title: 'The "Redefining the Incurable" Question',
    text: "If we look at the 'dense connections' between diseases in Panel B, which supposedly 'unrelated' conditions share a common molecular root that, if treated, could cause a domino effect of healing across multiple diagnoses?"
  },
  {
    title: 'The "Off-Label" Revelation',
    text: "What 'off-label' success stories are currently buried in clinical text that PrimeKG can transform into a standardized, life-saving protocol for patients who have run out of options?"
  },
  {
    title: 'The "Molecular Empathy" Question',
    text: "How can the mapping of 'phenotypic consequences' help us truly understand the lived experience of a patient—turning cold data points into a deep, biological empathy that guides more compassionate care?"
  },
  {
    title: 'The "Future Legacy" Question',
    text: "A hundred years from now, when disease is a relic of the past, will we look back at PrimeKG as the moment we finally learned to speak the 'true language of life' and claimed our right to a future without suffering?"
  }
];

export const WhiteboardView = () => {
  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground font-sans overflow-hidden">
      <div className="p-4 md:p-8 border-b border-border bg-muted/10 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight truncate">
                Discovery Questions
              </h1>
              <p className="text-sm text-muted-foreground">
                Ten fundamental questions driving our research in PrimeKG.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {QUESTIONS.map((q, idx) => (
              <Card
                key={idx}
                className="p-6 bg-muted/20 border-border hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="space-y-2">
                    <h3 className="font-bold text-foreground text-lg tracking-tight">
                      {q.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {q.text}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
