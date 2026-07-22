---
project: "CLARA"
artifact: "P13 Internal Dashboard Analytics Wiring"
status: "active"
owner: "CLARA Product and Engineering"
classification: "product-spec"
---

# CLARA P13 Internal Dashboard Analytics Wiring

## Status

P13-PR-01 is complete. P13-PR-02 is complete. P13-PR-03 is complete.
P13-PR-04 is complete. P13-PR-05 is complete. P13-PR-06 is current.

internal CRM usage is the focus. billing/payment is deferred. analytics are
safe aggregated workspace-scoped metrics. CLARA is not production deployed yet.
CLARA is not public GA launched yet.

## Scope

P13-PR-06 adds a read-only internal CRM dashboard aggregate for operators. The
dashboard summarizes customers, lifecycle status, owner coverage,
conversation-to-customer linking, follow-up workload, recent CRM activity, and
a small internal CRM health summary.

The API derives organization and workspace from backend AuthContext only.
Client-supplied organization_id, workspace_id, user_id, or role is not
authorization truth.

## API Behavior

- `GET /api/v1/analytics/internal-crm-dashboard` returns workspace-scoped
  aggregate internal CRM metrics.
- Optional `timeWindow` accepts `7d`, `30d`, or `90d`.
- Unknown query fields are rejected instead of ignored silently.
- The response is read-only and aggregate-only.

## Dashboard Behavior

The dashboard displays internal CRM summary cards in the workspace status area.
The panel is read-only and has no mutation buttons, exports, drilldowns,
provider actions, AI actions, outbound send actions, or billing/payment
actions.

## Safety

This PR does not add billing/payment/provider/AI/outbound behavior.
this PR does not add billing/payment/provider/AI/outbound behavior.

This PR does not add heavy analytics jobs or exports.
this PR does not add heavy analytics jobs or exports.

The response does not include access tokens, refresh tokens, Authorization
headers, cookies, client secrets, raw provider payloads, raw webhook payloads,
raw Gmail payloads, raw audit metadata, full customer messages, billing
payloads, payment payloads, invoices, subscriptions, or quota-enforcement
state.

## Non-Goals

This PR does not implement billing, payment, subscriptions, invoices,
checkout, quota enforcement, real provider calls, real AI provider calls,
outbound sends, background jobs, scheduled analytics, report exports,
customer-level drilldowns, notification sends, or public GA launch behavior.
