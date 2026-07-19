---
project: "CLARA"
artifact: "P9 CRM Workflow Metrics + KPI Dashboard Cards Spec"
status: "draft"
owner: "CLARA Product, Engineering, Security, and Operations"
classification: "product-spec"
---

# CLARA P9 CRM Workflow Metrics + KPI Dashboard Cards Spec

## Purpose

P9-PR-04 adds CRM Workflow Metrics and KPI Dashboard Cards for the CLARA
analytics workspace. The feature is aggregate-first, workspace-scoped, and
read-only.

## Scope

- `GET /api/v1/analytics/crm-workflow`
- `GET /api/v1/analytics/kpi-dashboard`
- Dashboard panels for KPI cards and CRM workflow metrics.
- Extension boundary regression proving analytics internals stay out of the
  browser extension.

## Non-Goals

- No report export.
- No customer-level drilldown.
- No CRM mutation.
- No task creation.
- No owner assignment.
- No lifecycle or status mutation.
- No outbound send.
- No scheduled aggregation jobs.
- No real AI provider.

## Allowed Query Parameters

- `timeWindow`: `today`, `last_7_days`, `last_30_days`
- `category`: `crm_workflow`, `audit_compliance`, `operational`,
  `channel_performance`, `sla_readiness`

Custom windows, operator filters, customer filters, raw export, and advanced
reporting filters are deferred to later P9 work.

## CRM Workflow Metrics

- `crm_profile_intelligence_view_count`
- `crm_timeline_intelligence_view_count`
- `crm_action_proposal_review_count`
- `crm_follow_up_proposal_review_count`
- `crm_owner_assignment_readiness_view_count`
- `crm_lifecycle_status_readiness_view_count`
- `crm_audit_coverage_count`
- `blocked_crm_action_count`
- `crm_readiness_surface_count`
- `crm_review_only_action_count`

## KPI Dashboard Cards

- `total_conversations`
- `unresolved_conversations`
- `sla_risk`
- `channel_health`
- `crm_workflow_reviews`
- `crm_audit_coverage`
- `blocked_sensitive_actions`
- `outbound_delivery_health`

## Contracts

Metric and card responses include:

- `workspaceId`
- `generatedAt`
- `timeWindow`
- aggregate metric/card values
- privacy flags
- read-only safety flags

## Privacy Rules

- Backend AuthContext is required.
- All analytics are workspace-scoped.
- Outputs are aggregate-first.
- No raw customer messages.
- No raw provider payload.
- No raw webhook payload.
- No raw audit metadata.
- No access token.
- No refresh token.
- No cookies.
- No auth headers.
- No secrets.

## Dashboard Behavior

The dashboard renders simple read-only KPI cards and CRM workflow metric lists.
It uses plain text rendering only and does not add export, download, execute,
apply, create task, assign owner, update status, send message, or write note
controls.

## P9 Compact Roadmap Handoff

- P9-PR-01 complete: Analytics & Reporting Scope + KPI Policy.
- P9-PR-02 complete: Analytics Read Model + Metric Foundation.
- P9-PR-03 complete: Core Operational Metrics Pack.
- P9-PR-04 in progress: CRM Workflow Metrics + KPI Dashboard Cards.
- P9-PR-05 next: Reporting Filters + Analytics Audit Privacy Hardening.
- P9-PR-06 next: Final P9 Audit / Runbook.
