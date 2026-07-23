# CLARA P15 Internal Runtime Smoke Execution Runbook

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

## Execution

1. Run API smoke checks from a local/internal environment.
2. Run Dashboard smoke checks against the intended internal API base URL.
3. Run Extension smoke checks with local-safe snapshot/companion behavior only.
4. Record evidence with the P15 evidence log template.
5. Stop and escalate if auth, workspace scope, or sensitive-data boundaries fail.

Evidence must not include secrets/tokens/cookies/auth headers/raw provider
payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data. Evidence
should minimize customer-sensitive data.

## Non-Goals

- No public SaaS launch.
- No production deployment claim unless separately executed.
- No billing/payment activation.
- No provider/AI/outbound activation.
- No email, Slack, Discord, webhook, push notification, or support tool send.
- No background job, queue execution, heavy analytics export, or report generation.
