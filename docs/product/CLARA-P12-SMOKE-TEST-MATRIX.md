---
project: "CLARA"
artifact: "P12 Smoke Test Matrix"
status: "active"
owner: "CLARA Product and Engineering"
classification: "smoke-test-matrix"
---

# CLARA P12 Smoke Test Matrix

Release Candidate is a validation gate, not a launch. CLARA is not GA yet and
is not production deployed yet.

| Area | Flow | Actor/role | Preconditions | Steps | Expected result | Evidence | Blocks RC? | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| API | health/readiness | operator | local API running | call `/health` and `/ready` | safe 200 responses | response log | yes | no provider calls |
| Dashboard | local workspace load | owner/agent/viewer | API running, demo auth | open dashboard and switch roles | UI loads and viewer is read-only | screenshot or test log | yes | demo-safe only |
| Extension | boundary smoke | operator | extension tests available | run extension tests | manual-assisted boundary holds | test output | yes | no auto-send |
| Auth | unauthenticated protected route | anonymous | API running | request protected API without auth | safe 401 | response log | yes | no stack trace |
| Workspace | cross-workspace guard | owner | seeded demo data | request out-of-scope resource | safe 404/403 per contract | test output | yes | client workspaceId ignored |
| Local Demo | conversation/composer | owner/agent | seeded local data | select conversation, type, copy/clear draft | visible local interaction feedback | screenshot/test output | yes | no real send required |
| Beta | limited user flow | beta user | approved workspace access | complete known safe workflow | works with known limitations | beta result row | yes | no public self-serve |
| Security | sensitive data redaction | operator | validation run | scan/test outputs | no token, cookie, auth header, secret, raw payload, raw HTML, raw prompt | validator output | yes | must pass |
| Operational | readiness-only panels | operator | dashboard loaded | inspect readiness panels | read-only, no execute/deploy/export/send controls | screenshot/test output | yes | no side effects |

Smoke tests must not activate billing/payment/provider/AI/outbound side effects.
