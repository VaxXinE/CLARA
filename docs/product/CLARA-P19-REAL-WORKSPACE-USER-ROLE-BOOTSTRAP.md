---
project: "CLARA"
artifact: "P19 Real Workspace User Role Bootstrap"
status: "current"
owner: "CLARA Product and Engineering"
classification: "runtime-bootstrap"
---

# P19 Real Workspace User Role Bootstrap

P19-PR-01 is complete. P19-PR-02 is complete. P19-PR-03 is complete and covers Real
CRM Data Entry + Customer Workflow Runtime.

P19-PR-02 makes real internal team usage depend on provider auth plus backend
workspace membership. Mock/demo mode is dev/test only and must not be used for
operator/team CRM work.

## Runtime Contract

- Internal team usage must use provider auth.
- First owner bootstrap is required for real internal usage.
- Bootstrap creates or links organization, workspace, owner user, and active
  owner workspace membership.
- Bootstrap is idempotent for the same provider subject/email.
- Real workspace membership is required.
- Backend AuthContext/workspace membership is source of truth.
- client-supplied workspaceId is not authoritative.
- Missing/inactive membership fails closed.
- Viewer is read-only.
- Owner/agent CRM mutation policy remains enforced.

## Guardrails

CLARA is not public GA launch. CLARA is not production deployment.
Billing/payment remains deferred. Official WA/IG/TikTok APIs remain not
activated. Outbound auto-send remains disabled.

Do not store or print secrets/tokens/auth headers, raw provider payloads, raw
AI provider responses, raw prompts, raw DOM, raw HTML, cookies, or payment
data.
