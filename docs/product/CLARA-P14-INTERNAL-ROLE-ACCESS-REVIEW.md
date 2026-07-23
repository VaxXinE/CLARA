# CLARA P14 Internal Role Access Review

## Status

P14-PR-01 is complete. P14-PR-02 is complete. P14-PR-03 is complete.
P14-PR-04 is current.

Internal access QA is for internal beta rollout.

## Role Boundary

Owner/admin/operator/viewer access boundaries are reviewed.

| Internal role | Runtime mapping | Boundary |
| --- | --- | --- |
| Owner | owner | Elevated workspace readiness read and CRM actions. |
| Admin | owner responsibility | Internal admin review responsibility; no separate runtime role in this PR. |
| Operator | agent | Workspace-scoped CRM work only. |
| Viewer | viewer | Read-only. Viewer/read-only mutation blocking is required. |

Admin/owner elevated actions require workspace membership and proper role.
Operator CRM access is scoped. AuthContext and workspace membership remain
source of truth. Client-supplied workspaceId is not authoritative.

## Non-Goals

No invite mutation, role mutation, membership deletion, public self-escalation,
billing/payment activation, provider activation, AI activation, outbound
activation, production deployment automation, or production rollback automation.
