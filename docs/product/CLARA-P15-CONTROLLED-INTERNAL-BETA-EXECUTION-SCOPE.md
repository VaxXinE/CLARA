# CLARA P15 Controlled Internal Beta Execution Scope

## Status

P14 Internal Beta Rollout Preparation is complete. P14-PR-01 is complete.
P14-PR-02 is complete. P14-PR-03 is complete. P14-PR-04 is complete.
P14-PR-05 is complete. P14-PR-06 is complete. P15 Controlled Internal Beta
Execution is current. P15-PR-01 is complete. P15-PR-02 is complete.
P15-PR-03 is current.

Controlled internal beta execution is internal-only. controlled internal beta is
internal-only. Controlled internal beta is not public SaaS launch. controlled
internal beta is not public SaaS launch. Controlled internal beta is not
production deployment claim unless separately executed. controlled internal
beta is not production deployment claim unless separately executed.
billing/payment is deferred. provider/AI/outbound activation remains controlled.
Feedback/support remains manual/local/repo-safe unless separately approved.
feedback/support remains manual/local/repo-safe unless separately approved. No
external support tool integration is activated. no external support tool
integration is activated.

AuthContext and workspace membership remain source of truth.
client-supplied workspaceId is not authoritative. Secrets/tokens/cookies/auth
headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw
prompts/payment data must not be included in evidence, feedback, logs, docs, or
runbooks. secrets/tokens/cookies/auth headers/raw provider payload/raw webhook
payload/raw HTML/raw DOM/raw prompts/payment data must not be included in
evidence, feedback, logs, docs, or runbooks. Known limitations must be reviewed
before broader rollout.

## Execution Scope

- Run CLARA with approved internal participants only.
- Use local/dev-safe or separately approved internal environments only.
- Capture evidence with redacted screenshots, safe issue IDs, dates, roles, and
  workflow names.
- Use backend AuthContext and workspace membership as the authority for access.
- Pause the beta when auth, workspace isolation, secret handling, or unsafe
  outbound behavior is suspected.

## Non-Goals

No billing, payment SDK, public launch, production deployment claim, production
deployment automation, production rollback automation, real provider activation,
real AI activation, real outbound activation, external support integration,
notification send, background job, queue execution, heavy export, or runtime
feature activation is included in P15-PR-01.
