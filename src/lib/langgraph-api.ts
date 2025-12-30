export function getLangServeUrl() {
  const fromEnv = import.meta.env.VITE_LANGSERVE_URL;
  if (typeof fromEnv === "string" && fromEnv.trim().length > 0) return fromEnv;

  // Default: use same-origin root. Remove the `/agent` prefix so the
  // client talks to the LangGraph server at the site root.
  return window.location.origin;
}

// Back-compat alias (legacy name used across the app).
export function getLangGraphApiUrl() {
  return getLangServeUrl();
}
