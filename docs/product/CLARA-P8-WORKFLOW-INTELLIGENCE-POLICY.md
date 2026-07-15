---
project: "CLARA"
artifact: "P8 Workflow Intelligence Policy"
status: "draft"
owner: "CLARA Product, Engineering, Security, and AI"
classification: "workflow-policy"
---

# CLARA P8 Workflow Intelligence Policy

## Principle

Workflow intelligence is suggestion-only until a human explicitly approves a
CRM action. P8 may rank, explain, and prepare reviewable workflow proposals, but
it must not execute autonomous CRM mutation.

## Reviewable Workflow Proposals

A workflow proposal may include:

- suggested follow-up task
- suggested owner assignment
- suggested customer status
- suggested lifecycle stage
- suggested customer note draft
- suggested needs-attention flag

The proposal is not the mutation. The mutation boundary must require Backend
AuthContext, workspace-scoped authorization, role permission, human approval,
input validation, and audit log coverage.

Required boundary: Backend AuthContext and workspace-scoped authorization.

## Safe Handoff From P7

P7 AI output is untrusted recommendation input. P8 must validate and re-check
permissions before any CRM change. P7 cannot auto-write customer notes,
auto-create tasks, auto-assign owners, auto-change lifecycle, or schedule work.

P8 keeps no auto-write customer note, no auto-create task, and no auto-assign
owner as hard workflow rules until an authorized human explicitly approves a
scoped CRM mutation.

## UI Rules

Dashboard workflow UI may show readiness, suggestions, and disabled planned
controls. It must not use `dangerouslySetInnerHTML`, render raw HTML, display
tokens, display cookies, display raw provider payloads, or display raw webhook
payloads.
