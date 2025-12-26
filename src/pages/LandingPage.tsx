import { diseases } from '../data/diseases';
import { Header } from '../components/organisms/Header';
import { Footer } from '../components/organisms/Footer';
import { Link } from 'react-router-dom';
import { 
    ArrowRight, 
    Activity, 
    Network, 
    Brain, 
    Biohazard, 
    ArrowUpRight, 
    Clock, 
    Camera, 
    Mail, 
    AtSign, 
    Code, 
    Briefcase,
    Sparkles,
    Link as LinkIcon,
    FileText
} from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="text-text-main transition-colors duration-300 antialiased font-sans flex flex-col items-center min-h-screen relative">
            <div className="fixed inset-0 z-[-1] pointer-events-none bg-uiverse-grid"></div>

            <div className="max-w-3xl w-full mx-auto px-6 py-12 md:py-20 space-y-24">
                <Header />

                <main className="space-y-24">
                    {/* Hero Section */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center transition-none duration-0">
                                <img alt="Sarkome Logo" className="w-12 h-12 object-contain" width="48" height="48" src="/logo_purple_nobackground.svg" />
                            </div>
                            <div>
                                <h1 className="font-semibold text-lg text-text-main transition-none duration-0">Sarkome Institute</h1>
                                <p className="text-sm text-text-main">Generative Biotechnology</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                                The Industrialization of <span className="text-primary">Causal Discovery</span>
                            </h2>
                            <p className="text-lg text-text-main leading-relaxed max-w-xl">
                                Sarkome In-Silico: A Multi-Agent Graph Reasoning System powered by Gemini 3.0, accelerating therapeutic target identification for Rare Sarcoma (ASPS) using the PrimeKG knowledge substrate.
                            </p>
                            <div className="pt-2">
                                <Link to="/platform" className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary transition-all group">
                                    <span className="mono-text">[ ENTER PLATFORM ]</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Platform Visualization */}
                        <div className="relative py-12 md:py-16 dark">
                            <p className="text-xs font-bold tracking-widest text-text-main uppercase mb-8">Platform Visualization</p>
                            <div className="relative h-[300px] md:h-[400px] w-full perspective-[1000px]">
                                {/* Main Card */}
                                <div className="absolute inset-x-0 top-0 md:left-10 md:right-10 mx-auto z-20 bg-surface border border-border-custom rounded-xl shadow-2xl overflow-hidden p-4 transform transition-transform hover:scale-[1.02] duration-500">
                                    <div className="flex items-center justify-between mb-4 border-b border-border-custom pb-3">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                        </div>
                                        <div className="text-[10px] font-mono text-text-main">causal_inference_engine_v4.py</div>
                                    </div>
                                    <div className="relative h-[200px] md:h-[280px] bg-black rounded-lg overflow-hidden flex items-center justify-center">
                                        <img alt="Abstract Data Visualization" className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTu0_VpIa_addIxGdTpsucwH6Q83MTH8RS60p-EV4FyTg1BasX_a-IozLR5yNXBU5cAZqNlbSFGFFvs4jvddCDRvfdFmHtS76ZipuSrXg532wHWW6BbuaUyissY6pbHc4Myau1g2eIyhr40TuZtADOJSoBHoqPe_OHtMx2_A0E7RjsCZS3Ah25YSXU4kmX1_hdeSPhwfkkgr7MkB-dkQxmFll7BzIJ4g9hrj9RwPo33LfkBWMjZtyxuPHt4mywlha_qlMtEpke4jCJ" />
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
                                <div className="hidden md:block absolute top-12 -left-4 w-2/3 h-[300px] z-10 bg-surface border border-border-custom rounded-xl shadow-xl p-4 opacity-90 transform -rotate-6 scale-90 origin-bottom-right animate-float-delay">
                                    <div className="h-full w-full bg-surface rounded border border-dashed border-border-custom flex flex-col p-4">
                                        <div className="h-2 w-1/3 bg-border-custom rounded mb-4"></div>
                                        <div className="h-2 w-2/3 bg-border-custom rounded mb-2 opacity-60"></div>
                                        <div className="h-2 w-1/2 bg-border-custom rounded mb-2 opacity-60"></div>
                                        <div className="h-2 w-3/4 bg-border-custom rounded mb-8 opacity-60"></div>
                                        <div className="mt-auto grid grid-cols-2 gap-2">
                                            <div className="h-16 bg-border-custom rounded opacity-40"></div>
                                            <div className="h-16 bg-border-custom rounded opacity-40"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Decorative Card */}
                                <div className="hidden md:block absolute top-20 -right-4 w-2/3 h-[280px] z-10 bg-surface border border-border-custom rounded-xl shadow-xl p-4 opacity-90 transform rotate-3 scale-95 origin-bottom-left animate-float">
                                    <div className="h-full w-full bg-black rounded overflow-hidden relative">
                                        <img alt="Gradient Texture" className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvDgJ4_q465Dz4iqJsvyGzeugCfeRsZngNxI5FPVs9gWqq25cS70TshBDYbyU9eLxxjuzXfIK0OZAJAGKQukLR3cUwE2NOQU-9htsh_RveC3PjoMAMPlOeqxGL9Txi4Tl0liQH_EJICvjegk5sqF-vL_VqpGLYil3gj9aZ2VWcWAgmA5mcpKJyLiiSeLBDs-CVV_eY2Xzf4ZpjO3Y4PTG3eQHLygrx-O92m31zrOH4Bs669YPUgp3QdXsg4ncFQ6MytiDsU32-XTXW" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-white font-mono text-xs">Simulating...</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Discovery Pipeline */}
                    <section>
                        <h3 className="text-xs font-bold tracking-widest text-text-main uppercase mb-8">Discovery Pipeline</h3>
                        <p className="mb-10 text-text-main text-sm leading-relaxed">
                            Merging high-throughput wet lab data with causal AI to map disease etiology and accelerate asset generation.
                        </p>
                        <div className="space-y-8 relative pl-2">
                            <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-border-custom"></div>

                            {[
                                { phase: "01", title: "Assimilate", desc: "Integrate PrimeKG and proprietary datasets to establish the baseline Knowledge Graph.", label: "Assimilate" },
                                { phase: "02", title: "Interrogate", desc: "Query the Causal Agent to identify novel pathway associations and targets.", label: "Interrogate" },
                                { phase: "03", title: "Reinforce", desc: "Expert adjudication of AI insights to curate and lock high-confidence nodes in the Graph.", label: "Reinforce" },
                                { phase: "04", title: "Design", desc: "Generate scientifically plausible, synthesizable therapeutic candidates (e.g., interface-specific PROTACs).", label: "Design" },
                                { phase: "05", title: "Verify", desc: "Confirm mechanism of action via rapid wet-lab loops (NanoBRET, Cryo-EM) prior to scaling.", label: "Verify" },
                                { phase: "06", title: "Deploy", desc: "Externalize the validated asset", label: "Deploy" }
                            ].map((step, i) => (
                                <div key={i} className="relative pl-8 group">
                                    <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-border-custom group-hover:bg-primary transition-colors"></div>
                                    <div className="grid md:grid-cols-[1fr_3fr] gap-2 md:gap-8">
                                        <div className="text-xs font-mono text-text-main pt-0.5 uppercase">PHASE {step.phase} — {step.label}</div>
                                        <div>
                                            <h4 className="font-medium text-text-main mb-1 group-hover:text-primary transition-colors">{step.title}</h4>
                                            <p className="text-sm text-text-main">{step.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Advisory Board */}
                    <section>
                        <h3 className="text-xs font-bold tracking-widest text-text-main uppercase mb-8">Advisory Board</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-surface border border-border-custom p-6 rounded-2xl hover:border-primary/50 transition-colors cursor-default">
                                <p className="text-sm leading-relaxed mb-6 text-text-main">
                                    "Building Sarkome as a generative biotechnology institute that uses AI to create missing biological knowledge, turning rare-disease treatment, such as ASPS, from probabilistic guessing into systematic causal discovery."
                                </p>
                                <div className="flex items-center gap-3">
                                    <img alt="Bryan Ramírez Palacios" className="w-10 h-10 rounded-full object-cover border border-border-custom" src="/bry.png" />
                                    <div>
                                        <div className="text-sm font-medium text-text-main">Bryan Ramírez Palacios</div>
                                        <div className="text-xs text-text-main">Founder & Lead Architect, Sarkome Institute</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-surface border border-border-custom p-6 rounded-2xl hover:border-primary/50 transition-colors cursor-default">
                                <p className="text-sm leading-relaxed mb-6 text-text-main">
                                    "Sarkome seeks a Founding Biological Sciences Partner to build a causal-first discovery engine for single-driver cancers, starting with ASPS. The role focuses on mechanism-based wet-lab validation, isogenic models, and transcriptional dependency testing."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-border-custom">
                                        <span className="text-[10px] font-bold text-primary">?</span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-text-main">[ Selection in Progress ]</div>
                                        <div className="text-xs text-text-main">Founding Partner, Biological Sciences</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Technology Stack */}
                    <section>
                        <h3 className="text-xs font-bold tracking-widest text-text-main uppercase mb-8">Technology Stack</h3>
                        <div className="flex flex-wrap gap-6">
                            {[
                                { name: "Gemini 3.0", src: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.svg", color: "from-blue-400/20 to-purple-400/20" },
                                { name: "Docker", src: "https://www.vectorlogo.zone/logos/docker/docker-tile.svg", color: "from-blue-500/10 to-blue-600/10" },
                                { name: "LangChain", src: "https://avatars.githubusercontent.com/u/126733545?s=200&v=4", color: "from-green-400/10 to-emerald-500/10" },
                                { name: "Neo4j", src: "https://www.vectorlogo.zone/logos/neo4j/neo4j-icon.svg", color: "from-blue-600/10 to-indigo-700/10" },
                                { name: "Google Cloud", src: "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg", color: "from-blue-500/10 to-red-500/10" },
                                { name: "Python", src: "https://www.vectorlogo.zone/logos/python/python-icon.svg", color: "from-yellow-400/10 to-blue-500/10" }
                            ].map((tech, i) => (
                                <div key={i} className="group relative">
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                                        {tech.name}
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                                    </div>
                                    
                                    <div className={`absolute -inset-2 bg-gradient-to-br ${tech.color} rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    <div className="relative w-12 h-12 bg-surface border border-border-custom rounded-xl flex items-center justify-center p-2.5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 shadow-sm">
                                        <img alt={tech.name} className="w-full h-full object-contain" src={tech.src} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Active Programs */}
                    <section>
                        <h3 className="text-xs font-bold tracking-widest text-text-muted uppercase mb-8">Active Programs</h3>
                        <div className="space-y-4">
                            {diseases.filter(d => d.type === 'active').map(disease => (
                                <Link key={disease.id} to={`/programs/${disease.id}`} className="group flex items-center justify-between p-4 -mx-4 rounded-xl hover:bg-surface transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                            {disease.id === 'als' ? <Brain className="w-5 h-5" /> : <Biohazard className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm text-text-main">{disease.code}</div>
                                            <div className="text-xs text-text-muted">Rare Oncology / {disease.name}</div>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Latest Research */}
                    <section>
                        <h3 className="text-xs font-bold tracking-widest text-text-muted uppercase mb-6">Latest Research</h3>
                        <div className="flex flex-col gap-4">
                            {[
                                { date: "FEB 2024", title: "Graph Neural Networks in Protein Folding", time: "5 m" },
                                { date: "JAN 2024", title: "Causal Inference for Target Validation", time: "12 m" },
                                { date: "DEC 2023", title: "The Future of In-Silico Trials", time: "8 m" }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-start group cursor-pointer">
                                    <div>
                                        <div className="text-xs text-text-muted mb-1 mono-text">{item.date}</div>
                                        <h4 className="text-sm font-medium text-text-main group-hover:text-primary transition-colors">{item.title}</h4>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-text-muted">
                                        <Clock className="w-3.5 h-3.5" />
                                        {item.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Inside the Lab */}
                    <section>
                        <h3 className="text-xs font-bold tracking-widest text-text-muted uppercase mb-6">Inside the Lab</h3>
                        <p className="text-sm text-text-muted mb-8">
                            Located in the heart of Kendall Square, where computation meets biology.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-48 md:h-64">
                            <div className="col-span-1 h-full rounded-2xl overflow-hidden relative group">
                                <img alt="Lab Equipment" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNKDlFib6AZKnh32dRkk-aLpn591NWremRhUatLgWJwj6_iJTiBzC2iyTw2QL-ojNYXtH9Tb8a-cEm5CPHROsh-OULatrfoljGIReaLcy9X4dQU36JWHrOMQI-T8J_cn0K4lv17EMcFzwlbW2m0UV-KRM0uZKu06sxCjWvAtBXQU2NpZ6HJDSjFD-KjHpIu9I8WBukydVLHCGZJx14pz7p1sPdLV7C6wTJeOGwbZ37MAT77mwhmATq7Y6LXcPYM2zuP5ut5xrsHQyf" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <div className="col-span-1 h-full rounded-2xl overflow-hidden relative group translate-y-4 md:translate-y-8">
                                <img alt="Scientist working" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm6A_hlu7YcnV7qXvPzqzRo3Rt-FoyBZnJV_zv62qWPI9kjqiGd3CKZhELunA8ZRueFCu9tELV4DPBGo9gA4OVKFuYXas6v46thrB5aj8Z05WzgZMSIfkb43i8_tZuFeLX77bQt9DNpQMmaHspVYAs4fjuwMJgVHeAmPxGzK5OwtBRrtT5xT7IOh12np_oyg1V-L3f2uiWrqID4lsPbuJajWWOUWhaylapNWTPcDpzx5AnQwzJcdyZBz8QEtKHg38xaERij3QbJleW" />
                            </div>
                            <div className="col-span-1 h-full rounded-2xl overflow-hidden relative group">
                                <img alt="Data Visualization" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYwVBglgF0xeJ1Qkxm5pIs9jWnSkY_X4G4hHfbWswuwE3ZR7WWs2zXlhG3CGJRvuEVnBBK5N911XLFKPGpg7_qR11R9pvhjB0YIB5oMrOWWiaduA7jLQttU3awPwF3RCnF9sStnI1tGu-jfqU_AQzjz5lE4fMUE2sWx0ptZzeUQ5iXj18fUMxkLX2BcGfM-97znYMSOj2oaT_JRDrK34OVYKIZxrxXIkwQheNHbWV1KahZoE_G-vhxrqDxk-uzg4ckgSwOEEIUSwU_" />
                            </div>
                            <div className="col-span-1 h-full rounded-2xl overflow-hidden relative group translate-y-4 md:translate-y-8">
                                <img alt="Code on screen" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBowVOMD1mGapNdw_MeyuxVgkFrMvlIFeA0ueKZRbUUgZlZ7qnwxAY0evNTC-EErGl1jNOUE3mgyGUF2swZDmICFw7DIiUsUqhq3qYSxEBrWjV0J1xmS0JdkKvmnW6pqaELPmhGMSn5rWIneJ9_jOXHQFfgEyRCxz572BCz4qHedhF077LfwwhbOT7sCePOa0WFo4h6OsL8_ef_wgTHDbzct7bYVi9xSHZEKJ90rIzeDspff1968osoxDBJusGEhI3D97LhVWgmlzkR" />
                            </div>
                        </div>
                    </section>

                    {/* Request Access */}
                    <section className="border-t border-dashed border-border-custom pt-12">
                        <h3 className="text-xs font-bold tracking-widest text-text-muted uppercase mb-6">Request Access</h3>
                        <p className="text-sm text-text-muted mb-8">
                            Partnership inquiries and investor relations can reach us using the form below.
                        </p>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input className="w-full bg-surface border border-text-main rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary placeholder:text-text-muted/50 outline-none text-text-main" placeholder="Name" type="text" />
                                <input className="w-full bg-surface border border-text-main rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary placeholder:text-text-muted/50 outline-none text-text-main" placeholder="Email" type="email" />
                            </div>
                            <textarea className="w-full bg-surface border border-text-main rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary placeholder:text-text-muted/50 resize-none outline-none text-text-main" placeholder="Message" rows={4}></textarea>
                            <div className="flex items-center justify-between pt-2">
                                <button className="bg-foreground text-background px-6 py-2 rounded-full text-sm font-medium hover:bg-primary transition-colors" type="button">
                                    Send message
                                </button>
                            </div>
                        </form>

                        <div className="mt-16 space-y-3 text-sm">
                            {[
                                { icon: FileText, label: "Documentation", value: "sarkome.com/docs", href: "http://sarkome.com/docs" },
                                { icon: Mail, label: "Email", value: "partners@sarkome.bio", href: "mailto:partners@sarkome.bio" },
                                { icon: AtSign, label: "Twitter / X", value: "@sarkome_ai", href: "https://x.com/sarkome_ai" },
                                { icon: Code, label: "GitHub", value: "@sarkome-official", href: "https://github.com/sarkome-official" },
                                { icon: Briefcase, label: "LinkedIn", value: "/company/sarkome", href: "https://www.linkedin.com/company/sarkome/" }
                            ].map((social, i) => (
                                <a key={i} className="flex justify-between items-center group text-text-muted hover:text-primary transition-colors" href={social.href}>
                                    <div className="flex items-center gap-3">
                                        <social.icon className="w-4 h-4" />
                                        <span className="text-text-main">{social.label}</span>
                                    </div>
                                    <span className="mono-text text-xs opacity-60 text-text-main">{social.value} ↗</span>
                                </a>
                            ))}
                        </div>
                    </section>

                    <Footer />
                </main>
            </div>
        </div>
    );
}
