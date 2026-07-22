---
project: "CLARA"
artifact: "P12 Release Candidate Validation Matrix"
status: "active"
owner: "CLARA Product and Engineering"
classification: "release-candidate-validation"
---

# CLARA P12 Release Candidate Validation Matrix

## Status

P12-PR-01 is complete. P12-PR-02 is current.

CLARA is not GA yet.

CLARA is not production deployed yet.

Release Candidate is a validation gate, not a launch.

Smoke tests must not activate billing/payment/provider/AI/outbound side effects.

## Candidate Requirements

| Area | Required Validation | Blocks RC? | Evidence |
| --- | --- | --- | --- |
| API | format, typecheck, test, build, production dependency audit | yes | validator output and test counts |
| Dashboard | format, typecheck, test, build, production dependency audit | yes | validator output and test counts |
| Extension | format, typecheck, test, build, production dependency audit | yes | validator output and test counts |
| Auth | unauthenticated, provider-mode, mock-mode, membership boundary regressions | yes | test output |
| Workspace | client workspaceId is never authority and cross-workspace access remains safe | yes | test output |
| Local Demo | demo auth, conversation selection, composer, review-only AI, readiness panels | yes | smoke notes |
| Beta | limited, monitored, controlled, known-limitations-aware flow | yes | beta checklist |
| Security | no tokens, cookies, auth headers, secrets, raw payloads, raw prompts, or unsafe HTML | yes | checklist |
| Operational | readiness panels remain read-only; no deploy, queue, alert, backup, restore, load-test execution | yes | checklist |

## RC Result States

- `pass`: required validation passed.
- `blocker_fail`: Release Candidate status is denied.
- `accepted_known_limitation`: documented limitation accepted for Beta only.
- `deferred_issue`: non-blocking issue deferred with owner.
- `rollback_to_previous_candidate`: candidate is rejected and previous candidate remains active.
