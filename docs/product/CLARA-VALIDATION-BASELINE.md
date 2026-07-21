---
project: "CLARA"
artifact: "CLARA Validation Baseline"
status: "active"
owner: "CLARA Engineering"
classification: "validation-baseline"
---

# CLARA Validation Baseline

## Status

Latest validated baseline after P11 complete:

```text
Baseline: P11-PR-07
API: 416 test files / 985 tests
Dashboard: 125 test files / 261 tests
Extension: 59 test files / 87 tests
Build: pass
Final banner: CLARA P11-PR-07 VALIDATION PASSED
```

Exact counts may grow after future PRs. P12 Beta / GA Release Readiness starts
from this validated P11 baseline.

## Validator Policy

- Runtime scans exclude tests/docs where appropriate.
- Tests/docs may contain forbidden terms intentionally when asserting
  redaction/security behavior.
- Runtime source must not expose secrets or raw payloads.
- Do not use `npm audit fix --force` automatically.
- Active runtime/docs must maintain AuthContext authority, frontend role guard
  is UX-only, client workspaceId is never authority, and workspace-scoped
  output.

## Safety Baseline

The validated baseline includes no raw customer messages, no raw provider
payload, no raw webhook payload, no raw usage events, no raw payment data, no
raw telemetry, no access token, no refresh token, no cookies, no payment
provider integration, no charging customers, no invoice creation, no quota
enforcement, no real AI provider, and no production deployment in this docs
refresh.
