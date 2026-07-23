# CLARA P14 Internal Security Review

## Status

P14-PR-01 is complete. P14-PR-02 is complete. P14-PR-03 is complete.
P14-PR-04 is current.

Internal access QA is for internal beta rollout.

## Review Scope

Owner/admin/operator/viewer access boundaries are reviewed. Backend AuthContext
and workspace membership remain source of truth. Client-supplied workspaceId is
not authoritative.

## Security Findings

- Viewer/read-only mutation blocking is required and covered by regression
  tests.
- Operator CRM access is scoped to existing agent role permissions.
- Admin/owner elevated actions require workspace membership and proper role.
- Internal data import remains workspace-scoped and safe.
- Dashboard role checks remain UX-only.
- Extension cannot mutate internal access, roles, import state, billing,
  provider, AI, or outbound state.

## Prohibited Exposure

Secrets/tokens/cookies/raw provider payload/raw webhook payload/raw HTML/payment
data must not be imported or exposed.

## Deferred Activation

Billing/payment is deferred. Public SaaS launch is deferred. Production
deployment requires separate explicit action. Provider/AI/outbound activation
remains controlled.
