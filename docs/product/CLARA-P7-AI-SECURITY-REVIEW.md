# CLARA P7 AI Security Review

## Threat Model

Assets:

- customer conversations
- workspace membership
- AI context and output
- audit logs
- provider tokens and secrets

Trust boundaries:

- browser/dashboard to API
- extension to API
- backend AuthContext to workspace-scoped repositories
- deterministic mock AI providers to future real provider boundary

## Attack Scenarios

- prompt injection asks to ignore policy.
- output claims an action was completed.
- request asks for token, cookie, raw provider payload, raw webhook payload, raw DOM, or raw HTML.
- client supplies workspace id as authority.
- dashboard renders AI output as HTML.
- extension captures provider session material.

## Mitigations

- backend AuthContext is authoritative.
- all business access is workspace-scoped.
- P7 uses no real LLM provider.
- P7 uses no AI SDK.
- AI outputs stay suggestion-only, review-only, recommendation-only, or evaluation-only.
- `requiresHumanApproval` gates restricted output.
- audit metadata is allowlisted.
- dashboard must not use unsafe HTML rendering.
- extension remains preview/copy/manual only.

## Residual Risks

- Real provider integration needs a new review.
- P8 CRM & Workflow Intelligence must add explicit write policies.
- Model evaluation and prompt hardening must be revisited before external LLM
  traffic.

## Current P7 Security Requirements

- no auto-send.
- no automatic customer note write.
- no automatic task creation.
- no automatic scheduler.
- no autonomous provider action.
- no access token.
- no refresh token.
- no cookies.
- no raw provider payload.
- no raw webhook payload.
- no raw DOM.
- no raw HTML.
