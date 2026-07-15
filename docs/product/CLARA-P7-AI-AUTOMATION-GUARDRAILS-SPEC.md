# CLARA P7 AI Automation Guardrails Spec

AI Automation Guardrails define the safety boundary for current and future AI
workflow features. This is an evaluation-only layer: it classifies requested AI
actions, returns a safe decision, records audit events, and never executes the
action.

## Scope

- Evaluate requested AI action type.
- Return `allowed`, `requires_human_approval`, or `blocked`.
- Return `requiresHumanApproval` when the action needs explicit operator review.
- Keep every decision workspace-scoped through backend AuthContext.
- Record `ai_automation_guardrail_evaluated`.
- Record `ai_automation_action_blocked` when policy blocks an action.
- Record `ai_automation_abuse_detected` when abuse wording is detected.

## Security Rules

- no auto-send.
- no automatic task creation.
- no automatic scheduler.
- no automatic customer note write.
- no access token in request, response, audit, or logs.
- no refresh token in request, response, audit, or logs.
- no cookies in request, response, audit, or logs.
- no raw provider payload.
- no raw webhook payload.
- no raw DOM.
- no raw HTML.
- Frontend role, organization, and workspace values are UX only.
- Authorization stays server-side.

## Action Taxonomy

Allowed low-risk actions are preview-only activities such as conversation
summaries, reply suggestions, follow-up suggestions, customer note suggestions,
operator coaching suggestions, safe context classification, and draft previews.

Restricted actions require human approval before a later workflow can continue.
Examples include creating or editing drafts, approving drafts, copying text to
composer, follow-up task previews, note previews, and attention markers.

Blocked actions include sending messages, provider mutation, user/role changes,
billing changes, token/cookie requests, raw payload access, cross-workspace
actions, hidden actions, browser provider session automation, and policy bypass.

## Endpoint

```http
POST /api/v1/ai/automation-guardrails/evaluate
```

The endpoint requires authentication and derives organization/workspace from
backend AuthContext only.

## Response

```json
{
  "data": {
    "guardrail": {
      "decisionId": "ai_auto_decision_1",
      "decision": "requires_human_approval",
      "actionType": "create_draft",
      "riskLevel": "medium",
      "blockedReason": null,
      "safeReasonCode": "ai_automation_human_approval_required",
      "safetyFlags": [],
      "requiresHumanApproval": true,
      "actionStatus": "evaluation_only",
      "policyVersion": "p7-ai-automation-guardrails-v1",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

## Non-goals

- No autonomous execution.
- No real AI provider integration.
- No provider send.
- No customer mutation.
- No task scheduler mutation.
- No dashboard execution controls.
