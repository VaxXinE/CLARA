# CLARA P14 Internal Beta Final Security Review

## Security Decision

P14 internal beta rollout preparation is complete only after this PR validates.
The final security review covers internal beta readiness, not public launch and
not production deployment.

## Required Boundaries

- AuthContext and workspace membership remain source of truth.
- client-supplied workspaceId is not authoritative.
- Secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw
  HTML/raw DOM/raw prompts/payment data must not be included in handoff,
  feedback, logs, docs, or runbooks.
- billing/payment is deferred.
- provider/AI/outbound activation remains controlled.
- Feedback/support remains manual/local/repo-safe unless separately approved.
- no external support tool integration is activated.

Security review is required before broader rollout if any boundary changes.
