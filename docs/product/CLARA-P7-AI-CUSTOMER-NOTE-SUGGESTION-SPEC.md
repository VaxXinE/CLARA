---
title: "CLARA P7 AI Customer Note Suggestion Spec"
status: "implemented"
phase: "P7-PR-06"
---

# CLARA P7 AI Customer Note Suggestion Spec

AI Customer Note Suggestion creates suggestion-only customer note text for human review.

## Endpoint

```text
POST /api/v1/ai/customer-note-suggestions
```

Response includes suggested note, suggested tags, confidence level, safety flags, `requiresHumanApproval=true`, `actionStatus=suggestion_only`, context budget summary, policy version, and created timestamp.

## Rules

- Output is suggestion-only.
- `actionStatus` is always `suggestion_only`.
- `requiresHumanApproval` is always true.
- Backend AuthContext is the source of organization and workspace authority.
- Context is workspace-scoped and uses safe context builder plus prompt contract.
- Deterministic mock provider only; no real AI provider network call.
- no access token, no refresh token, no cookies, no raw provider payload, no raw webhook payload, no raw DOM, no raw HTML, and no raw prompt may appear in responses, logs, or audit metadata.
- no auto-write and no automatic customer note write.
- No CRM/customer mutation from AI summary/note.

## Audit

```text
ai_customer_note_suggestion_requested
ai_customer_note_suggestion_generated
ai_customer_note_suggestion_blocked
ai_human_approval_required
ai_policy_blocked
```

## Non-goals

- No note persistence.
- No customer profile mutation.
- No task or scheduler creation.
- No send/reply action.
