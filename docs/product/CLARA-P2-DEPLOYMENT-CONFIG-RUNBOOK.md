---
project: "CLARA"
artifact: "P2 Deployment Config Runbook"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-09"
classification: "runbook"
related_documents:
  - "./CLARA-P2-PRODUCTION-AUTH-FOUNDATION-PLAN.md"
  - "./CLARA-P2-AUTH-SMOKE-TEST-RUNBOOK.md"
  - "../../services/api/README.md"
  - "../../apps/dashboard/README.md"
  - "../../SECURITY.md"
---

# CLARA P2 Deployment Config Runbook

## Purpose

This runbook defines the minimum deployment configuration baseline for:

```text
local development
test environments
staging
production
```

It documents what must be configured, what must fail fast, and what must never be committed to the repository.

## Security Rules

Always enforce:

```text
do not commit real .env files
do not commit production secrets
do not commit Supabase service role keys
do not commit real database credentials
do not commit real JWT or JWKS payloads
backend remains the source of truth for role, organization_id, and workspace_id
mock/demo auth must never be enabled in production
do not bake secrets into Docker images
do not copy .env files, private keys, SSH keys, or local credentials into Docker build contexts
```

## 1A. Docker Build Baseline

Current Docker baseline:

```text
services/api uses a multi-stage Node build and a non-root runtime image
apps/dashboard uses a multi-stage Vite build and an unprivileged nginx runtime image
root .dockerignore excludes .env files, keys, node_modules, and unrelated repo areas from build context
dashboard image should receive only public VITE_* values at build time
docker-compose.prod.example.yml is for production-like local smoke testing only
```

## 1. Environment Matrix

### Local

API expectations:

```dotenv
NODE_ENV=development
AUTH_MODE=mock
MOCK_AUTH_ENABLED=true
DATABASE_URL=postgresql://clara_user:clara_password_dev_only@127.0.0.1:5432/clara_api_dev
CORS_ORIGIN=http://127.0.0.1:5173
RATE_LIMIT_ENABLED=true
LOG_LEVEL=info
```

Dashboard expectations:

```dotenv
VITE_AUTH_MODE=demo
VITE_API_BASE_URL=http://127.0.0.1:3000
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Test

Expected principles:

```text
tests stay deterministic and offline
fixture-safe repositories remain allowed
provider tests may use safe local JWKS helpers
no real secrets are required
```

### Staging

API expectations:

```dotenv
NODE_ENV=production
AUTH_MODE=provider
AUTH_PROVIDER=supabase
MOCK_AUTH_ENABLED=false
DATABASE_URL=secret-managed
SUPABASE_AUTH_JWKS_URL=secret-managed-or-safe-config-managed
SUPABASE_AUTH_ISSUER=secret-managed-or-safe-config-managed
CORS_ORIGIN=https://dashboard-staging.example.test
RATE_LIMIT_ENABLED=true
REQUEST_BODY_LIMIT_BYTES=1048576
LOG_LEVEL=info
```

Dashboard expectations:

```dotenv
VITE_AUTH_MODE=provider
VITE_API_BASE_URL=https://api-staging.example.test
VITE_SUPABASE_URL=https://example.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key-only
```

### Production

API expectations:

```dotenv
NODE_ENV=production
AUTH_MODE=provider
AUTH_PROVIDER=supabase
MOCK_AUTH_ENABLED=false
DATABASE_URL=required
SUPABASE_AUTH_JWKS_URL=required
SUPABASE_AUTH_ISSUER=required
CORS_ORIGIN=https://dashboard.example.com
RATE_LIMIT_ENABLED=true
REQUEST_BODY_LIMIT_BYTES=1048576
LOG_LEVEL=info
```

Dashboard expectations:

```dotenv
VITE_AUTH_MODE=provider
VITE_API_BASE_URL=https://api.example.com
VITE_SUPABASE_URL=https://example.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key-only
```

## 2. Production Fail-Fast Rules

API startup must fail when:

```text
AUTH_MODE=mock
MOCK_AUTH_ENABLED=true
DATABASE_URL is missing
AUTH_PROVIDER is missing in provider mode
SUPABASE_AUTH_JWKS_URL or SUPABASE_AUTH_ISSUER is missing for Supabase provider mode
BETTER_AUTH_BASE_URL is missing for Better Auth provider mode in production
CORS_ORIGIN is empty
CORS_ORIGIN=*
RATE_LIMIT_ENABLED=false
LOG_LEVEL is debug, trace, or silent
```

Dashboard deployment must fail review when:

```text
VITE_AUTH_MODE=provider but VITE_SUPABASE_URL is missing
VITE_AUTH_MODE=provider but VITE_SUPABASE_ANON_KEY is missing
frontend config contains a service role key
frontend config points to an unsafe or wrong API base URL
```

## 3. CORS Baseline

Production CORS rules:

```text
use explicit origins only
do not use *
review any additional staging or ops origins intentionally
keep frontend and API deployment URLs aligned
```

## 4. Logging and Limits Baseline

Production-safe defaults:

```text
LOG_LEVEL should be info or warn
RATE_LIMIT_ENABLED must stay true
REQUEST_BODY_LIMIT_BYTES should stay at 1048576 or another explicitly reviewed safe value
AI_DRAFT_RATE_LIMIT_MAX and REPLY_SEND_RATE_LIMIT_MAX should stay stricter than the global limit
never log bearer tokens, Authorization headers, cookies, or raw JWT payloads
```

## 5. Local Validation Commands

API:

```bash
cd services/api
npm install
npx --yes prettier "src/**/*.ts" "tests/**/*.ts" --write
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high
```

Dashboard:

```bash
cd apps/dashboard
npm install
npx --yes prettier "src/**/*.{ts,tsx}" --write
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high
```

Repo:

```bash
bash scripts/validate-repo-structure.sh
```

Docker baseline:

```bash
docker build -f services/api/Dockerfile -t clara-api:local .
docker build -f apps/dashboard/Dockerfile -t clara-dashboard:local .
docker compose -f docker-compose.prod.example.yml config
bash scripts/docker-smoke.sh
```

## 6. Known Limitations

Current deployment baseline does not yet provide:

```text
real cloud deployment manifests
CI/CD rollout automation
domain and TLS provisioning
secret manager integration
external monitoring or alerting integration
real channel provider deployment config
real AI provider deployment config
```
