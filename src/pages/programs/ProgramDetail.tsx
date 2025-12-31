import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { diseases } from '../../data/diseases';
import {
  ArrowLeft,
  ArrowUpRight,
  Activity,
  Sparkles,
  Layers,
  Microchip,
  Shield,
  Dna
} from 'lucide-react';
import { Header } from '../../components/organisms/Header';
import { Footer } from '../../components/organisms/Footer';

export default function ProgramDetail() {
  const { id } = useParams<{ id: string }>();
  const disease = diseases.find(d => d.id === id);

  const activePrograms = useMemo(() => diseases.filter(d => d.type === 'active'), []);

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

  return (
    <div className="text-text-main transition-colors duration-300 antialiased font-sans flex flex-col items-center min-h-screen relative overflow-x-hidden bg-background">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-uiverse-grid opacity-20"></div>

      <div className="max-w-6xl w-full mx-auto px-6 py-12 md:py-16 space-y-12">
        <Header />

        <main className="animate-fadeIn">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-text-muted hover:text-primary transition-colors uppercase mb-6 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">

            {/* Left Content Area */}
            <div className="lg:col-span-8 space-y-12">

              {/* Disease Summary Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-text-main">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-70">Disease Summary</h2>
                </div>
                <p className="text-sm leading-relaxed text-text-main/90 max-w-2xl">
                  {disease.description}
                </p>
              </div>

              {/* Molecular Mechanism Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-text-main">
                  <Layers className="w-4 h-4 text-primary" />
                  <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-70">Molecular Mechanism</h2>
                </div>
                <div className="bg-surface border border-border-custom p-6 rounded-2xl">
                  <p className="leading-relaxed text-sm text-text-main/80 italic">
                    "{disease.molecular_detail}"
                  </p>
                </div>
              </div>

              {/* Info Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface border border-border-custom p-5 rounded-xl space-y-3">
                  <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Driver Class</div>
                  <div className="text-sm font-semibold text-text-main">TF Fusion</div>
                </div>
                <div className="bg-surface border border-border-custom p-5 rounded-xl space-y-3">
                  <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Modality</div>
                  <div className="text-sm font-semibold text-primary">PROTAC</div>
                </div>
              </div>
            </div>

            {/* Right Sidebar Area */}
            <div className="lg:col-span-4 space-y-8">

              {/* Structural Insight Card */}
              <div className="relative group overflow-hidden rounded-2xl border border-border-custom bg-black">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    alt="Lab Visualization"
                    className="w-full h-full object-cover opacity-70"
                    src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black to-transparent">
                  <div className="text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase mb-1">Structural Insight</div>
                  <div className="text-white text-xs font-medium">Molecular Dynamics Simulation</div>
                </div>
              </div>

              {/* Active Portfolio Section */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-70">Active Portfolio</h3>
                <div className="bg-surface border border-border-custom p-6 rounded-2xl">
                  <div className="space-y-2">
                    {activePrograms.map(p => (
                      <Link
                        key={p.id}
                        to={`/programs/${p.id}`}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${p.id === disease.id ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-transparent border-transparent hover:bg-white/5 text-text-muted'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Activity className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">{p.code}</span>
                        </div>
                        <ArrowUpRight className="w-3 h-3 opacity-50" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
