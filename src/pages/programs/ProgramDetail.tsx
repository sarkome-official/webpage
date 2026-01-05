import { useParams, Link } from 'react-router-dom';
import { diseases } from '../../data/diseases';
import { ArrowLeft, ExternalLink, Zap, Atom, Route, Microscope } from 'lucide-react';
import { Header } from '../../components/organisms/Header';
import { Footer } from '../../components/organisms/Footer';

// Unique visual element - DNA helix inspired
const HelixDecoration = () => (
  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-64 opacity-[0.03] pointer-events-none hidden lg:block">
    <svg viewBox="0 0 100 200" fill="none" className="w-full h-full">
      {[...Array(10)].map((_, i) => (
        <g key={i}>
          <circle cx={50 + Math.sin(i * 0.6) * 30} cy={i * 20 + 10} r="4" fill="currentColor" className="text-primary" />
          <circle cx={50 - Math.sin(i * 0.6) * 30} cy={i * 20 + 10} r="4" fill="currentColor" className="text-primary" />
          <line 
            x1={50 + Math.sin(i * 0.6) * 30} y1={i * 20 + 10}
            x2={50 - Math.sin(i * 0.6) * 30} y2={i * 20 + 10}
            stroke="currentColor" strokeWidth="1" className="text-primary"
          />
        </g>
      ))}
    </svg>
  </div>
);

