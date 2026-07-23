# CLARA P15 Controlled Internal Beta Roadmap

## Status

P14 Internal Beta Rollout Preparation is complete. P14-PR-01 is complete.
P14-PR-02 is complete. P14-PR-03 is complete. P14-PR-04 is complete.
P14-PR-05 is complete. P14-PR-06 is complete. P15 Controlled Internal Beta
Execution is current. P15-PR-01 is complete. P15-PR-02 is current.

runtime smoke execution is internal-only. runtime smoke execution is not public
SaaS launch. runtime smoke execution is not production deployment claim unless
separately executed.

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

## P15 Sequence

| PR        | Scope                                                      | Status   |
| --------- | ---------------------------------------------------------- | -------- |
| P15-PR-01 | Controlled Internal Beta Execution Scope + Operating Rules | complete |
| P15-PR-02 | Internal Runtime Smoke Execution + Evidence Log            | current  |

## P15-PR-01 Deliverables

- Controlled internal beta execution scope exists.
- Internal beta operating rules exist.
- Internal beta participant rules exist.
- Internal beta evidence log policy exists.
- Internal beta issue capture policy exists.
- Internal beta escalation rules exist.
- Internal beta daily/weekly operating checklist exists.
- Non-launch guardrails remain explicit.

## P15-PR-02 Deliverables

- Internal runtime smoke execution runbook exists.
- Internal runtime evidence log template exists.
- API, Dashboard, and Extension smoke execution checklists exist.
- Evidence privacy boundary exists.
- Evidence retention/manual handling policy exists.
- Smoke evidence remains local/internal and sanitized.
