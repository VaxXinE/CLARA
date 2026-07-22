---
project: "CLARA"
artifact: "P13 Customer Lifecycle Status + Owner Assignment"
status: "active"
owner: "CLARA Product and Engineering"
classification: "product-spec"
---

# CLARA P13 Customer Lifecycle Status + Owner Assignment

P13-PR-01 is complete. P13-PR-02 is complete. P13-PR-03 is current.
internal CRM usage is the focus. billing/payment is deferred. CLARA is not
production deployed yet. CLARA is not public GA launched yet.

## Scope

lifecycle/owner assignment are workspace-scoped internal CRM features. Operators
can update a customer lifecycle status and assign an owner from active workspace
members. This is internal CRM usage, not billing, payment, public GA launch,
external support integration, or autonomous AI automation.

Lifecycle and owner assignment are internal workspace-scoped CRM features.

Supported lifecycle statuses:

- `new`
- `active`
- `follow_up`
- `at_risk`
- `resolved`
- `archived`
- `blocked`

## Backend Contract

The API adds workspace-scoped mutation endpoints:

- `PATCH /api/v1/customers/:customer_id/lifecycle-status`
- `PATCH /api/v1/customers/:customer_id/owner-assignment`

Backend AuthContext is the authority for organization, workspace, role, and
actor. Client-supplied `organization_id`, `workspace_id`, `role`, or user
authority fields are rejected or ignored safely and must not authorize access.

owner assignment requires valid workspace membership. The assigned user must be
an active member of the same backend-derived organization/workspace. Missing,
inactive, or cross-workspace member ids fail closed.

Viewers remain read-only. Owners and agents may mutate according to backend
`customer:update` permission. Extension clients do not get lifecycle or owner
mutation powers.

## Timeline And Audit

Timeline/audit must not expose raw provider/audit/secrets. Timeline output uses
safe event titles, summaries, actor references, timestamps, and customer ids.
Audit metadata is allowlisted to safe fields such as customer id, previous/next
status, and previous/next owner user ids. It must not include access tokens,
refresh tokens, Authorization headers, cookies, client secrets, raw provider
payloads, raw audit metadata, raw customer message bodies, or raw HTML.

## Dashboard Behavior

The dashboard adds safe operator controls inside the customer workspace:

- lifecycle status selector
- owner assignment selector populated from available active workspace members
- loading/error/success states through existing customer mutation feedback
- customer profile/list/timeline refresh after mutation

Frontend role checks remain UX-only. Backend authorization remains the source of
truth.

## Deferred

This PR does not add billing/payment, checkout, invoices, subscriptions, quota
enforcement, production deployment, public GA launch, external support tool
integration, outbound provider sends, real AI provider calls, AI draft
auto-send, customer deletion, task workflow execution, or extension CRM
mutation powers.
