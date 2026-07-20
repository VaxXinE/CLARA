---
project: "CLARA"
artifact: "P10 Tenant Isolation + Permission Audit Hardening Spec"
status: "draft"
owner: "CLARA Product, Engineering, Security, and Operations"
classification: "security-specification"
---

# CLARA P10 Tenant Isolation + Permission Audit Hardening Spec

## Scope

P10-PR-02 adds readiness-only runtime visibility for tenant isolation and
permission audit boundaries. It is a hardening and evidence step, not a
customer-facing workflow feature.

## Runtime Endpoints

| Endpoint | Behavior |
|---|---|
| `GET /api/v1/enterprise/tenant-isolation/readiness` | Authenticated read-only tenant isolation readiness. |
| `GET /api/v1/enterprise/permission-audit/readiness` | Authenticated read-only permission audit readiness. |

Both endpoints derive organization and workspace scope from Backend
AuthContext. Client-provided organization or workspace identifiers are rejected
or ignored safely and are never authority.

Client workspaceId is never authority. Frontend role guard is UX-only; backend
authorization remains the enforcement point.

## Security Rules

- Backend AuthContext remains the source of truth.
- All tenant isolation evidence is workspace-scoped.
- Least privilege remains the permission audit baseline.
- Safe audit metadata is required for denied access, role escalation attempts,
  and workspace boundary violations.
- Dashboard role and workspace labels are UX only.
- Extension runtime cannot read tenant isolation internals or permission audit
  internals.
- Responses include safe readiness summaries only.
- Responses include no raw customer messages.
- Responses include no raw provider payload.
- Responses include no raw webhook payload.
- Responses include no raw audit metadata.
- Responses include no access token.
- Responses include no refresh token.
- Responses include no cookies.
- Responses include no auth headers.
- Responses include no API keys or secrets.

## Non-Goals

P10-PR-02 does not add SSO, MFA, billing, report export, backup automation,
data deletion automation, provider integration, role mutation, permission
mutation, CRM mutation, task creation, owner assignment, lifecycle/status
mutation, outbound send, dashboard mutation, or real AI provider calls.

In short: no role mutation, no permission mutation, no CRM mutation, and no
outbound send are introduced by this readiness work.

## Validation

Use:

```bash
bash scripts/validate-p10-tenant-isolation-permission-audit-hardening.sh
```

The validator confirms API, dashboard, and extension regression coverage for
read-only tenant isolation readiness and permission audit readiness.
