# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

> Repo `extension-erp` adalah salinan dari `fe-extension-erp` yang dipakai khusus untuk deploy sementara di **Vercel**. Lihat bagian [Deploy ke Vercel](#deploy-ke-vercel-sementara) di bawah.

## Deploy ke Vercel (sementara)

### 1. Import project

1. Login ke [vercel.com](https://vercel.com) → **Add New** → **Project** → pilih repo `extension-erp`.
2. Saat preset detection muncul, biarkan Vercel pakai **Vite** (sudah di-pin di [vercel.json](./vercel.json)).
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 2. Environment variables

Tambah di **Settings → Environment Variables** (scope: Production + Preview):

| Var                  | Value                                                |
|----------------------|------------------------------------------------------|
| `VITE_API_BASE_URL`  | `https://<api-railway-domain>/api` (akhiri dgn `/api`) |

Lihat [.env.production.example](./.env.production.example).

> **Catatan:** Vite men-_inline_ `VITE_*` ke bundle saat build. Setiap kali nilai diubah, Vercel harus redeploy supaya bundle baru terpakai.

### 3. Deploy

- Push ke branch yang di-track Vercel → build & deploy otomatis.
- Setiap PR akan dapat **Preview Deployment** sendiri.

### 4. SPA routing

`vercel.json` sudah memuat rewrite `^/(.*)$ → /index.html` agar deep-link `react-router` (mis. `/dashboard`) tidak 404 saat refresh.

### 5. CLI alternatif

```powershell
npm i -g vercel
vercel login
vercel link        # pilih project
vercel --prod      # deploy production
```

### Catatan perubahan dibanding `fe-extension-erp`

- File baru: [vercel.json](./vercel.json), [.vercelignore](./.vercelignore), [.env.production.example](./.env.production.example).
- File Docker (`Dockerfile`, `nginx.conf`, `docker-entrypoint.sh`, dst.) dibiarkan ada untuk parity, tapi dikecualikan dari upload via `.vercelignore`.
- `window.__ENV__.API_BASE_URL` (di-inject runtime oleh `docker-entrypoint.sh`) tidak dipakai di Vercel — fallback otomatis ke `import.meta.env.VITE_API_BASE_URL` yang sudah dibaked saat build (lihat `src/config/env.ts`).

---

## Vite template notes

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
