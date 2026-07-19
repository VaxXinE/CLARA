---
project: "CLARA"
artifact: "P9 Implementation Roadmap"
status: "draft"
owner: "CLARA Product, Engineering, Security, and Operations"
classification: "product-roadmap"
---

# CLARA P9 Analytics / Reporting / KPI Roadmap

## Phase Goal

P9 adds Analytics / Reporting / KPI capability after P8 CRM & Workflow
Intelligence. The phase starts with policy, contracts, and privacy boundaries
before any heavy runtime dashboard or scheduled aggregation work.

## Roadmap

| PR | Status | Scope |
|---|---|---|
| P9-PR-01 | complete | Analytics & Reporting Scope + KPI Policy |
| P9-PR-02 | in progress | Analytics Read Model + Metric Foundation |
| P9-PR-03 | planned | Core Operational Metrics Pack |
| P9-PR-04 | planned | CRM Workflow Metrics + KPI Dashboard Cards |
| P9-PR-05 | planned | Reporting Filters + Analytics Audit Privacy Hardening |
| P9-PR-06 | planned | Final P9 Audit / Runbook |

## Phase Guardrails

- Backend AuthContext remains the source of truth.
- All analytics are workspace-scoped.
- Metric output is aggregate-first.
- No raw provider payload, raw webhook payload, raw customer messages, raw
  audit metadata, tokens, cookies, auth headers, secrets, raw DOM, raw HTML, or
  raw prompts.
- P9-PR-02 adds the Analytics Read Model and Metric Foundation only. Runtime
  metrics, no scheduled aggregation, no report export, no customer-level
  drilldown, no outbound send, no CRM mutation, no task creation, and no real
  AI provider remain explicit guardrails.
