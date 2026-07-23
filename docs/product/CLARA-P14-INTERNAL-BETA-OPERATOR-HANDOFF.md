# CLARA P14 Internal Beta Operator Handoff

## Operator Scope

Operators may run controlled internal usage checks, review CRM workflows, collect
manual feedback, and monitor known limitations. Internal beta go-live is
controlled internal usage only.

## Operator Guardrails

- AuthContext and workspace membership remain source of truth.
- client-supplied workspaceId is not authoritative.
- Feedback/support remains manual/local/repo-safe unless separately approved.
- no external support tool integration is activated.
- provider/AI/outbound activation remains controlled.
- billing/payment is deferred.

Do not include secrets/tokens/cookies/auth headers/raw provider payload/raw
webhook payload/raw HTML/raw DOM/raw prompts/payment data in handoff, feedback,
logs, docs, or runbooks.
