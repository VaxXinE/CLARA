---
project: "CLARA"
artifact: "P19 Mock/Demo Usage Removal Gate"
status: "current"
owner: "CLARA Product and Engineering"
classification: "runtime-guardrail"
---

# P19 Mock/Demo Usage Removal Gate

Mock/demo mode remains available only for local development and automated tests.
Mock/demo mode is dev/test only and must not be used for real internal CRM work.

## Gate

- Internal operators must run the dashboard with `VITE_AUTH_MODE=provider`.
- API internal CRM runtime must run with `INTERNAL_CRM_RUNTIME_ENABLED=true`.
- `INTERNAL_CRM_RUNTIME_ENABLED=true` fails closed unless `AUTH_MODE=provider`,
  `MOCK_AUTH_ENABLED=false`, and `DATABASE_URL` are set.
- Demo role switcher is not used in provider mode.
- Dashboard provider mode must not send `x-mock-*` headers.

## Authority

Backend AuthContext/workspace membership is source of truth. client-supplied
workspaceId is not authoritative. Viewer is read-only. Owner/agent CRM mutation
policy remains enforced.

## Deferred Work

CLARA is not public GA launch. Billing/payment remains deferred. Official
WA/IG/TikTok APIs remain not activated. Outbound auto-send remains disabled.
