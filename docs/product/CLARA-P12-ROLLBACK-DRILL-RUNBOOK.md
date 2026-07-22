---
project: "CLARA"
artifact: "P12 Rollback Drill Runbook"
status: "active"
owner: "CLARA Product and Engineering"
classification: "rollback-readiness"
---

# CLARA P12 Rollback Drill Runbook

P12-PR-01 is complete. P12-PR-02 is complete. P12-PR-03 is current.

CLARA is not GA yet.

CLARA is not production deployed yet.

Rollback drill is not automatic production rollback.

The rollback drill is documented/rehearsed only, not a real production rollback.

No real provider/payment/AI/outbound activation happens in this PR.

## Drill Steps

1. Record the current release candidate identifier, branch, and commit SHA.
2. Record the previous release candidate reference.
3. Review migration rollback/forward-fix decision before any schema change.
4. Review config rollback for API, Dashboard, Extension, Auth, CORS, TLS, DNS, rate limit, and logging.
5. Review dashboard static asset rollback target.
6. Review API build rollback target.
7. Review extension build rollback target.
8. Rehearse post-rollback smoke tests without touching production infrastructure.
9. Record incident communication owner and escalation path.
10. Capture evidence and known limitations.

## Rollback Blockers

Rollback is required or no-go remains active when auth fails, workspace
isolation fails, data exposure risk appears, token/secret exposure appears,
migration fails, `/health` or `/ready` fails, dashboard cannot connect to API,
unsafe provider/payment/AI activation appears, audit redaction fails, critical
smoke test fails, or an unreviewed known limitation is found.

## Evidence

Capture branch/commit SHA, release candidate identifier, validator output, test
counts, build outputs, npm audit 0 vulnerabilities result, config readiness
check, migration readiness check, rollback rehearsal result, post-deployment
smoke result, known limitations review, and go/no-go approval.
