---
project: "CLARA"
artifact: "P19 Real CRM Operator QA Checklist"
status: "current"
classification: "qa-checklist"
---

# P19 Real CRM Operator QA Checklist

- Confirm internal team usage must use provider auth.
- Confirm mock/demo mode is dev/test only.
- Confirm customer create/update is for real internal CRM usage.
- Confirm customer notes/activity are real workspace-scoped CRM workflows.
- Confirm lifecycle/status and owner assignment are role-aware CRM workflows.
- Confirm conversation-to-customer linking is explicit and workspace-scoped.
- Confirm backend AuthContext/workspace membership is source of truth.
- Confirm client-supplied workspaceId is not authoritative.
- Confirm missing/inactive membership fails closed.
- Confirm viewer is read-only.
- Confirm owner/agent CRM mutation policy remains enforced.
- Confirm CLARA is not public GA launch.
- Confirm CLARA is not production deployment.
- Confirm billing/payment remains deferred.
- Confirm official WA/IG/TikTok APIs remain not activated.
- Confirm outbound auto-send remains disabled.
