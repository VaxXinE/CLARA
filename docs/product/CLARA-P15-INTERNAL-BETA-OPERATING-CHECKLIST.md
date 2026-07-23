# CLARA P15 Internal Beta Operating Checklist

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

## Daily Checklist

- Confirm approved environment, participant list, role scope, and known
  limitations.
- Run agreed internal scenarios and record safe pass/fail evidence.
- Triage blockers and stop on security or workspace isolation concerns.

## Weekly Checklist

- Review issue trends, unresolved blockers, known limitations, and go/no-go
  status before expanding participants.
