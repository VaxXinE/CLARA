---
title: "CLARA P7 AI Conversation Summary Spec"
status: "implemented"
phase: "P7-PR-06"
---

# CLARA P7 AI Conversation Summary Spec

AI Conversation Summary gives an operator a review-only summary of a scoped conversation.

## Endpoint

```text
POST /api/v1/ai/conversation-summaries
```

Response includes summary text, key points, open questions, risk flags, safety flags, `requiresHumanApproval=true`, context budget summary, policy version, and created timestamp.

## Rules

- Output is review-only.
- Backend AuthContext is the source of organization and workspace authority.
- Context is workspace-scoped and built through the P7 safe context builder.
- Prompt contract output is sent only to the deterministic mock provider.
- No real AI provider call exists in this PR.
- no access token, no refresh token, no cookies, no raw provider payload, no raw webhook payload, no raw DOM, no raw HTML, and no raw prompt may appear in responses, logs, or audit metadata.
- no auto-write and no automatic customer note write.
- No automatic task creation, scheduler/reminder creation, or message send happens from a summary.

## Audit

```text
ai_conversation_summary_requested
ai_conversation_summary_generated
ai_conversation_summary_blocked
ai_human_approval_required
ai_policy_blocked
```

## Non-goals

- No OpenAI/Gemini/Claude SDK.
- No customer note persistence.
- No CRM/customer mutation.
- No automatic action execution.
