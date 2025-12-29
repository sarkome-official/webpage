export function getLangServeUrl() {
  const fromEnv = import.meta.env.VITE_LANGSERVE_URL;
  if (typeof fromEnv === "string" && fromEnv.trim().length > 0) return fromEnv;

  // Default: same-origin proxy path.
  // In dev, Vite proxies `/agent/*` to your LangServe backend (host:8080).
  // In prod, configure your hosting/proxy to forward `/agent/*` to the backend.
  return new URL("/agent", window.location.origin).toString();
}

// Back-compat alias (legacy name used across the app).
export function getLangGraphApiUrl() {
  return getLangServeUrl();
}
