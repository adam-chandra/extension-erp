// Runtime config injected by the docker entrypoint (see docker-entrypoint.sh).
// In dev (`npm run dev`) this file does not exist — env.ts falls back to
// Vite's build-time VITE_* variables.
declare global {
  interface Window {
    __ENV__?: {
      API_BASE_URL?: string
    }
  }
}

export {}
