# CLARA P7 Final AI Assistant Runbook

AI Assistant Runbook for P7 production-readiness checks.

## Daily Checks

- Confirm AI endpoints require authentication.
- Confirm audit events are written for AI requests, blocks, and approval gates.
- Confirm blocked outputs remain safe and readable.
- Confirm no real LLM provider or AI SDK has been added.

## Weekly Checks

```bash
cd services/api
npm run test -- p7-final-ai

cd ../../apps/dashboard
npm run test -- p7-final-ai

cd ../extension
npm run test -- p7-final-ai
```

## Endpoint Validation

- Reply suggestions remain suggestion-only.
- Draft review remains review-only until human approval.
- Follow-up recommendations remain recommendation-only.
- Automation guardrails remain evaluation-only.
- `requiresHumanApproval` remains present on human-gated outputs.
- backend AuthContext remains the source of authority.
- All access remains workspace-scoped.

## Safe Audit Review

Inspect event names and safe reason codes only. Do not copy customer content,
raw prompts, or provider payloads into tickets.

Required safe boundaries:

- no auto-send.
- no automatic customer note write.
- no automatic task creation.
- no automatic scheduler.
- no access token.
- no refresh token.
- no cookies.
- no raw provider payload.
- no raw webhook payload.
- no raw DOM.
- no raw HTML.

## Rollback

Disable dashboard exposure first, then revert the AI feature commit. P7 has no
real LLM provider, no AI SDK, and no external provider credentials to rotate.

## Escalation

Escalate suspected prompt injection, unsafe output, secret exposure, or
cross-workspace behavior to engineering and security before any further release.
