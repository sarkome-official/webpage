import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { diseases } from '../../data/diseases';
import { ArrowLeft, ArrowUpRight, Activity, Beaker } from 'lucide-react';
import { Header } from '../../components/organisms/Header';
import { Footer } from '../../components/organisms/Footer';

export default function ProgramDetail() {
  const { id } = useParams<{ id: string }>();
  const disease = diseases.find(d => d.id === id);

  if (!disease) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Program Not Found</h1>
          <Link to="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col items-center">
      <div className="max-w-4xl w-full mx-auto px-6 py-12 md:py-20 space-y-12">
        <Header />
        
        <main className="space-y-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Pipeline
            </Link>
            
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-mono border ${disease.type === 'active' ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-border text-muted-foreground'}`}>
                {disease.code}
              </span>
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                {disease.type === 'active' ? 'Active Program' : 'Pipeline Candidate'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{disease.name}</h1>
            <p className="text-xl text-muted-foreground font-light border-l-2 border-primary pl-4">
              {disease.fusion} <span className="text-primary mx-2">→</span> {disease.mechanism}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-4">Disease Summary</h2>
                <p className="leading-relaxed text-foreground">
                  {/* @ts-ignore */}
                  {disease.description || "Detailed analysis of the molecular drivers and clinical presentation of this rare sarcoma subtype."}
                </p>
              </section>

              <section>
                <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-4">Molecular Mechanism</h2>
                <div className="bg-card border border-border p-6 rounded-xl">
                  <p className="leading-relaxed text-sm text-foreground">
                    {/* @ts-ignore */}
                    {disease.molecular_detail || "Our research focuses on the specific fusion protein interactions that drive oncogenesis, utilizing multi-agent modeling to identify vulnerable nodes in the signaling network."}
                  </p>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-card border border-border p-6 rounded-xl">
                <h3 className="text-xs font-bold text-muted-foreground uppercase mb-4">Target Profile</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Driver</div>
                    <div className="font-mono">{disease.fusion}</div>
                  </div>
                   <div>
                    <div className="text-xs text-muted-foreground mb-1">Class</div>
                    <div className="font-medium">Transcription Factor Fusion</div>
                  </div>
                   <div>
                    <div className="text-xs text-muted-foreground mb-1">Therapeutic Strategy</div>
                    <div className="font-medium">Direct Degrader (PROTAC) / Interface Inhibitor</div>
                  </div>
                </div>
              </div>

              <section>
                <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-8">Active Programs</h3>
                <div className="space-y-4">
                  {diseases.filter(d => d.type === 'active').map(activeDisease => (
                    <Link 
                      key={activeDisease.id}
                      to={`/programs/${activeDisease.id}`}
                      className={`group flex items-center justify-between p-4 -mx-4 rounded-xl hover:bg-card transition-colors ${activeDisease.id === disease.id ? 'bg-card' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{activeDisease.code}</div>
                          <div className="text-xs text-muted-foreground">Rare Oncology / {activeDisease.name}</div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-8">Pipeline Candidates</h3>
                <div className="space-y-4">
                  {diseases.filter(d => d.type === 'candidate').map(candidate => (
                    <Link 
                      key={candidate.id}
                      to={`/programs/${candidate.id}`}
                      className={`group flex items-center justify-between p-4 -mx-4 rounded-xl hover:bg-card transition-colors ${candidate.id === disease.id ? 'bg-card' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                          <Beaker className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{candidate.code}</div>
                          <div className="text-xs text-muted-foreground">{candidate.name}</div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
