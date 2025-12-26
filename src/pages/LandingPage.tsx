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
    Briefcase
} from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="bg-background text-foreground transition-colors duration-300 antialiased font-sans flex flex-col items-center min-h-screen relative">
            <div className="fixed inset-0 z-[-1] pointer-events-none bg-dots opacity-50"></div>

            <div className="max-w-3xl w-full mx-auto px-6 py-12 md:py-20 space-y-24">
                <Header />

                <main className="space-y-24">
                    {/* Hero Section */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center transition-all duration-500">
                                <img alt="Sarkome Logo" className="w-12 h-12 object-contain" width="48" height="48" src="/logo_purple_nobackground.svg" />
                            </div>
                            <div>
                                <h1 className="font-semibold text-lg">Sarkome Institute</h1>
                                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Generative Biotechnology</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                                The Industrialization of <span className="text-primary">Causal Discovery</span>
                            </h2>
                            <p className="text-lg text-text-muted-light dark:text-text-muted-dark leading-relaxed max-w-xl">
                                Sarkome In-Silico: A Multi-Agent Graph Reasoning System powered by Gemini 3.0, accelerating therapeutic target identification for Rare Sarcoma (ASPS) using the PrimeKG knowledge substrate.
                            </p>
                            <div className="pt-2">
                                <Link to="/platform" className="inline-flex items-center gap-2 bg-text-main-light dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all group">
                                    <span className="mono-text">[ ENTER PLATFORM ]</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Platform Visualization */}
                        <div className="relative py-12 md:py-16">
                            <p className="text-xs font-bold tracking-widest text-text-muted-light dark:text-text-muted-dark uppercase mb-8">Platform Visualization</p>
                            <div className="relative h-[300px] md:h-[400px] w-full perspective-[1000px]">
                                {/* Main Card */}
                                <div className="absolute inset-x-0 top-0 md:left-10 md:right-10 mx-auto z-20 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-2xl overflow-hidden p-4 transform transition-transform hover:scale-[1.02] duration-500">
                                    <div className="flex items-center justify-between mb-4 border-b border-border-light dark:border-border-dark pb-3">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                        </div>
                                        <div className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark">causal_inference_engine_v4.py</div>
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
                                <div className="hidden md:block absolute top-12 -left-4 w-2/3 h-[300px] z-10 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-xl p-4 opacity-90 transform -rotate-6 scale-90 origin-bottom-right animate-float-delay">
                                    <div className="h-full w-full bg-slate-100 dark:bg-slate-900 rounded border border-dashed border-border-light dark:border-border-dark flex flex-col p-4">
                                        <div className="h-2 w-1/3 bg-slate-300 dark:bg-slate-700 rounded mb-4"></div>
                                        <div className="h-2 w-2/3 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                                        <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                                        <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-8"></div>
                                        <div className="mt-auto grid grid-cols-2 gap-2">
                                            <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                            <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Decorative Card */}
                                <div className="hidden md:block absolute top-20 -right-4 w-2/3 h-[280px] z-10 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-xl p-4 opacity-90 transform rotate-3 scale-95 origin-bottom-left animate-float">
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
                        <h3 className="text-xs font-bold tracking-widest text-text-muted-light dark:text-text-muted-dark uppercase mb-8">Discovery Pipeline</h3>
                        <p className="mb-10 text-text-muted-light dark:text-text-muted-dark text-sm leading-relaxed">
                            Our approach integrates high-throughput wet lab data with causal representation learning to build the first comprehensive map of disease etiology.
                        </p>
                        <div className="space-y-8 relative pl-2">
                            <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-border-light dark:border-border-dark"></div>

                            {[
                                { phase: "01", title: "Ingest Data", desc: "We gather vast quantities of noisy clinical and biological data, combining different sources that traditional models often overlook.", label: "Ingest" },
                                { phase: "02", title: "Sanitize Data", desc: "We clean this data using strict logic rules (solving problems like \"hemangioma mimicry\") to create a reliable \"ground truth\" that competitors lack.", label: "Sanitize" },
                                { phase: "03", title: "Generate Hypotheses", desc: "We create high-quality therapeutic theories (e.g., interface-specific PROTACs) that are chemically possible and biologically plausible.", label: "Generate" },
                                { phase: "04", title: "Validate Physically", desc: "We confirm these theories in the lab using fast testing loops (NanoBRET, Cryo-EM) to prove structural reality before major capital investment.", label: "Validate" },
                                { phase: "05", title: "Spin Out", desc: "Finally, we spin out the validated asset into a focused commercial entity.", label: "Spin" }
                            ].map((step, i) => (
                                <div key={i} className="relative pl-8 group">
                                    <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-border-light dark:border-border-dark group-hover:bg-primary transition-colors"></div>
                                    <div className="grid md:grid-cols-[1fr_3fr] gap-2 md:gap-8">
                                        <div className="text-xs font-mono text-text-muted-light dark:text-text-muted-dark pt-0.5 uppercase">PHASE {step.phase} — {step.label}</div>
                                        <div>
                                            <h4 className="font-medium text-text-main-light dark:text-text-main-dark mb-1 group-hover:text-primary transition-colors">{step.title}</h4>
                                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{step.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Advisory Board */}
                    <section>
                        <h3 className="text-xs font-bold tracking-widest text-text-muted-light dark:text-text-muted-dark uppercase mb-8">Advisory Board</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 rounded-2xl hover:border-primary/50 transition-colors cursor-default">
                                <p className="text-sm leading-relaxed mb-6 text-text-main-light dark:text-text-main-dark">
                                    "Building Sarkome as a generative biotechnology institute that uses AI to create missing biological knowledge, turning rare-disease treatment, such as ASPS, from probabilistic guessing into systematic causal discovery."
                                </p>
                                <div className="flex items-center gap-3">
                                    <img alt="Bryan Ramírez Palacios" className="w-10 h-10 rounded-full object-cover border border-border-light dark:border-border-dark" src="/bry.png" />
                                    <div>
                                        <div className="text-sm font-medium">Bryan Ramírez Palacios</div>
                                        <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Founder & Lead Architect, Sarkome Institute</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 rounded-2xl hover:border-primary/50 transition-colors cursor-default">
                                <p className="text-sm leading-relaxed mb-6 text-text-main-light dark:text-text-main-dark">
                                    "Sarkome seeks a Founding Biological Sciences Partner to build a causal-first discovery engine for single-driver cancers, starting with ASPS. The role focuses on mechanism-based wet-lab validation, isogenic models, and transcriptional dependency testing."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-border-light dark:border-border-dark">
                                        <span className="text-[10px] font-bold text-primary">?</span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">[ Selection in Progress ]</div>
                                        <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Founding Partner, Biological Sciences</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Technology Stack */}
                    <section>
                        <h3 className="text-xs font-bold tracking-widest text-text-muted-light dark:text-text-muted-dark uppercase mb-8">Technology Stack</h3>
                        <div className="flex flex-wrap gap-4 md:gap-6 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                            {[
                                { name: "PyTorch", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAet9hmSVrgCnOaMvj85Hdn6uN2n1D8vqUsZEjWpeWQvuirD9kcHDM-x5V_OfiMzPecPu5wjuxuT1NbZOGggjSKeLYjOUF5ShVd50B30prBVIIX8ARWQtrJFygf0o4b1y3q4BGC7I8NE7EPhqPXoYXJBGaDnzdn8kXNtsqrAOMHS--FSCCLsdgVTlglMDFMAJLaMoPo5sGO8pGPFH21k7XtNn8nu3gXR_GKcvMy1cOpJzIRjLVfLK_ufR8FMeqi16Yo6gbbk7fLwsy" },
                                { name: "Python", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYB0x9rb65YtVt0oWqwYoLzz3f3DhIkX8oOMMOREy2Ed6Y2kbIzku_VnbgrpNp3GfLXCwk_CCZX1QgaSdFuMFcCLfvsFWVjYPTmnb1ciax91R85CXcHAO3Km5Bx70UEzDTEXHKgcge1-sOr6W32GGZbyTkFOgqXQ2seoBwlcYhx5loDhNe-Yy6b2nqpC8_H15sxP1Skkf1NOY17uCCgrLCyYMzBdR8DAnySzvPRlq0C8CW4plPPI6Zcst6XhZBVEaAWxhtWOp5AnmV" },
                                { name: "TensorFlow", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg4SQyGpjJmOoR-t1G33MzGvzFV0h2U62dScNrUqjGjvyAf4gwQoGtwnxzbIVC7KFCm3SMsop_YMBa2VVPua4GXCDDH0Le4OLtQd8nsgiHSE02V9le1LpcuUtsRYc_lz05h_i2aEqs_4-5maIkfONDdhVM1amsHxNofGd2QtHPyW0kKLZEIenaUpzkMhmfUCHBbZg28wbgL7Ergcp8so4r6zFwsWaSQVWCbCYBmZkag91ycAJMTDuqMXQaW4dN8pWzy6Z4AcbBRZsP" },
                                { name: "Docker", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAI5MENw9kVQRWFIzs9QehU5jZH9XX4OAwNJRhD9CWNi-6IItoKxRpbO3wU0HgGdEjaPP4rZZIgTOx3dUruf4Gi_2FnO_mTJdMzl8yAC4hatsge5k-e5B79COs_Jem-jnfFBYx-uIBdfMlLkWYwWcUk-rXzX2892urrXb0RhU7nlC1IQkBEWx1QcHGON47bArmy3LlTQLDPECmm0Wl1hJFsL0rkIQvSGDoMNp6jQcq1LB5uXoRsqLfXkrsPraF6556owywExGt89Jfi" },
                                { name: "Google Cloud", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7likBGn-VhzvkIY-mNT9rnFSs1mzCmMyh-CdUJ3fqtpswFjsGkjxudHAH8EwZt09fmHdFENmkowlgN0fI6u4E4Qeh6mp2KCSgGQxCbnQzZv4STYuJGmDviBESgFPCllyMKf_GdCkARqxpEYN9NrW3wxxHZasEzlIRTttDuQxZx0-YjcNtksRNO6jWYxrWDBuEDzAvqGdTjTTdgB5649pRmN65QK0PiK1qkjvz52hdpVV8Lrd1_yi7PlSP8w3IYxQHQJC-iRJ7UXKi" }
                            ].map((tech, i) => (
                                <div key={i} className="w-10 h-10 bg-surface-light dark:bg-surface-dark rounded-full flex items-center justify-center border border-border-light dark:border-border-dark" title={tech.name}>
                                    <img alt={tech.name} className="w-5 h-5" src={tech.src} />
                                </div>
                            ))}
                            <div className="w-10 h-10 bg-surface-light dark:bg-surface-dark rounded-full flex items-center justify-center border border-border-light dark:border-border-dark text-text-main-light dark:text-text-main-dark" title="Biology">
                                <Activity className="w-5 h-5" />
                            </div>
                        </div>
                    </section>

                    {/* Active Programs */}
                    <section>
                        <h3 className="text-xs font-bold tracking-widest text-text-muted-light dark:text-text-muted-dark uppercase mb-8">Active Programs</h3>
                        <div className="space-y-4">
                            {diseases.filter(d => d.type === 'active').map(disease => (
                                <Link key={disease.id} to={`/programs/${disease.id}`} className="group flex items-center justify-between p-4 -mx-4 rounded-xl hover:bg-surface-light dark:hover:bg-surface-dark transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                            {disease.id === 'als' ? <Brain className="w-5 h-5" /> : <Biohazard className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{disease.code}</div>
                                            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Rare Oncology / {disease.name}</div>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-text-muted-light dark:text-text-muted-dark group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Latest Research */}
                    <section>
                        <h3 className="text-xs font-bold tracking-widest text-text-muted-light dark:text-text-muted-dark uppercase mb-6">Latest Research</h3>
                        <div className="flex flex-col gap-4">
                            {[
                                { date: "FEB 2024", title: "Graph Neural Networks in Protein Folding", time: "5 m" },
                                { date: "JAN 2024", title: "Causal Inference for Target Validation", time: "12 m" },
                                { date: "DEC 2023", title: "The Future of In-Silico Trials", time: "8 m" }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-start group cursor-pointer">
                                    <div>
                                        <div className="text-xs text-text-muted-light dark:text-text-muted-dark mb-1 mono-text">{item.date}</div>
                                        <h4 className="text-sm font-medium group-hover:text-primary transition-colors">{item.title}</h4>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-text-muted-light dark:text-text-muted-dark">
                                        <Clock className="w-3.5 h-3.5" />
                                        {item.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Inside the Lab */}
                    <section>
                        <h3 className="text-xs font-bold tracking-widest text-text-muted-light dark:text-text-muted-dark uppercase mb-6">Inside the Lab</h3>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-8">
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
                        <div className="flex justify-end mt-12">
                            <div className="text-[10px] text-text-muted-light dark:text-text-muted-dark flex items-center gap-1">
                                Shot on Fujifilm GFX 100 <Camera className="w-3 h-3" />
                            </div>
                        </div>
                    </section>

                    {/* Request Access */}
                    <section className="border-t border-dashed border-border-light dark:border-border-dark pt-12">
                        <h3 className="text-xs font-bold tracking-widest text-text-muted-light dark:text-text-muted-dark uppercase mb-6">Request Access</h3>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-8">
                            Partnership inquiries and investor relations can reach us using the form below.
                        </p>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input className="w-full bg-surface-light dark:bg-surface-dark border-0 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark/50 outline-none" placeholder="Name" type="text" />
                                <input className="w-full bg-surface-light dark:bg-surface-dark border-0 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark/50 outline-none" placeholder="Email" type="email" />
                            </div>
                            <textarea className="w-full bg-surface-light dark:bg-surface-dark border-0 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark/50 resize-none outline-none" placeholder="Message" rows={4}></textarea>
                            <div className="flex items-center justify-between pt-2">
                                <button className="bg-text-main-light dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-colors" type="button">
                                    Send message
                                </button>
                                <div className="text-xs text-text-muted-light dark:text-text-muted-dark hidden sm:block">
                                    or <kbd className="font-mono">↵ Enter</kbd> to send
                                </div>
                            </div>
                        </form>

                        <div className="mt-16 space-y-3 text-sm">
                            {[
                                { icon: Mail, label: "Email", value: "partners@sarkome.bio", href: "mailto:partners@sarkome.bio" },
                                { icon: AtSign, label: "Twitter / X", value: "@sarkome_ai", href: "https://x.com/sarkome_ai" },
                                { icon: Code, label: "GitHub", value: "@sarkome-official", href: "https://github.com/sarkome-official" },
                                { icon: Briefcase, label: "LinkedIn", value: "/company/sarkome", href: "https://www.linkedin.com/company/sarkome/" }
                            ].map((social, i) => (
                                <a key={i} className="flex justify-between items-center group text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors" href={social.href}>
                                    <div className="flex items-center gap-3">
                                        <social.icon className="w-4 h-4" />
                                        <span>{social.label}</span>
                                    </div>
                                    <span className="mono-text text-xs opacity-60">{social.value} ↗</span>
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
