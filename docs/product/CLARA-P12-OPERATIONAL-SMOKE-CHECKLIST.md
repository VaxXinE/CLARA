---
project: "CLARA"
artifact: "P12 Operational Smoke Checklist"
status: "active"
owner: "CLARA Product and Operations"
classification: "operational-smoke-checklist"
---

# CLARA P12 Operational Smoke Checklist

## Required Checks

- Validator output is captured.
- API, Dashboard, and Extension build outputs are captured.
- Production dependency audit outputs are captured.
- Readiness-only panels remain read-only.
- Release Candidate evidence is stored without secrets or raw payloads.
- Known limitations are reviewed.
- No-go blockers are reviewed.
- P12-PR-03 production deployment checklist and rollback drill are identified as
  the next gate.

## Forbidden During Operational Smoke

- Production deployment.
- Payment or billing activation.
- Real provider network activation.
- Real AI provider calls.
- Outbound auto-send.
- Queue job, retry, alert, backup, restore, incident automation, load-test, or
  evidence export execution.
