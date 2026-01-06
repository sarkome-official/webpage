# Sarkome Frontend

> **AI-Powered Precision Oncology Platform**  
> From Genomic Data to Therapeutic Hypotheses in Minutes.

A modern React-based web application for AI-driven precision oncology research. This frontend interfaces with the Sarkome backend Agent to provide researchers and oncologists with tools for therapeutic hypothesis generation, knowledge graph exploration, and protein structure analysis.

---

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Routing & Navigation](#routing--navigation)
- [Authentication](#authentication)
- [Internationalization (i18n)](#internationalization-i18n)
- [Design System](#design-system)
- [Public Assets](#public-assets)
- [SEO & Structured Data](#seo--structured-data)
- [Deployment](#deployment)
- [Backend Integration](#backend-integration)
- [Contributing](#contributing)

---

## Overview

Sarkome is an AI-powered precision oncology platform that:

- **Ingests** patient genomic profiles and tumor characteristics.
- **Traverses** the world's largest biomedical knowledge graph (PrimeKG: 4M+ nodes, 20M+ relationships).
- **Analyzes** 3D protein structures from AlphaFold to identify druggable pockets.
- **Synthesizes** findings with real-time literature to generate validated therapeutic hypotheses.

This frontend provides the user interface for interacting with these capabilities through an intuitive, modern web application.

---

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | React | 19.0.0 |
| **Build Tool** | Vite | 6.3.4 |
| **Language** | TypeScript | ~5.7.2 |
| **Styling** | Tailwind CSS | 4.1.5 |
| **UI Components** | Radix UI / Shadcn UI | Various |
| **Routing** | React Router DOM | 7.11.0 |
| **State/Agent** | LangGraph SDK | 0.1.0 |
| **3D Visualization** | Three.js + React Three Fiber | 0.182.0 |
| **Knowledge Graph** | react-force-graph-3d | 1.29.0 |
| **Markdown** | react-markdown | 9.0.3 |
| **i18n** | i18next | 25.7.3 |
| **Authentication** | @react-oauth/google + jose | Latest |
| **Rate Limiting** | Upstash Redis/Ratelimit | Latest |

### Key Dependencies

```json
{
  "@huggingface/transformers": "^3.8.1",
  "@langchain/core": "^0.3.55",
  "@langchain/langgraph-sdk": "^0.1.0",
  "lucide-react": "^0.508.0",
  "mermaid": "^11.12.2",
  "pdfjs-dist": "^5.4.530",
  "react-dropzone": "^14.3.8",
  "react-force-graph-3d": "^1.29.0",
  "rehype-sanitize": "^6.0.0",
  "remark-gfm": "^4.0.1"
}
```

---

## Project Structure

```
sarkome_frontend_react/
|-- api/                          # Vercel Serverless Functions
|   |-- auth/                     # Authentication endpoints
|       |-- callback/             # OAuth callback handler
|       |-- login.ts              # Login endpoint
|       |-- logout.ts             # Logout endpoint
|       |-- session.ts            # Session management
|
|-- public/                       # Static assets
|   |-- favicon.ico               # Browser favicon
|   |-- logo.svg                  # Primary logo
|   |-- graph_data.json           # Knowledge graph data (~1MB)
|   |-- llms.txt                  # LLM context file for AI crawlers
|   |-- robots.txt                # SEO crawler configuration
|
|-- scripts/
|   |-- generate-sitemap.ts       # Sitemap generation script (post-build)
|
|-- src/
|   |-- @types/                   # TypeScript type definitions
|   |-- components/               # React components
|   |   |-- auth/                 # Authentication components
|   |   |   |-- AuthProvider.tsx
|   |   |   |-- GoogleLoginButton.tsx
|   |   |   |-- ProtectedRoute.tsx
|   |   |-- decorations/          # Visual decoration components
|   |   |-- molecules/            # Reusable molecule-level components
|   |   |-- organisms/            # Complex organism-level components
|   |   |-- ui/                   # Shadcn/Radix UI primitives (21 components)
|   |   |-- AppSidebar.tsx        # Main application sidebar
|   |   |-- ChatInterface.tsx     # Chat interface container
|   |   |-- ChatMessagesView.tsx  # Message display component
|   |   |-- InputForm.tsx         # Query input with model/effort selection
|   |   |-- WelcomeScreen.tsx     # Landing welcome screen
|   |   |-- ...                   # 18+ additional components
|   |
|   |-- content/                  # Markdown documentation content
|   |   |-- agent_reasoning.md
|   |   |-- causa_engine.md
|   |   |-- economic.md
|   |   |-- garp.md
|   |   |-- infrastructure.md
|   |   |-- intro.mdx
|   |   |-- philosophy.md
|   |   |-- technology.md
|   |
|   |-- data/                     # Static data files
|   |-- hooks/                    # Custom React hooks
|   |   |-- useAgent.ts           # LangGraph agent integration hook
|   |   |-- use-mobile.ts         # Mobile detection hook
|   |
|   |-- i18n/                     # Internationalization
|   |   |-- config.ts             # i18n configuration
|   |   |-- locales/
|   |       |-- en/               # English translations
|   |       |-- es/               # Spanish translations
|   |       |-- pt/               # Portuguese translations
|   |
|   |-- lib/                      # Utility libraries and services
|   |   |-- chat-types.ts         # Chat message type definitions
|   |   |-- docs-config.ts        # Documentation configuration
|   |   |-- document-processor.ts # PDF/document processing
|   |   |-- knowledge-graph-api.ts# Knowledge graph API client
|   |   |-- langgraph-api.ts      # LangGraph API utilities
|   |   |-- local-threads.ts      # Local thread storage
|   |   |-- patient-context-builder.ts
|   |   |-- patient-record.ts     # Patient data management
|   |   |-- pricing.ts            # Query cost calculation
|   |   |-- uniprot-service.ts    # UniProt API integration
|   |   |-- user-knowledge-graph.ts
|   |   |-- utils.ts              # General utilities
|   |
|   |-- pages/                    # Page components
|   |   |-- LandingPage.tsx       # Public landing page
|   |   |-- FAQPage.tsx           # FAQ page
|   |   |-- docs/                 # Documentation pages
|   |   |   |-- DocsLayout.tsx
|   |   |   |-- DocPage.tsx
|   |   |-- platform/             # Protected platform pages
|   |   |   |-- AlphaFoldView.tsx
|   |   |   |-- ApiView.tsx
|   |   |   |-- HistoryView.tsx
|   |   |   |-- KnowledgeGraphNodes.tsx
|   |   |   |-- KnowledgeGraphView.tsx
|   |   |   |-- PatientRecordView.tsx
|   |   |   |-- QueryBuilderView.tsx
|   |   |   |-- SimulationView.tsx
|   |   |-- programs/             # Research program pages
|   |       |-- ProgramDetail.tsx
|   |
|   |-- services/                 # API service layer
|   |-- App.tsx                   # Main application component
|   |-- main.tsx                  # Application entry point
|   |-- global.css                # Global styles with CSS variables
|   |-- vite-env.d.ts             # Vite environment types
|
|-- index.html                    # HTML entry point with SEO metadata
|-- package.json                  # Project dependencies
|-- vite.config.ts                # Vite configuration
|-- vercel.json                   # Vercel deployment configuration
|-- tsconfig.json                 # TypeScript configuration
|-- eslint.config.js              # ESLint configuration
|-- components.json               # Shadcn UI configuration
```

---

## Features

### Core Platform Features

| Feature | Description |
|---------|-------------|
| **Query Builder** | AI-powered chat interface with configurable research depth (effort levels) |
| **Knowledge Graph Explorer** | 3D interactive visualization of PrimeKG biomedical entities |
| **AlphaFold Integration** | Protein structure lookup and analysis |
| **Patient Records** | Patient profile management with genomic data |
| **Chat History** | Persistent conversation threading with local storage |
| **Document Processing** | PDF upload and context injection |

### AI Agent Integration

- Real-time streaming responses from LangGraph backend
- Configurable effort levels: Low, Medium, High
- Model selection: Gemini 3.0 Pro / Flash
- Tool routing: Web Search, PrimeKG, AlphaFold RAG
- Activity timeline showing agent reasoning steps

### UI/UX Features

- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Responsive Design**: Mobile-first approach with sidebar navigation
- **Glassmorphism**: Modern UI aesthetics with backdrop blur effects
- **Micro-animations**: Smooth transitions and loading states
- **Lazy Loading**: Code splitting for optimal performance

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/sarkome-official/sarkome_frontend_react.git
cd sarkome_frontend_react

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Backend API URL (required)
VITE_API_URL=http://localhost:8000

# Google OAuth Client ID (for authentication)
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Upstash Redis (for rate limiting)
VITE_UPSTASH_REDIS_REST_URL=your_upstash_url
VITE_UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# JWT Secret (for session management)
VITE_JWT_SECRET=your_jwt_secret
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production (includes sitemap generation) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on all files |
| `npm run fetch-transformer` | Fetch Hugging Face transformer models |

---

## Routing & Navigation

### Public Routes (No Authentication Required)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `LandingPage` | Public homepage with product overview |
| `/programs/:id` | `ProgramDetail` | Research program details (e.g., ASPS) |
| `/docs` | `DocsLayout` | Documentation hub |
| `/docs/:slug` | `DocPage` | Individual documentation page |
| `/faq` | `FAQPage` | Frequently asked questions |

### Protected Routes (Authentication Required)

| Route | Component | Description |
|-------|-----------|-------------|
| `/platform` | `ChatInterface` | Main AI query interface |
| `/knowledge-graph` | `KnowledgeGraphView` | Knowledge graph overview |
| `/knowledge-graph-nodes` | `KnowledgeGraphNodes` | Interactive 3D graph |
| `/alphafold` | `AlphaFoldView` | Protein structure explorer |
| `/api` | `ApiView` | API documentation (WIP) |
| `/history` | `HistoryView` | Chat history viewer |
| `/sim` | `SimulationView` | Simulation tools |
| `/patient/new` | `NewPatientForm` | Create patient profile |
| `/patient/:patientId` | `PatientRecordView` | View patient record |

---

## Authentication

The application uses **Google OAuth 2.0** for authentication, implemented via:

1. **Frontend Components**:
   - `AuthProvider.tsx` - React Context for auth state
   - `GoogleLoginButton.tsx` - OAuth login trigger
   - `ProtectedRoute.tsx` - Route guard wrapper

2. **Vercel Serverless Functions** (`/api/auth/`):
   - `login.ts` - Initiates OAuth flow
   - `callback/` - Handles OAuth redirect
   - `session.ts` - JWT session validation
   - `logout.ts` - Session termination

3. **Session Management**:
   - JWT tokens with `jose` library
   - Secure HTTP-only cookies
   - Upstash Redis for rate limiting

---

## Internationalization (i18n)

The application supports multiple languages using **i18next**:

| Language | Locale Code | Status |
|----------|-------------|--------|
| English | `en` | Complete |
| Spanish | `es` | Complete |
| Portuguese | `pt` | Complete |

**Configuration**: `src/i18n/config.ts`

**Usage**:
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('welcome.title')}</h1>;
}
```

---

## Design System

### CSS Architecture

The design system is built on **Tailwind CSS 4** with custom CSS variables for theming:

```css
:root {
  --primary: #7c3aed;        /* Violet-600 */
  --background: #ffffff;     /* Light mode */
  --foreground: #111827;
  --border: #e5e7eb;
  --radius: 0.75rem;
}

.dark {
  --background: #050505;     /* Near black */
  --foreground: #ededed;
  --border: #27272a;
}
```

### UI Component Library

21 Shadcn/Radix UI components are pre-configured:

| Component | File |
|-----------|------|
| Button | `ui/button.tsx` |
| Card | `ui/card.tsx` |
| Dialog | `ui/dialog.tsx` |
| Dropdown Menu | `ui/dropdown-menu.tsx` |
| Input | `ui/input.tsx` |
| Popover | `ui/popover.tsx` |
| Scroll Area | `ui/scroll-area.tsx` |
| Select | `ui/select.tsx` |
| Sidebar | `ui/sidebar.tsx` |
| Tabs | `ui/tabs.tsx` |
| Tooltip | `ui/tooltip.tsx` |
| ... | (and 10 more) |

### Utility Classes

Custom utility classes defined in `global.css`:

- `.bg-dots` - Dotted background pattern
- `.bg-grid` - Grid background with fade mask
- `.bg-uiverse-grid` - UIverse-style grid
- `.no-scrollbar` - Hide scrollbar (cross-browser)
- `.subtle-scrollbar` - Fade-in scrollbar on hover
- `.animate-float` - Floating animation effect
- `.animate-fadeInUp` - Entrance animation

---

## Public Assets

The `/public` directory contains:

| File | Size | Purpose |
|------|------|---------|
| `favicon.ico` | 48KB | Browser tab icon |
| `favicon.png` | 42KB | PNG fallback favicon |
| `favicon.svg` | 7MB | High-res SVG favicon |
| `logo.svg` | 698KB | Primary brand logo |
| `logo_purple_nobackground.svg` | 954KB | Transparent logo variant |
| `OpenGraphStadardLogo.png` | 145KB | Social media preview image |
| `sarkome_solid.jpg` | 62KB | Solid background logo |
| `garp.webp` | 85KB | GARP program image |
| `bry.png` | 1MB | BRY program image |
| `graph_data.json` | 1MB | Pre-loaded knowledge graph data |
| `llms.txt` | 6KB | AI/LLM context file |
| `robots.txt` | 771B | Search engine crawl rules |
| `vite.svg` | 1.5KB | Vite placeholder icon |

### llms.txt

A specialized file following the [llms.txt proposal](https://llmstxt.org/) for providing context to AI crawlers:

```
# Sarkome: System Context for AI Agents

> Core Objective: From Genomic Data to Therapeutic Hypotheses in Minutes...
```

This file helps LLMs like GPT, Claude, and Gemini understand Sarkome when crawling the website.

---

## SEO & Structured Data

### Meta Tags

Comprehensive SEO meta tags are configured in `index.html`:

- Title, description, keywords
- Open Graph (Facebook, LinkedIn)
- Twitter Cards
- Canonical URL

### JSON-LD Structured Data

Four schema types are embedded:

1. **ResearchOrganization** - Company information
2. **WebSite** - Site metadata with SearchAction
3. **FAQPage** - Structured FAQ for rich snippets
4. **SoftwareApplication** - Platform as software product

### Content Security Policy

A strict CSP is configured to allow:

- Scripts from `self`, Google, 3Dmol.org
- Connections to API, googleapis, UniProt, AlphaFold, Upstash
- Styles from `self` with `unsafe-inline`
- Images from `self`, `data:`, and any HTTPS source
- Fonts from Google Fonts

---

## Deployment

### Vercel (Recommended)

The project is configured for Vercel deployment:

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

**Configuration** (`vercel.json`):
```json
{
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "rewrites": [
    { "source": "/((?!api/|.*\\..*).*)", "destination": "/index.html" }
  ]
}
```

### Manual Build

```bash
npm run build
# Output in ./dist directory
```

---

## Backend Integration

### LangGraph Agent API

The frontend communicates with the LangGraph-based backend via:

| Endpoint | Purpose |
|----------|---------|
| `/runs` | Execute agent runs with streaming |
| `/agent` | Direct agent communication |
| `/api` | REST API endpoints |
| `/langgraph` | LangGraph protocol endpoints |

### Vite Proxy Configuration

Development proxies are configured in `vite.config.ts`:

```typescript
proxy: {
  "/api/auth": { target: "http://localhost:3001" },
  "/api": { target: VITE_API_URL },
  "/langgraph": { target: VITE_API_URL, ws: true },
  "/runs": { target: VITE_API_URL, ws: true },
  "/agent": { target: VITE_API_URL, ws: true }
}
```

### useAgent Hook

The custom `useAgent` hook (`src/hooks/useAgent.ts`) provides:

- WebSocket streaming connection
- Message state management
- Event parsing (generate_query, web_research, reflection, finalize_answer)
- Error handling
- Run cancellation

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

### Code Style

- TypeScript strict mode
- ESLint with React hooks plugin
- Prettier formatting (implicit via Vite)

---

## License

Proprietary - Sarkome Institute 2024-2026

---

## Links

- **Website**: https://sarkome.com
- **Platform**: https://sarkome.com/platform
- **GitHub**: https://github.com/sarkome-official
- **Email**: contact@sarkome.com
