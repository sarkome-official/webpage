import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
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
      // Proxy API requests to the backend server
      "/api": {
        target: "https://backend-service-d8075c1-3qralpu7na-uc.a.run.app", // Cloud Run Backend
        changeOrigin: true,
        secure: false, // Often needed for self-signed or specific cloud certs issues, safe for testing
      },
      // LangGraph API
      "/langgraph": {
        target: "https://backend-service-d8075c1-3qralpu7na-uc.a.run.app",
        changeOrigin: true,
        secure: false,
        ws: true,
        // rewrite: (path) => path.replace(/^\/langgraph/, ""), // Verify if backend expects this prefix
      },
      // Sarkome Agent
      "/agent": {
        target: "https://backend-service-d8075c1-3qralpu7na-uc.a.run.app",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
