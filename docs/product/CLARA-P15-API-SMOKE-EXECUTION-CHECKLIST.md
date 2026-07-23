# CLARA P15 API Smoke Execution Checklist

## Status

P14 Internal Beta Rollout Preparation is complete. P15 Controlled Internal Beta
Execution is current. P15-PR-01 is complete. P15-PR-02 is complete.
P15-PR-03 is current.

runtime smoke execution is internal-only. runtime smoke execution is not public
SaaS launch. runtime smoke execution is not production deployment claim unless
separately executed. billing/payment is deferred. provider/AI/outbound
activation remains controlled. feedback/support remains manual/local/repo-safe
unless separately approved. no external support tool integration is activated.
AuthContext and workspace membership remain source of truth.
client-supplied workspaceId is not authoritative.

## Checklist

- `GET /health` returns safe health output.
- `GET /ready` returns safe readiness output.
- Protected endpoints reject unauthenticated requests safely.
- Workspace-scoped endpoints use Backend AuthContext and active membership.
- Viewer read-only behavior remains non-mutating.
- API evidence excludes secrets, tokens, auth headers, raw provider payloads,
  raw webhook payloads, raw HTML, raw DOM, raw prompts, raw audit metadata, and
  payment data.

Evidence must not include secrets/tokens/cookies/auth headers/raw provider
payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data. Evidence
should minimize customer-sensitive data.
