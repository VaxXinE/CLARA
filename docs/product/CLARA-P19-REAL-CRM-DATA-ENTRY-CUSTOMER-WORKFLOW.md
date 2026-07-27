---
project: "CLARA"
artifact: "P19 Real CRM Data Entry Customer Workflow"
status: "current"
classification: "internal-runbook"
---

# P19 Real CRM Data Entry Customer Workflow

P19-PR-02 is complete. P19-PR-03 is current. P19-PR-04 is next:
Internal CRM Deployment Runtime + Environment Hardening.

Internal team usage must use provider auth. Mock/demo mode is dev/test only.
Customer create/update is for real internal CRM usage, not seeded demo data.
Backend AuthContext/workspace membership is source of truth, and
client-supplied workspaceId is not authoritative.

Operators create customer records with display name, contact identifier, source,
status, and safe notes summary. Owner/agent CRM mutation policy remains
enforced. Viewer is read-only.

Guardrails: missing/inactive membership fails closed, CLARA is not public GA
launch, CLARA is not production deployment, billing/payment remains deferred,
official WA/IG/TikTok APIs remain not activated, and outbound auto-send remains
disabled.
