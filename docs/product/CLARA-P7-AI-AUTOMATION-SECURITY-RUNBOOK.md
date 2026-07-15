# CLARA P7 AI Automation Security Runbook

This runbook is the p7 production readiness gate for AI Automation Guardrails.
The feature is evaluation-only and must not execute customer, provider, task, or
admin mutations.

## Local Smoke

```bash
cd services/api
npm run test -- ai-automation
```

Example safe check:

```bash
curl -sS http://127.0.0.1:3000/api/v1/ai/automation-guardrails/evaluate \
  -H 'content-type: application/json' \
  -H 'x-mock-user-id: usr_demo_agent' \
  -H 'x-mock-organization-id: org_demo' \
  -H 'x-mock-workspace-id: wks_demo_sales' \
  -H 'x-mock-role: agent' \
  -d '{"requestedAction":"suggest_reply","sourceFeature":"future_automation"}'
```

## Required Checks

- AI Automation Guardrails endpoint requires auth.
- `requiresHumanApproval` is returned for restricted actions.
- Abuse Tests block bypass attempts.
- backend AuthContext is the only authorization source.
- Decisions are workspace-scoped.
- `ai_automation_guardrail_evaluated` is recorded.
- `ai_automation_action_blocked` is recorded for blocked actions.
- `ai_automation_abuse_detected` is recorded for abuse.

## Security Checklist

- no auto-send.
- no automatic task creation.
- no automatic scheduler.
- no automatic customer note write.
- no access token.
- no refresh token.
- no cookies.
- no raw provider payload.
- no raw webhook payload.
- no raw DOM.
- no raw HTML.
- No real AI provider keys in repo.
- No autonomous provider action.
- No dashboard mutation control for future automation.

## Rollback

Disable any dashboard exposure first, then revert the route/service commit. Since
this feature has no database migration and does not execute actions, rollback is
code-only.
