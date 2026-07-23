# CLARA P14 Final Internal Beta Go-Live Runbook

## Status

P14-PR-01 is complete. P14-PR-02 is complete. P14-PR-03 is complete.
P14-PR-04 is complete. P14-PR-05 is complete. P14-PR-06 is current.

P14 internal beta rollout preparation is complete only after this PR validates.
Internal beta go-live is controlled internal usage only.

## Go-Live Steps

1. Confirm internal workspace membership and role assignments.
2. Confirm P14 go/no-go checklist is signed off.
3. Confirm internal seed/import data is approved and workspace-scoped.
4. Confirm feedback/support remains manual/local/repo-safe unless separately approved.
5. Confirm known limitations are reviewed before broader rollout.
6. Run the P14 final validator and store the pass output.

## Non-Launch Boundary

Internal beta is not public SaaS launch. Internal beta is not production
deployment claim unless separately executed. Internal beta is not a production
deployment claim unless separately executed. billing/payment is deferred.
provider/AI/outbound activation remains controlled. Feedback/support remains
manual/local/repo-safe unless separately approved. no external support tool
integration is activated.

AuthContext and workspace membership remain source of truth. client-supplied
workspaceId is not authoritative.

Secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw
HTML/raw DOM/raw prompts/payment data must not be included in handoff, feedback,
logs, docs, or runbooks.
secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw
HTML/raw DOM/raw prompts/payment data must not be included in handoff, feedback,
logs, docs, or runbooks.
