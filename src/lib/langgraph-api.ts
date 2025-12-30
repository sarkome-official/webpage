export function getAgentUrl() {
  const fromEnv = import.meta.env.VITE_AGENT_URL || import.meta.env.VITE_LANGSERVE_URL;
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
