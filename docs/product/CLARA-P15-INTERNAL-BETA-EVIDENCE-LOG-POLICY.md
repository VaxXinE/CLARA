# CLARA P15 Internal Beta Evidence Log Policy

## Status

P14 Internal Beta Rollout Preparation is complete. P14-PR-01 is complete.
P14-PR-02 is complete. P14-PR-03 is complete. P14-PR-04 is complete.
P14-PR-05 is complete. P14-PR-06 is complete. P15 Controlled Internal Beta
Execution is current. P15-PR-01 is complete. P15-PR-02 is complete.
P15-PR-03 is current.

controlled internal beta is internal-only. controlled internal beta is not
public SaaS launch. controlled internal beta is not production deployment claim
unless separately executed. billing/payment is deferred. provider/AI/outbound
activation remains controlled. feedback/support remains manual/local/repo-safe
unless separately approved. no external support tool integration is activated.
AuthContext and workspace membership remain source of truth.
client-supplied workspaceId is not authoritative.
secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw
HTML/raw DOM/raw prompts/payment data must not be included in evidence,
feedback, logs, docs, or runbooks. Known limitations must be reviewed before
broader rollout.

## Allowed Evidence

- Date, environment label, participant role, workspace-safe scenario name.
- Safe pass/fail status, blocker ID, and redacted screenshot reference.
- Safe notes about UX friction and workflow completion.

## Rejected Evidence

Tokens, cookies, auth headers, API keys, secrets, raw provider payloads, raw
webhook payloads, raw DOM, raw HTML, raw prompts, payment data, raw audit
metadata, and unnecessary customer-sensitive content are rejected.
