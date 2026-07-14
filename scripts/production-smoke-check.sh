#!/usr/bin/env bash
set -euo pipefail

echo "CLARA production smoke check"

bash scripts/validate-repo-structure.sh
bash scripts/validate-production-runtime-config.sh

(
  cd services/api
  npm run typecheck
  npm run build
  npm audit --omit=dev --audit-level=high
)

(
  cd apps/dashboard
  npm run typecheck
  npm run build
  npm audit --omit=dev --audit-level=high
)

if [[ -f apps/extension/package.json ]]; then
  (
    cd apps/extension
    npm run typecheck
    npm run build
  )
fi

docker compose -f docker-compose.prod.example.yml config >/dev/null

cat <<'SMOKE'
Manual runtime checks after starting a production-like deployment:
- GET /health should return 200.
- GET /ready should return 200.
- GET /api/v1/me without auth should return safe 401.
- Dashboard root should load from the configured dashboard origin.
SMOKE
