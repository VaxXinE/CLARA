# CLARA P14 Internal Access QA Checklist

## Status

P14-PR-01 is complete. P14-PR-02 is complete. P14-PR-03 is complete.
P14-PR-04 is current.

Internal access QA is for internal beta rollout. Owner/admin/operator/viewer
access boundaries are reviewed.

## Required Checks

- Viewer/read-only mutation blocking is required.
- Operator CRM access is scoped.
- Admin/owner elevated actions require workspace membership and proper role.
- AuthContext and workspace membership remain source of truth.
- Client-supplied workspaceId is not authoritative.
- Internal data import remains workspace-scoped and safe.
- Cross-workspace customer, conversation, task, and import access remains
  blocked.
- Secrets/tokens/cookies/raw provider payload/raw webhook payload/raw
  HTML/payment data must not be imported or exposed.
- Billing/payment is deferred.
- Public SaaS launch is deferred.
- Production deployment requires separate explicit action.
- Provider/AI/outbound activation remains controlled.

## Validation Statements

These statements are the internal beta access gate for P14-PR-04:

- client-supplied workspaceId is not authoritative.
- secrets/tokens/cookies/raw provider payload/raw webhook payload/raw HTML/payment data must not be imported or exposed.
- billing/payment is deferred.
- public SaaS launch is deferred.
- production deployment requires separate explicit action.
- provider/AI/outbound activation remains controlled.

## Pass Rule

Internal access QA passes only when API, Dashboard, and Extension tests pass and
the validator prints `CLARA P14-PR-04 VALIDATION PASSED`.
