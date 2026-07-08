---
project: "CLARA"
artifact: "P2 Auth Smoke Test Runbook"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-08"
classification: "runbook"
related_documents:
  - "./CLARA-P2-PRODUCTION-AUTH-FOUNDATION-PLAN.md"
  - "../adr/ADR-0002-production-auth-foundation.md"
  - "../../services/api/README.md"
  - "../../apps/dashboard/README.md"
---

# CLARA P2 Auth Smoke Test Runbook

## Purpose

This runbook provides a small, repeatable auth smoke test for:

```text
local demo mode
provider-mode fail-closed behavior
production guardrail verification
```

It is designed to stay deterministic and offline-friendly.

## Scope

This runbook validates:

```text
mock/demo mode still works locally
provider mode does not load product data without a session
provider mode rejects missing or invalid bearer tokens
provider identity still requires active CLARA membership
backend remains the source of truth for role, organization_id, and workspace_id
```

This runbook does not validate:

```text
real Supabase hosted login
real OAuth callback handling
real provider network dependency in CI
multi-workspace selection UX
```

## Prerequisites

Local prerequisites:

```text
Node.js and npm installed
local PostgreSQL stack available for the API demo flow
no real provider secrets committed
```

## 1. Demo Mode Smoke

API local env:

```dotenv
AUTH_MODE=mock
MOCK_AUTH_ENABLED=true
AUTH_PROVIDER=
SUPABASE_AUTH_JWKS_URL=
SUPABASE_AUTH_ISSUER=
BETTER_AUTH_BASE_URL=
```

Dashboard local env:

```dotenv
VITE_AUTH_MODE=demo
VITE_API_BASE_URL=http://127.0.0.1:3000
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Run:

```bash
cd infra/local
docker compose up -d

cd ../../services/api
npm install
cp .env.example .env
npm run db:ready
npm run db:migrate
npm run db:seed
npm run dev

cd ../../apps/dashboard
npm install
cp .env.example .env.local
npm run dev
```

Expected result:

```text
dashboard opens in demo mode
role switcher is visible
owner and agent can generate drafts and send replies
viewer is read-only
no provider login shell is shown
```

## 2. Provider Mode Configuration Smoke

API provider-mode env requirements:

```dotenv
AUTH_MODE=provider
AUTH_PROVIDER=supabase
MOCK_AUTH_ENABLED=false
SUPABASE_AUTH_JWKS_URL=https://example.supabase.test/auth/v1/jwks
SUPABASE_AUTH_ISSUER=https://example.supabase.test/auth/v1
```

Dashboard provider-mode env requirements:

```dotenv
VITE_AUTH_MODE=provider
VITE_API_BASE_URL=http://127.0.0.1:3000
VITE_SUPABASE_URL=https://example.supabase.test
VITE_SUPABASE_ANON_KEY=example-anon-key
```

Rules:

```text
never commit real Supabase URL or anon key
never commit a service role key
mock auth must stay disabled for production-like validation
```

## 3. Expected Behavior Without Session

Run the dashboard in provider mode without signing in.

Expected result:

```text
dashboard shows login shell
dashboard does not fetch /api/v1/me or conversation data
no fake Authorization header is attached
```

Reference automated checks:

```bash
cd apps/dashboard
npm run test -- --run src/App.test.tsx src/auth/AuthProvider.test.tsx src/api/client.test.ts
```

## 4. Expected Behavior With Invalid Token

Expected API behavior:

```text
missing Authorization header returns 401
malformed bearer token returns 401
invalid JWT returns 401
expired JWT returns 401
```

Reference automated checks:

```bash
cd services/api
npm run test -- --run tests/require-auth.test.ts tests/auth-production-guardrails.test.ts
```

## 5. Expected Behavior With Valid Provider Identity but Missing Membership

Expected API behavior:

```text
provider identity may verify successfully
AuthContext must still fail closed when CLARA user or active membership is missing
safe response is 403
no business data is returned
```

Reference automated checks:

```bash
cd services/api
npm run test -- --run tests/require-auth.test.ts tests/auth-context-resolver.test.ts tests/workspace-membership.test.ts
```

## 6. Expected Behavior With Active Membership

Expected API behavior:

```text
verified provider identity resolves to internal CLARA user
active workspace membership resolves role and scope
backend builds AuthContext server-side
RBAC and workspace scope continue to work without frontend-trusted role data
```

Reference automated checks:

```bash
cd services/api
npm run test -- --run tests/require-auth.test.ts tests/auth-context-resolver.test.ts
```

## 7. Production Guardrail Checklist

Verify before any production-like use:

```text
AUTH_MODE=mock is blocked in production
MOCK_AUTH_ENABLED=true is blocked in production
provider mode requires provider-specific config
Authorization header is never logged
access tokens are never logged
frontend never trusts role, organization_id, or workspace_id
cross-workspace resource reads still return 404
```

## 8. Full Validation Commands

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

Repo:

```bash
bash scripts/validate-repo-structure.sh
```

## 9. Security Notes

```text
do not use this runbook with real customer data
do not paste real JWTs into screenshots, docs, or logs
do not trust frontend role or workspace values as authorization truth
do not treat provider-mode login shell as production-complete authentication UX
```
