---
title: "ADR-0001 Production Auth Foundation"
version: "1.0.0"
status: "proposed"
owner: "Clara Architecture Team"
last_updated: "2026-07-08"
classification: "architecture-decision-record"
related_documents:
  - "../product/CLARA-MVP-GAP-REVIEW.md"
  - "../product/CLARA-P2-PRODUCTION-AUTH-FOUNDATION-PLAN.md"
  - "../product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/02-AUTHENTICATION-CHECKLIST.md"
  - "../product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/03-AUTHORIZATION-AND-RBAC-CHECKLIST.md"
  - "../product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/04-TENANT-WORKSPACE-ISOLATION-CHECKLIST.md"
---

# ADR-0001 Production Auth Foundation

## 1. Context

CLARA MVP is locally runnable and currently uses mock auth for:

```text
GET /api/v1/me
conversation/customer/activity reads
AI draft generation
simulated reply send
dashboard demo workflow
```

This is sufficient for local/demo/test use, but it is not a valid production trust boundary.

The system already depends on:

```text
server-side RBAC
organization/workspace scope
authorization from backend AuthContext
cross-workspace 404 behavior
frontend permission checks as UX hints only
```

Phase 2 requires a production authentication foundation that preserves these rules without rebuilding the product around a new auth model.

## 2. Problem

Current mock auth cannot safely support:

```text
real user identity verification
session or token lifecycle management
password reset, MFA, email verification, or device/session revocation
secure production secret management
provider-backed login flows
auditable production sign-in behavior
```

If CLARA builds custom password auth from scratch now, it would create avoidable security and maintenance risk.

## 3. Decision

CLARA will use a provider-managed authentication system for identity and session issuance.

CLARA will keep:

```text
organization membership
workspace membership
application roles: owner, agent, viewer
authorization decisions
tenant/workspace scoping
```

inside the CLARA database and backend services.

The backend remains the source of truth for authorization.

Mock auth will remain available only for:

```text
local development
local demo
CI tests
```

and must fail fast in production.

## 4. Considered Options

### Option A: Supabase Auth

Pros:

```text
managed auth with email/social/session flows
good Postgres alignment
supports JWT-based server verification
fits well with CLARA keeping app roles in its own database
fast path for Phase 2 delivery
```

Cons:

```text
introduces provider dependency
session/JWT model must still be carefully mapped into backend AuthContext
multi-workspace role lookup still must be built in CLARA
```

Assessment:

```text
Strong candidate for CLARA Phase 2.
```

### Option B: Better Auth

Pros:

```text
self-hostable direction
TypeScript-friendly developer experience
good control over app integration
```

Cons:

```text
more implementation responsibility than managed auth
smaller operational maturity footprint than larger providers
CLARA still must own more auth runtime details
```

Assessment:

```text
Reasonable option if Clara wants more ownership, but slower and riskier than managed auth for this phase.
```

### Option C: Auth.js

Pros:

```text
popular ecosystem
good frontend integration patterns
multiple provider options
```

Cons:

```text
best fit is often frontend/web session orchestration
CLARA still needs a clear backend trust boundary for API auth
can add complexity when the backend must stay source of truth
```

Assessment:

```text
Useful for web integration, but not the strongest single decision for Clara's backend-first authorization model.
```

### Option D: Clerk

Pros:

```text
strong managed auth product
good UX components
fast setup for login and session flows
```

Cons:

```text
more vendor coupling
can bias architecture toward frontend-centric auth handling if used carelessly
membership and role resolution still belongs in CLARA backend
```

Assessment:

```text
Viable, but needs stronger discipline to keep backend authorization as source of truth.
```

### Option E: Custom JWT/Password Auth

Pros:

```text
maximum control
no external auth vendor dependency
```

Cons:

```text
highest security risk
slowest delivery path
password auth, recovery, MFA, revocation, and secret rotation all become Clara responsibilities
easy to get wrong
```

Assessment:

```text
Rejected for Phase 2.
Do not build custom password auth from scratch.
```

## 5. Recommended Provider Direction

Recommended direction:

```text
Supabase Auth as the default provider direction for Phase 2 planning
```

Why:

```text
provider-managed identity reduces security burden
works well with PostgreSQL-oriented stack
allows Clara to keep app authorization in its own database
fits current backend-centric AuthContext model better than frontend-trusted role models
```

Fallback direction:

```text
Better Auth if Clara intentionally chooses more operational ownership later
```

## 6. Session/Token Strategy

Recommended strategy:

```text
provider-issued access token or session token proves identity
backend verifies token on every protected API request
backend extracts stable provider user identity
backend maps provider identity to Clara user record
backend loads organization/workspace membership from Clara database
backend builds final AuthContext from Clara-owned membership data
```

Rules:

