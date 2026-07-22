---
project: "CLARA"
artifact: "P12 Beta / GA Scope + Release Criteria"
status: "active"
owner: "CLARA Product and Engineering"
classification: "release-readiness-policy"
---

# CLARA P12 Beta / GA Scope + Release Criteria

## Status

P1-P11 are complete. DOCS-REFRESH-BEFORE-P12, UI-POLISH-BEFORE-P12, and
PRE-P12-INTERACTION-ACTIVATION are complete. P12 is current, and P12-PR-01 is
current work.

P12-PR-01 is current work.

CLARA is not GA yet. CLARA is not production deployed yet. Beta and GA are
different gates: Beta is controlled validation; GA is public launch readiness.

Beta and GA are different gates.

## Beta Allowed Scope

- Limited user testing with known participants.
- Controlled workspace access.
- Local/demo-safe interaction flows.
- Simulated or readiness-only panels when clearly labeled.
- Human-approved workflows.
- Review-only AI surfaces.
- Provider readiness checks.
- Safe analytics summaries.
- Safe admin and compliance readiness surfaces.
- Documented known limitations.
- Manual operator review.

## Beta Blocked Scope

- Public self-serve launch.
- Real billing, payment provider integration, charging, invoice creation, or
  checkout session creation.
- Subscription, plan, entitlement, quota, or usage counter mutation.
- Production quota blocking.
- Autonomous AI action or real AI provider activation.
- Unmanaged provider send.
- Unsupported social provider scraping.
- Production load testing against real customer traffic.
- Raw data export or evidence export.
- Automated incident, backup, restore, retry, queue, alert, or load-test
  execution.
- Unreviewed role, session, billing, enterprise, compliance, or audit retention
  mutation.

## Beta Entry Criteria

- P12-PR-01 scope and criteria are approved.
- Security boundaries remain unchanged. Backend AuthContext remains
  authoritative, and client workspaceId is never authority.
- Local demo smoke passes.
- Release candidate validation plan exists.
- Known limitations are published.
- Support and feedback intake path is ready enough for limited users.
- No open blocker risk with data exposure, auth bypass, workspace isolation, or
  unsafe provider/payment/AI activation.
- No unsafe provider activation, unsafe payment activation, or unsafe AI
  activation.

## GA Criteria

- P12-PR-01 through P12-PR-05 complete.
- Release candidate validation complete.
- Smoke test matrix passes.
- Production deployment checklist passes.
- Rollback drill is documented and tested.
- Support, feedback, and known issues workflow is ready.
- Final GA audit and runbook are complete.
- Production config is validated.
- No open blocker risk.
- No unresolved data exposure risk.
- No unsafe provider, payment, or AI activation.
- Known limitations are accepted or resolved.
- Go/no-go is approved.

## Accepted Beta Risks

- Limited readiness-only surfaces may show non-production status.
- Simulated/local flows may be used for demonstration.
- Manual operator review remains required.
- Provider, AI, billing, enterprise, and reliability surfaces may remain
  readiness-only when labeled.

## GA Blocker Risks

- Auth bypass, role escalation, or workspace isolation failure.
- Token, cookie, Authorization header, secret, raw customer message, raw
  provider payload, raw webhook payload, raw prompt, raw telemetry, raw payment
  data, or raw audit metadata exposure.
- Real payment, provider send, autonomous AI, queue, alert, backup, restore,
  load-test, or evidence export activation without approved launch scope.
- Missing rollback plan or untested release candidate smoke matrix.

## Go / No-Go Policy

Go requires completed P12 gates, passing validation, accepted limitations, and
explicit approval. No-go is mandatory for any GA blocker risk, unsafe production
config, failing release smoke, or unresolved security boundary issue.
