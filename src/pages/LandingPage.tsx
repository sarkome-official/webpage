import { diseases } from '../data/diseases';
import { RotatingHeading } from '../components/molecules/RotatingHeading';
import { Header } from '../components/organisms/Header';
import { Footer } from '../components/organisms/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Beaker } from 'lucide-react';
import '../index.css';

export default function LandingPage() {
    return (
        <div className="bg-background text-foreground transition-colors duration-300 antialiased font-sans flex flex-col items-center">
            <div className="fixed inset-0 z-[-1] pointer-events-none bg-grid"></div>

            <div className="max-w-4xl w-full mx-auto px-6 py-12 md:py-20 space-y-24">
                <Header />

                <main className="space-y-24">
                    {/* Hero Section */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-20 h-20 rounded-full bg-card border-border flex items-center justify-center">
                                <img alt="Sarkome Logo" className="w-12 h-12 object-contain" width="48" height="48" src="/logo_purple_nobackground.svg" />
                            </div>
                            <div>
                                <h1 className="font-semibold text-lg text-foreground">Sarkome Institute</h1>
                                <p className="text-sm text-muted-foreground">Generative Biotechnology</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <RotatingHeading />
                            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                                Sarkome In-Silico: A Multi-Agent Graph Reasoning System powered by Gemini 3.0, accelerating therapeutic target identification for Rare Sarcoma (ASPS) using the PrimeKG knowledge substrate.
                            </p>
                            <div className="pt-2">
                                <Link to="/platform" className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all group">
                                    <span className="mono-text">[ ENTER PLATFORM ]</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Platform Visualization */}
                        <div className="relative py-12 md:py-16">
                            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-8">Platform Visualization</p>
                            <div className="relative h-[300px] md:h-[400px] w-full perspective-[1000px]">
                                {/* Main Card */}
                                <div className="absolute inset-x-0 top-0 md:left-10 md:right-10 mx-auto z-20 bg-card border-border rounded-xl shadow-2xl overflow-hidden p-4 transform transition-all hover:scale-[1.02] duration-500">
                                    <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                        </div>
                                        <div className="text-[10px] font-mono text-muted-foreground">causal_inference_engine_v4.py</div>
                                    </div>
                                    <div className="relative h-[200px] md:h-[280px] bg-black rounded-lg overflow-hidden flex items-center justify-center">
                                        <img alt="Abstract Data Visualization" className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTu0_VpIa_addIxGdTpsucwH6Q83MTH8RS60p-EV4FyTg1BasX_a-IozLR5yNXBU5cAZqNlbSFGFFvs4jvddCDRvfdFmHtS76ZipuSrXg532wHWW6BbuaUyissY6pbHc4Myau1g2eIyhr40TuZtADOJSoBHoqPe_OHtMx2_A0E7RjsCZS3Ah25YSXU4kmX1_hdeSPhwfkkgr7MkB-dkQxmFll7BzIJ4g9hrj9RwPo33LfkBWMjZtyxuPHt4mywlha_qlMtEpke4jCJ" width="800" height="600" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                            <div className="bg-white/10 backdrop-blur-md p-3 rounded border border-white/20">
                                                <div className="text-[10px] text-white/60 mb-1">Confidence Score</div>
                                                <div className="text-xl font-bold text-white">98.4%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Left Decorative Card */}
                                <div className="hidden md:block absolute top-12 -left-12 w-2/3 h-[300px] z-10 transform -rotate-6 scale-90 origin-bottom-right">
                                    <div className="h-full w-full bg-card border-border rounded-xl shadow-xl p-4 opacity-40 blur-[1px] transition-all animate-float">
                                        <div className="h-full w-full bg-slate-100 dark:bg-slate-900 rounded border border-dashed border-border flex flex-col p-4">
                                            <div className="h-2 w-1/3 bg-slate-300 dark:bg-slate-700 rounded mb-4"></div>
                                            <div className="h-2 w-2/3 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                                            <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                                            <div className="mt-auto grid grid-cols-2 gap-2">
                                                <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                                <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Decorative Card */}
                                <div className="hidden md:block absolute top-24 -right-12 w-2/3 h-[280px] z-10 transform rotate-3 scale-95 origin-bottom-left">
                                    <div className="h-full w-full bg-card border-border rounded-xl shadow-xl p-4 opacity-40 blur-[1px] transition-all animate-float [animation-delay:3s]">
                                        <div className="h-full w-full bg-black rounded overflow-hidden relative">
                                            <img alt="Gradient Texture" className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvDgJ4_q465Dz4iqJsvyGzeugCfeRsZngNxI5FPVs9gWqq25cS70TshBDYbyU9eLxxjuzXfIK0OZAJAGKQukLR3cUwE2NOQU-9htsh_RveC3PjoMAMPlOeqxGL9Txi4Tl0liQH_EJICvjegk5sqF-vL_VqpGLYil3gj9aZ2VWcWAgmA5mcpKJyLiiSeLBDs-CVV_eY2Xzf4ZpjO3Y4PTG3eQHLygrx-O92m31zrOH4Bs669YPUgp3QdXsg4ncFQ6MytiDsU32-XTXW" loading="lazy" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Discovery Pipeline */}
                    <section>
                        <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-8">Discovery Pipeline</h3>
                        <p className="mb-10 text-muted-foreground text-sm leading-relaxed">
                            Our approach integrates high-throughput wet lab data with causal representation learning to build the first comprehensive map of disease etiology.
                        </p>
                        <div className="space-y-8 relative pl-2">
                            <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-border"></div>

                            {[
                                { phase: "01", title: "Ingest Data", desc: "We gather vast quantities of noisy clinical and biological data, combining different sources that traditional models often overlook." },
                                { phase: "02", title: "Sanitize Data", desc: "We clean this data using strict logic rules (solving problems like \"hemangioma mimicry\") to create a reliable \"ground truth\" that competitors lack." },
                                { phase: "03", title: "Generate Hypotheses", desc: "We create high-quality therapeutic theories (e.g., interface-specific PROTACs) that are chemically possible and biologically plausible." },
                                { phase: "04", title: "Validate Physically", desc: "We confirm these theories in the lab using fast testing loops (NanoBRET, Cryo-EM) to prove structural reality before major capital investment." },
                                { phase: "05", title: "Spin Out", desc: "Finally, we spin out the validated asset into a focused commercial entity." }
                            ].map((step, i) => (
                                <div key={i} className="relative pl-8 group">
                                    <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors"></div>
                                    <div className="grid md:grid-cols-[1fr_3fr] gap-2 md:gap-8">
                                        <div className="text-xs font-mono text-muted-foreground pt-0.5 uppercase">PHASE {step.phase} — {step.title.split(' ')[0]}</div>
                                        <div>
                                            <h4 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">{step.title}</h4>
                                            <p className="text-sm text-muted-foreground">{step.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Team Section */}
                    <section>
                        <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-8">Team</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-card border-border p-6 rounded-2xl hover:border-primary/50 transition-colors cursor-default">
                                <p className="text-sm leading-relaxed mb-6 text-foreground">
                                    "Building Sarkome as a generative biotechnology institute that uses AI to create missing biological knowledge, turning rare-disease treatment, such as ASPS, from probabilistic guessing into systematic causal discovery."
                                </p>
                                <div className="flex items-center gap-3">
                                    <img alt="Bryan Ramírez Palacios" className="w-10 h-10 rounded-full object-cover border border-border" src="/bry.png" />
                                    <div>
                                        <div className="text-sm font-medium">Bryan Ramírez Palacios</div>
                                        <div className="text-xs text-muted-foreground">Founder & Lead Architect, Sarkome Institute</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border-border p-6 rounded-2xl hover:border-primary/50 transition-colors cursor-default">
                                <p className="text-sm leading-relaxed mb-6 text-foreground">
                                    "Sarkome seeks a Founding Biological Sciences Partner to build a causal-first discovery engine for single-driver cancers, starting with ASPS. The role focuses on mechanism-based wet-lab validation, isogenic models, and transcriptional dependency testing."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-card border-border flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">[ Selection in Progress ]</div>
                                        <div className="text-xs text-muted-foreground">Founding Partner, Biological Sciences</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Active Programs */}
                    <section>
                        <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-8">Active Programs</h3>
                        <div className="space-y-4">
                            {diseases.filter(d => d.type === 'active').map(disease => (
                                <Link key={disease.id} to={`/programs/${disease.id}`} className="group flex items-center justify-between p-4 -mx-4 rounded-xl hover:bg-card transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{disease.code}</div>
                                            <div className="text-xs text-muted-foreground">Rare Oncology / {disease.name}</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                                </Link>
                            ))}
                        </div>
                    </section>

                    <Footer />
                </main>
            </div>
        </div>
    );
}
