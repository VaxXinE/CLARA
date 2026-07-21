---
project: "CLARA"
artifact: "CLARA Runbook Index"
status: "active"
owner: "CLARA Operations"
classification: "runbook-index"
---

# CLARA Runbook Index

## Status

P11 complete. P12 Beta / GA Release Readiness is next.

## Active Runbooks

- `docs/product/CLARA-P11-PRODUCTION-RUNBOOK.md`
- `docs/product/CLARA-P11-P12-HANDOFF-NOTES.md`
- `docs/product/CLARA-RELEASE-READINESS-OVERVIEW.md`
- `docs/product/CLARA-P12-HANDOFF-FROM-P11.md`

Historical phase runbooks remain available for traceability.

## Safety

Runbooks must keep AuthContext, frontend role guard is UX-only, client
workspaceId is never authority, workspace-scoped operations, no raw customer
messages, no raw provider payload, no raw webhook payload, no raw usage events,
no raw payment data, no raw telemetry, no access token, no refresh token, no
cookies, no payment provider integration, no charging customers, no invoice
creation, no quota enforcement, no real AI provider, and no production
deployment in this docs refresh.