```text
do not trust roles from frontend
do not trust organization_id/workspace_id from request body/query/params
do not log raw tokens
invalid or expired session returns safe 401
authenticated but unauthorized action returns safe 403
cross-workspace resource access still returns 404
```

## 7. Backend AuthContext Strategy

Production `AuthContext` should contain:

```text
provider_user_id
clara_user_id
organization_id
workspace_id
role
permission set or permission derivation source
auth method
```

Auth resolution sequence:

```text
1. Verify provider token/session.
2. Resolve Clara user by provider identity mapping.
3. Resolve active organization/workspace membership in Clara database.
4. Derive role and permissions from Clara membership.
5. Reject request if any required part is missing or invalid.
```

## 8. Workspace Membership Lookup from CLARA Database

Decision:

```text
workspace membership stays in Clara database, not in provider token claims as final truth
```

Reason:

```text
Clara owns business authorization
memberships and application roles are domain data
workspace switching and future admin flows should not depend on frontend-trusted claims
membership changes should take effect immediately on backend checks
```

Minimum lookup requirements:

```text
map provider identity -> Clara user
map Clara user -> workspace_memberships
load organization_id, workspace_id, role from Clara data
reject access if membership is missing or inactive
```

## 9. RBAC Mapping

Current Clara roles remain:

```text
owner
agent
viewer
```

Mapping rule:

```text
identity provider proves who the user is
Clara database decides what the user can do
```

Current permission model remains:

| Permission | Owner | Agent | Viewer |
| --- | ---: | ---: | ---: |
| `conversation:read` | Yes | Yes | Yes |
| `customer:read` | Yes | Yes | Yes |
| `activity:read` | Yes | Yes | Yes |
| `ai_draft:create` | Yes | Yes | No |
| `reply:send` | Yes | Yes | No |

## 10. Mock Auth Isolation/Deprecation Plan

Mock auth plan:

```text
keep mock auth for local/demo/test only
block mock auth at startup in production
block mock auth in production-like environments unless explicitly isolated and documented
add clear config flag separation between mock auth and production auth
deprecate mock auth as the default path once production auth integration is complete
```

Target end state:

```text
mock auth remains a test/demo aid only
production code path does not depend on mock auth behavior
```

## 11. Production Fail-Fast Config Rules

Production must fail fast when:

```text
mock auth is enabled
provider config is missing
required auth secrets/config are missing
token verification config is invalid
database runtime for membership lookup is unavailable
```

Production config rules:

```text
no default auth secret
no fallback anonymous access
no fallback to client-provided organization_id/workspace_id
no startup success with incomplete auth configuration
```

## 12. Security Implications

Positive implications:

```text
reduces risk compared with custom password auth
keeps authorization server-side
keeps tenant/workspace scope under Clara backend control
reduces chance of frontend-trusted role bugs
```

Residual risks:

```text
provider outage becomes part of auth availability model
bad token verification implementation could still weaken backend trust boundary
membership caching mistakes could create stale authorization behavior
```

Security requirements that remain unchanged:

```text
no frontend-trusted role
no token in logs
no hardcoded auth secrets
safe 401 for unauthenticated
safe 403 for unauthorized
cross-workspace 404 behavior
```

## 13. Testing Requirements

Required test categories:

```text
request without auth returns 401
invalid token returns 401
expired token/session returns 401
mock auth fails in production mode
user without workspace membership is denied
viewer cannot generate AI draft
viewer cannot send reply
cross-workspace resource access still returns 404
frontend role hints do not override backend authorization
token/secret values do not appear in logs or error responses
```

Additional Phase 2 tests:

```text
provider identity maps correctly to Clara user
workspace membership lookup failure fails closed
role change in Clara database affects backend authorization correctly
```

## 14. Rollout Plan

Phase sequence:

```text
1. Introduce production auth config model and fail-fast startup rules.
2. Add provider token verification path behind a non-default integration flag.
3. Add provider identity -> Clara user mapping.
4. Add workspace membership lookup from Clara database.
5. Switch protected API routes to production AuthContext path.
6. Keep mock auth only in local/demo/test.
7. Expand test coverage and run security review.
8. Remove production code dependency on mock auth assumptions.
```

Rollout guardrails:

```text
no production rollout without security review
no provider integration without secret management plan
no auth rollout without negative tests for expired/invalid sessions
```

## 15. Consequences / Trade-Offs

Benefits:

```text
safer than building custom auth
faster path to production trust boundary
preserves Clara-owned RBAC and workspace scope
keeps frontend simple and non-authoritative
```

Trade-offs:

```text
auth provider dependency is introduced
membership lookup adds a required database hop
architecture is more explicit and slightly more complex than MVP mock auth
```

Final consequence:

```text
Clara should optimize for secure identity delegation and backend-owned authorization, not for building an auth product inside the product.
```
