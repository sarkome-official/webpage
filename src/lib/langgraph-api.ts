export function getAgentUrl() {
  // Debug logging
  console.log("[Config] Env DEV:", import.meta.env.DEV);

  // In development, force relative path to use Vite Proxy (avoids CORS)
  if (import.meta.env.DEV) {
    console.log("[Config] Using relative path (proxy) for agent.");
    return "";
  }

  const fromEnv = import.meta.env.VITE_LANGGRAPH_API_URL || import.meta.env.VITE_AGENT_URL || import.meta.env.VITE_LANGSERVE_URL;
  console.log("[Config] Resolved Agent URL from env:", fromEnv);

  if (typeof fromEnv === "string" && fromEnv.trim().length > 0) return fromEnv;

  // Default: point to agent server at localhost:8080
  return "http://localhost:8080";
}

// Back-compat alias (legacy name used across the app).
export function getLangServeUrl() {
  return getAgentUrl();
}

// Back-compat alias (legacy name used across the app).
export function getLangGraphApiUrl() {
  return getAgentUrl();
}
