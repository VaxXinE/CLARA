---
project: "CLARA"
artifact: "P12 RC Validation Runbook"
status: "active"
owner: "CLARA Product and Engineering"
classification: "rc-validation-runbook"
---

# CLARA P12 RC Validation Runbook

## Purpose

This runbook defines how a build becomes a Release Candidate. Release Candidate
is a validation gate, not a launch.

## Steps

1. Confirm branch and commit SHA.
2. Run `scripts/validate-p12-release-candidate-smoke-matrix.sh`.
3. Record API, Dashboard, and Extension test counts.
4. Record build outputs.
5. Record `npm audit --omit=dev --audit-level=high` result for each package.
6. Run local demo smoke flow.
7. Run Beta smoke flow if Beta users are available.
8. Complete security and operational smoke checklists.
9. Review known limitations and no-go blockers.
10. Link P12-PR-03 deployment checklist as next gate.

## Hard Stop

Stop validation on any auth bypass, workspace isolation failure, data exposure,
unsafe production deployment, payment/billing activation, provider activation,
real AI provider call, outbound auto-send, queue/alert/backup/restore/load-test
execution, or unsafe HTML rendering.
