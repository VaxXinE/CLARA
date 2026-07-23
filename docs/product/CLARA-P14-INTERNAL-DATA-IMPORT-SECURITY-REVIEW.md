# CLARA P14 Internal Data Import Security Review

## Status

P14-PR-01 is complete. P14-PR-02 is complete. P14-PR-03 is complete.
P14-PR-04 is complete.

Internal access QA is for internal beta rollout.

## Review Result

Internal data import remains workspace-scoped and safe. AuthContext and
workspace membership remain source of truth. Client-supplied workspaceId is not
authoritative.

## Import Rejection Rules

Reject:

- unknown fields
- client workspaceId or workspace_id
- secret-like fields
- token/cookie/auth header fields
- raw provider payload fields
- raw webhook payload fields
- raw DOM, raw HTML, and raw prompt fields
- payment data

Secrets/tokens/cookies/raw provider payload/raw webhook payload/raw HTML/payment
data must not be imported or exposed.

## Deferred Activation

Billing/payment is deferred. Public SaaS launch is deferred. Production
deployment requires separate explicit action. Provider/AI/outbound activation
remains controlled.
