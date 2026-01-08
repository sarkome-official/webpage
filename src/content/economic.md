# Economic Model: Pay-Per-Use Intelligence

## Philosophy: Transparent, Usage-Based Pricing

Most AI platforms lock you into expensive subscriptions whether you use them or not. Sarkome takes a different approach: **you pay for what you use, when you use it**.

We believe that researchers and clinicians should have access to cutting-edge AI-powered oncology tools without prohibitive upfront costs. Our pricing model is designed to be:

- **Transparent**: You see exactly what each query costs before you run it.
- **Fair**: Costs are directly tied to actual computational resources consumed.
- **Flexible**: Multiple tiers to match your usage patterns and budget.

---

## How Pricing Works

### The Formula

Our hybrid agentic architecture optimizes costs by using specific models for different phases of reasoning:

1.  **Query & Reflection (Gemini 3 Flash)**: Handling initial reasoning, tool routing, and knowledge graph queries.
2.  **Synthesis & Answer (Gemini 3 Pro)**: Generating the final high-quality, nuanced response.

```
Total Cost = (Flash Cost + Pro Cost) + Platform Fee (50%)
```

### Base Tech Pricing (Gemini 3.0 API)

| Model | Input (per 1M) | Output (per 1M) | Role |
|-------|----------------|-----------------|------|
| **Gemini 3 Flash** | $0.50 | $3.00 | Reasoning loops, Tool usage, Reflection |
| **Gemini 3 Pro** | $2.00 | $12.00 | Final Context Synthesis, User Answer |

### Real-World Query Examples

**1. Standard Research Query**
*User asks: "Analyze the relationship between TP53 mutations and cisplatin resistance."*

*   **Phase 1 (Flash)**: 25k context tokens + Tools = ~$0.015
*   **Phase 2 (Pro)**: 20k synthesized context + 2k output = ~$0.064
*   **Total Base Cost**: $0.079
*   **User Price**: **~$0.12**

**2. Deep Agentic Task**
*User asks: "Find all clinical trials for glioblastoma in Phase 3 targeting EGFR, compare their outcomes, and summarize standard of care."*

*   **Phase 1 (Flash)**: Multi-step reasoning (x4 loops), ~80k tokens total = ~$0.05
*   **Phase 2 (Pro)**: Massive context synthesis, 4k output = ~$0.15
*   **Total Base Cost**: $0.20
*   **User Price**: **~$0.30**

*Note: Simple conversational queries ("Hello", "Summarize this text") use Flash end-to-end and cost <$0.01.*

---

## Pricing Tiers

### Tier 1: Pay-As-You-Go

**Best for**: Occasional users, researchers exploring the platform.

- No monthly commitment
- Pay only for queries you run
- Full access to all platform features
- Real-time cost estimation before each query

### Tier 2: Infrastructure Subscription + Usage

**Best for**: Regular users who want predictable baseline costs.

| Plan | Monthly Base | What's Included | Usage Pricing |
|------|--------------|-----------------|---------------|
| **Starter** | $29/month | Priority support, query history, patient records | LLM cost + 40% (reduced fee) |
| **Professional** | $99/month | All Starter features + API access, team collaboration | LLM cost + 30% (reduced fee) |
| **Institution** | Custom | Dedicated infrastructure, SLA, compliance features | Volume discounts + negotiated rates |

The monthly base covers infrastructure maintenance, data storage, and premium features. Usage fees are reduced as a benefit of your subscription.

### Tier 3: Bring Your Own LLM (BYOLLM)

**Best for**: Organizations with existing AI infrastructure, privacy-conscious institutions.

| Plan | Monthly Cost | What You Get |
|------|--------------|--------------|
| **BYOLLM Basic** | $49/month | Platform access, knowledge graph, AlphaFold integration |
| **BYOLLM Pro** | $149/month | Basic + API access, priority routing, advanced analytics |
| **BYOLLM Enterprise** | Custom | Pro + on-premise deployment options, custom integrations |

**How it works**:
1. Connect your own LLM API (OpenAI, Anthropic, Google AI, Azure, self-hosted)
2. Sarkome handles orchestration, knowledge graph traversal, and tool routing
3. You pay only for platform infrastructure; LLM costs go directly to your provider