export default function ProgramDetail() {
  const { id } = useParams<{ id: string }>();
  const disease = diseases.find(d => d.id === id);

  if (!disease) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Program Not Found</h1>
          <Link to="/" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const researchPhases = [
    { 
      phase: "01", 
      title: "Map the Enemy",
      subtitle: "Knowledge Graph Analysis",
      description: "Traverse 129K biomedical entities to identify every protein, pathway, and vulnerability connected to the ASPSCR1-TFE3 fusion.",
      status: "active",
      color: "from-violet-500/20 to-fuchsia-500/20"
    },
    { 
      phase: "02", 
      title: "Find Existing Weapons",
      subtitle: "Drug Repurposing Screen",
      description: "Screen 8,000+ FDA-approved drugs for shared molecular targets. Why build new when we can repurpose?",
      status: "active",
      color: "from-cyan-500/20 to-blue-500/20"
    },
    { 
      phase: "03", 
      title: "Design New Attacks",
      subtitle: "PROTAC Development",
      description: "Model the TFE3 fusion interface using AlphaFold to design targeted protein degraders.",
      status: "planned",
      color: "from-amber-500/20 to-orange-500/20"
    },
    { 
      phase: "04", 
      title: "Validate & Publish",
      subtitle: "Academic Collaboration",
      description: "Partner with research institutions to validate computational hypotheses and publish findings.",
      status: "planned",
      color: "from-emerald-500/20 to-green-500/20"
    },
  ];

  return (
    <div className="text-text-main transition-colors duration-300 antialiased font-sans flex flex-col items-center min-h-screen relative">
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-uiverse-grid"></div>

      <div className="max-w-3xl w-full mx-auto px-4 md:px-6 py-12 md:py-20 space-y-12">
        <Header />

        <main className="space-y-24">
          {/* Back link */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-text-muted hover:text-primary transition-colors uppercase group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Hero Section */}
          <section className="text-center relative -mt-16">
          <HelixDecoration />
          
          {/* Program badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Active Research Program</span>
          </div>

          {/* Main title */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-text-main via-primary to-text-main bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              {disease.code}
            </span>
          </h1>
          
          <p className="text-lg text-text-muted mb-8">{disease.name}</p>

          {/* Quick stats */}
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">~300</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Cases/Year (US)</div>
            </div>
            <div className="w-px bg-border-custom" />
            <div>
              <div className="text-2xl font-bold text-text-main">t(X;17)</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Translocation</div>
            </div>
            <div className="w-px bg-border-custom" />
            <div>
              <div className="text-2xl font-bold text-text-main">TFE3</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Fusion Driver</div>
            </div>
          </div>
        </section>

        {/* The Problem - Visual block */}
        <section>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-950/30 via-background to-background border border-red-500/10 p-8 md:p-12">
            
            <div className="relative">
              <div className="text-[10px] font-bold tracking-widest text-red-400/80 uppercase mb-4">The Challenge</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 max-w-2xl">
                ASPS doesn't respond to standard chemotherapy or radiation.
              </h2>
              <p className="text-text-main/70 leading-relaxed max-w-2xl mb-6">
                {disease.description}
              </p>
              
              {/* Visual stats bar */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-red-500/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <span className="text-xs text-text-muted">Chemo Response: <span className="text-red-400 font-semibold">~0%</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <span className="text-xs text-text-muted">Radiation Response: <span className="text-red-400 font-semibold">~0%</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                  <span className="text-xs text-text-muted">5yr Survival (Metastatic): <span className="text-amber-400 font-semibold">~20%</span></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Molecular Mechanism */}
        <section>
          <div className="grid md:grid-cols-5 gap-6 items-start">
            <div className="md:col-span-2">
              <div className="sticky top-8">
                <div className="text-[10px] font-bold tracking-widest text-text-muted uppercase mb-2">Molecular Biology</div>
                <h3 className="text-xl font-bold mb-4">The Fusion That Drives It All</h3>
                <div className="flex gap-2">
                  <span className="px-2 py-1 text-[10px] rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">TF Fusion</span>
                  <span className="px-2 py-1 text-[10px] rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">PROTAC Target</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-3 bg-surface border border-border-custom rounded-2xl p-6">
              <blockquote className="text-sm leading-relaxed text-text-main/80 italic border-l-2 border-primary/30 pl-4">
                "{disease.molecular_detail}"
              </blockquote>
              <div className="mt-6 pt-6 border-t border-border-custom grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-text-muted mb-1">Key Pathways</div>
                  <div className="text-sm font-medium">VEGF · MET · mTOR</div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">Therapeutic Angle</div>
                  <div className="text-sm font-medium">Degradation via PROTAC</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Research Approach */}
        <section>
          <div className="text-center mb-12">
            <div className="text-[10px] font-bold tracking-widest text-primary uppercase mb-2">Our Approach</div>
            <h2 className="text-3xl font-bold">Systematic Drug Discovery</h2>
            <p className="text-text-muted mt-2 max-w-lg mx-auto">
              Four phases. One goal: find a treatment that works.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {researchPhases.map((phase, idx) => (
              <div 
                key={idx}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  phase.status === 'active' 
                    ? 'border-primary/30 bg-gradient-to-br ' + phase.color
                    : 'border-border-custom bg-surface/50 opacity-70'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-4xl font-black ${phase.status === 'active' ? 'text-primary/30' : 'text-text-muted/20'}`}>
                      {phase.phase}
                    </span>
                    {phase.status === 'active' && (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        IN PROGRESS
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold mb-1">{phase.title}</h4>
                  <div className="text-xs text-text-muted mb-3">{phase.subtitle}</div>
                  <p className="text-sm text-text-main/70 leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section>
          <div className="bg-surface border border-border-custom rounded-2xl p-8">
            <div className="text-[10px] font-bold tracking-widest text-text-muted uppercase mb-6">Powered By</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Atom, name: "PrimeKG", desc: "129K biomedical entities" },
                { icon: Microscope, name: "AlphaFold", desc: "Protein structure prediction" },
                { icon: Route, name: "LangGraph", desc: "Autonomous AI agents" },
                { icon: Zap, name: "Real-time Search", desc: "PubMed & clinical trials" },
              ].map((tech, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <tech.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{tech.name}</div>
                    <div className="text-xs text-text-muted">{tech.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-surface border border-border-custom p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-2">Want to contribute?</h3>
            <p className="text-sm text-text-muted mb-6 max-w-md">
              We're actively looking for collaborators in computational biology, medicinal chemistry, and clinical research.
            </p>
            <a 
              href="mailto:research@sarkome.com" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Get in Touch
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>

          <Footer />
        </main>
      </div>

      {/* Custom animation for gradient text */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
        .animate-gradient {
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </div>
  );
}
