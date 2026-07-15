# CLARA P7 AI Reply Suggestion Security Runbook

## Purpose

This runbook validates the AI Reply Suggestion path before demo or staging use.

## Required Checks

Run:

```bash
cd services/api
npm run typecheck
npm run test -- ai-reply-suggestion
npm run build

cd ../../apps/dashboard
npm run typecheck
npm run test -- AiReplySuggestionPanel client
npm run build

cd ../../apps/extension
npm run typecheck
npm run test -- p7-ai-reply-suggestion
npm run build
```

## Security Expectations

- Suggestions are suggestion-only.
- `requiresHumanApproval` must always be `true`.
- No auto-send exists in the suggestion route or dashboard panel.
- Backend AuthContext controls organization, workspace, and role.
- Client-supplied workspace fields are rejected or ignored safely.
- Untrusted customer content is passed through the Prompt Contract and AI Context Builder.
- Unsafe prompt injection attempts return safe `ai_policy_blocked` or `ai_prompt_injection_flagged` behavior.
- Responses include no access token, no refresh token, no cookies, no raw provider payload, no raw webhook payload, no raw DOM, and no raw HTML.

## Audit Review

Confirm these events can be emitted with safe metadata only:

- `ai_suggestion_requested`
- `ai_suggestion_generated`
- `ai_policy_blocked`
- `ai_human_approval_required`

## Rollback

If suggestions behave unsafely:

1. Disable dashboard usage of the suggestion panel.
2. Remove access to `POST /api/v1/ai/reply-suggestions` at the routing layer.
3. Keep manual reply and existing AI draft flow intact.
4. Review audit events for unsafe metadata before re-enabling.
