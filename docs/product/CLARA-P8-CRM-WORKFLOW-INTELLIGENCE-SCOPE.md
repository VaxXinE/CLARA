---
project: "CLARA"
artifact: "P8 CRM Workflow Intelligence Scope"
status: "draft"
owner: "CLARA Product, Engineering, Security, and AI"
classification: "product-scope"
---

# CLARA P8 CRM & Workflow Intelligence Scope

## Purpose

P8 starts CRM & Workflow Intelligence after P7 complete. The goal is to turn
safe AI suggestions into reviewable CRM workflow proposals, not autonomous
mutations.

## Scope

P8 includes:

- customer profile intelligence
- lifecycle/status intelligence
- customer timeline intelligence
- follow-up workflow
- task recommendation and review
- owner/assignment readiness
- CRM activity audit
- workflow permission boundaries
- workspace-scoped CRM access
- safe handoff from P7 AI suggestions to P8 CRM workflow

## Relation To P7 AI Assistant

P7 remains suggestion-only, review-only, and evaluation-only. P8 may consume P7
recommendations as inputs, but every persistent CRM mutation still requires
Backend AuthContext, workspace-scoped authorization, role permission, human
approval, and audit log coverage.

## Relation To P9 Analytics

P9 Analytics / Reporting / KPI is later work. P8 must not add analytics
dashboards, KPI reporting, billing, or growth metrics.

## Non-Goals

- no autonomous CRM mutation
- no auto-write customer note
- no auto-create task
- no auto-assign owner
- no auto-change pipeline/lifecycle
- no billing/admin/user/role mutation
- no provider connect/disconnect
- no analytics/KPI dashboard

## Expected PR Breakdown

- P8-PR-01: CRM scope, mutation policy, workflow intelligence policy, security runbook
- P8-PR-02: read-only CRM readiness surfaces
- P8-PR-03: reviewable task/follow-up proposal contract
- P8-PR-04: audited human-approved CRM mutation boundary
- P8-PR-05: final P8 security regression and P9 handoff
