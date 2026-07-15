---
title: "CLARA P7 AI Summary Notes Security Runbook"
status: "implemented"
phase: "P7-PR-06"
---

# CLARA P7 AI Summary Notes Security Runbook

Use this runbook for AI Conversation Summary and AI Customer Note Suggestion incidents.

## Normal State

- Features are review-only and suggestion-only.
- `requiresHumanApproval` must be true.
- Customer note suggestions must return `actionStatus=suggestion_only`.
- Backend AuthContext is authoritative.
- Data access is workspace-scoped.

## Security Checks

- no access token
- no refresh token
- no cookies
- no raw provider payload
- no raw webhook payload
- no raw DOM
- no raw HTML
- no raw prompt
- no auto-write
- no automatic customer note write
- no CRM/customer mutation from AI summary/note

## Audit Events

```text
ai_conversation_summary_requested
ai_conversation_summary_generated
ai_conversation_summary_blocked
ai_customer_note_suggestion_requested
ai_customer_note_suggestion_generated
ai_customer_note_suggestion_blocked
ai_human_approval_required
ai_policy_blocked
```

## Incident Handling

If prompt injection is suspected, confirm the response is blocked with a safe reason code and no raw customer content is logged.

If output claims a note/profile was already changed, treat it as blocked policy output and verify no customer record changed.

If secret exposure is suspected, rotate affected credentials, disable the AI route if needed, inspect audit metadata, and escalate security review.

## Rollback

Disable dashboard usage by hiding the panel or remove route registration. No database rollback is required because this PR does not persist summaries or notes.
