import { useState } from "react";
import { ChevronDown, Search, HelpCircle, Brain, Shield, FlaskConical, Mail } from "lucide-react";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { cn } from "@/lib/utils";

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQItem[] = [
    // General
    {
        category: "General",
        question: "What is Sarkome?",
        answer: "Sarkome is an AI-powered precision oncology platform that transforms genomic data into actionable therapeutic hypotheses in minutes. It uses intelligent agents that reason over biomedical knowledge graphs (PrimeKG), protein structures (AlphaFold), and real-time scientific literature to discover personalized cancer treatments."
    },
    {
        category: "General",
        question: "Who is Sarkome for?",
        answer: "Sarkome is designed for oncology researchers, pharmaceutical companies, academic institutions, and healthcare organizations seeking to accelerate cancer drug discovery and identify personalized treatment options using AI-driven analysis."
    },
    {
        category: "General",
        question: "Is Sarkome a diagnostic tool?",
        answer: "No. Sarkome is a research platform for hypothesis generation. It does not provide medical diagnoses or treatment recommendations for clinical use. All outputs require expert validation before any clinical application."
    },
    // Technology
    {
        category: "Technology",
        question: "How does Sarkome use AI for cancer research?",
        answer: "Sarkome deploys AI Agents that ingest patient genomic profiles, traverse the world's largest biomedical knowledge graph with over 4 million nodes and 20 million relationships, analyze 3D protein structures from AlphaFold, and synthesize findings with real-time literature to generate validated therapeutic hypotheses."
    },
    {
        category: "Technology",
        question: "What is a biomedical knowledge graph?",
        answer: "A biomedical knowledge graph is a structured database that represents relationships between biological entities like genes, proteins, diseases, drugs, and pathways. Sarkome uses PrimeKG, which contains over 4 million nodes and 20 million relationships, enabling complex multi-hop reasoning to discover non-obvious connections."
    },
    {
        category: "Technology",
        question: "How does Sarkome integrate with AlphaFold?",
        answer: "Sarkome integrates AlphaFold's database of 200+ million predicted protein structures to analyze 3D conformations, identify druggable binding pockets, and predict drug-protein interactions at atomic resolution."
    },
    // Data & Privacy
    {
        category: "Data & Privacy",
        question: "What data sources does Sarkome integrate?",
        answer: "Sarkome integrates PrimeKG (a comprehensive biomedical knowledge graph), AlphaFold (protein structure predictions), PubMed and scientific literature, clinical trial registries, and user-provided genomic data to generate therapeutic hypotheses."
    },
    {
        category: "Data & Privacy",
        question: "Is my data secure on Sarkome?",
        answer: "Yes. Sarkome implements industry-standard security practices including encrypted data transmission (HTTPS), secure authentication via Google OAuth 2.0 with PKCE, and does not store any patient genomic data beyond the active session."
    },
    // Scientific
    {
        category: "Scientific",
        question: "What is precision oncology?",
        answer: "Precision oncology is an approach to cancer treatment that uses genetic and molecular profiling to identify the most effective therapies for individual patients. Sarkome accelerates this process by using AI to analyze complex biomedical data and generate personalized treatment hypotheses."
    },
    {
        category: "Scientific",
        question: "What types of cancer does Sarkome support?",
        answer: "Sarkome supports all cancer types with a focus on rare and hard-to-treat malignancies where traditional approaches fall short, including sarcomas, rare solid tumors, and cancers driven by fusion oncoproteins."
    },
    {
        category: "Scientific",
        question: "How accurate are Sarkome's hypotheses?",
        answer: "Every hypothesis is grounded in verifiable data from knowledge graphs and peer-reviewed literature. Confidence scores reflect evidence strength based on the number and quality of supporting sources. However, all outputs require expert validation before any research or clinical application."
    },
    {
        category: "Scientific",
        question: "What is targeted protein degradation?",
        answer: "Targeted protein degradation (TPD) is a therapeutic modality that uses small molecules (like PROTACs) to selectively destroy disease-causing proteins rather than just inhibiting them. This approach is particularly promising for 'undruggable' targets like fusion oncoproteins."
    }
];

