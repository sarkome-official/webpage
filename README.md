# Sarkome Frontend - Scientific Agent Interface 🧬

![React 19](https://img.shields.io/badge/React-19-blue) ![Vite 6](https://img.shields.io/badge/Vite-6-purple) ![Tailwind 4](https://img.shields.io/badge/Tailwind-4.0-cyan) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)

A next-generation biomedical research interface designed to interact with the **Sarkome Scientific Agent**. This frontend provides a "Grounding First" user experience, visualizing complex biological data (Knowledge Graphs, Protein Structures) before presenting LLM-synthesized reasoning.

## ⚡ Tech Stack

This project uses a cutting-edge stack optimized for performance and developer experience:

-   **Core Framework**: [React 19](https://react.dev/) (Release Candidate/Beta features enabled)
-   **Build System**: [Vite 6](https://vitejs.dev/) with SWC for lightning-fast HMR.
-   **Styling Engine**: [Tailwind CSS v4](https://tailwindcss.com/) (Alpha/Beta) - relying on native CSS variables and modern layout engines.
-   **UI Library**: [Shadcn/UI](https://ui.shadcn.com/) (Radix Primitives) + `lucide-react` for icons.
-   **Visualization**:
    -   `react-force-graph-3d` for Knowledge Graph exploration.
    -   `@react-three/fiber` for 3D protein rendering.
-   **AI & Logic**:
    -   `@langchain/langgraph-sdk` for streaming agent states.
    -   `@huggingface/transformers` for client-side heuristic/embeddings (experimental).

## 📂 Project Structure (LLM Context)

For AI agents and developers analyzing this codebase, here is the high-level map:

```text
c:\Users\Nebula\Desktop\Sarkome\sarkome_frontend_react\
├── public/              # Static assets (workers, models)
├── src/
│   ├── components/      # Reusable UI atoms (Buttons, Inputs, Panels)
│   │   ├── decorations/ # Visual flair (Silk, Backgrounds)
│   │   └── organisms/   # Complex compositions (Footer, Header)
│   ├── pages/           # Route Views (LandingPage, GraphView)
│   ├── lib/             # Utilities (cn, api-clients)
│   ├── hooks/           # Custom React 19 hooks
│   ├── App.tsx          # Main Router & Layout logic
│   └── main.tsx         # Entry point (Providers)
├── vite.config.ts       # Proxy config for Backend (:8000) & Agent (:8080)
└── package.json         # Dependency manifest
```

## 🚀 Getting Started

### Prerequisites
-   Node.js 20+ (Required for Vite 6/React 19)
-   Backend services running (Python FastAPI on port 8000, LangGraph on port 8080).

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at `http://localhost:3000`.

## 🔗 Backend Integration

This frontend relies on a specific **Proxy Configuration** defined in `vite.config.ts`:

-   `/api/*`: Proxies to **FastAPI Backend** (`http://127.0.0.1:8000`)
    -   Handles: Legacy endpoints, authentication, direct DB queries.
-   `/langgraph/*` & `/agent/*`: Proxies to **LangGraph Agent** (`http://127.0.0.1:8080`)
    -   Handles: Streaming responses, state updates, research loop events.

Ensure your backend services are running on these ports or update `vite.config.ts`.

## 🤖 CEO / LLM Optimization Notes

*   **State Management**: This app heavily relies on React 19 hooks and local state. Complex global state is managed via URL parameters or LangGraph streaming events.
*   **Styling Strategy**: We use `tailwind-merge` (`cn` utility) for all class compositions. Do NOT use inline styles unless necessary for dynamic 3D values.
*   **Strict Mode**: React Strict Mode is enabled. Effects may fire twice in dev.


### Knowledge Graph Gateway

| Method | Endpoint | Description |
|:---|:---|:---|
| GET | `/api/kg/health` | KG API health status |
| GET | `/api/kg/stats` | Graph statistics (nodes, edges, embeddings) |
| GET | `/api/kg/search/text?q=...` | Text search (exact/partial match) |
| GET | `/api/kg/search/semantic?q=...` | AI-powered semantic search |
| GET | `/api/kg/neighbors/{node}` | Get 1-hop neighbors |
| GET | `/api/kg/subgraph/{entity}` | Get subgraph for visualization |
| GET | `/api/kg/path/{source}/{target}` | Find shortest path |
| GET | `/api/kg/hypothesis/repurposing/{disease}` | Drug repurposing candidates |
| GET | `/api/kg/hypothesis/targets/{disease}` | Therapeutic targets |
| GET | `/api/kg/hypothesis/mechanisms/{drug}/{disease}` | Drug-disease mechanism |

npx vercel dev --listen 3001