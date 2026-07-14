#!/usr/bin/env bash
set -euo pipefail

echo "CLARA production runtime config validation"

(
  cd services/api
  npm run test -- --run tests/runtime-config-doctor.test.ts tests/deployment-config.test.ts
)

(
  cd apps/dashboard
  npm run test -- --run src/config/dashboard-runtime-config-doctor.test.ts src/auth/auth-config.test.ts
)

docker compose -f docker-compose.prod.example.yml config >/dev/null

echo "Production runtime config validation passed."
