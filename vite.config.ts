import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_LANGGRAPH_API_URL || "http://localhost:8000";

  return {
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
      exclude: ["@huggingface/transformers"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3000,
      strictPort: true,
      proxy: {
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
          // rewrite: (path) => path.replace(/^\/langgraph/, ""), // Verify if backend expects this prefix
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
