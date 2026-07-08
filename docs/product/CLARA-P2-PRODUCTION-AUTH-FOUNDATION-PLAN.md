---
project: "CLARA"
artifact: "P2 Production Auth Foundation Plan"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering, Security, and Product Team"
last_updated: "2026-07-08"
classification: "phase-plan"
repository: "https://github.com/VaxXinE/CLARA"
related_documents:
  - "../adr/ADR-0002-production-auth-foundation.md"
  - "./CLARA-MVP-GAP-REVIEW.md"
  - "./CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/02-AUTHENTICATION-CHECKLIST.md"
  - "./CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/03-AUTHORIZATION-AND-RBAC-CHECKLIST.md"
  - "./CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/04-TENANT-WORKSPACE-ISOLATION-CHECKLIST.md"
---

# CLARA P2 Production Auth Foundation Plan

## Purpose

This document translates ADR-0002 into a practical implementation plan for Phase 2.

Goal:

```text
replace MVP mock auth as the production trust boundary
keep Clara backend as source of truth for authorization
preserve organization/workspace scope and current RBAC model
introduce explicit auth modes and provider configuration as the baseline integration contract
```

## Phase Objective

Deliver a production-ready authentication foundation without changing Clara's core authorization principles.

That means:

```text
provider-managed identity
backend token/session verification
Clara-owned workspace membership lookup
server-side RBAC enforcement
mock auth isolated to local/demo/test
```

## In Scope

```text
provider selection and auth configuration model
token/session verification path in API
Clara user mapping from provider identity
workspace membership lookup from Clara database
production fail-fast config rules
test coverage for auth failure modes
mock auth isolation plan
```

## Out of Scope

```text
real provider messaging integrations
frontend product redesign
new customer-facing features
custom password auth
authorization moved to frontend
```

## Recommended Provider Direction

Default direction:

```text
Supabase Auth
```

Fallback direction:

```text
Better Auth if Clara later chooses more auth ownership
```

Rejected direction for Phase 2:

```text
custom JWT/password auth from scratch
```

## Target Architecture

High-level flow:

```text
frontend obtains provider-managed session
frontend sends token/session to Clara API
Clara API verifies token/session
Clara API resolves Clara user
Clara API loads workspace membership from Clara database
Clara API builds AuthContext
Clara API enforces RBAC and workspace scope
```

## Required Backend Rules

```text
no frontend-trusted role
no frontend-trusted organization_id or workspace_id
safe 401 for unauthenticated
safe 403 for unauthorized
cross-workspace resource access remains 404
no token in logs
mock auth blocked in production
```

## Implementation Steps

### Step 1: Provider Configuration Model

Deliver:

```text
provider env variable validation
production fail-fast rules
clear separation between local mock auth and production auth
```

### Step 2: Token Verification Path

Deliver:

```text
provider token/session verification on protected API routes
safe unauthenticated error handling
no token leakage in logs or responses
extract and validate bearer token before any provider verifier is called
Supabase JWT verification through configured JWKS and issuer validation
non-Supabase providers fail closed until explicitly implemented
```

### Step 3: Clara User Mapping

Deliver:

```text
map provider subject/user id to Clara user record
fail closed if provider identity is not mapped
```

### Step 4: Workspace Membership Lookup

Deliver:

```text
load organization_id, workspace_id, and role from Clara database
support current owner/agent/viewer model
fail closed if membership is missing or inactive
resolve AuthContext only after provider_subject maps to exactly one active workspace membership
reject ambiguous multi-workspace resolution until explicit workspace-selection flow exists
```

### Step 5: AuthContext Cutover

Deliver:

```text
build production AuthContext from verified identity + Clara membership
update protected route middleware to use production path
retain mock auth only for local/demo/test
dashboard provider mode only sends bearer token when provider session exists
frontend login shell remains UX only and does not decide role or workspace
```

### Step 6: Security Test Expansion

Deliver:

```text
invalid token tests
expired session tests
missing membership tests
mock auth blocked in production tests
cross-workspace 404 preservation tests
```

## Rollout Requirements

Before enabling production auth by default:

```text
security review completed
provider secrets managed safely
negative auth tests pass
workspace membership lookup path tested
observability/logging reviewed for token safety
```

## Smoke Test Reference

Use this runbook for deterministic local validation:

```text
docs/product/CLARA-P2-AUTH-SMOKE-TEST-RUNBOOK.md
```

## Main Risks

```text
provider verification mistakes can weaken auth boundary
membership caching can create stale authorization
poor env validation can let production boot with unsafe auth mode
frontend teams may accidentally over-trust role hints
```

## Success Criteria

Phase 2 auth foundation is successful when:

```text
mock auth is no longer the production trust boundary
all protected APIs verify real identity
backend authorization still comes from Clara data
viewer restrictions still hold
cross-workspace access still fails closed
production startup fails fast on invalid auth config
```

## Short Recommendation

```text
Adopt provider-managed identity now.
Keep authorization and workspace membership in Clara.
Do not spend Phase 2 building custom password auth.
```
