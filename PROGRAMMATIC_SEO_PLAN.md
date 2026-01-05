# Sarkome: Programmatic SEO + GEO Implementation Plan

> **Version:** 1.1  
> **Date:** 2026-01-05  
> **Author:** Senior Software Architect  
> **Status:** IMPLEMENTING - Phase 1 Complete, Phase 2 In Progress
> **Objective:** Optimize Sarkome for discovery by AI systems (ChatGPT, Gemini, Perplexity) and traditional search engines (Google).

---

## Executive Summary

This plan implements a dual-strategy approach:
1. **Programmatic SEO**: Automatically generate optimized pages at scale for long-tail keywords related to sarcoma research, ASPS, and biotech.
2. **Generative Engine Optimization (GEO)**: Structure content specifically for AI models to extract, cite, and recommend Sarkome in their responses.

---

## Phase 1: Foundation - Technical SEO & AI Accessibility

### 1.1 Enhanced `llms.txt` (Already Exists - EXCELLENT)
**Current Status:** You already have a comprehensive `llms.txt` file. This is ahead of 99% of websites.

**Improvements Needed:**
- [ ] Add explicit **FAQ section** with common questions about ASPS, Sarkome, and SAR-001.
- [ ] Add **structured entities** (JSON-LD style) for key concepts.
- [ ] Add **"How to Cite"** section for academic AI tools.

**Target File:** `public/llms.txt`

### 1.2 Create `llms-full.txt` for Deep Context
A longer version with complete scientific documentation for models that can handle extended context.

**New File:** `public/llms-full.txt`

### 1.3 Update `robots.txt` for AI Crawlers
Allow specific AI crawlers explicitly.

**Target File:** `public/robots.txt`
```
User-agent: *
Allow: /

# AI Model Crawlers - Explicitly Allowed
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Amazonbot
Allow: /

Sitemap: https://sarkome.com/sitemap.xml
```

### 1.4 Add Structured Data (JSON-LD Schema)
Implement rich schema markup in `index.html` for:
- `Organization`
- `WebSite`
- `BioChemEntity` (for SAR-001)
- `MedicalCondition` (for ASPS)
- `FAQPage`

**Target File:** `index.html`

---

## Phase 2: Programmatic SEO Pages

### 2.1 Concept: Auto-Generated Knowledge Pages
Create template-driven pages that are automatically populated from your Knowledge Graph data. Each page targets a specific long-tail keyword.

### 2.2 Page Templates to Create

| Template Type | Example URL | Content Source |
|---------------|-------------|----------------|
| **Disease Pages** | `/knowledge/diseases/alveolar-soft-part-sarcoma` | PrimeKG disease nodes |
| **Gene Pages** | `/knowledge/genes/TFE3` | PrimeKG gene nodes |
| **Protein Pages** | `/knowledge/proteins/ASPSCR1-TFE3` | AlphaFold + PrimeKG |
| **Drug Mechanism Pages** | `/knowledge/mechanisms/protein-degradation` | Internal content |
| **Research Topic Pages** | `/research/targeted-protein-degradation` | Generated content |
| **FAQ Pages** | `/faq/what-is-asps` | Structured FAQs |

### 2.3 Implementation Strategy

**A. Create Dynamic Route Components:**
```
src/pages/knowledge/
  ├── DiseaseTemplate.tsx
  ├── GeneTemplate.tsx
  ├── ProteinTemplate.tsx
  └── MechanismTemplate.tsx
```

**B. Generate Static JSON Data Files:**
```
public/data/
  ├── diseases.json
  ├── genes.json
  ├── proteins.json
  └── mechanisms.json
```

**C. Pre-render for SEO (Vite SSG or Prerender):**
Use `vite-plugin-ssr` or `prerender-spa-plugin` to generate static HTML for each knowledge page at build time.

---

## Phase 3: GEO - Content Optimization for AI

### 3.1 Answer-First Content Structure
Every knowledge page must follow this structure:

```markdown
# [Topic Title]

**Quick Answer:** [2-3 sentence direct answer to the main question]

## Overview
[Detailed explanation with clear paragraphs]

## Key Facts
- Bullet point 1
- Bullet point 2
- Bullet point 3

## Frequently Asked Questions
### Q: [Question 1]
A: [Direct answer]

### Q: [Question 2]
A: [Direct answer]

## Sources & Citations
- [Source 1]
- [Source 2]
```

This structure is optimized for:
- **Perplexity AI**: Loves bullet points and clear structure.
- **ChatGPT**: Favors conversational, direct answers.
- **Gemini**: Prioritizes comprehensive, well-cited content.

### 3.2 Semantic HTML Enhancements
Use proper semantic HTML elements:
- `<article>` for main content
- `<section>` for logical divisions
- `<aside>` for related information
- `<details>/<summary>` for expandable FAQs
- `<figure>/<figcaption>` for images/diagrams

### 3.3 Entity-Rich Content
Explicitly mention and define key entities:
- **Brand:** "Sarkome" / "Sarkome Institute"
- **Product:** "SAR-001"
- **Disease:** "Alveolar Soft Part Sarcoma (ASPS)"
- **Technology:** "Targeted Protein Degradation" / "PROTAC"

AI models associate these entities when they appear together consistently.

---

## Phase 4: Schema Markup Implementation

