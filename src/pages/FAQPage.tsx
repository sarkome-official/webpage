import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Search, Brain, Database, FlaskConical, Shield } from "lucide-react";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";

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
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-16 max-w-4xl">
                {/* Hero Section */}
                <section className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Find answers to common questions about Sarkome's AI-powered precision oncology platform,
                        our technology, and how we're accelerating cancer research.
                    </p>
                </section>

                {/* Search & Filter */}
                <section className="mb-8">
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    }`}
                            >
                                {category !== "All" && categoryIcons[category]}
                                {category}
                            </button>
                        ))}
                    </div>
                </section>

                {/* FAQ List */}
                <section className="space-y-4">
                    {filteredFaqs.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No questions found matching your search.</p>
                        </div>
                    ) : (
                        filteredFaqs.map((faq, index) => (
                            <article
                                key={index}
                                className="border border-border rounded-lg overflow-hidden bg-card"
                                itemScope
                                itemType="https://schema.org/Question"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                                    aria-expanded={openIndex === index}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-primary">
                                            {categoryIcons[faq.category]}
                                        </span>
                                        <h2 className="font-medium text-foreground" itemProp="name">
                                            {faq.question}
                                        </h2>
                                    </div>
                                    {openIndex === index ? (
                                        <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                    )}
                                </button>

                                {openIndex === index && (
                                    <div
                                        className="px-5 pb-5 pt-0"
                                        itemScope
                                        itemType="https://schema.org/Answer"
                                        itemProp="acceptedAnswer"
                                    >
                                        <div className="pl-8 border-l-2 border-primary/30">
                                            <p className="text-muted-foreground leading-relaxed" itemProp="text">
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
                <section className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                        Still have questions?
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Our team is here to help you understand how Sarkome can accelerate your cancer research.
                    </p>
                    <a
                        href="mailto:contact@sarkome.com"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                    >
                        Contact Us
                    </a>
                </section>
            </main>

            <Footer />
        </div>
    );
}