const categoryIcons: Record<string, React.ReactNode> = {
    "General": <HelpCircle className="w-5 h-5" />,
    "Technology": <Brain className="w-5 h-5" />,
    "Data & Privacy": <Shield className="w-5 h-5" />,
    "Scientific": <FlaskConical className="w-5 h-5" />
};

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const categories = ["All", ...Array.from(new Set(faqs.map(f => f.category)))];

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="text-text-main transition-colors duration-300 antialiased font-sans flex flex-col items-center min-h-screen relative">
            {/* Background Pattern */}
            <div className="fixed inset-0 z-[-1] pointer-events-none bg-uiverse-grid"></div>

            <div className="max-w-5xl w-full mx-auto px-4 md:px-6 py-12 md:py-20 space-y-12">
                <Header />

                <main className="space-y-12">
                    {/* Hero Section */}
                    <section className="text-center space-y-6 max-w-3xl mx-auto">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
                            <HelpCircle className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-text-main">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg text-text-main max-w-2xl mx-auto leading-relaxed">
                            Find answers to common questions about Sarkome's AI-powered precision oncology platform,
                            our technology, and how we're accelerating cancer research.
                        </p>
                    </section>

                    {/* Search & Filter Section */}
                    <section className="space-y-6">
                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-main opacity-50" />
                            <input
                                type="text"
                                placeholder="Search questions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-border-custom bg-surface/50 backdrop-blur-sm text-text-main placeholder:text-text-main placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            />
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={cn(
                                        "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all border",
                                        selectedCategory === category
                                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                            : "bg-surface/50 backdrop-blur-sm text-text-main border-border-custom hover:bg-surface hover:border-primary/50"
                                    )}
                                >
                                    {category !== "All" && categoryIcons[category]}
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Results Count */}
                        <p className="text-center text-sm text-text-main opacity-60">
                            Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'}
                            {selectedCategory !== "All" && ` in ${selectedCategory} `}
                        </p>
                    </section>

                    {/* FAQ List */}
                    <section className="space-y-4 max-w-3xl mx-auto">
                        {filteredFaqs.length === 0 ? (
                            <div className="text-center py-16 px-4">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface/50 border border-border-custom mb-6">
                                    <Search className="w-10 h-10 text-text-main opacity-30" />
                                </div>
                                <h3 className="text-xl font-semibold text-text-main mb-2">No questions found</h3>
                                <p className="text-text-main opacity-60">
                                    Try adjusting your search or category filter
                                </p>
                            </div>
                        ) : (
                            filteredFaqs.map((faq, index) => (
                                <article
                                    key={index}
                                    className="border border-border-custom rounded-xl overflow-hidden bg-surface/30 backdrop-blur-sm transition-all hover:bg-surface/50 hover:border-primary/30"
                                    itemScope
                                    itemType="https://schema.org/Question"
                                >
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex items-start md:items-center justify-between gap-4 p-5 md:p-6 text-left transition-colors group"
                                        aria-expanded={openIndex === index}
                                    >
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className="flex-shrink-0 mt-1 md:mt-0">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                                                    openIndex === index
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-primary/10 text-primary group-hover:bg-primary/20"
                                                )}>
                                                    {categoryIcons[faq.category]}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1.5">
                                                    {faq.category}
                                                </div>
                                                <h2 className="font-semibold text-base md:text-lg text-text-main break-words" itemProp="name">
                                                    {faq.question}
                                                </h2>
                                            </div>
                                        </div>
                                        <ChevronDown
                                            className={cn(
                                                "w-5 h-5 text-text-main opacity-50 flex-shrink-0 transition-transform mt-1 md:mt-0",
                                                openIndex === index && "rotate-180"
                                            )}
                                        />
                                    </button>

                                    {openIndex === index && (
                                        <div
                                            className="px-5 md:px-6 pb-5 md:pb-6 pt-0"
                                            itemScope
                                            itemType="https://schema.org/Answer"
                                            itemProp="acceptedAnswer"
                                        >
                                            <div className="ml-0 md:ml-[52px] pl-4 border-l-2 border-primary/30">
                                                <p className="text-text-main leading-relaxed opacity-80" itemProp="text">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </article>
                            ))
                        )}
                    </section>

                    {/* Contact CTA */}
                    <section className="mt-16 max-w-3xl mx-auto">
                        <div className="text-center p-8 md:p-10 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 backdrop-blur-sm">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/20 mb-4">
                                <Mail className="w-7 h-7 text-primary" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-text-main mb-3">
                                Still have questions?
                            </h2>
                            <p className="text-text-main opacity-80 mb-6 max-w-md mx-auto">
                                Our team is here to help you understand how Sarkome can accelerate your cancer research.
                            </p>
                            <a
                                href="mailto:contact@sarkome.com"
                                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                            >
                                <Mail className="w-4 h-4" />
                                Contact Us
                            </a>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </div>
    );
}
