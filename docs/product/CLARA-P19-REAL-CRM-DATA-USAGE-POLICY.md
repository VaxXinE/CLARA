---
project: "CLARA"
artifact: "P19 Real CRM Data Usage Policy"
status: "current"
owner: "CLARA Product and Engineering"
classification: "data-policy"
---

# P19 Real CRM Data Usage Policy

Real internal CRM data may be used only in provider-authenticated, workspace
membership-gated internal runtime.

## Allowed

- Workspace-scoped customer records.
- Workspace-scoped customer notes.
- Workspace-scoped timeline/activity records.
- Workspace-scoped owner assignment and lifecycle/status updates.
- Explicit workspace-scoped conversation-to-customer links.

## Not Allowed

- Raw provider payloads.
- Raw webhook payloads.
- Access tokens, refresh tokens, cookies, or auth headers.
- Privileged provider keys or AI provider secrets.
- Raw prompts or raw customer messages as AI prompts.
- Raw DOM, raw HTML, or payment data.

Viewer is read-only. Owner/agent CRM mutation policy remains enforced.
Backend AuthContext/workspace membership is source of truth. client-supplied
workspaceId is not authoritative.
