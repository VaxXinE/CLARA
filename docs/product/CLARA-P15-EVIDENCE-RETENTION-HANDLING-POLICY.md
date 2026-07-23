# CLARA P15 Evidence Retention Handling Policy

## Status

P14 Internal Beta Rollout Preparation is complete. P15 Controlled Internal Beta
Execution is current. P15-PR-01 is complete. P15-PR-02 is complete.
P15-PR-03 is complete. P15-PR-04 is current.

runtime smoke execution is internal-only. runtime smoke execution is not public
SaaS launch. runtime smoke execution is not production deployment claim unless
separately executed. billing/payment is deferred. provider/AI/outbound
activation remains controlled. feedback/support remains manual/local/repo-safe
unless separately approved. no external support tool integration is activated.
AuthContext and workspace membership remain source of truth.
client-supplied workspaceId is not authoritative.

## Handling

- Keep smoke evidence in repo-safe docs, local notes, or approved internal
  issue records only.
- Retain only summarized evidence needed to prove pass/fail and follow-up.
- Delete or redact accidental sensitive captures immediately.
- Do not forward evidence into email, Slack, Discord, webhook, push
  notification, or external support tools unless separately approved.

Evidence must not include secrets/tokens/cookies/auth headers/raw provider
payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data. Evidence
should minimize customer-sensitive data.
