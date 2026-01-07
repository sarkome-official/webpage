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
    Globe,
    CreditCard,
    Zap,
    Shield,
    Users,
    TestTube,
    GraduationCap
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
    { name: "Neo4j", src: "https://www.vectorlogo.zone/logos/neo4j/neo4j-icon.svg", color: "from-blue-400/10 to-cyan-500/10" },
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

// Data: Economic Model Stats
const ECONOMIC_STATS = [
    { icon: CreditCard, label: "Pricing Model", value: "Pay-Per-Use", sub: "No Monthly Lock-in" },
    { icon: Zap, label: "Starting Cost", value: "$0.03", sub: "Per Simple Query" },
    { icon: Shield, label: "BYOLLM Option", value: "From $49", sub: "Use Your Own LLM" },
    { icon: Users, label: "Academic Discount", value: "Up to 50%", sub: "Research Institutions" }
];

// Data: Social Links
const SOCIAL_LINKS = [
    { icon: FileText, label: "Documentation", value: "sarkome.com/docs", href: "/docs/intro" },
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
                                <h1 className="font-semibold text-2x3 text-text-main transition-none duration-0">Sarkome</h1>
                                <p className="text-sm text-text-main">Clinical reasoning infrastructure</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                                From Genomic Data to <span className="text-primary">Therapeutic Hypotheses</span> in Minutes.
                            </h2>
                            <p className="text-base md:text-lg text-text-main leading-relaxed max-w-xl">
                                Accelerate precision oncology with AI Agent that reason over global biomedical knowledge to discover personalized treatments.
                            </p>
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <GoogleLoginButton />
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Beta 0.0.6 Live</span>
                                </div>
                            </div>
                        </div>

                        {/* Narrative Workflows: From Query to Discovery */}
                        <div className="relative py-12 md:py-20 border-y border-border-custom/50">
                            <p className="text-xs font-bold tracking-widest text-text-main uppercase mb-12 text-center">How Sarkome Works: The Path to Discovery</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                                {/* Decorative Connector Line (Desktop) */}
                                <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border-custom to-transparent -translate-y-16"></div>

                                {/* Step 1: The Clinical Query */}
                                <div className="relative flex flex-col items-center text-center space-y-4 group">
                                    <div className="w-12 h-12 rounded-full bg-surface border border-border-custom flex items-center justify-center z-10 group-hover:border-primary/50 transition-colors shadow-xl">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-bold uppercase tracking-tight">1. Input Case</h4>
                                        <div className="bg-surface/50 border border-border-custom p-3 rounded-lg text-left">
                                            <p className="text-[10px] font-mono text-text-muted mb-1">// Natural Language Query</p>
                                            <p className="text-xs italic leading-tight italic">"Identify metabolic vulnerabilities in ASPS fusion-protein driven tumors..."</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 2: Agent Reasoning */}
                                <div className="relative flex flex-col items-center text-center space-y-4 group">
                                    <div className="w-12 h-12 rounded-full bg-surface border border-border-custom flex items-center justify-center z-10 group-hover:border-primary/50 transition-colors shadow-2xl">
                                        <Network className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-bold uppercase tracking-tight">2. Agentic Reasoning</h4>
                                        <div className="bg-black/40 border border-primary/20 p-3 rounded-lg text-left backdrop-blur-sm">
                                            <div className="flex gap-1 mb-2">
                                                <div className="h-1 w-4 bg-primary/40 rounded"></div>
                                                <div className="h-1 w-8 bg-primary rounded"></div>
                                                <div className="h-1 w-2 bg-primary/20 rounded"></div>
                                            </div>
                                            <p className="text-[10px] leading-tight text-white/80">Traversing PrimeKG...</p>
                                            <p className="text-[10px] leading-tight text-white/60">Analyzing AlphaFold conformations...</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3: Therapeutic Hypothesis */}
                                <div className="relative flex flex-col items-center text-center space-y-4 group">
                                    <div className="w-12 h-12 rounded-full bg-primary border border-primary/20 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-bold uppercase tracking-tight">3. Structured Result</h4>
                                        <div className="bg-surface border-2 border-primary/30 p-3 rounded-lg text-left shadow-lg scale-105">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[9px] font-bold text-primary px-1.5 py-0.5 bg-primary/10 rounded">HYPOTHESIS v1.2</span>
                                                <span className="text-[9px] font-mono opacity-60">94.2% Conf.</span>
                                            </div>
                                            <p className="text-[11px] font-bold leading-tight">Targeting SLC7A11 ferroptosis pathway...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <section className="bg-surface/30 p-8 rounded-3xl border border-border-custom">
                            <h3 className="text-xs font-bold tracking-widest text-text-main uppercase mb-8 text-center">Built for Precision Oncology</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { icon: TestTube, label: "Researchers", desc: "Accelerate hypothesis discovery" },
                                    { icon: Briefcase, label: "Biopharma", desc: "Validate novel drug targets" },
                                    { icon: GraduationCap, label: "Academic Labs", desc: "Scale research infrastructure" },
                                    { icon: Activity, label: "Clinicians", desc: "Explore complex oncology cases" }
                                ].map((type, i) => (
                                    <div key={i} className="flex flex-col items-center text-center group">
                                        <div className="w-10 h-10 rounded-xl bg-card border border-border-custom flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300">
                                            <type.icon className="w-5 h-5 opacity-70 group-hover:text-primary group-hover:opacity-100 transition-all" />
                                        </div>
                                        <div className="text-sm font-bold text-text-main transition-colors group-hover:text-primary">{type.label}</div>
                                        <div className="text-[10px] text-text-muted leading-tight mt-1">{type.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

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
                                    "We've built an AI agent that reasons over 100,000+ biomedical nodes and real-time literature to generate therapeutic hypotheses in minutes. The platform combines PrimeKG, AlphaFold, and causal reasoning to transform oncology from trial-and-error into systematic drug discovery."
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
                                    "Seeking ML Engineers with expertise in knowledge graph embeddings, agentic systems (LangGraph/LangChain), and biomedical NLP. Ideal candidates have experience building production RAG pipelines, graph neural networks, or deployed LLM agents in regulated environments."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-border-custom">
                                        <span className="text-[10px] font-bold text-primary">?</span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-text-main">[ Open Position ]</div>
                                        <div className="text-xs text-text-main">Senior ML Engineer, Biomedical AI</div>
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
                        <h3 className="text-xs font-bold tracking-widest text-text-muted uppercase mb-4">Active Programs</h3>
                        <p className="text-sm text-text-main/80 mb-8 leading-relaxed">
                            Sarkome-led research initiatives to generate novel therapeutic hypotheses through systematic AI-driven discovery. Each program produces peer-reviewed publications validated by academic institutions, transforming computational insights into actionable biomedical knowledge.
                        </p>
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
                            We don't need a physical lab to find answers. We need a map. Our agent traverse the largest integrated biological knowledge graph in existence.
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

                    {/* Economic Model - Badge/Emblem Style */}
                    <section>
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <h3 className="text-xs font-bold tracking-widest text-text-main uppercase">Economic Model</h3>
                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <span className="text-[10px] font-bold text-emerald-500 uppercase">Current Status: Free Beta 0.0.6</span>
                            </div>
                        </div>
                        <p className="text-sm text-text-main mb-10">
                            During our initial launch phase, <strong className="text-primary">all platform features are free to use</strong>. Our future model ensures oncology AI remains accessible with clear, usage-based pricing.
                        </p>


                        {/* Badge Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                            {/* Badge 1 - Pay Per Use (Emerald) */}
                            <div className="group relative flex flex-col items-center text-center p-6 bg-surface/50 rounded-2xl border border-border-custom hover:border-emerald-500/30 transition-colors">
                                {/* Circular Icon with Double Ring */}
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 w-20 h-20 rounded-full bg-emerald-500/20 blur-xl group-hover:bg-emerald-500/30 transition-all duration-500" />
                                    <div className="relative w-20 h-20 rounded-full border-2 border-emerald-500/50 flex items-center justify-center group-hover:border-emerald-400 transition-colors">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center">
                                            <CreditCard className="w-6 h-6 text-emerald-400" />
                                        </div>
                                    </div>
                                </div>
                                {/* Badge Content */}
                                <div className="relative">
                                    <div className="text-2xl font-bold text-text-main mb-1">Pay-Per-Use</div>
                                    <div className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-3">Zero Commitment</div>
                                    {/* Emblem/Ribbon */}
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-wider">No Monthly Fees</span>
                                    </div>
                                    {/* Description */}
                                    <p className="text-xs text-text-muted leading-relaxed">
                                        Run one query or one thousand. You see the cost estimate before every query and pay only for the AI processing used. No surprises.
                                    </p>
                                </div>
                            </div>

                            {/* Badge 2 - Starting Cost (Blue) */}
                            <div className="group relative flex flex-col items-center text-center p-6 bg-surface/50 rounded-2xl border border-border-custom hover:border-blue-500/30 transition-colors">
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 w-20 h-20 rounded-full bg-blue-500/20 blur-xl group-hover:bg-blue-500/30 transition-all duration-500" />
                                    <div className="relative w-20 h-20 rounded-full border-2 border-blue-500/50 flex items-center justify-center group-hover:border-blue-400 transition-colors">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 flex items-center justify-center">
                                            <Zap className="w-6 h-6 text-blue-400" />
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="text-2xl font-bold text-text-main mb-1">From $0.03</div>
                                    <div className="text-xs font-medium text-blue-400 uppercase tracking-wider mb-3">Per Query</div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        <span className="text-[10px] font-semibold text-blue-300 uppercase tracking-wider">Transparent Pricing</span>
                                    </div>
                                    {/* Description */}
                                    <p className="text-xs text-text-muted leading-relaxed">
                                        Simple questions cost cents. Complex multi-tool analyses cost more but still a fraction of traditional research services.
                                    </p>
                                </div>
                            </div>

                            {/* Badge 3 - BYOLLM (Purple) */}
                            <div className="group relative flex flex-col items-center text-center p-6 bg-surface/50 rounded-2xl border border-border-custom hover:border-purple-500/30 transition-colors">
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 w-20 h-20 rounded-full bg-purple-500/20 blur-xl group-hover:bg-purple-500/30 transition-all duration-500" />
                                    <div className="relative w-20 h-20 rounded-full border-2 border-purple-500/50 flex items-center justify-center group-hover:border-purple-400 transition-colors">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-purple-400" />
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="text-2xl font-bold text-text-main mb-1">From $49/mo</div>
                                    <div className="text-xs font-medium text-purple-400 uppercase tracking-wider mb-3">Bring Your Own AI</div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full mb-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                        <span className="text-[10px] font-semibold text-purple-300 uppercase tracking-wider">Full Data Privacy</span>
                                    </div>
                                    {/* Description */}
                                    <p className="text-xs text-text-muted leading-relaxed">
                                        Already have OpenAI, Anthropic, or Google AI access? Connect your own API keys. You pay for our platform, LLM costs go to your provider.
                                    </p>
                                </div>
                            </div>

                            {/* Badge 4 - Academic (Amber/Gold) */}
                            <div className="group relative flex flex-col items-center text-center p-6 bg-surface/50 rounded-2xl border border-border-custom hover:border-amber-500/30 transition-colors">
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 w-20 h-20 rounded-full bg-amber-500/20 blur-xl group-hover:bg-amber-500/30 transition-all duration-500" />
                                    <div className="relative w-20 h-20 rounded-full border-2 border-amber-500/50 flex items-center justify-center group-hover:border-amber-400 transition-colors">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center">
                                            <Users className="w-6 h-6 text-amber-400" />
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="text-2xl font-bold text-text-main mb-1">Up to 50% Off</div>
                                    <div className="text-xs font-medium text-amber-400 uppercase tracking-wider mb-3">Academic Program</div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider">Universities & Labs</span>
                                    </div>
                                    {/* Description */}
                                    <p className="text-xs text-text-muted leading-relaxed">
                                        Universities, research hospitals, and academic labs qualify for reduced rates. Grant-compatible invoicing available.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom CTA */}
                        <div className="mt-10 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 text-center">
                            <h4 className="text-xl font-bold mb-2">Ready to explore?</h4>
                            <p className="text-sm text-text-muted mb-6">
                                Start your research today. New accounts receive <span className="text-primary font-semibold">$5 in future credits</span> automatically, but right now, you can explore everything for free.
                            </p>
                            <div className="flex justify-center">
                                <GoogleLoginButton />
                            </div>
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
