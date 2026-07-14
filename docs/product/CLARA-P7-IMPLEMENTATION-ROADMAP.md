---
project: "CLARA"
artifact: "P7 Implementation Roadmap"
status: "implemented"
owner: "CLARA Product, Engineering, Security, and AI"
classification: "roadmap"
---

# CLARA P7 Implementation Roadmap

## P7 PR Plan

- P7-PR-01 AI Assistant Product Scope + Safety Policy
- P7-PR-02 AI Context Builder + Prompt Contract
- P7-PR-03 AI Reply Suggestion v1
- P7-PR-04 AI Draft Review + Human Approval Flow
- P7-PR-05 AI Follow-up Recommendation
- P7-PR-06 AI Conversation Summary + Customer Notes
- P7-PR-07 AI Automation Guardrails + Abuse Tests
- P7-PR-08 Final AI Assistant Audit + Runbook

## Build Order

Start with policy and tests, then build the smallest safe context builder. Reply suggestions and summaries come before any automation. Automation must not ship without explicit human-in-the-loop approval, audit trail, rollback, prompt injection tests, backend AuthContext, workspace-scoped access, and no auto-send.

## Later Phases

CRM expansion, analytics/KPI product, enterprise admin workflows, billing, invite/update-role/delete-user implementation, and real autonomous automation remain later phases.
