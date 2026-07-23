# CLARA P15 Evidence Privacy Boundary

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

## Boundary

Evidence may include safe command names, pass/fail status, timestamps, component
names, safe reason codes, and issue links. Evidence must not include
secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw
HTML/raw DOM/raw prompts/payment data. Evidence should minimize
customer-sensitive data.
evidence must not include secrets/tokens/cookies/auth headers/raw provider
payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data.

Screenshots must be cropped or redacted before sharing outside the internal
beta working group. Raw logs must be summarized, not pasted wholesale.
