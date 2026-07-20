---
project: "CLARA"
artifact: "P10 Security Checklist"
status: "final"
owner: "CLARA Security and Engineering"
classification: "security-checklist"
---

# CLARA P10 Security Checklist

## Authentication And Authorization

- Backend AuthContext is the source of truth.
- Frontend role guard is UX-only.
- Enterprise readiness routes require authentication.
- Least privilege gates enterprise/admin readiness.

## Tenant Isolation

- Workspace scope comes from Backend AuthContext.
- Client-supplied workspaceId, organizationId, organization_id, workspace_id,
  role, and user_id are not authority.
- Cross-workspace enterprise/compliance access is blocked or safely ignored.

## Data Safety

- No raw customer messages.
- No raw provider payload.
- No raw webhook payload.
- No raw audit metadata.
- No raw evidence.
- No raw permission internals.
- No raw DOM, raw HTML, or raw prompts.
- No tokens, cookies, auth headers, API keys, or secrets.

## Evidence And Audit Safety

- Evidence output is safe summary only.
- Audit metadata is allowlisted.
- No evidence export or download exists in P10.
- No certification claim is made.

## No-Automation Boundary

- No SSO/MFA implementation.
- No role or permission mutation.
- No session revocation or force logout.
- No backup or restore execution.
- No data deletion automation.
- No legal hold automation.
- No incident automation or notification send.
- No report generation.
- No CRM/customer mutation, task creation, owner assignment,
  lifecycle/status update, customer note write, outbound send, workflow
  automation, or real AI provider call.

## Dashboard And Extension

- Dashboard panels are read-only and safe-rendered.
- Extension remains manual-assisted and outside enterprise internals.
- `dangerouslySetInnerHTML` is not used for enterprise readiness UI.
