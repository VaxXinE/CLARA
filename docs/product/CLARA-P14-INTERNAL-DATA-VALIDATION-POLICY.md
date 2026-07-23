# CLARA P14 Internal Data Validation Policy

## Status

P14-PR-01 is complete. P14-PR-02 is complete. P14-PR-03 is current.

Internal data seeding/import is for internal beta rollout.

## Validation Rules

- Allow only documented customer fields.
- Reject unknown fields.
- Reject secret-like fields.
- Reject raw provider payload fields.
- Reject raw webhook payload fields.
- Reject raw DOM, raw HTML, and raw prompt fields.
- Reject payment/billing fields.
- Reject client workspaceId or workspace_id fields.
- Derive workspace from backend AuthContext.
- Use workspace membership as source of truth.
- Block viewer/read-only users.

## Security Boundary

Import is workspace-scoped. AuthContext and workspace membership remain source
of truth. Client-supplied workspaceId is not authoritative.

Secrets/tokens/cookies/auth headers/raw provider payloads/raw webhook
payloads/raw HTML/payment data must not be imported.

Billing/payment is deferred. Public SaaS launch is deferred. Production
deployment requires separate explicit action. Provider/AI/outbound activation
remains controlled.
