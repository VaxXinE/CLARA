---
title: CLARA P5 User Role Management Readiness
status: implemented
phase: P5
updated: 2026-07-14
---

# CLARA P5 User Role Management Readiness

## Scope

P5-PR-04 adds a read-only foundation for future workspace user and role
management. It does not add invites, role changes, member deletion, public
self-escalation, workspace switching, or dashboard mutation controls.

## Backend Endpoints

```text
GET /api/v1/workspace/members
GET /api/v1/workspace/roles/readiness
```

Both routes require authentication and derive `organization_id`,
`workspace_id`, `user_id`, and `role` only from backend `AuthContext`.
Client-provided organization, workspace, role, or user fields are ignored for
authorization.

## Access Rules

```text
owner: can read member list and role-management readiness
agent: blocked from role-management readiness
viewer: blocked from role-management readiness
```

The current CLARA role model has `owner`, `agent`, and `viewer`. There is no
admin role yet. Future admin behavior must be introduced server-side, not by
trusting frontend role claims.

## Safe Response Fields

Workspace member responses include only:

```text
user_id
display_name
email
role
status
created_at
updated_at
```

Readiness responses include current role, disabled planned controls, and policy
metadata. Responses must not include access tokens, refresh tokens,
Authorization headers, service role keys, raw provider payloads, or client
secrets.

## Dashboard Behavior

The dashboard shows a read-only access-control readiness panel:

```text
current backend-derived role
readiness status for owners
safe workspace member list for owners
disabled invite/update/delete controls
backend-authorization reminder
```

Agent and viewer sessions do not call the owner-only readiness endpoints from
the UI. Backend authorization remains the source of truth.

## Security Notes

- No invite, role update, delete, or workspace switch mutation exists in this PR.
- No frontend role value is trusted for authorization.
- No organization or workspace value from request query/body authorizes access.
- No secrets or token material are returned or rendered.
- Future mutation APIs must add dedicated permission checks, audit logging, and
  tenant-isolation tests before implementation.
