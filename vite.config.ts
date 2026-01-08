import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  // Use VITE_API_URL as the source of truth for the backend location
  const target = env.VITE_API_URL || env.VITE_LANGGRAPH_API_URL || "http://localhost:8000";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Build optimizations for production
    build: {
      target: "esnext",
      minify: "esbuild",
      cssMinify: true,
      sourcemap: false, // Disable in production for smaller bundles
      rollupOptions: {
        output: {
          // Manual chunks for optimal caching and parallel loading
          manualChunks: {
            // Core React ecosystem - rarely changes
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            // Firebase SDK - separate chunk for auth flow
            "vendor-firebase": ["firebase/app", "firebase/auth", "firebase/firestore"],
            // Heavy visualization libraries
            "vendor-viz": ["three", "react-force-graph-3d", "mermaid"],
            // UI components library
            "vendor-radix": [
              "@radix-ui/react-dialog",
              "@radix-ui/react-popover",
              "@radix-ui/react-dropdown-menu",
              "@radix-ui/react-tooltip",
              "@radix-ui/react-tabs",
              "@radix-ui/react-select"
            ],
            // LangChain/AI SDK
            "vendor-ai": ["@langchain/core", "@langchain/langgraph-sdk"],
          },
          // Use content hashes for cache busting
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
        },
      },
      // Increase chunk size warning limit (some vendor chunks are large)
      chunkSizeWarningLimit: 600,
    },
    // Optimize dependency pre-bundling
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "firebase/app",
        "firebase/auth",
        "lucide-react",
      ],
    },
    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        // Auth API (Vercel Functions - run with 'vercel dev --listen 3001')
        "/api/auth": {
          target: "http://localhost:3001",
          changeOrigin: true,
          secure: false,
        },
        // Proxy API requests to the backend server
        "/api": {
          target: target,
          changeOrigin: true,
          secure: false, // Often needed for self-signed or specific cloud certs issues, safe for testing
        },
        // LangGraph API
        "/langgraph": {
          target: target,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
        // Proxy runs directly to support relative paths avoiding CORS
        "/runs": {
          target: target,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
        // Sarkome Agent
        "/agent": {
          target: target,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
  };
});

