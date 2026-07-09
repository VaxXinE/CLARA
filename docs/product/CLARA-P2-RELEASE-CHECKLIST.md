---
project: "CLARA"
artifact: "P2 Release Checklist"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-09"
classification: "checklist"
related_documents:
  - "./CLARA-P2-STAGING-SMOKE-RUNBOOK.md"
  - "./CLARA-P2-DEPLOYMENT-CONFIG-RUNBOOK.md"
  - "./CLARA-P2-AUTH-SMOKE-TEST-RUNBOOK.md"
  - "../../SECURITY.md"
---

# CLARA P2 Release Checklist

## 1. Pre-Release Validation

- [ ] `services/api` passes `npm run typecheck`, `npm run test`, `npm run build`, and `npm audit --omit=dev --audit-level=high`.
- [ ] `apps/dashboard` passes `npm run typecheck`, `npm run test`, `npm run build`, and `npm audit --omit=dev --audit-level=high`.
- [ ] `bash scripts/validate-repo-structure.sh` passes.
- [ ] Docker production-like config validates with `docker compose -f docker-compose.prod.example.yml config`.
- [ ] Required docs are updated when behavior, config, or operations changed.

## 2. Security Preflight

- [ ] No real `.env` files are committed.
- [ ] No private keys, PEM files, SSH keys, or local credentials are committed.
- [ ] No Supabase service role key exists in dashboard config or build input.
- [ ] API production-like runtime uses `NODE_ENV=production`.
- [ ] API production-like runtime uses `AUTH_MODE=provider`.
- [ ] `MOCK_AUTH_ENABLED=false`.
- [ ] `CORS_ORIGIN` is explicit and not `*`.
- [ ] Secrets come from secret manager or platform environment config.
- [ ] No release notes or logs include Authorization headers, tokens, cookies, or raw JWT payloads.

## 3. Docker and Image Checklist

- [ ] API image builds from `services/api/Dockerfile`.
- [ ] Dashboard image builds from `apps/dashboard/Dockerfile`.
- [ ] Runtime images do not depend on dev dependencies to start.
- [ ] Runtime containers do not run as root.
- [ ] `.dockerignore` rules exclude `.env`, keys, and local credentials from build context.
- [ ] Dashboard build uses public `VITE_*` values only.

## 4. Staging Smoke Checklist

- [ ] Run [CLARA-P2-STAGING-SMOKE-RUNBOOK.md](/Users/newsmaker23/Projects/clarav2/docs/product/CLARA-P2-STAGING-SMOKE-RUNBOOK.md).
- [ ] `/health` returns 200.
- [ ] `/ready` returns 200.
- [ ] Unauthenticated `/api/v1/me` returns safe 401.
- [ ] Dashboard root returns 200.
- [ ] No blank page or startup crash is observed.
- [ ] No obvious 5xx regression appears in smoke logs.

## 5. Post-Deploy Verification

- [ ] Confirm deployed API image tag or commit SHA.
- [ ] Confirm deployed dashboard image tag or commit SHA.
- [ ] Confirm environment config matches intended staging or production target.
- [ ] Confirm production guardrails are still active.
- [ ] Confirm safe error envelope still includes `correlation_id`.
- [ ] Confirm unauthenticated protected endpoints still fail closed.

## 6. Rollback Checklist

- [ ] Previous known-good image tags are identified before release.
- [ ] Rollback command or platform procedure is known for API image.
- [ ] Rollback command or platform procedure is known for dashboard image.
- [ ] Any environment variable change has a matching rollback plan.
- [ ] Database rollback risk is reviewed before release.

Database rollback warning:

```text
schema migrations may not be safely reversible
review migration direction and data impact before production rollout
prefer forward-fix over unsafe emergency downgrade when data loss is possible
```

## 7. Incident Notes

Record if release fails:

```text
release identifier or commit SHA
time detected
failed step
correlation_id if applicable
rollback action taken
follow-up owner
```
