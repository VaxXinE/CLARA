---
project: "CLARA"
artifact: "P9 Analytics Reporting KPI Scope Policy"
status: "draft"
owner: "CLARA Product, Engineering, Security, and Operations"
classification: "product-analytics-policy"
---

# CLARA P9 Analytics & Reporting Scope + KPI Policy

## Purpose

P9 starts the Analytics / Reporting / KPI phase with policy before runtime
analytics. This document defines the metric scope, safe output contract,
privacy boundary, and non-goals for the first P9 implementation step.

## P9 Scope

P9 covers aggregate, workspace-scoped analytics for:

- Conversation volume metrics.
- Reply volume metrics.
- Response time metrics.
- Channel health metrics.
- Follow-up proposal metrics.
- CRM readiness metrics.
- Audit coverage metrics.
- Operator workload metrics.
- Unresolved conversation metrics.
- SLA readiness metrics.

## Non-goals

P9-PR-01 does not add heavy dashboards, scheduled aggregation jobs, report
export, CRM/customer mutation, task creation, customer note writes, owner
assignment, lifecycle/status updates, outbound send, workflow automation, real
AI provider integration, AI SDK/API key requirements, or per-customer analytics
surfaces.

## Metric Categories

Allowed categories:

- `operational`
- `customer_engagement`
- `channel_performance`
- `crm_workflow`
- `audit_compliance`
- `operator_productivity`
- `sla_readiness`

## Allowed Metric Keys

Allowed metric keys for P9-PR-01 policy:

- `conversation_volume`
- `reply_volume`
- `average_response_time_ms`
- `channel_health_status`
- `follow_up_proposal_count`
- `crm_readiness_coverage`
- `audit_coverage_rate`
- `operator_workload_count`
- `unresolved_conversation_count`
- `sla_readiness_status`

Unknown metric keys must be blocked.

## Metric Output Contract

Allowed output shape:

```ts
{
  metricKey: string;
  workspaceId: string;
  generatedAt: string;
  category: string;
  label: string;
  description: string;
  valueType: "count" | "percentage" | "duration_ms" | "ratio" | "status";
  aggregationLevel: "workspace" | "channel" | "operator" | "customer_segment";
  timeWindow: "today" | "last_7_days" | "last_30_days" | "custom";
  privacy: {
    aggregated: true;
    rawPayloadIncluded: false;
    piiMinimized: true;
    workspaceScoped: true;
    policyVersion: string;
  }
}
```

## Aggregation Rules

- Analytics output is aggregate-first.
- Workspace-level aggregation is the default.
- Channel/operator/customer-segment aggregation is allowed only when it remains
  workspace-scoped and PII-minimized.
- Per-customer analytics are delayed until a later PR with explicit privacy
  review.

## Privacy Rules

Analytics output must not expose raw customer messages, raw provider payload,
raw webhook payload, raw audit metadata, access tokens, refresh tokens,
cookies, auth headers, API keys, secrets, raw DOM, raw HTML, raw prompts, or
unredacted PII.

## Workspace Boundary

Backend AuthContext is the source of truth. Workspace scope must come from the
server-side authenticated context, not query/body/header values from the client.
Cross-workspace analytics access must be blocked.

## Redaction Policy

Metric requests that ask for raw payloads, secrets, token/cookie/header values,
raw DOM/HTML, raw prompts, raw audit metadata, or raw customer message content
must be rejected before metric execution.

## Role Considerations

Owner/admin can be allowed to read future analytics. Agent access should be
limited to operational/team metrics. Viewer access should be read-only and may
be restricted further by later route policy.

## P9 PR Roadmap

- P9-PR-01 Analytics & Reporting Scope + KPI Policy.
- P9-PR-02 Analytics Read Model Foundation.
- P9-PR-03 Conversation Volume Metrics.
- P9-PR-04 Response Time / SLA Metrics.
- P9-PR-05 Channel Performance Metrics.
- P9-PR-06 CRM Workflow Metrics.
- P9-PR-07 Dashboard KPI Cards.
- P9-PR-08 Reporting Filters / Time Windows.
- P9-PR-09 Analytics Audit + Privacy Hardening.
- P9-PR-10 Final P9 Audit / Runbook.
