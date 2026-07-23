# CLARA P14 Internal Role Permission Matrix

## Status

P14-PR-01 is complete. P14-PR-02 is current. This matrix supports internal user
setup for internal beta rollout.

## Matrix

| Capability | Owner | Admin | Operator | Viewer |
| --- | --- | --- | --- | --- |
| Sign off internal beta security checklist | Yes | Assist | No | No |
| Review workspace member readiness | Yes | Planned support | No | No |
| Use CRM customer/conversation workflow | Yes | Yes | Yes, scoped | Read-only |
| Create/update/delete user or role | No, deferred | No, deferred | No | No |
| Invite members | No, deferred | No, deferred | No | No |
| Activate provider/AI/outbound behavior | No, controlled | No, controlled | No | No |
| Access billing/payment controls | No, deferred | No, deferred | No | No |

## Authority Rules

Backend AuthContext and workspace membership remain source of truth. Client
supplied workspaceId is not authoritative. Role and workspace claims from query,
body, headers, or browser state must not override server membership.

Viewer/read-only behavior remains safe: viewer users may inspect allowed
read-only state but must not create, update, delete, invite, assign, send,
charge, deploy, or activate external systems.

Operator CRM access is clearly scoped to the backend workspace membership.
Admin security responsibilities are clearly scoped to readiness and review, not
unimplemented mutation. Owner responsibility and recovery policy are clearly
scoped to controlled internal operations.