---

## Cost Transparency

### Before Every Query

You'll see a cost estimate before submitting:

```
Estimated Cost Breakdown
------------------------
Workflow: Hybrid Agent (Flash + Pro)
Effort Level: Medium
Tools: Web Search, Knowledge Graph

Phase 1 (Reasoning - Flash): ~25k tokens
Phase 2 (Answer - Pro): ~22k tokens

Est. Base Cost: $0.08
Platform fee: $0.04
------------------------
Total estimate: ~$0.12
```

### Usage Dashboard

Track your spending with detailed analytics:

- Daily, weekly, monthly cost breakdowns
- Cost per query type and tool
- Token usage patterns
- Budget alerts and limits

---

## Scale Projection: 100 Concurrent Users
*For institutions planning dedicated infrastructure.*

**Scenario**: 100 researchers active 24/7 (e.g., global team or shift-based hospital usage).
*Assumed Load: 12 complex queries per user/hour.*

| Metric | Monthly Volume | Base Cost (LLM) | Platform Fee (Revenue) | Total Cost |
|--------|----------------|-----------------|------------------------|------------|
| **Total Query Volume** | ~864,000 queries | $69,120 | $34,560 | **$103,680** |

*At this scale, **Volume Discounts** apply (typically 15-20% off Platform Fees), bringing the total closer to **$95,000/month** for unrestricted, 24/7 access to state-of-the-art oncology reasoning.*

---

## Enterprise & Research Institutions

### Volume Commitments

For organizations processing significant query volumes, we offer:

| Commitment | Discount |
|------------|----------|
| $500+/month | 10% off platform fees |
| $2,000+/month | 20% off platform fees |
| $10,000+/month | Custom enterprise pricing |

### Academic Partnerships

Universities and research hospitals may qualify for:

- Reduced platform fees (up to 50% off)
- Grant-compatible invoicing
- Collaborative research opportunities
- Co-publication options for platform improvements

---

## Why This Model Works

### For Researchers

- **Low barrier to entry**: Try the platform without a large upfront investment
- **Scalable costs**: Scale usage up or down as your project demands
- **No waste**: You never pay for capacity you don't use

### For Sarkome

- **Sustainable growth**: Revenue scales with actual platform value delivered
- **Aligned incentives**: We succeed when you use the platform successfully
- **Quality focus**: We're motivated to make every query worth its cost

### For the Ecosystem

- **Accessible AI**: Cutting-edge oncology AI becomes available to smaller labs
- **Fair competition**: Pricing transparency prevents vendor lock-in
- **Innovation funding**: Platform fees directly fund R&D and improvements

---

## Comparison to Traditional Models

| Aspect | Traditional SaaS | Sarkome Pay-Per-Use |
|--------|------------------|---------------------|
| Monthly cost | Fixed ($200-2000+) | Variable (based on usage) |
| Unused capacity | You pay anyway | You pay nothing |
| Cost predictability | High (but inflexible) | Estimable per query |
| Barrier to try | High | Very low |
| Scaling down | Often penalized | Automatic |
| Scaling up | Requires plan upgrade | Seamless |

---

## Getting Started

### Step 1: Create Account
Sign up with Google authentication. No credit card required to explore.

### Step 2: Run Your First Query
Every new account receives **$5 in free credits** to explore the platform.

### Step 3: Add Payment Method
When you're ready for more, add a payment method and continue seamlessly.

### Step 4: Choose Your Tier (Optional)
Upgrade to a subscription tier if you want reduced fees or BYOLLM flexibility.

---

## Summary

**Sarkome's economic model is simple: pay for what you use, see what you're paying, and never get locked into something that doesn't work for you.**

We're building the world's most comprehensive oncology reasoning platform, and we want it to be accessible to everyone who can benefit from it—from individual researchers to major institutions.

The best AI tools shouldn't require enterprise budgets. They should be available to anyone willing to invest in better research outcomes.

---

**Ready to Start?** [Access the Platform](/platform) | [Contact Sales](mailto:contact@sarkome.com)