#!/bin/sh
# Drop-in for nginx:alpine's /docker-entrypoint.d/ — the official entrypoint
# executes every *.sh here before launching nginx.
#
# Generates /usr/share/nginx/html/env.js from runtime env vars so we can
# change API_BASE_URL per environment WITHOUT rebuilding the JS bundle —
# just set API_BASE_URL on the container and restart.

set -eu

TARGET=/usr/share/nginx/html/env.js

cat > "$TARGET" <<EOF
window.__ENV__ = {
  API_BASE_URL: "${API_BASE_URL:-}"
};
EOF

echo "[runtime-env] wrote $TARGET with API_BASE_URL=${API_BASE_URL:-<empty>}"
