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
P13-PR-01 is complete. P13-PR-02 is complete. P13-PR-03 is complete.
P13-PR-04 is complete. P13-PR-05 is complete. P13-PR-06 is complete.
P13-PR-07 is current. P13 internal CRM activation is complete only after this
PR validates. CLARA is usable for internal CRM workflow after P13.
internal CRM usage is the focus. billing/payment is deferred. analytics are
safe aggregated workspace-scoped metrics. this PR does not add
billing/payment/provider/AI/outbound behavior. this PR does not add heavy
analytics jobs or exports. no real provider/payment/AI/outbound behavior is
activated. no real external provider credentials are required. CLARA is not
production deployed yet. CLARA is not public GA launched yet. Billing/payment
remains deferred. Public SaaS launch is deferred.

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
| P13-PR-04 | Follow-up Task Workflow | complete |
| P13-PR-05 | Conversation-to-Customer Linking | complete |
| P13-PR-06 | Internal Dashboard Analytics Wiring | complete |
| P13-PR-07 | Internal CRM End-to-End QA + Runbook | current |

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

Conversation-to-customer linking is workspace-scoped. Linking is explicit
user-approved internal CRM action. This PR does not auto-create or auto-merge
customers. Timeline/audit must not expose raw provider/audit/secrets/message
bodies.

Internal dashboard analytics are safe aggregated workspace-scoped metrics. This
PR does not add billing/payment/provider/AI/outbound behavior. This PR does not
add heavy analytics jobs or exports.

P13 does not activate billing, payment, subscriptions, invoices, checkout,
production deployment, autonomous AI, external support tool integrations, or
real outbound provider sends.
