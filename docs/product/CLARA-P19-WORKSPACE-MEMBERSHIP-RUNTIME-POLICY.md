---
project: "CLARA"
artifact: "P19 Workspace Membership Runtime Policy"
status: "current"
owner: "CLARA Product and Engineering"
classification: "security-policy"
---

# P19 Workspace Membership Runtime Policy

P19-PR-02 requires real workspace membership for internal CRM usage.

## Policy

- Internal team usage must use provider auth.
- Real workspace membership is required.
- Backend AuthContext/workspace membership is source of truth.
- client-supplied workspaceId is not authoritative.
- Missing/inactive membership fails closed.
- Cross-workspace spoofing is rejected.
- Viewer is read-only.
- Owner/agent CRM mutation policy remains enforced.

Frontend role labels and navigation are UX-only. They are never final
authorization.

## Non-Launch Guardrails

CLARA is not public GA launch. CLARA is not production deployment.
Billing/payment remains deferred. Official WA/IG/TikTok APIs remain not
activated. Outbound auto-send remains disabled.
