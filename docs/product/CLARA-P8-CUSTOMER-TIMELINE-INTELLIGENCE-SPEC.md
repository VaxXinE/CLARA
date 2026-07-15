---
project: "CLARA"
artifact: "P8 Customer Timeline Intelligence Spec"
status: "draft"
owner: "CLARA Product, Engineering, Security, and AI"
classification: "product-spec"
---

# CLARA P8 Customer Timeline Intelligence Spec

## Purpose

P8-PR-03 adds Customer Timeline Intelligence as a read-only, review-only read
model for customer context. It helps operators see key customer moments without
creating tasks, writing notes, changing lifecycle/status, assigning owners, or
sending messages.

## Read-Only Contract

- Backend AuthContext is the source of truth.
- Data is workspace-scoped from server auth only.
- Client-supplied organization/workspace/role is not authority.
- The endpoint has no CRM mutation, no auto-create task, no auto-write customer
  note, no owner assignment, no lifecycle/status change, and no autonomous
  workflow execution.
- AI draft and reply send flows remain separate and human-approved.

## Input Data Sources

The first implementation uses existing safe records:

- customer profile timestamps and status
- conversation list/detail records
- safe message summaries already returned by conversation repositories

Future PRs may add activity, reply, and channel-specific timeline enrichments
only if they keep the same workspace-scoped and read-only rules.

## API Output

`GET /api/v1/customers/:customerId/timeline/intelligence` returns:

- `customerId`, `workspaceId`, `generatedAt`
- `timeline.events[]`
- `intelligence.keyMoments`
- `intelligence.recentSignals`
- `intelligence.riskFlags`
- `intelligence.followUpHints`
- `safety.readOnly = true`
- `safety.mutationAllowed = false`
- `safety.requiresHumanApprovalForMutation = true`

Timeline event types include customer created, conversation started/updated,
inbound message, outbound reply, channel event, activity event, AI suggestion,
customer profile signal, and unknown.

## Rules

- Key moments summarize counts and latest safe timeline facts.
- Recent signals summarize open conversation and last interaction state.
- Risk flags are review prompts only.
- Follow-up hints are suggestions only and do not execute actions.
- `safeMetadata` is allowlisted primitive metadata only.

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
- no owner assignment
- no lifecycle/status update
- no analytics/KPI dashboard
- no autonomous workflow
- no auto-send

## Future PR Handoff

Likely next P8 work:

- reviewable CRM action proposal
- task/follow-up workflow
- owner assignment readiness
- lifecycle/status update flow with approval
- final P8 audit
