---
project: "CLARA"
artifact: "P9 Core Operational Metrics Pack Spec"
status: "implemented"
owner: "CLARA Product, Engineering, Security, and Operations"
classification: "product-spec"
---

# CLARA P9 Core Operational Metrics Pack

P9-PR-03 adds the first runtime metric pack for P9 Analytics / Reporting / KPI.
It stays small: authenticated, workspace-scoped, aggregate-first operational
metrics only.

## Scope

The pack exposes:

- `GET /api/v1/analytics/overview`
- `GET /api/v1/analytics/conversations/volume`
- `GET /api/v1/analytics/response-time-sla`
- `GET /api/v1/analytics/channels/performance`

Allowed filters:

- `timeWindow`: `today`, `last_7_days`, `last_30_days`
- `channel`: `all`, `email`, `webchat`, `whatsapp`
- `category`: `operational`, `channel_performance`, `sla_readiness`

## Metric Groups

Conversation Volume Metrics:

- total conversations
- open conversations
- closed conversations
- unresolved conversations
- conversations grouped by channel
- conversations needing attention

Response Time and SLA:

- average first response time
- median first response time
- P95 first response time
- oldest unresolved response age
- SLA risk count
- unanswered conversation count

Channel Performance Metrics:

- connected channel count
- degraded channel count
- disabled/action-required channel count
- inbound sync success/failure counters
- outbound delivery success/failure counters
- safe provider health status

## Security Contract

- Backend AuthContext is the only authority for user, organization, workspace,
  and role.
- Every result is workspace-scoped.
- Every result is aggregate-first.
- No raw customer messages are returned.
- No raw provider payload is returned.
- No raw webhook payload is returned.
- No access token is returned.
- No refresh token is returned.
- No cookies are returned.
- No raw audit metadata is returned.
- No CRM mutation is performed.
- No task creation is performed.
- No outbound send is performed.
- No real AI provider is called.
- No report export is implemented.
- No customer-level drilldown is implemented.

## Dashboard

The dashboard adds a read-only `CoreOperationalMetricsPanel` component and API
client methods for the new endpoints. This PR does not wire new charts, export
controls, mutation buttons, or customer drilldown UI.

## Extension Boundary

The browser extension remains outside analytics runtime. It does not request
metric data, does not render analytics dashboards, and does not receive tokens,
cookies, raw provider payload, raw webhook payload, raw DOM, raw HTML, or
customer-level analytics data.

## Deferred

- CRM Workflow Metrics + KPI Dashboard Cards remain P9-PR-04.
- Reporting filters and analytics audit hardening remain P9-PR-05.
- Final P9 runbook and security regression remain P9-PR-06.
