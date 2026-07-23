# CLARA P15 Dashboard Smoke Execution Checklist

## Status

P14 Internal Beta Rollout Preparation is complete. P15 Controlled Internal Beta
Execution is current. P15-PR-01 is complete. P15-PR-02 is current.

runtime smoke execution is internal-only. runtime smoke execution is not public
SaaS launch. runtime smoke execution is not production deployment claim unless
separately executed. billing/payment is deferred. provider/AI/outbound
activation remains controlled. feedback/support remains manual/local/repo-safe
unless separately approved. no external support tool integration is activated.
AuthContext and workspace membership remain source of truth.
client-supplied workspaceId is not authoritative.

## Checklist

- Dashboard loads against the local/internal API base URL.
- Owner, agent, and viewer demo roles remain visible for local/internal smoke.
- Viewer/read-only mode remains non-mutating.
- Error states are safe and do not expose provider internals.
- UI does not render raw HTML or use `dangerouslySetInnerHTML`.
- Dashboard evidence excludes secrets, tokens, cookies, auth headers, raw DOM,
  raw HTML, raw prompts, raw provider payloads, raw webhook payloads, and payment
  data.

Evidence must not include secrets/tokens/cookies/auth headers/raw provider
payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data. Evidence
should minimize customer-sensitive data.
