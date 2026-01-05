# Platform Infrastructure

This document outlines the production-grade technical infrastructure powering Sarkome's precision oncology platform.

---

## Architecture Overview

Sarkome is deployed on a modern, cloud-native stack that separates concerns across distinct layers optimized for scalability, performance, and cost-efficiency.

```
                    ┌─────────────┐
                    │   Vercel    │
                    │  (Frontend  │
                    │   + Edge)   │
                    └──────┬──────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │  Google Cloud Run v2     │
            │  (Agent Pipeline API)    │
            │  - Min: 1 instance       │
            │  - Max: 10 instances     │
            │  - CPU: 2 vCPU           │
            │  - Memory: 4GB           │
            └────────────┬─────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Neo4j     │  │   Redis     │  │  External   │
│ (PrimeKG)   │  │ (Upstash)   │  │    APIs     │
│ 64GB+ RAM   │  │ Rate Limit  │  │ AlphaFold   │
└─────────────┘  └─────────────┘  └─────────────┘
```

---

## Layer 1: Frontend (Vercel)

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | React 19 + TypeScript | Type-safe UI components |
| **Build Tool** | Vite 6 | Lightning-fast dev & build |
| **Styling** | Tailwind CSS v4 | Utility-first design |
| **UI Library** | Shadcn/UI | Accessible component system |
| **3D Graphics** | Three.js | Knowledge graph rendering |
| **State** | React Context + Hooks | Auth, language, theme |
| **Routing** | React Router v7 | Client-side navigation |
| **i18n** | i18next | Multi-language support |

### Performance Optimizations

- **Code Splitting**: Lazy-loaded routes and heavy components
- **Image Optimization**: Auto-WebP conversion, CDN caching
- **Progressive Web App**: Service worker for offline capability
- **Edge Functions**: Serverless API routes at 300+ edge locations

### Authentication Layer (Vercel Edge)

**Flow**: OAuth 2.0 with PKCE (Proof Key for Code Exchange)

```
User → Google SSO → /api/auth/callback → JWT Generation → 
HttpOnly Cookie (Secure, SameSite=Lax)
```

**Security Features**:
- Encrypted `oauth_state` cookies (AES-256-GCM)
- JWT with issuer/audience validation
- Rate limiting (10 req/min/IP via Upstash Redis)
- Email verification enforcement

---

## Layer 2: Backend (Google Cloud Platform)

### Cloud Run Service

**Deployment Model**: Fully managed serverless containers

**Specifications**:
```yaml
Service: backend-agent-api
Region: us-central1
CPU: 2 vCPU
Memory: 4GB
Min Instances: 1  # Prevents cold starts
Max Instances: 10
Concurrency: 80   # Requests per container
```

**Networking**:
- VPC Connector: `PRIVATE_RANGES_ONLY` for secure secret access
- Global Load Balancer with static IP
- SSL Certificate: `api.sarkome.com`

### Agent Pipeline (LangGraph)

**Core Framework**: LangGraph (stateful agent orchestration)

**LLM Integration**:

| Model | Provider | Use Case | Cost/1M Tokens |
|-------|----------|----------|----------------|
| **Gemini 3.0 Flash** | Google | Entity extraction, routing, reflection | $0.075 input, $0.30 output |
| **Gemini 3.0 Pro** | Google | Final synthesis, complex reasoning | $1.25 input, $5.00 output |

**API Endpoints**:
- `POST /runs/stream`: Server-Sent Events for real-time updates
- `POST /runs/wait`: Synchronous execution (for testing)
- `GET /api/config/models`: Available LLM configurations
- `GET /api/config/effort-levels`: Effort level presets
- `GET /api/tools`: Tool registry

### Secret Management

**Google Cloud Secret Manager**:
```
_GEMINI_API_KEY           → LLM API access
_KNOWLEDGE_GRAPH_URL      → PrimeKG endpoint
_KNOWLEDGE_GRAPH_API_KEY  → PrimeKG authentication
_LANGSMITH_API_KEY        → Observability platform
```

**Why Secret Manager**:
- Automatic rotation support
- Audit logging of access
- IAM-controlled permissions
- Version history

---

## Layer 3: Data Infrastructure

### Knowledge Graph (PrimeKG)

**Database**: Neo4j Enterprise Edition

**Scale**:
- **Nodes**: 4+ million (genes, proteins, diseases, drugs, pathways)
- **Relationships**: 20+ million edges
- **Instance**: High-memory VM (64GB+ RAM recommended)

**Query Patterns**:
```cypher
// Example: Multi-hop gene-drug discovery
MATCH path = (disease:Disease {name: 'Pancreatic Cancer'})
  -[:ASSOCIATES_WITH]->(gene:Gene)
  -[:INTERACTS_WITH*1..2]->(target:Gene)
  <-[:TARGETS]-(drug:Drug)
WHERE NOT (drug)-[:CAUSES]->(:SideEffect {severity: 'severe'})
RETURN path, drug.name, collect(gene.name) as pathway
LIMIT 10
```

**Access Pattern**:
- RESTful API wrapper around Cypher queries
- API key authentication
- Rate limiting at service level

### Vector Database (Semantic Search)

**Technology**: Pinecone or Weaviate

**Use Cases**:
- **Entity Resolution**: Mapping free text ("lung cancer") to canonical identifiers
- **Similar Paper Discovery**: Finding semantically related publications
- **Query Expansion**: Broadening search terms with synonyms

**Index Configuration**:
- Embedding Model: `text-embedding-004` (Google)
- Dimensions: 768
- Metric: Cosine similarity

### External APIs

