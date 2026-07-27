---
project: "CLARA"
artifact: "P19 Internal Team Access Runbook"
status: "current"
owner: "CLARA Product and Engineering"
classification: "runbook"
---

# P19 Internal Team Access Runbook

Internal team usage must use provider auth. Mock/demo mode is dev/test only.

## Roles

- Owner prepares workspace access, reviews member readiness, and can perform
  owner-permitted CRM actions.
- Agent uses the assigned workspace for normal CRM work according to backend
  permissions.
- Viewer can inspect assigned workspace data in read-only mode.

owner/agent CRM mutation policy remains enforced by the backend. Viewer is
read-only.

## Onboarding

1. Bootstrap the first owner with provider subject/email.
2. Add or verify active workspace membership for each internal user.
3. Assign role: owner, agent, or viewer.
4. Ask the user to sign in through provider auth.
5. Verify `/api/v1/me` resolves backend AuthContext and workspace membership.

## Missing Membership

If login succeeds but the dashboard shows workspace access required, do not use
demo/mock mode for real work. Verify the provider subject/email mapping and
active workspace membership in backend data, then ask the user to sign in
again.

client-supplied workspaceId is not authoritative. Missing/inactive membership
fails closed.
