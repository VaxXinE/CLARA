---
project: "CLARA"
artifact: "P12 Deployment Cutover Go/No-Go Policy"
status: "active"
owner: "CLARA Product, Security, Engineering, Operations"
classification: "go-no-go-policy"
---

# CLARA P12 Deployment Cutover Go/No-Go Policy

P12-PR-01 is complete. P12-PR-02 is complete. P12-PR-03 is current.

CLARA is not GA yet. CLARA is not production deployed yet.

The deployment checklist is a readiness gate, not deployment execution.

Rollback drill is not automatic production rollback.

No real provider/payment/AI/outbound activation happens in this PR.

## No-Go / Rollback Blockers

- Auth failure.
- Workspace isolation failure.
- Data exposure risk.
- Raw token/secret exposure.
- Migration failure.
- Health/ready failure.
- Dashboard unable to connect API.
- Unsafe provider/payment/AI activation.
- Audit redaction failure.
- Critical smoke test failure.
- Unreviewed known limitation.

## Decisions

- `pass`: all required checks and evidence are complete.
- `no-go`: any blocker is present.
- `accepted known limitation`: explicitly reviewed and non-blocking for the target gate.
- `rollback`: rehearse or execute only through approved operational procedure outside this PR.
- `defer`: move non-blocking issue to P12-PR-04 support/feedback or P12-PR-05 final GA audit.
