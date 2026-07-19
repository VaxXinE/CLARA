---
project: "CLARA"
artifact: "P8 Implementation Roadmap"
status: "draft"
owner: "CLARA Product, Engineering, Security, and AI"
classification: "roadmap"
---

# CLARA P8 Implementation Roadmap

## P8 PR Plan

- P8-PR-01 CRM & Workflow Intelligence Scope + Mutation Policy — complete
- P8-PR-02 Customer Profile Intelligence Read Model — complete
- P8-PR-03 Customer Timeline Intelligence — complete
- P8-PR-04 Reviewable CRM Action Proposal — complete
- P8-PR-05 Task / Follow-up Workflow Proposal — complete
- P8-PR-06 owner assignment readiness — complete
- P8-PR-07 lifecycle/status update readiness — complete
- P8-PR-08 CRM activity audit hardening — in progress
- P8-PR-09 final P8 security regression, runbook, and P9 handoff

## Build Order

Start with policy and tests. Add read-only customer/workflow intelligence before
any mutation. Add reviewable proposals before mutation. Add persistent CRM
mutation only after Backend AuthContext, workspace-scoped authorization, human
approval, role permission, and audit log controls exist.

## Later Phases

P9 Analytics / Reporting / KPI remains later work. Billing, entitlement,
enterprise admin, provider management, and autonomous automation remain outside
P8.
