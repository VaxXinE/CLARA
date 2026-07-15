# CLARA P7 AI Follow-up Recommendation Spec

## Purpose

AI Follow-up Recommendation adds recommendation-only guidance for operators.
It helps decide whether to follow up, ask for missing information, escalate, or
take no follow-up action.

This is not automation. It does not create tasks, schedule reminders, send
messages, mutate CRM/customer records, or call a real AI provider.

## Endpoint Contract

`POST /api/v1/ai/follow-up-recommendations`

Request:

```json
{
  "conversationId": "conv_demo_budi_stock",
  "customerId": "cust_demo_budi",
  "taskType": "follow_up_suggestion",
  "operatorInstruction": "Optional human instruction",
  "urgency": "normal",
  "maxRecommendations": 3
}
```

Response:

```json
{
  "data": {
    "recommendation": {
      "recommendationId": "ai_follow_up_conv_demo_1",
      "type": "follow_up_recommendation",
      "conversationId": "conv_demo_budi_stock",
      "customerId": "cust_demo_budi",
      "recommendations": [],
      "summary": null,
      "safetyFlags": [],
      "requiresHumanApproval": true,
      "blockedReason": null,
      "safeReasonCode": "ai_follow_up_recommendation_generated",
      "contextBudgetSummary": {},
      "policyVersion": "p7-ai-context-v1",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "ai": {
      "provider": "mock",
      "model": "mock-clara-follow-up-recommendation-v1"
    }
  }
}
```

## Allowed Recommendation Types

- `follow_up_later`
- `ask_for_missing_information`
- `escalate_to_human`
- `suggest_reply`
- `review_customer_context`
- `mark_needs_attention`
- `no_follow_up_needed`

Each item has `actionStatus: "recommendation_only"` and
`requiresHumanApproval: true`.

## Blocked Recommendation Types

- `auto_send_message`
- `auto_schedule_task`
- `auto_mutate_customer`
- `auto_change_pipeline`
- `auto_assign_agent`
- `auto_connect_provider`
- `auto_disconnect_provider`
- `update_role`
- `invite_user`
- `delete_user`
- `billing_change`
- `cross_workspace_action`

## Safety Rules

- Uses backend AuthContext only; client workspace IDs are not authority.
- The request is workspace-scoped through server-side authorization.
- Uses the P7 AI Context Builder and AI Prompt Contract.
- Uses deterministic mock provider only.
- recommendation-only means no auto-send, no automatic task creation, and no
  automatic scheduler.
- Human review is required before any real action.
- No real OpenAI, Gemini, Claude, or other LLM provider call is made.
- No raw prompt is returned.
- No access token, no refresh token, no cookies, no raw provider payload, no raw
  webhook payload, no raw DOM, and no raw HTML are returned.

## Audit Events

- `ai_follow_up_recommendation_requested`
- `ai_follow_up_recommendation_generated`
- `ai_follow_up_recommendation_blocked`
- `ai_human_approval_required`
- `ai_policy_blocked`

Audit metadata stores safe IDs, counts, reason codes, and provider label only.
It does not store full prompt, raw customer body, provider payload, tokens, or
cookies.

## Non-goals

- No task product.
- No reminder or scheduler automation.
- No autonomous provider action execution.
- No CRM/customer mutation.
- No conversation summary or customer notes. That is P7-PR-06.