### 4.1 Organization Schema (Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "ResearchOrganization",
  "name": "Sarkome Institute",
  "url": "https://sarkome.com",
  "logo": "https://sarkome.com/logo_purple_nobackground.svg",
  "description": "A graph-driven reasoning system for cancer hypothesis validation using PrimeKG, AlphaFold, and real-time literature.",
  "foundingDate": "2024",
  "knowsAbout": [
    "Alveolar Soft Part Sarcoma",
    "Targeted Protein Degradation",
    "ASPSCR1-TFE3 Fusion Protein",
    "Biomedical Knowledge Graphs"
  ],
  "sameAs": [
    "https://github.com/sarkome",
    "https://twitter.com/sarkome"
  ]
}
```

### 4.2 FAQPage Schema
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Sarkome?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sarkome is a Venture Institute developing targeted therapies for rare cancers, specifically Alveolar Soft Part Sarcoma (ASPS), using AI-powered drug discovery."
      }
    },
    {
      "@type": "Question",
      "name": "What is ASPS?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Alveolar Soft Part Sarcoma (ASPS) is an ultra-rare, chemotherapy-resistant soft tissue sarcoma driven by the ASPSCR1-TFE3 fusion protein."
      }
    }
  ]
}
```

### 4.3 BioChemEntity Schema (for SAR-001)
```json
{
  "@context": "https://schema.org",
  "@type": "Drug",
  "name": "SAR-001",
  "description": "A selective protein degrader targeting the ASPSCR1-TFE3 fusion protein in ASPS.",
  "drugClass": "Targeted Protein Degrader (PROTAC)",
  "mechanismOfAction": "Induces selective degradation of the ASPSCR1-TFE3 fusion oncoprotein",
  "activeIngredient": "Undisclosed (in development)",
  "clinicalPharmacology": "Pre-clinical validation phase"
}
```

---

## Phase 5: Content Calendar - Programmatic Generation

### 5.1 Priority Keywords (Long-Tail)

| Keyword | Search Intent | Page Type |
|---------|---------------|-----------|
| "what is alveolar soft part sarcoma" | Informational | Disease Page |
| "ASPSCR1-TFE3 fusion treatment" | Transactional | Mechanism Page |
| "targeted protein degradation ASPS" | Informational | Research Page |
| "rare sarcoma AI drug discovery" | Navigational | About Page |
| "TFE3 fusion protein structure" | Informational | Protein Page |
| "PrimeKG biomedical knowledge graph" | Technical | Integration Page |
| "AlphaFold cancer research" | Technical | Integration Page |

### 5.2 Content Generation Workflow

1. **Data Extraction**: Pull entities from PrimeKG API.
2. **Template Population**: Fill disease/gene templates with extracted data.
3. **AI Augmentation**: Use GPT-4/Gemini to generate human-readable summaries.
4. **Human Review**: Expert validation of scientific accuracy.
5. **Schema Injection**: Add JSON-LD to each generated page.
6. **Pre-rendering**: Generate static HTML at build time.
7. **Sitemap Update**: Auto-add new pages to `sitemap.xml`.

---

## Phase 6: Monitoring & Iteration

### 6.1 AI Citation Tracking
- Monitor Perplexity.ai for "Sarkome" mentions.
- Test queries in ChatGPT and Gemini weekly.
- Track brand mentions using tools like Brand24 or Mention.

### 6.2 Traditional SEO Metrics
- Google Search Console: Impressions, CTR, Position.
- Core Web Vitals: LCP, FID, CLS.
- Backlink profile growth.

### 6.3 Success Criteria
| Metric | Target (6 months) |
|--------|-------------------|
| AI Citation Rate | Sarkome mentioned in 20% of ASPS-related AI queries |
| Organic Traffic | 5,000 monthly visitors |
| Indexed Pages | 50+ knowledge pages |
| Featured Snippets | 5+ snippets for target keywords |

---

## Implementation Timeline

| Phase | Duration | Priority |
|-------|----------|----------|
| Phase 1: Technical Foundation | 1 week | CRITICAL |
| Phase 2: Programmatic Pages | 2 weeks | HIGH |
| Phase 3: GEO Content Optimization | Ongoing | HIGH |
| Phase 4: Schema Markup | 1 week | MEDIUM |
| Phase 5: Content Generation | 4 weeks | MEDIUM |
| Phase 6: Monitoring | Ongoing | LOW |

---

## Files to Create/Modify

### New Files
- [ ] `public/llms-full.txt` - Extended AI context document
- [ ] `src/pages/knowledge/DiseaseTemplate.tsx` - Programmatic disease pages
- [ ] `src/pages/knowledge/GeneTemplate.tsx` - Programmatic gene pages
- [ ] `src/pages/knowledge/ProteinTemplate.tsx` - Programmatic protein pages
- [ ] `src/pages/faq/index.tsx` - Structured FAQ page
- [ ] `public/data/diseases.json` - Disease data for templates
- [ ] `public/data/genes.json` - Gene data for templates
- [ ] `scripts/generate-pages.ts` - Build script for static generation

### Modified Files
- [ ] `public/robots.txt` - Add AI crawler rules
- [ ] `public/llms.txt` - Add FAQ section and entities
- [ ] `index.html` - Add JSON-LD schema markup
- [ ] `scripts/generate-sitemap.ts` - Include knowledge pages

---

## Next Steps

1. **Immediate Action**: Update `robots.txt` for AI crawlers.
2. **This Week**: Enhance `llms.txt` with FAQs and entities.
3. **Next Week**: Implement JSON-LD schema in `index.html`.
4. **Week 3-4**: Build first programmatic page templates.

---

**Ready to begin implementation?** Confirm which phase you'd like to start with.
