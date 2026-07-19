---
project: "CLARA"
artifact: "P9 Reporting Filters + Analytics Audit Privacy Spec"
status: "in-progress"
owner: "CLARA Product, Engineering, Security, and Operations"
classification: "product-spec"
---

# CLARA P9 Reporting Filters + Analytics Audit Privacy

## Goal

P9-PR-05 adds safe reporting filters and analytics audit privacy hardening for
the existing P9 Analytics / Reporting / KPI surfaces.

The implementation stays aggregate-first, Backend AuthContext driven, and
workspace-scoped. It does not add exports, customer-level drilldown, scheduled
aggregation, CRM mutation, task creation, outbound send, or real AI provider
calls.

## Supported Filters

| Filter | Allowed Values | Notes |
|---|---|---|
| `timeWindow` | `today`, `last_7_days`, `last_30_days` | Custom date ranges are not supported in this PR. |
| `channel` | `all`, `email`, `webchat`, `whatsapp` | Unsupported social/provider channels are rejected. |
| `category` | `operational`, `channel_performance`, `sla_readiness`, `crm_workflow`, `audit_compliance` | Routes may restrict categories to their metric family. |
| `operatorId` | server-validated id string | Role-gated to owner access only. |

`organization_id`, `workspace_id`, and role from client input are not used as
authorization truth. Backend AuthContext remains the source of truth.

## Audit Privacy

Analytics audit events are safe summaries only:

- event name
- workspace id from Backend AuthContext
- actor id from Backend AuthContext
- timestamp
- safe filter summary
- safe reason code

Audit metadata has no raw customer messages, no raw provider payload, no raw
webhook payload, no raw audit metadata, no access token, no refresh token, no
cookies, no auth headers, no secrets, no raw DOM, no raw HTML, and no raw
prompts.

## Dashboard Behavior

The dashboard displays a read-only Reporting Filters panel and Analytics Audit
Privacy panel. These panels show safe aggregate status only. They do not add
apply/execute controls, report export, customer drilldown, mutation controls,
token display, raw payload rendering, or unsafe HTML rendering.

## Extension Boundary

The browser extension remains outside analytics reporting filters and analytics
audit internals. It does not request reporting data, cross-workspace analytics,
raw KPI data, raw provider payload, raw webhook payload, raw audit metadata,
access token, refresh token, cookies, raw DOM, raw HTML, or raw prompt content.

## Security Guardrails

- Backend AuthContext is authoritative.
- All analytics responses are workspace-scoped.
- Metric output remains aggregate-first.
- Operator filters are role-gated.
- Cross-workspace filter attempts fail closed.
- Unknown filters fail closed.
- Sensitive request terms fail closed.
- Dashboard output is read-only.
- Extension runtime does not collect analytics internals.
- no raw customer messages
- no raw provider payload
- no raw webhook payload
- no raw audit metadata
- no access token
- no refresh token
- no cookies
- no CRM mutation
- no task creation
- no outbound send
- no real AI provider
- no report export
- no customer-level drilldown

## Validation

Run:

```bash
bash scripts/validate-p9-reporting-filters-analytics-audit-privacy.sh
```

Expected success marker:

```text
CLARA P9-PR-05 VALIDATION PASSED
```
