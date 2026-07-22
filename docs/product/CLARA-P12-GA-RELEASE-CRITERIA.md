---
project: "CLARA"
artifact: "P12 GA Release Criteria"
status: "active"
owner: "CLARA Product and Engineering"
classification: "ga-release-policy"
---

# CLARA P12 GA Release Criteria

CLARA is not GA yet. CLARA is not production deployed yet. GA requires the full
P12 closeout, not only local demo readiness or Beta approval.

## Mandatory GA Criteria

- P12-PR-01 through P12-PR-05 complete.
- Release candidate validation complete.
- Smoke test matrix pass.
- Production deployment checklist pass.
- Rollback drill documented and tested.
- Support, feedback, and known issues workflow ready.
- Final GA audit and runbook complete.
- Security boundaries unchanged.
- Production config validated.
- No open blocker risk.
- No unresolved data exposure risk.
- No unsafe provider, payment, or AI activation.
- Known limitations accepted or resolved.
- Go/no-go approved.

## Not GA-Ready Yet

- Public self-serve launch.
- Billing launch, payment provider integration, charging, invoice creation, or
  checkout session creation.
- Autonomous AI action or real AI provider activation.
- Unmanaged provider sends.
- Production automation for queue jobs, alerts, backup, restore, incident
  execution, heavy load tests, or evidence export.
- Any role, permission, session, billing, enterprise, compliance, or audit
  retention mutation not separately approved.

## GA Blockers

GA is blocked by failing smoke tests, failed rollback drill, unsafe production
config, unresolved security risk, unresolved data exposure risk, or unclear
ownership for support/feedback/known issues.
