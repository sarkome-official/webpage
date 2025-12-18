## Plan: Site Content & Routing Update

Goal: Replace current informational pages with the new 4-page narrative (SAR-001, Platform, Development, Investors) and make navigation URLs consistent (no 404s).

Constraints / assumptions
- Keep the existing layout system (BaseLayout + shared Header/Footer).
- Do not introduce new UX surfaces (no new pages/modals). The Investors “form” will live on the Investors page and the button will jump to it.
- Reuse existing Tailwind/design tokens; no new theme/colors.

### Step 1: Decide URL strategy (pick one)
Option A (clean URLs, recommended):
- New canonical routes: `/sar-001`, `/platform`, `/development`, `/investors`.
- Keep old routes working via minimal redirect stubs (no new UX):
	- `/science` → `/sar-001`
	- `/roadmap` → `/development`
	- `/contact` → `/investors`
	- `/project-info` (currently used for “Research Documentation”) → `/platform`

Option B (keep existing URLs):
- Keep `/science`, `/roadmap`, `/contact`, `/project-info` but replace the content + nav labels only.

### Step 2: Fix current broken nav
- Today the header links to `/research`, but there is no `src/pages/research.astro`.
- Replace that nav item with the chosen “Platform” route.

### Step 3: Implement page content (4 pages)
For each page, update copy exactly as provided and structure it into clear sections with consistent typography.

Positioning goals (why these page names)
- “SAR-001” replaces “The Science” to read like a product/program (investors in an SAE are buying a specific drug, not general science).
- “Platform” replaces “Research & Data” to communicate unfair advantage: fast, cheap execution without owning a wet lab.
- “Development” replaces “Roadmap” to feel regulated and milestone-driven (path to clinic).
- “Investors” is the capital-raise entry point and gating mechanism for the data room.

1) SAR-001 page
- Headline + sub-headline
- Section: The Target
	- Clearly define ASPSCR1–TFE3 as the driver.
- Section: The Modality
	- Explain Targeted Protein Degradation (PROTACs).
- Section: Differentiation (simple visual)
	- “VCP Inhibition (Systemic Toxicity)” vs “SAR-001 Degradation (Selective Precision)”.
- Section: The Unmet Need
	- Briefly mention limitations of Atezolizumab (current standard of care) and the failure/toxicity of VCP inhibitors like CB-5083.
- Section: Development Status
	- Stage (e.g., Lead Optimization / Preclinical), primary indication (ASPS), expansion (tRCC).

2) Platform page
- Headline + sub-headline
- Section: The Virtual Engine
	- Describe the Agentic AI → Cloud Lab loop.
- Section: Technical Stack
	- Mention AlphaFold 3 (structure), DiffDock (binding), DeepTernary (PROTAC modeling).
- Section: Cloud Partners
	- Display partner names as a simple grid (logos only if existing assets are available in the repo): WuXi AppTec, Charles River, Emerald Cloud Lab.

3) Development page
- Headline + sub-headline
- Section: Milestone Chart (clean visual timeline)
	- Implement as a responsive timeline: horizontal on desktop, stacked on mobile.
	- Show the key arc: Q3 2026 (Lead Declaration) → Q4 2027 (IND Filing).
	- Include intermediate milestones/deliverables (hit-to-lead, lead optimization, IND-enabling, clinical entry) aligned to your provided schedule.
- Section: Current Status
	- Clearly state “Preclinical Phase” or “Lead Optimization” (choose one, consistent with SAR-001 status).
- Section: Regulatory Strategy
	- Mention Orphan Drug Designation (ODD) and a Basket Trial strategy (ASPS + tRCC).

4) Investors page
- Headline + sub-headline
- Section: Investment Thesis (3 bullets)
	- Monogenic Driver
	- Validated Modality (Targeted Protein Degradation)
	- Capital Efficient (Virtual)
- Section: Market Potential
- Section: Data Room Access
	- A “Request VDR Access” button links to an on-page form section.
	- Form fields: Name, Fund/Firm, Email.
	- For now it can be a non-functional form (no backend) with clear “Submit” affordance.
	- Do not publish decks/raw data publicly; require a request.

- Section: News / Press
	- Add a small section for public updates (e.g., patent filing milestones, advisory board appointments).
	- If no items are provided yet, include the section with a minimal “Updates coming soon” placeholder.

### Step 4: Update shared chrome
- Update Header nav labels + hrefs to match the chosen canonical routes.
- Update Footer if it contains “Research Documentation” links so they point to Platform.

### Step 5: Verification / acceptance checks
- No 404s for any nav link.
- All four pages render inside BaseLayout with consistent spacing.
- Mobile: timeline stacks cleanly; nav still works.

- Build passes: `npm run build`.

Notes
- We will choose and work with option A for URLs.
- Here the content: "1. "SAR-001" (Replaces "The Science")
Why: Investors in an SAE model are buying a specific drug, not general science. "The Science" sounds like an academic exploration; "SAR-001" (or "Our Program") sounds like a commercial product.

What to put here:

The Target: Clearly define ASPSCR1-TFE3 as the driver.

The Modality: Explain Targeted Protein Degradation (PROTACs).

Differentiation: A simple graphic showing "VCP Inhibition (Systemic Toxicity)" vs. "SAR-001 Degradation (Selective Precision)".

The "Unmet Need": Briefly mention the limitations of Atezolizumab (current standard of care) and the failure of VCP inhibitors like CB-5083.

2. "Platform" (Replaces "Research & Data")
Why: This explains your "unfair advantage." It tells the investor how you will execute this cheaply and quickly without a physical lab.

What to put here:

The "Virtual Engine": Describe the Agentic AI → Cloud Lab loop.

Technical Stack: Mention specific tools like AlphaFold 3 (for structure), DiffDock (for binding), and DeepTernary (for PROTAC modeling) to show technical depth.

Cloud Partners: Logos of partners like WuXi AppTec, Charles River, or Emerald Cloud Lab to show operational readiness.

3. "Development" (Replaces "Roadmap")
Why: "Roadmap" can feel vague. "Development" implies a rigorous, regulated path to the clinic.

What to put here:

Milestone Chart: A clean visual timeline showing Q3 2026 (Lead Declaration) -> Q4 2027 (IND Filing).

Current Status: Clearly state "Preclinical Phase" or "Lead Optimization."

Regulatory Strategy: Mention "Orphan Drug Designation (ODD)" and "Basket Trial Strategy" (ASPS + tRCC) to show you understand the regulatory path.

4. "Investors" (New / Crucial)
Why: This signals you are raising capital. It is the entry point for your "Data Room."

What to put here:

Investment Thesis: A 3-bullet summary: "Monogenic Driver," "Validated Modality (TPD)," "Capital Efficient (Virtual)."

Data Room Login: A button saying "Request Data Room Access." Do not put your raw data or pitch deck on the public site; make them ask for it.

News/Press: Any updates on patent filings or advisory board appointments." 