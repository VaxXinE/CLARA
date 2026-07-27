---
project: "CLARA"
artifact: "P19 Internal CRM Admin Runbook"
status: "current"
owner: "CLARA Product and Engineering"
classification: "admin-runbook"
---

# P19 Internal CRM Admin Runbook

Admins prepare and monitor internal CRM runtime without enabling public launch
or payment/provider side effects.

## Preflight

- API uses `INTERNAL_CRM_RUNTIME_ENABLED=true`.
- API uses `AUTH_MODE=provider` and `MOCK_AUTH_ENABLED=false`.
- Dashboard uses `VITE_AUTH_MODE=provider`.
- Provider users have active CLARA workspace memberships.
- CORS is explicit.
- No `.env` files, provider secrets, AI secrets, tokens, cookies, or auth
  headers are committed.

## Operations

Use backend membership data for role changes and access review. Backend
AuthContext/workspace membership is source of truth. client-supplied
workspaceId is not authoritative.

## Guardrails

CLARA is not public GA launch. Billing/payment remains deferred. Official
WA/IG/TikTok APIs remain not activated. Outbound auto-send remains disabled.
