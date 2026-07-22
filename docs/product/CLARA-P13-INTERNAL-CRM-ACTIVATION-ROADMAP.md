---
project: "CLARA"
artifact: "P13 Internal CRM Activation Roadmap"
status: "active"
owner: "CLARA Product and Engineering"
classification: "product-roadmap"
---

# CLARA P13 Internal CRM Activation Roadmap

## Status

P12 release-readiness is complete. P13 is current. P13 focuses internal CRM usage.
P13-PR-01 is complete. P13-PR-02 is complete. P13-PR-03 is complete. Internal CRM
usage is the focus. CLARA is not production deployed yet. CLARA is not public GA
launched yet. billing/payment is deferred. Billing/payment remains deferred.

P13 moves CLARA from release-readiness into practical internal CRM usage. The
goal is not public SaaS monetization. The goal is that an internal workspace
operator can manage customers, conversations, follow-up context, and safe CRM
workflow state with backend authorization as the source of truth.

## P13 Sequence

| PR | Scope | Status |
| --- | --- | --- |
| P13-PR-01 | Customer CRUD Activation | complete |
| P13-PR-02 | Customer Notes + Activity Timeline | complete |
| P13-PR-03 | Lifecycle Status + Owner Assignment | complete |
| P13-PR-04 | Follow-up Task Workflow | current |
| P13-PR-05 | Conversation-to-Customer Linking | planned |
| P13-PR-06 | Internal Dashboard Analytics Wiring | planned |
| P13-PR-07 | Internal CRM End-to-End QA + Runbook | planned |

## Guardrails

Customer CRUD is internal workspace-scoped. Backend AuthContext is the
authority. Frontend role checks are UX-only. Client-supplied organization or
workspace identifiers must not become authorization truth.

Notes/timeline are workspace-scoped internal CRM features. Timeline must not
expose raw provider/audit/secrets.

lifecycle/owner assignment are workspace-scoped internal CRM features. owner
assignment requires valid workspace membership. Timeline/audit must not expose
raw provider/audit/secrets.

follow-up tasks are workspace-scoped internal CRM features. task assignee
requires valid workspace membership. this PR does not auto-send external
notifications. Timeline/audit must not expose raw provider/audit/secrets.

P13 does not activate billing, payment, subscriptions, invoices, checkout,
production deployment, autonomous AI, external support tool integrations, or
real outbound provider sends.
