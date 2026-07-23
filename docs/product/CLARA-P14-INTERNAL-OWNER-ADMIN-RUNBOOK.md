# CLARA P14 Internal Owner/Admin Runbook

## Status

P14-PR-01 is complete. P14-PR-02 is current. This runbook prepares owner and
admin users for internal beta rollout.

## Owner Responsibilities

- Maintain the first accountable workspace owner.
- Approve internal beta participant list.
- Confirm security checklist completion.
- Confirm internal data policy acceptance.
- Own recovery decisions if an owner bootstrap conflict occurs.
- Confirm production deployment requires separate explicit action before any
  production-like rollout.

## Admin Responsibilities

- Prepare role guidance for owner, admin, operator, and viewer users.
- Review member readiness and known limitations.
- Confirm operator CRM access is clearly scoped.
- Confirm viewer read-only behavior remains safe.
- Verify no billing/payment/provider/AI/outbound behavior is activated.

## Recovery Policy

Owner recovery must be handled as a controlled operational action. It must not
be implemented as public self-escalation. Recovery must preserve Backend
AuthContext and workspace membership as source of truth. Client supplied
workspaceId is not authoritative.

## Forbidden During P14-PR-02

Do not add billing, payment SDKs, public launch, automatic production
deployment, real provider activation, real AI activation, outbound auto-send,
secrets, real credentials, raw HTML rendering, or token/payload display.
