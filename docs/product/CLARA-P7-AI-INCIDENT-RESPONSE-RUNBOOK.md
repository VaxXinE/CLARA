# CLARA P7 AI Incident Response Runbook

Incident Response for AI assistant misuse, prompt injection, unsafe output, or
unexpected automation behavior.

## Prompt Injection

1. Capture correlation id and safe reason code.
2. Confirm `ai_policy_blocked` or `ai_automation_abuse_detected` exists.
3. Preserve sanitized audit metadata only.
4. Patch policy/tests before re-enabling the affected path.

## Unsafe Output

1. Disable the affected UI action if needed.
2. Verify output stayed suggestion-only, review-only, or evaluation-only.
3. Confirm `requiresHumanApproval` was not bypassed.
4. Add regression coverage.

## Suspected Secret Exposure

Check for:

- no access token.
- no refresh token.
- no cookies.
- no raw provider payload.
- no raw webhook payload.
- no raw DOM.
- no raw HTML.

If any exposure is confirmed, rotate affected credentials and open a security
incident.

## Suspected Auto-send Or Mutation

P7 must have no auto-send, no automatic customer note write, no automatic task
creation, no automatic scheduler, no CRM/customer mutation from AI, and no
provider/user/role/billing mutation from AI.

## Cross-workspace Suspicion

Backend AuthContext is authoritative. Client workspace input is not authority.
Treat any cross-workspace result as security-severity until disproven.

## Communication

Use sanitized summaries. Do not paste raw prompts, provider payloads, tokens, or
customer secrets into public channels.
