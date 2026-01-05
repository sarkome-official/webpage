import { diseases } from '../data/diseases';
import { Header } from '../components/organisms/Header';
import { Footer } from '../components/organisms/Footer';
import { Link } from 'react-router-dom';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
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
    FileText,
    Database,
    Cpu,
    Dna,
    Globe
} from 'lucide-react';

// Data: Discovery Pipeline Steps
const DISCOVERY_STEPS = [
    { title: "Understanding Before Action", desc: "Before searching, the agent analyzes your intent. If you ask about a protein structure, it doesn't waste time searching for news; it goes straight to our scientific databases (AlphaFold/KG).", label: "intent_analysis" },
    { title: "Maximum Speed", desc: "We consult multiple data sources simultaneously, not one after another. This allows us to deliver complex answers in half the time.", label: "parallel_execution" },
    { title: "Cost Efficiency", desc: "If the agent already 'knows' the answer based on its internal data, it delivers it immediately without unnecessary web searches. We only browse the internet when strictly necessary to fill information gaps.", label: "smart_retrieval" },
    { title: "Self-Correction", desc: "If the information found is insufficient, the agent enters a 'reflection' mode, seeking additional data and refining its response until it meets our quality standards.", label: "recursive_reflection" }
];

// Data: Technology Stack
const TECH_STACK = [
    { name: "Gemini 3.0", src: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.svg", color: "from-blue-400/20 to-purple-400/20" },
    { name: "Docker", src: "https://www.vectorlogo.zone/logos/docker/docker-tile.svg", color: "from-blue-500/10 to-blue-600/10" },
    { name: "LangGraph", src: "https://avatars.githubusercontent.com/u/126733545?s=200&v=4", color: "from-green-400/10 to-emerald-500/10" },
    { name: "NetworkX", src: "https://logo.svgcdn.com/devicon/networkx-original.svg", color: "from-slate-700/10 to-slate-900/10" },
    { name: "Google Cloud", src: "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg", color: "from-blue-500/10 to-red-500/10" },
    { name: "Python", src: "https://www.vectorlogo.zone/logos/python/python-icon.svg", color: "from-yellow-400/10 to-blue-500/10" },
    { name: "Alphafold", src: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/deepmind-icon.svg", color: "from-purple-600/10 to-rose-400/10" }
];

// Data: Computational Substrate Stats
const SUBSTRATE_STATS = [
    { icon: Database, label: "Knowledge Nodes", value: "100,000+", sub: "Validated Entities" },
    { icon: Dna, label: "Structural Models", value: "200M+", sub: "via AlphaFold 3" },
    { icon: Cpu, label: "Inference Speed", value: "< 200ms", sub: "Causal Reasoning" },
    { icon: Globe, label: "Data Sources", value: "Real-time", sub: "PubMed & BioRxiv" }
];

// Data: Social Links
const SOCIAL_LINKS = [
    { icon: FileText, label: "Documentation", value: "sarkome.com/docs", href: "/docs/intro", disabled: true },
    { icon: Mail, label: "Email", value: "contact@sarkome.com", href: "mailto:contact@sarkome.com" },
    { icon: AtSign, label: "Twitter / X", value: "@sarkome_ai", href: "https://x.com/sarkome", disabled: true },
    { icon: Code, label: "GitHub", value: "@sarkome-official", href: "https://github.com/sarkome-official" },
    { icon: Briefcase, label: "LinkedIn", value: "/company/sarkome", href: "https://www.linkedin.com/company/sarkome/" }
];


export default function LandingPage() {
    return (
        <div className="text-text-main transition-colors duration-300 antialiased font-sans flex flex-col items-center min-h-screen relative">
            <div className="fixed inset-0 z-[-1] pointer-events-none bg-uiverse-grid"></div>

            <div className="max-w-3xl w-full mx-auto px-4 md:px-6 py-12 md:py-20 space-y-12">
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
                                <p className="text-sm text-text-main">Computational Oncology</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                                From Genomic Data to <span className="text-primary">Therapeutic Hypotheses</span> in Minutes.
                            </h2>
                            <p className="text-base md:text-lg text-text-main leading-relaxed max-w-xl">
                                Accelerate precision oncology with AI Agents that reason over global biomedical knowledge to discover personalized treatments.
                            </p>
                            <div className="pt-2">
                                <GoogleLoginButton />
                            </div>
                        </div>

                        {/* Platform Visualization */}
                        <div className="relative py-12 md:py-16">
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
                                        <img alt="Abstract Data Visualization" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTu0_VpIa_addIxGdTpsucwH6Q83MTH8RS60p-EV4FyTg1BasX_a-IozLR5yNXBU5cAZqNlbSFGFFvs4jvddCDRvfdFmHtS76ZipuSrXg532wHWW6BbuaUyissY6pbHc4Myau1g2eIyhr40TuZtADOJSoBHoqPe_OHtMx2_A0E7RjsCZS3Ah25YSXU4kmX1_hdeSPhwfkkgr7MkB-dkQxmFll7BzIJ4g9hrj9RwPo33LfkBWMjZtyxuPHt4mywlha_qlMtEpke4jCJ" />
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
                        <h3 className="text-xs font-bold tracking-widest text-text-main uppercase mb-8">How Our Agent Optimizes Every Answer</h3>
                        <p className="mb-10 text-text-main text-sm leading-relaxed">
                            Our AI engine doesn't just answer; it decides. We have replaced traditional linear processing with a dynamic architecture that prioritizes speed and precision.
                        </p>
                        <div className="space-y-8 relative pl-2">
                            {DISCOVERY_STEPS.map((step, i) => (
                                <div key={i} className="relative pl-8 group">
                                    <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-border-custom group-hover:bg-primary transition-colors"></div>
                                    <div className="grid md:grid-cols-[1fr_3fr] gap-2 md:gap-8">
                                        <div className="text-xs font-mono text-text-main pt-0.5 uppercase opacity-70">{step.label}</div>
                                        <div>
                                            <h4 className="font-medium text-text-main mb-1 group-hover:text-primary transition-colors">{step.title}</h4>
                                            <p className="text-sm text-text-main leading-snug">{step.desc}</p>
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
                            <a href="https://www.linkedin.com/in/bryramirezp/" target="_blank" rel="noopener noreferrer" className="bg-surface border border-border-custom p-6 rounded-2xl hover:border-primary/50 transition-colors cursor-pointer block" aria-label="View LinkedIn profile of Bryan Ramírez Palacios">
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
                            </a>

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
                            {TECH_STACK.map((tech, i) => (
                                <div key={i} className="group relative">
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                                        {tech.name}
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                                    </div>

                                    <div className={`absolute -inset-2 bg-gradient-to-br ${tech.color} rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    <div className="relative w-12 h-12 bg-surface border border-border-custom rounded-xl flex items-center justify-center p-2.5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 shadow-sm" aria-label={tech.name}>
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
                                <Link key={disease.id} to={`/programs/${disease.id}`} className="group flex items-center justify-between p-4 -mx-4 rounded-xl hover:bg-surface transition-colors" aria-label={`View details for ${disease.name} program`}>
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
                        <div className="p-6 border border-dashed border-border-custom rounded-lg bg-surface/30 flex items-center justify-center">
                            <p className="text-sm text-text-muted mono-text animate-pulse">Working...</p>
                        </div>
                    </section>

                    {/* Technical Stats / Substrate */}
                    <section>
                        <h3 className="text-xs font-bold tracking-widest text-text-main uppercase mb-6">The Computational Substrate</h3>
                        <p className="text-sm text-text-main mb-8">
                            We don't need a physical lab to find answers. We need a map. Our agents traverse the largest integrated biological knowledge graph in existence.
                        </p>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {SUBSTRATE_STATS.map((stat, i) => (
                                <div key={i} className="p-4 rounded-xl bg-surface border border-border-custom hover:border-primary/50 transition-colors group">
                                    <div className="mb-3 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                                        <stat.icon className="w-4 h-4" />
                                    </div>
                                    <div className="text-2xl font-bold text-text-main mb-1">{stat.value}</div>
                                    <div className="text-xs font-semibold text-text-main mb-0.5">{stat.label}</div>
                                    <div className="text-[10px] text-text-muted mono-text uppercase tracking-wider">{stat.sub}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Request Access */}
                    <section className="pt-12">
                        <h3 className="text-xs font-bold tracking-widest text-text-muted uppercase mb-6">Communicate with Us</h3>
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
                            {SOCIAL_LINKS.map((social, i) => {
                                if (social.disabled) {
                                    return (
                                        <div key={i} className="flex justify-between items-center text-text-muted opacity-50 cursor-not-allowed select-none">
                                            <div className="flex items-center gap-3">
                                                <social.icon className="w-4 h-4" />
                                                <span className="text-text-main">{social.label}</span>
                                            </div>
                                            <span className="mono-text text-xs opacity-60 text-text-main">{social.value}</span>
                                        </div>
                                    );
                                }
                                return (
                                    <a key={i} className="flex justify-between items-center group text-text-muted hover:text-primary transition-colors" href={social.href} aria-label={`Follow us on ${social.label}`}>
                                        <div className="flex items-center gap-3">
                                            <social.icon className="w-4 h-4" />
                                            <span className="text-text-main">{social.label}</span>
                                        </div>
                                        <span className="mono-text text-xs opacity-60 text-text-main">{social.value} ↗</span>
                                    </a>
                                );
                            })}
                        </div>
                    </section>

                    <Footer />
                </main>
            </div>
        </div>
    );
}
