---
project: "CLARA"
artifact: "CLARA Security Boundary Summary"
status: "active"
owner: "CLARA Security"
classification: "security-boundary-summary"
---

# CLARA Security Boundary Summary

## Status

P11 complete. P12 Beta / GA Release Readiness is next. CLARA is not GA-ready
yet.

## Active Boundaries

- AuthContext is the source of truth.
- Access is workspace-scoped.
- frontend role guard is UX-only.
- client workspaceId is never authority.
- no token/cookie/auth header/API key/secret exposure.
- no raw customer messages.
- no raw provider payload.
- no raw webhook payload.
- no raw audit metadata exposure.
- no raw usage events.
- no raw payment data.
- no raw telemetry.
- no scraping/session hijacking for social channels.
- no autonomous AI actions.
- no real AI provider call from readiness.
- no payment provider integration.
- no charging customers.
- no invoice creation, checkout, or payment method storage.
- no quota enforcement side effects.
- no heavy load test in normal validation.
- no production load-test target by default.

Security review remains required before production provider, payment, AI action,
quota enforcement, or customer-impacting automation is enabled.
