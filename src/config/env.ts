// Resolution order:
//   1. window.__ENV__.API_BASE_URL  → injected at container start by docker-entrypoint.sh
//      (changeable per-environment without rebuilding the bundle)
//   2. import.meta.env.VITE_API_BASE_URL  → baked at `npm run build` (dev / local builds)
//   3. http://localhost:8080/api  → safe fallback for `npm run dev`
function resolveApiBaseUrl(): string {
  if (typeof window !== 'undefined' && window.__ENV__?.API_BASE_URL) {
    return window.__ENV__.API_BASE_URL
  }
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  return 'http://localhost:8080/api'
}

export const env = {
  apiBaseUrl: resolveApiBaseUrl(),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
