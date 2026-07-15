---
project: "CLARA"
artifact: "P7 Implementation Roadmap"
status: "implemented"
owner: "CLARA Product, Engineering, Security, and AI"
classification: "roadmap"
---

# CLARA P7 Implementation Roadmap

## P7 PR Plan

- P7-PR-01 AI Assistant Product Scope + Safety Policy — complete
- P7-PR-02 AI Context Builder + Prompt Contract — complete
- P7-PR-03 AI Reply Suggestion v1 — complete
- P7-PR-04 AI Draft Review + Human Approval Flow — complete
- P7-PR-05 AI Follow-up Recommendation — complete
- P7-PR-06 AI Conversation Summary + Customer Notes — complete
- P7-PR-07 AI Automation Guardrails + Abuse Tests — complete
- P7-PR-08 Final AI Assistant Audit + Runbook — complete

## Build Order

Start with policy and tests, then build the smallest safe context builder. Reply suggestions and summaries come before any automation. Automation must not ship without explicit human-in-the-loop approval, audit trail, rollback, prompt injection tests, backend AuthContext, workspace-scoped access, and no auto-send.

## Later Phases

CRM expansion, analytics/KPI product, enterprise admin workflows, billing, invite/update-role/delete-user implementation, and real autonomous automation remain later phases.

## Final Handoff

P7 complete. The assistant layer is suggestion-only, review-only,
recommendation-only, and evaluation-only. It keeps `requiresHumanApproval`,
backend AuthContext, workspace-scoped data access, no real LLM provider, no AI
SDK, no auto-send, no automatic customer note write, no automatic task
creation, and no automatic scheduler.

Next phase: P8 CRM & Workflow Intelligence.
