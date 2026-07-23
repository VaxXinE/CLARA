# CLARA P14 Workspace Isolation QA

## Status

P14-PR-01 is complete. P14-PR-02 is complete. P14-PR-03 is complete.
P14-PR-04 is current.

Internal access QA is for internal beta rollout.

## Isolation Rules

- AuthContext and workspace membership remain source of truth.
- Client-supplied workspaceId is not authoritative.
- Customer reads and mutations are workspace-scoped.
- Conversation reads and linking are workspace-scoped.
- Follow-up task reads and mutations are workspace-scoped.
- Internal data import remains workspace-scoped and safe.
- Cross-workspace access must return safe 404 or safe authorization errors.

## Data Safety

Secrets/tokens/cookies/raw provider payload/raw webhook payload/raw HTML/payment
data must not be imported or exposed.

Billing/payment is deferred. Public SaaS launch is deferred. Production
deployment requires separate explicit action. Provider/AI/outbound activation
remains controlled.
