# Sarkome Frontend - Module Context

> **SYSTEM PROMPT FOR AI AGENTS**
> This document provides full context for working on the Sarkome React frontend.

---

## MODULE IDENTITY

| Property | Value |
|----------|-------|
| **Name** | `sarkome-frontend` |
| **Type** | React SPA (Vite + TypeScript) |
| **Domain** | Biomedical Research UI |
| **Status** | `PRODUCTION` |
| **Last Updated** | `2026-01-07T17:25:00-03:00` |
| **Version** | `1.5.0` |

---

## QUICK CONTEXT (TL;DR)

**What this module does:**
- Provides the user interface for the Sarkome platform
- Chat interface for biomedical queries with SSE streaming
- Patient record management
- Landing page and documentation
- Knowledge graph visualization

**When to work on this module:**
- UI/UX changes
- Adding new components
- Styling (Tailwind CSS)
- API integration changes
- Routing modifications

**Tech Stack:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- Firebase Authentication

---

## FILE STRUCTURE

```
sarkome_frontend_react/
|
+-- CONTEXT.md              <-- [YOU ARE HERE]
+-- .context/
|   +-- manifest.json
|   +-- changelog.json
|
+-- src/
|   +-- App.tsx             <-- Main app with routing
|   +-- main.tsx            <-- Entry point
|   +-- global.css          <-- Global styles + Tailwind
|   |
|   +-- components/         <-- Reusable UI components (56 files)
|   |   +-- ui/             <-- shadcn/ui primitives
|   |   +-- InputForm.tsx   <-- Query builder with tool toggles
|   |   +-- ChatView.tsx    <-- Chat message display
|   |   +-- AppSidebar.tsx  <-- Navigation sidebar
|   |   +-- ...
|   |
|   +-- pages/              <-- Route pages
|   |   +-- LandingPage.tsx <-- Public landing page
|   |   +-- FAQPage.tsx     <-- FAQ section
|   |   +-- platform/       <-- Protected platform pages
|   |       +-- QueryBuilder.tsx
|   |       +-- ChatHistory.tsx
|   |       +-- PatientRecordView.tsx
|   |       +-- ...
|   |
|   +-- services/           <-- API clients
|   |   +-- knowledgeGraphApi.ts <-- PrimeKG API client
|   |
|   +-- lib/                <-- Utilities
|   |   +-- firebase.ts     <-- Firebase config
|   |   +-- utils.ts        <-- Helper functions
|   |
|   +-- contexts/           <-- React contexts
|   +-- hooks/              <-- Custom hooks
|
+-- public/                 <-- Static assets
+-- index.html
+-- vite.config.ts
+-- tailwind.config.js
```

---

## KEY COMPONENTS

### Core UI Components

| Component | Path | Purpose |
|-----------|------|---------|
| `InputForm.tsx` | components/ | Query input with tool toggles, effort slider, model selector |
| `ChatView.tsx` | components/ | Displays chat messages with streaming support |
| `AppSidebar.tsx` | components/ | Navigation sidebar with chat history |
| `PatientRecordView.tsx` | pages/platform/ | Patient profile with linked chats |

### Pages

| Page | Route | Purpose |
|------|-------|---------|
| `LandingPage.tsx` | `/` | Public homepage |
| `FAQPage.tsx` | `/faq` | Frequently asked questions |
| `QueryBuilder.tsx` | `/platform/query` | Main chat interface |
| `ChatHistory.tsx` | `/platform/history` | View past conversations |
| `PatientRecordView.tsx` | `/platform/patients/:id` | Individual patient view |

---

## STYLING GUIDELINES

1. **Use Tailwind CSS** for all styling
2. **Use shadcn/ui components** from `components/ui/`
3. **Color scheme**: Dark mode optimized with subtle gradients
4. **Animations**: Subtle micro-animations for interactions
5. **Responsive**: Mobile-first approach

### Design Tokens (from global.css)
```css
--background: 0 0% 3.9%;      /* Near black */
--foreground: 0 0% 98%;       /* Near white */
--primary: 0 0% 98%;          /* Accent color */
--card: 0 0% 3.9%;            /* Card backgrounds */
--border: 0 0% 14.9%;         /* Border color */
```

---

## API INTEGRATION

### Backend Agent API
```typescript
// Streaming chat
const response = await fetch(`${API_URL}/runs/stream`, {
  method: 'POST',
  body: JSON.stringify({
    input: { messages: [...] },
    config: { configurable: { effort_level: 'medium', ... } }
  })
});
// Process SSE stream...
```

### Knowledge Graph API
```typescript
import { knowledgeGraphApi } from '@/services/knowledgeGraphApi';

// Semantic search
const results = await knowledgeGraphApi.searchSemantic('cancer treatment');

// Drug repurposing
const drugs = await knowledgeGraphApi.findRepurposingCandidates('Sarcoma');
```

### Firebase
```typescript
import { auth, db } from '@/lib/firebase';

// Auth
const user = auth.currentUser;

// Firestore
const doc = await getDoc(doc(db, 'users', userId));
```

---

## ENVIRONMENT VARIABLES

```env
VITE_API_URL=http://localhost:8080        # Backend agent API
VITE_FIREBASE_API_KEY=...                 # Firebase config
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=sarkome
VITE_KNOWLEDGE_GRAPH_URL=...              # PrimeKG API
VITE_KNOWLEDGE_GRAPH_API_KEY=...
```

---

## DEVELOPMENT

### Install & Run
```bash
cd sarkome_frontend_react
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## ROUTING STRUCTURE

```
/                       <-- LandingPage (public)
/faq                    <-- FAQPage (public)
/docs/*                 <-- Documentation (public)

/platform               <-- Protected routes (require auth)
  /query                <-- QueryBuilder (main chat)
  /history              <-- ChatHistory
  /patients             <-- PatientList
  /patients/:id         <-- PatientRecordView
  /settings             <-- UserSettings
```

---

## RELATED DOCUMENTATION

| Document | Purpose |
|----------|---------|
| `sarkome_infra/backend/CONTEXT.md` | Backend API reference |
| `primekg-infra/CONTEXT.md` | Knowledge Graph API |
| `sarkome_firebase/CONTEXT.md` | Firebase infrastructure |

---

> **END OF FRONTEND CONTEXT**
