# CLARA P7 AI Follow-up Recommendation Security Runbook

## Production Gate

AI Follow-up Recommendation is recommendation-only. It requiresHumanApproval,
uses backend AuthContext, and stays workspace-scoped.

Before enabling:

- Confirm no real LLM provider SDK or key is configured.
- Confirm no auto-send path exists.
- Confirm no automatic task creation exists.
- Confirm no automatic scheduler or reminder creation exists.
- Confirm no CRM/customer mutation is triggered by recommendation output.

## Incident Checks

Prompt injection suspicion:

- Check for `ai_follow_up_recommendation_blocked`.
- Check `safeReasonCode`.
- Do not copy raw customer content into incident notes.

Unsafe context blocked:

- Confirm no access token appears in API responses.
- Confirm no refresh token appears in API responses.
- Confirm no cookies appear in API responses.
- Confirm no raw provider payload appears in API responses.
- Confirm no raw webhook payload appears in API responses.
- Confirm no raw DOM appears in API responses.
- Confirm no raw HTML appears in API responses.

Suspicious recommendation output:

- Block if output claims an action was already completed.
- Block if output suggests autonomous send, task creation, scheduler creation,
  provider connection changes, role changes, user invites, deletion, or billing
  mutation.

## Rollback

- Disable the route at deployment/router layer if needed.
- Revert the application release if unsafe behavior is observed.
- Preserve audit logs with sanitized IDs and reason codes only.
- Escalate to security review for AI prompt/policy bypass.
