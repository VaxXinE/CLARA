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
- Implemented bootstrap path is `services/api` CLI command `npm run db:bootstrap-owner`.
- Bootstrap creates or links organization, workspace, CLARA user, and active owner membership.
- Bootstrap is idempotent for the same provider subject/email.
- Bootstrap rejects conflicting active owners instead of reassigning ownership.
- No public self-escalation to owner.
- No frontend-only owner assignment.
- No provider token, cookie, service role key, or raw provider payload is accepted or stored.

Required bootstrap inputs:

```text
BOOTSTRAP_ORGANIZATION_ID
BOOTSTRAP_ORGANIZATION_NAME
BOOTSTRAP_WORKSPACE_ID
BOOTSTRAP_WORKSPACE_NAME
BOOTSTRAP_OWNER_PROVIDER_SUBJECT
BOOTSTRAP_OWNER_EMAIL
BOOTSTRAP_OWNER_DISPLAY_NAME
```

Provider subject is the stable identity claim from the verified auth provider.
It is not an access token or refresh token.

## Dashboard Blocked State

- Provider mode loads `/api/v1/me` first as the membership gate.
- Product data is loaded only after backend membership resolution succeeds.
- Provider-authenticated users without CLARA membership see `Workspace access required`.
- Sign out remains available.
- No token, provider payload, workspace override, or role override is shown or trusted.

## Security Rules

- Inactive membership fails closed.
- Unsupported role fails closed.
- Organization/workspace/role are derived from backend membership data.
- Business queries must remain scoped by organization and workspace.
- Cross-workspace resource access must not reveal existence.
