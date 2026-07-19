---
project: "CLARA"
artifact: "P8 Lifecycle / Status Update Readiness Spec"
status: "draft"
owner: "CLARA Product, Engineering, Security, and AI"
classification: "product-spec"
---

# Lifecycle / Status Update Readiness

P8-PR-07 adds a readiness-only, review-only lifecycle/status update read model.
It helps an operator decide whether a customer lifecycle or status deserves
human review, but it does not change customer data.

## Scope

- Endpoint: `GET /api/v1/customers/:customerId/lifecycle-status/readiness`
- Dashboard: read-only lifecycle/status readiness panel.
- Extension: no lifecycle/status capability is added.
- Authority: Backend AuthContext only.
- Scope: workspace-scoped customer lookup.

## Response Contract

The API returns current lifecycle/status, safe review reasons, suggested review
metadata, transition policy, risk, and safety flags.

Required safety flags:

- `lifecycleUpdated=false`
- `statusUpdated=false`
- `actionExecuted=false`
- `mutationAllowed=false`
- `requiresHumanApprovalForMutation=true`

## Security Rules

- Backend AuthContext is the source of truth for user, role, organization, and
  workspace.
- Client-provided organization/workspace/role data is not authorization
  authority.
- Cross-workspace customers return safe not-found behavior.
- There is no CRM mutation.
- There is no lifecycle mutation.
- There is no status mutation.
- There is no auto-change lifecycle/status.
- There is no task creation.
- There is no outbound send.
- There is no scheduler.
- There is no raw provider payload.
- There is no raw webhook payload.
- There is no access token.
- There is no refresh token.
- There is no cookies.

## Implementation Notes

This PR intentionally stops at read-only readiness. A future lifecycle/status
mutation flow must add explicit server-side permission checks, human approval,
audit logging, workspace-scoped writes, and rollback guidance before any write
operation is allowed.
