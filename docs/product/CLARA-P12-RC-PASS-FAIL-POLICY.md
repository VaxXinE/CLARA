---
project: "CLARA"
artifact: "P12 RC Pass / Fail Policy"
status: "active"
owner: "CLARA Product and Engineering"
classification: "rc-pass-fail-policy"
---

# CLARA P12 RC Pass / Fail Policy

## Result Types

| Result | Meaning |
| --- | --- |
| Required pass | Required gate passed and evidence is recorded |
| Blocker fail | RC status denied until fixed |
| Accepted known limitation | Non-GA limitation accepted for Beta only |
| Deferred issue | Non-blocking issue assigned to owner |
| Rollback to previous candidate | Candidate rejected; previous candidate remains active |

## Blocker Failures

- Failed validator, typecheck, test, build, or production dependency audit.
- Auth/session bypass.
- Workspace isolation failure.
- Token, cookie, Authorization header, secret, raw payload, raw prompt, raw
  payment data, raw telemetry, raw DOM, or raw HTML exposure.
- Production deployment claim or execution.
- Billing/payment/provider/AI/outbound side effect activation.
- Queue job, retry, alert, backup, restore, incident automation, load-test, or
  evidence export execution.

## Accepted Known Limitations

Readiness-only, review-only, simulated, or demo-safe behavior can be accepted
only when documented and not presented as GA-ready.
