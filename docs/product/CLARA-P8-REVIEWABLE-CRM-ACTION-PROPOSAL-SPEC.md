---
project: "CLARA"
artifact: "P8 Reviewable CRM Action Proposal Spec"
status: "draft"
owner: "CLARA Product, Engineering, Security, and AI"
classification: "product-spec"
---

# CLARA P8 Reviewable CRM Action Proposal Spec

## Purpose

P8-PR-04 adds Reviewable CRM Action Proposal support. It returns proposal-only,
review-only CRM action guidance that operators can inspect before any future
approval/execution flow exists.

## Proposal-Only Contract

- Backend AuthContext is the source of truth.
- Data access is workspace-scoped from server auth only.
- `mutationExecuted=false` for every response.
- No CRM mutation happens in this PR.
- No auto-create task, no auto-write customer note, no owner assignment
  mutation, and no lifecycle/status mutation.
- Human approval is required before any future mutation flow.

## Input Sources

Allowed sources:

- operator
- customer_profile_intelligence
- customer_timeline_intelligence
- ai_suggestion_review
- system_review

Client-provided workspace data is accepted only as non-authoritative context and
must not override Backend AuthContext.

## Output Fields

The API returns proposal id, customer id, workspace id, proposal type, title,
summary, proposed action, risk classification, review next step, warnings, and
safety flags.

## Allowed Proposal Types

- follow_up_task_review
- customer_note_review
- status_change_review
- lifecycle_change_review
- owner_assignment_review
- needs_attention_review

Unknown or unsafe proposal requests are blocked or rejected safely.

## Risk Classification

Low-risk proposals stay review-only. Medium/high-risk proposals require explicit
human review and later role permission. Unsafe content becomes blocked with a
safe reason.

## Permission Handoff

The response includes the future required permission, but this PR does not
execute that permission path.

## Security Boundaries

- no raw provider payload
- no raw webhook payload
- no access token
- no refresh token
- no cookies
- no Authorization header
- no raw DOM
- no raw HTML
- no raw prompt
- no real AI provider
- no AI SDK dependency
- no `dangerouslySetInnerHTML`

## Non-Goals

- no CRM mutation
- no task creation
- no customer note write
- no owner assignment mutation
- no lifecycle/status mutation
- no analytics/KPI dashboard
- no autonomous workflow
- no auto-send

## Future PR Handoff

Next work can add task/follow-up workflow proposal, owner assignment readiness,
lifecycle/status update flow with approval, CRM activity audit hardening, and
final P8 audit.