| API | Provider | Data Type | Rate Limit |
|-----|----------|-----------|------------|
| **AlphaFold Database** | EBI | Protein structures | Public, no auth |
| **UniProt** | EBI | Protein sequences | Public, polite crawling |
| **PubMed** | NCBI | Literature | 3 req/sec (no key) |
| **Google Search** | Google GenAI | Web results | API key required |

---

## Deployment Infrastructure (IaC)

### Pulumi Configuration

**Language**: Python

**Provider**: Google Cloud Platform (pulumi-gcp)

**Key Resources**:

```python
# Cloud Run Service
backend_service = gcp.cloudrunv2.Service(
    "backend-agent-api",
    location="us-central1",
    template=gcp.cloudrunv2.ServiceTemplateArgs(
        scaling=gcp.cloudrunv2.ServiceTemplateScalingArgs(
            min_instance_count=1,  # No cold starts
            max_instance_count=10
        ),
        containers=[...],
        vpc_access=gcp.cloudrunv2.ServiceTemplateVpcAccessArgs(
            connector=vpc_connector.id,
            egress="PRIVATE_RANGES_ONLY"
        )
    )
)

# Load Balancer with SSL
ssl_certificate = gcp.compute.ManagedSslCertificate(...)
backend_service_config = gcp.compute.BackendService(...)
url_map = gcp.compute.URLMap(...)
https_proxy = gcp.compute.TargetHttpsProxy(...)
forwarding_rule = gcp.compute.GlobalForwardingRule(...)
```

**Deployment**:
```bash
cd deploy/
pulumi up --yes  # Infrastructure as Code update
```

---

## Security Architecture

### Defense in Depth

| Layer | Mechanism |
|-------|-----------|
| **Transport** | TLS 1.3 (HTTPS everywhere) |
| **Authentication** | OAuth 2.0 + PKCE |
| **Session** | HttpOnly, Secure, SameSite cookies |
| **API** | JWT validation with HS256 |
| **Secrets** | GCP Secret Manager |
| **Rate Limiting** | Upstash Redis (10 req/min) |
| **CORS** | Origin whitelist (sarkome.com) |
| **CSP** | Content Security Policy headers |

### Data Protection

- **No Patient Data Storage**: Analysis happens in-session only, no persistence
- **Encryption in Transit**: All data encrypted via TLS
- **API Key Rotation**: Supported via Secret Manager versioning
- **Audit Logging**: All secret accesses logged to Cloud Logging

### Compliance Readiness

- **GDPR**: Minimal data collection, right to deletion
- **HIPAA**: No PHI stored (research platform, not clinical system)
- **SOC 2 Type II**: GCP and Vercel both certified

---

## Observability & Monitoring

### Application Performance

| Metric | Tool | Threshold |
|--------|------|-----------|
| **API Latency** | Cloud Monitoring | p95 < 2s |
| **Error Rate** | Sentry | < 1% |
| **Uptime** | Uptime Robot | 99.9% |
| **Frontend Performance** | Vercel Analytics | Core Web Vitals |

### LLM Observability

**Platform**: LangSmith

**Tracked Metrics**:
- Token usage per model
- Cost per request
- Latency per agent node
- Error traces with full context
- User feedback loop integration

### Cost Monitoring

```python
# Usage metadata tracked per request
{
  "usage_metadata": {
    "total_cost": 0.0042,
    "input_tokens": 1200,
    "output_tokens": 350,
    "model_breakdown": {
      "gemini-3-flash": {"input": 800, "output": 0, "cost": 0.0006},
      "gemini-3-pro": {"input": 400, "output": 350, "cost": 0.0036}
    }
  }
}
```

---

## Scalability Strategy

### Horizontal Scaling

- **Frontend**: Auto-scaled by Vercel Edge Network
- **API**: Cloud Run auto-scales containers (1→10 instances)
- **Database**: Neo4j read replicas for query distribution

### Cost Optimization

- **Serverless-First**: Pay only for compute time used
- **Cold Start Mitigation**: 1 minimum instance for backend
- **CDN Caching**: Static assets served from edge
- **Lazy Loading**: Heavy components loaded on-demand

### Performance Targets

| Operation | Target | Current |
|-----------|--------|---------|
| **Page Load (FCP)** | < 1.5s | ~1.2s |
| **Agent Response (Medium)** | < 10s | ~8s |
| **Knowledge Graph Query** | < 500ms | ~300ms |

---

## Development Workflow

### Local Development

```bash
# Frontend (Vite dev server)
npm run dev

# Backend (FastAPI with hot reload)
cd backend/src
uvicorn agent.app:app --reload --port 8080

# LangGraph Studio (visual debugging)
langgraph dev
# Open: http://127.0.0.1:2024
```

### Environment Variables

**Frontend (`.env.local`)**:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
AUTH_SECRET=...
```

**Backend (`backend/.env`)**:
```env
GEMINI_API_KEY=...
KNOWLEDGE_GRAPH_URL=https://...
KNOWLEDGE_GRAPH_API_KEY=...
EFFORT_LEVEL=medium
```

### Testing

```bash
# Unit tests
npm run test

# Integration tests (Playwright)
npm run test:e2e

# API tests
cd backend
pytest tests/
```

---

## Disaster Recovery

### Backup Strategy

- **Neo4j**: Daily automated snapshots
- **Code**: GitHub (multiple redundant copies)
- **Secrets**: Version history in Secret Manager

### Incident Response

1. **Alert**: Sentry error or downtime notification
2. **Diagnosis**: Check Cloud Logging, LangSmith traces
3. **Rollback**: `pulumi stack select previous && pulumi up`
4. **Postmortem**: Document in internal wiki

---

**Technical Questions?** [View API Documentation](/api) | [Contact Engineering](mailto:eng@sarkome.com)