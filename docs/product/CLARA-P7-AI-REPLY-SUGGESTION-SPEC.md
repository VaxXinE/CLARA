# CLARA P7 AI Reply Suggestion Spec

## Status

AI Reply Suggestion v1 is implemented as a suggestion-only workflow.

It uses:

- backend AuthContext as the only authority for user, organization, workspace, and role;
- workspace-scoped conversation lookup;
- the P7 AI Context Builder;
- the P7 Prompt Contract;
- a deterministic mock provider only.

## API

```text
POST /api/v1/ai/reply-suggestions
```

Request:

```json
{
  "conversationId": "conv_demo_budi_stock",
  "customerId": "cust_demo_budi",
  "taskType": "reply_suggestion",
  "tone": "friendly",
  "maxLength": 800,
  "operatorInstruction": "Keep it concise."
}
```

Response includes:

- `suggestionId`
- `type: reply_suggestion`
- `suggestedText`
- `summary`
- `recommendedNextAction`
- `safetyFlags`
- `requiresHumanApproval: true`
- `blockedReason`
- `safeReasonCode`
- `contextBudgetSummary`
- `policyVersion`

## Security Contract

- AI Reply Suggestion is suggestion-only.
- There is no auto-send behavior.
- AI draft and reply send remain separate explicit human actions.
- Customer messages are treated as untrusted customer content.
- Cross-workspace conversation access returns safe not-found behavior.
- The backend AuthContext is the only source of workspace and role authority.
- The response must include no access token, no refresh token, no cookies, no raw provider payload, no raw webhook payload, no raw DOM, and no raw HTML.
- Provider output that claims an action was completed is blocked.
- Provider output that asks to bypass human review is blocked.

## Audit Events

Safe audit events:

- `ai_suggestion_requested`
- `ai_suggestion_generated`
- `ai_policy_blocked`
- `ai_human_approval_required`

Audit metadata is allowlisted and must not include prompt text, message body, tokens, cookies, provider raw errors, raw provider payload, raw webhook payload, raw DOM, or raw HTML.

## Non-Goals

- No real AI provider integration.
- No OpenAI, Gemini, Claude, or other SDK.
- No provider send action.
- No autonomous provider action.
- No auto-send.
- No final approval workflow beyond human review notice.
