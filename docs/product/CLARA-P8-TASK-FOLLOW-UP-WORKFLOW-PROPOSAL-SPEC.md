# CLARA P8-PR-05 Task / Follow-up Workflow Proposal Spec

## Purpose

P8-PR-05 adds a deterministic Task / Follow-up Workflow Proposal contract for
customer follow-up review. It is proposal-only and review-only.

## Proposal-only Contract

- Backend AuthContext is the source of truth.
- Customer access is workspace-scoped.
- `taskCreated=false` is always returned.
- `actionExecuted=false` is always returned.
- Human approval is required before any future task workflow.
- There is no CRM mutation and no task creation in this PR.

## Input Sources

Allowed sources are `operator`, `customer_profile_intelligence`,
`customer_timeline_intelligence`, `action_proposal_review`,
`ai_suggestion_review`, and `system_review`.

`clientWorkspaceId` may be accepted for UI context, but it is never authority.

## Output Fields

The API returns `proposalId`, `customerId`, `workspaceId`, `generatedAt`,
`title`, `summary`, `followUp`, `proposedTask`, `risk`, `review`, and `safety`.
The task section is safe review metadata only.

## Allowed Proposal Intents

- `review_customer`
- `follow_up_customer`
- `request_more_context`
- `update_profile_review`
- `re_engage_customer`
- `no_op`

## Blocked Proposal Intents

The policy blocks attempts to create tasks immediately, schedule automatic
follow-up, send outbound messages, bypass human approval, request token/cookie
material, request raw provider payload, request raw webhook payload, request raw
DOM, request raw HTML, or request raw prompt data.

## Urgency And Due-window Rules

Urgency is limited to `low`, `medium`, or `high`. Due windows are limited to
`none`, `today`, `next_24h`, `next_48h`, and `this_week`.

## Human Approval Requirement

All proposals require human approval. This PR has no auto-create task, no
outbound send, and no scheduler.

## Permission Handoff

The proposal exposes the future required permission, but it does not grant that
permission and does not execute a workflow.

## Security Boundaries

There is no auto-create task, no outbound send, no scheduler, no auto-write
customer note, no owner assignment mutation, no lifecycle/status mutation, no
access token, no refresh token, and no cookies in the proposal response.

## Non-goals

This PR does not execute CRM mutations, create tasks, save notes, update status,
update lifecycle, assign owners, send messages, add analytics/KPI dashboards, or
integrate a real AI provider.

## Future PR Handoff

A later PR may add an approval/execution flow. That flow must keep backend
authorization, workspace scope, human approval, audit logging, and safe rollback
as hard requirements.
