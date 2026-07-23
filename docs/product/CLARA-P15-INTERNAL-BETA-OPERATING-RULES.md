# CLARA P15 Internal Beta Operating Rules

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

## Rules

- Run only approved internal workflows and approved roles.
- Record each session with date, participant role, workspace, scenario, result,
  issue links, and safe evidence references.
- Do not paste raw customer messages, provider payloads, prompts, auth headers,
  tokens, cookies, or payment data into evidence.
- Do not activate provider, AI, outbound, support, billing, deployment, queue,
  or background job behavior from beta feedback.
- Stop and escalate on security, tenant isolation, role, data exposure, or
  unsafe outbound concerns.
