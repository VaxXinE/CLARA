---
project: "CLARA"
artifact: "P12 Launch Risk Register"
status: "active"
owner: "CLARA Product and Engineering"
classification: "risk-register"
---

# CLARA P12 Launch Risk Register

## Accepted Beta Risks

| Risk | Beta Position | GA Position |
| --- | --- | --- |
| Simulated/local flows | Allowed when clearly labeled | Must be accepted as limitation or replaced |
| Readiness-only panels | Allowed when read-only | Must remain labeled or be completed |
| Manual operator review | Required | Must have documented operating model |
| Limited provider readiness | Allowed | Blocks GA if unsafe or unclear |
| Known limitations | Allowed when documented | Must be accepted or resolved |

## GA Blocker Risks

| Risk | Why It Blocks |
| --- | --- |
| Auth or workspace isolation failure | Customer data can cross tenant boundaries |
| Token/secret/raw payload exposure | Sensitive data leak |
| Billing/payment activation | Customer financial impact |
| Autonomous AI or auto-send activation | Unreviewed customer-facing action |
| Unmanaged provider send | Compliance and deliverability risk |
| Missing rollback drill | Unsafe production recovery |
| Missing support workflow | Beta/GA incidents cannot be handled |

## Risk Review Rule

Any blocker risk forces no-go until resolved or explicitly descoped from the
release.
