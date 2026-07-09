---
project: "CLARA"
artifact: "P2 Staging Smoke Runbook"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-09"
classification: "runbook"
related_documents:
  - "./CLARA-P2-DEPLOYMENT-CONFIG-RUNBOOK.md"
  - "./CLARA-P2-AUTH-SMOKE-TEST-RUNBOOK.md"
  - "./CLARA-P2-RELEASE-CHECKLIST.md"
  - "../../services/api/README.md"
  - "../../apps/dashboard/README.md"
---

# CLARA P2 Staging Smoke Runbook

## Purpose

This runbook defines a small production-like smoke flow for staging or local Docker validation.

It is intended to confirm:

```text
API boots with production-like config
dashboard serves the built workspace UI
unauthenticated protected endpoints fail closed
basic health and readiness checks pass
no obvious release-blocking regression appears before wider validation
```

## Preconditions

Confirm before running smoke checks:

```text
staging secrets come from secret manager or platform environment config
no real .env files are committed
no private keys are committed
API runtime uses NODE_ENV=production
API runtime uses AUTH_MODE=provider
MOCK_AUTH_ENABLED=false
CORS_ORIGIN is explicit and not *
dashboard build uses public VITE_* values only
dashboard does not contain any Supabase service role key
```

## Recommended Paths

Use one of these:

```text
local production-like Docker smoke using docker-compose.prod.example.yml
staging environment deployed with platform-managed secrets and config
```

## 1. Local Production-Like Docker Smoke

Build and config validation:

```bash
docker build -f services/api/Dockerfile -t clara-api:local .
docker build -f apps/dashboard/Dockerfile -t clara-dashboard:local .
docker compose -f docker-compose.prod.example.yml config
```

Optional helper script:

```bash
bash scripts/docker-smoke.sh
```

## 2. API Smoke Commands

Default base URL:

```text
http://127.0.0.1:3000
```

Smoke commands:

```bash
curl -fsS http://127.0.0.1:3000/health
curl -fsS http://127.0.0.1:3000/ready
curl -i http://127.0.0.1:3000/api/v1/me
```

Expected result:

```text
/health returns 200
/ready returns 200
/api/v1/me without auth returns safe 401
no stack traces are exposed
no Authorization header or token is printed in logs
```

Protected endpoint unauthenticated check:

```bash
curl -i http://127.0.0.1:3000/api/v1/conversations
```

Expected result:

```text
safe 401 envelope
correlation_id present
no internal provider or database error details exposed
```

## 3. Rate Limit Sanity Check

Use carefully in staging to avoid noisy logs.

Suggested approach:

```text
run only a very small number of repeated requests
do not brute-force protected endpoints
verify that rate limiting remains enabled in config
```

Manual example:

```bash
for _ in 1 2 3; do curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/health; done
```

Expected result:

```text
endpoint remains healthy
no unexpected 5xx response
if environment-specific limits are intentionally low, safe 429 behavior should appear instead of internal errors
```

## 4. Dashboard Smoke Checklist

Default base URL:

```text
http://127.0.0.1:8080
```

Checks:

```text
dashboard root returns 200
page loads in browser without blank screen
configured API base URL matches the intended API environment
expected auth mode is visible or implied by environment config
no frontend service-role secret is present in build inputs
```

Basic command:

```bash
curl -fsS http://127.0.0.1:8080/
```

Expected result:

```text
HTTP 200
HTML shell returned
no server error page
```

## 5. Scripted Smoke

Use the lightweight script when you want one fast pass:

```bash
CLARA_API_BASE_URL=http://127.0.0.1:3000 \
CLARA_DASHBOARD_BASE_URL=http://127.0.0.1:8080 \
bash scripts/staging-smoke.sh
```

The script checks:

```text
/health
/ready
unauthenticated /api/v1/me returns 401
dashboard root returns 200
```

## 6. Staging Failure Handling

Stop and escalate when:

```text
/health fails
/ready fails
protected endpoint returns 200 without auth
dashboard cannot load root HTML
safe error envelope is missing
mock auth appears enabled in production-like runtime
```

Record:

```text
correlation_id from failed request
exact failing URL
environment name
image tags or commit SHA
time of failure
```

## 7. Post-Smoke Outcome

A smoke run is considered pass when:

```text
all health and readiness checks pass
unauthenticated protected API checks fail closed with 401
dashboard root responds successfully
no release-blocking regression is observed
```
