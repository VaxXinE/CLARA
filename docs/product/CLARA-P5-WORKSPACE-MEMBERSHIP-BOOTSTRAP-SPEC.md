---
project: "CLARA"
artifact: "P5 Workspace Membership Bootstrap Spec"
status: "draft"
owner: "CLARA Engineering"
classification: "product-spec"
---

# CLARA P5 Workspace Membership Bootstrap Spec

Provider authentication proves identity. CLARA workspace membership grants application access.

## Membership Resolution

After provider token verification:

1. Resolve provider subject/email to an internal CLARA user.
2. Find active workspace memberships for that user.
3. If exactly one active membership exists, build server-side AuthContext from it.
4. If multiple active memberships exist, require explicit workspace selection in a future PR.
5. If no active membership exists, fail closed.

## Roles

Current roles:

- `owner`
- `agent`
- `viewer`

Admin/manager can be added later only if backend RBAC and tests are updated first.

## Owner Bootstrap

- Local demo owner remains seed-only and dev-only.
- Production owner bootstrap must be explicit, audited, and operator controlled.
- No public self-escalation to owner.
- No frontend-only owner assignment.

## Security Rules

- Inactive membership fails closed.
- Unsupported role fails closed.
- Organization/workspace/role are derived from backend membership data.
- Business queries must remain scoped by organization and workspace.
- Cross-workspace resource access must not reveal existence.
