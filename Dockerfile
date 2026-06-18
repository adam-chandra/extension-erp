# --- Stage 1: build SPA ---
# Use glibc (Debian) image. Vite 8 / Rolldown ships native bindings whose
# alpine/musl variant is frequently dropped by npm's optional-deps bug
# (npm/cli#4828), which surfaces as "Cannot find module
# @rolldown/binding-linux-x64-musl" during `vite build`.
FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

# Vite 8 (rolldown), Tailwind 4 (lightningcss + oxide) ship native bindings.
# npm's optional-deps bug (npm/cli#4828) can skip them when host OS differs
# from build OS — install the Linux x64 glibc variants explicitly so the
# build never falls over.
RUN npm install --no-audit --no-fund && \
    npm install --no-save --no-audit --no-fund \
      @rolldown/binding-linux-x64-gnu \
      lightningcss-linux-x64-gnu \
      @tailwindcss/oxide-linux-x64-gnu

COPY . .

# Bake the API base URL at build time (Vite inlines VITE_* into the bundle)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# --- Stage 2: serve static assets via nginx ---
FROM nginx:1.27-alpine

RUN apk add --no-cache curl bash && \
    rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.d/99-runtime-env.sh
RUN chmod +x /docker-entrypoint.d/99-runtime-env.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -fsS http://localhost/healthz || exit 1

# nginx:alpine already has its own entrypoint that runs everything in
# /docker-entrypoint.d/ before launching nginx — we just drop our script there.
CMD ["nginx", "-g", "daemon off;"]
