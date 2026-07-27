---
project: "CLARA"
artifact: "P19 Real Customer Create Update Runbook"
status: "current"
classification: "operator-runbook"
---

# P19 Real Customer Create/Update Runbook

Use provider auth for internal team usage. Mock/demo mode is dev/test only.

Create customer:

- Enter display name.
- Enter email, phone, or handle as contact identifier.
- Select source such as extension bridge, email, webchat, or WhatsApp.
- Select lifecycle status.
- Add a safe summary only.

Update customer:

- Edit safe CRM fields only.
- Do not paste tokens, cookies, auth headers, raw provider payloads, raw HTML, or
  payment data.
- Treat customer notes as internal workspace-scoped records.

Backend AuthContext/workspace membership is source of truth. client-supplied
workspaceId is not authoritative. Viewer is read-only.
