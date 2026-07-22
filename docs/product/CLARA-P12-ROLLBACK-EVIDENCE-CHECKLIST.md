---
project: "CLARA"
artifact: "P12 Rollback Evidence Checklist"
status: "active"
owner: "CLARA Operations"
classification: "rollback-evidence"
---

# CLARA P12 Rollback Evidence Checklist

P12-PR-01 is complete. P12-PR-02 is complete. P12-PR-03 is current.

CLARA is not GA yet. CLARA is not production deployed yet.

Rollback drill is not automatic production rollback.

No real provider/payment/AI/outbound activation happens in this PR.

## Evidence Requirements

- Branch/commit SHA.
- Release candidate identifier.
- Previous release candidate reference.
- Validator output.
- Test counts.
- Build outputs.
- npm audit 0 vulnerabilities result.
- Config readiness check.
- Migration readiness check.
- Rollback rehearsal result.
- Post-deployment smoke result.
- Known limitations review.
- Go/no-go approval.
- Incident communication note.

Evidence must not include secrets, tokens, cookies, Authorization headers, raw
provider payloads, raw webhook payloads, raw customer messages, raw prompts,
payment data, raw telemetry, or raw logs.
