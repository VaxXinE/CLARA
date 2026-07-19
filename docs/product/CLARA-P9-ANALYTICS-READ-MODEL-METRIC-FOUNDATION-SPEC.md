---
project: "CLARA"
artifact: "P9 Analytics Read Model Metric Foundation Spec"
status: "draft"
owner: "CLARA Product, Engineering, Security, and Operations"
classification: "product-analytics-spec"
---

# CLARA P9 Analytics Read Model + Metric Foundation

## Purpose

P9-PR-02 adds the first runtime foundation for Analytics Read Model and Metric
Foundation work. It exposes safe readiness and metric catalog endpoints so the
next P9 PRs can add real aggregate metrics without changing authorization,
privacy, or route shape.

This is foundation work only. Runtime metric values are introduced
progressively in later PRs.

## Foundation Scope

- Add workspace-scoped analytics readiness output.
- Add a metric registry with allowed metric keys, categories, value types, and
  aggregation levels.
- Add metric catalog output with safe privacy metadata.
- Add query validation for metric key, category, value type, aggregation level,
  and workspace scope.
- Add a read-only dashboard panel that explains the foundation state.
- Add extension boundary regression so analytics internals stay out of the
  browser extension.

## Non-goals

- No heavy operational metrics.
- No big KPI dashboard.
- No scheduled aggregation.
- No report export.
- No customer-level drilldown.
- No CRM mutation.
- No task creation.
- No owner assignment.
- No lifecycle/status mutation.
- No outbound send.
- No real AI provider.

## Endpoints

```text
GET /api/v1/analytics/readiness
GET /api/v1/analytics/metric-catalog
```

Both endpoints require authentication. Backend AuthContext is the only source
of organization/workspace authority.

## Readiness Contract

The readiness response is read-only and workspace-scoped:

```ts
{
  workspaceId: string;
  generatedAt: string;
  phase: "p9";
  readiness: {
    analyticsFoundationReady: boolean;
    metricRegistryReady: boolean;
    metricContractReady: boolean;
    runtimeMetricsImplemented: false;
    scheduledAggregationImplemented: false;
    reportExportImplemented: false;
  };
  allowedCategories: string[];
  blockedCategories: string[];
  privacy: {
    workspaceScoped: true;
    aggregateFirst: true;
    rawPayloadIncluded: false;
    rawCustomerMessagesIncluded: false;
    piiMinimized: true;
    policyVersion: string;
  };
  safety: {
    readOnly: true;
    mutationAllowed: false;
    actionExecuted: false;
    crmMutationExecuted: false;
    taskCreated: false;
    outboundSent: false;
  };
}
```

## Metric Catalog Contract

Each catalog item contains only safe contract metadata:

```ts
{
  metricKey: string;
  category: string;
  label: string;
  description: string;
  valueType: "count" | "percentage" | "duration_ms" | "ratio" | "status";
  aggregationLevel: "workspace" | "channel" | "operator" | "customer_segment";
  implementationStatus:
    | "policy_defined"
    | "foundation_ready"
    | "not_implemented_yet";
  privacy: {
    aggregated: true;
    rawPayloadIncluded: false;
    rawCustomerMessagesIncluded: false;
    workspaceScoped: true;
    piiMinimized: true;
  };
}
```

## Allowed Metric Keys

- `conversation_total`
- `conversation_open`
- `conversation_closed`
- `conversation_unresolved`
- `conversation_by_channel`
- `first_response_time_avg`
- `first_response_time_p50`
- `first_response_time_p95`
- `sla_risk_count`
- `channel_connected_count`
- `channel_degraded_count`
- `inbound_sync_success_count`
- `inbound_sync_failure_count`
- `outbound_delivery_success_rate`
- `outbound_delivery_failure_count`
- `crm_profile_intelligence_view_count`
- `crm_timeline_intelligence_view_count`
- `crm_action_proposal_review_count`
- `crm_follow_up_proposal_review_count`
- `crm_owner_assignment_readiness_view_count`
- `crm_lifecycle_status_readiness_view_count`
- `crm_audit_coverage_count`
- `blocked_crm_action_count`

## Allowed Categories

- `operational`
- `customer_engagement`
- `channel_performance`
- `crm_workflow`
- `audit_compliance`
- `operator_productivity`
- `sla_readiness`

## Query Policy

The metric catalog accepts filter-style query values only for known metric
keys, categories, value types, aggregation levels, and current workspace scope.
Client-provided `workspaceId` is never authority. If supplied, it must match the
Backend AuthContext workspace or the request is rejected.

Unknown metric keys, unknown metric categories, unknown aggregation levels,
unknown value types, raw payload requests, raw customer message requests, raw
provider payload requests, raw webhook payload requests, token/cookie/auth
header/API key/secret requests, raw DOM/raw HTML requests, raw prompt requests,
and raw audit metadata requests are blocked before metric execution.

## Aggregation Rules

- Analytics output is aggregate-first.
- Workspace aggregation is the default.
- Channel, operator, and customer-segment aggregation are allowed only when
  workspace-scoped and PII-minimized.
- Customer-level drilldown is deferred.

## Privacy Rules

Analytics output has no raw customer messages, no raw provider payload, no raw
webhook payload, no access token, no refresh token, no cookies, no auth headers,
no API keys, no secrets, no raw audit metadata, no raw DOM, no raw HTML, and no
raw prompts.

## Workspace Boundary

Backend AuthContext is required for all analytics routes. Organization and
workspace scope must come from server-side authentication, not request query,
body, or headers.

## Redaction Policy

Analytics read model responses expose safe readiness, category, and metric
contract metadata only. They do not include raw operational data or sensitive
provider data.

## P9 Handoff

Compact P9 Analytics / Reporting / KPI roadmap:

- P9-PR-01 Analytics & Reporting Scope + KPI Policy: complete.
- P9-PR-02 Analytics Read Model + Metric Foundation: in progress.
- P9-PR-03 Core Operational Metrics Pack.
- P9-PR-04 CRM Workflow Metrics + KPI Dashboard Cards.
- P9-PR-05 Reporting Filters + Analytics Audit Privacy Hardening.
- P9-PR-06 Final P9 Audit / Runbook.
