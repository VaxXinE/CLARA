---
project: "CLARA"
artifact: "P19 Real Internal CRM Runtime Activation"
status: "current"
owner: "CLARA Product and Engineering"
classification: "internal-runtime"
---

# P19 Real Internal CRM Runtime Activation

P19 moves CLARA from controlled runnable/demo validation into real internal CRM
usage for the team. Internal team usage must use provider auth, real workspace
membership, and backend-resolved role data.

## Runtime Contract

- API internal CRM runtime uses `INTERNAL_CRM_RUNTIME_ENABLED=true`,
  `AUTH_MODE=provider`, `MOCK_AUTH_ENABLED=false`, and `DATABASE_URL`.
- Dashboard internal CRM runtime uses `VITE_AUTH_MODE=provider`.
- Mock/demo mode is dev/test only.
- Demo role switcher is not used in provider mode.
- Backend AuthContext/workspace membership is source of truth.
- client-supplied workspaceId is not authoritative.
- Frontend role checks are UX-only and never final authorization.

## CRM Scope

Customer list/detail/create/update, notes, customer timeline, owner assignment,
lifecycle/status updates, and conversation-to-customer linking use existing
workspace-scoped APIs. Viewer is read-only. Owner/agent CRM mutation policy
remains enforced by backend permissions.

## Non-Launch Guardrails

CLARA is not public GA launch. CLARA is not production deployment unless
separately executed. Billing/payment remains deferred. Official WA/IG/TikTok
APIs remain not activated. Outbound auto-send remains disabled.

## Sensitive Data Rules

Do not expose provider tokens, cookies, auth headers, Supabase privileged keys,
AI provider secrets, raw provider payloads, raw AI payloads, raw prompts, raw
DOM, raw HTML, or payment data in the dashboard, API responses, logs, evidence,
or runbooks.
