---
project: "CLARA"
artifact: "P12 Go / No-Go Checklist"
status: "active"
owner: "CLARA Product and Engineering"
classification: "go-no-go-checklist"
---

# CLARA P12 Go / No-Go Checklist

P12 is current. P12-PR-01 is current work. CLARA is not GA yet and is not
production deployed yet.

## Go Criteria

- P12 required documents exist and are reviewed.
- P12-PR-01 through P12-PR-05 are complete for GA.
- Release candidate validation and smoke matrix pass.
- Deployment checklist and rollback drill pass.
- Security boundaries remain unchanged.
- Support and feedback workflow is ready.
- Known limitations are accepted or resolved.
- Product, Engineering, Security, and Operations approve go.

## No-Go Criteria

- Any open blocker risk.
- Any unresolved data exposure risk.
- Any auth bypass, role escalation, or workspace isolation failure.
- Any unsafe billing, payment, provider, AI, quota, queue, alert, backup,
  restore, load-test, evidence export, role, session, compliance, enterprise, or
  audit retention activation.
- Any production config failure.
- Any missing rollback owner.
