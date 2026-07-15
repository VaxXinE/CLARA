# CLARA P7 AI Draft Review Human Approval Spec

This spec defines the P7 AI Draft Review and Human Approval flow.

## Purpose

AI-generated reply content is never a provider action. It is draft text that
must pass a human approval step before it can be used as an approved draft in
the reply flow.

## Lifecycle

Supported review statuses:

- `suggested`: AI-created content starts here.
- `editing`: an operator edited the draft text.
- `approved`: an authenticated operator approved the draft.
- `rejected`: an authenticated operator rejected the draft.
- `expired`: the draft is no longer valid for approval.
- `blocked`: policy blocked the draft.

Blocked, rejected, and expired drafts cannot be approved. Regenerate or copy
safe text into a new draft instead.

## API

Routes:

```text
POST /api/v1/ai/draft-reviews
GET /api/v1/ai/draft-reviews/:draftId
POST /api/v1/ai/draft-reviews/:draftId/edit
POST /api/v1/ai/draft-reviews/:draftId/approve
POST /api/v1/ai/draft-reviews/:draftId/reject
```

Every route is authenticated. Mutation routes require the existing
`ai_draft:create` permission. Viewer role remains read-only.

## Authorization

The backend AuthContext is the source of truth for user, role, organization,
and workspace. Client-supplied `organization_id`, `workspace_id`, or `role`
is not accepted as authorization input.

All lookups are workspace-scoped. Cross-workspace access returns safe not-found
behavior.

## Response Contract

The review DTO includes safe fields only:

```text
draftId
suggestionId
conversationId
customerId
workspaceId
channel
status
draftText
editedText
reviewedByUserId
approvedAt
rejectedAt
safeReasonCode
safetyFlags
requiresHumanApproval
policyVersion
createdAt
updatedAt
```

The response must not include access token, refresh token, cookies,
Authorization header, client secret, raw provider payload, raw webhook payload,
raw DOM, raw HTML, hidden prompt content, or provider raw errors.

## Audit Events

Safe audit events:

```text
ai_draft_review_created
ai_draft_edited
ai_draft_approved
ai_draft_rejected
ai_draft_blocked
ai_human_approval_required
ai_policy_blocked
```

Audit metadata stores identifiers, status, and safe reason codes only. It must
not store full draft text, raw prompt text, raw provider payload, raw webhook
payload, raw DOM, raw HTML, tokens, cookies, or client secrets.

## Send Boundary

Approval does not equal send. Approved draft state only means the draft passed
human review. Reply send still requires the existing explicit human reply API
request. AI does not auto-send.

When a reply send request includes a draft id, the backend verifies that the
draft is approved in the authenticated workspace before using it.

## Non-goals

This PR does not implement:

- Real AI provider integration.
- OpenAI, Gemini, Claude, or other AI SDK usage.
- Provider send automation.
- Autonomous follow-up recommendation.
- Dashboard send/resend/retry mutation beyond existing explicit reply send.
- Raw HTML rendering.
