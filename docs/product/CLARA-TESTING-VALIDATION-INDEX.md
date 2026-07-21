---
project: "CLARA"
artifact: "CLARA Testing Validation Index"
status: "active"
owner: "CLARA Engineering"
classification: "validation-index"
---

# CLARA Testing / Validation Index

## Status

P11 complete with latest validator banner:

```text
CLARA P11-PR-07 VALIDATION PASSED
```

## Current Baseline

See `docs/product/CLARA-VALIDATION-BASELINE.md`.

## Active Validators

- `scripts/validate-repo-structure.sh`
- `scripts/validate-production-runtime-config.sh`
- `scripts/validate-p11-final-scale-reliability-billing-audit-runbook.sh`
- `scripts/validate-docs-refresh-before-p12.sh`

## Policy

Validation must not mutate production data or launch billing. Runtime source
must keep AuthContext, frontend role guard is UX-only, client workspaceId is
never authority, workspace-scoped output, no raw customer messages, no raw
provider payload, no raw webhook payload, no raw usage events, no raw payment
data, no raw telemetry, no access token, no refresh token, no cookies, no
payment provider integration, no charging customers, no invoice creation, no
quota enforcement, no real AI provider, and no production deployment in this
docs refresh.
