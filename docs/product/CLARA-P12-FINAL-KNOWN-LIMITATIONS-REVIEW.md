---
project: "CLARA"
artifact: "P12 Final Known Limitations Review"
status: "active"
owner: "CLARA Product and Support"
classification: "known-limitations-review"
---

# CLARA P12 Final Known Limitations Review

P12-PR-01 is complete. P12-PR-02 is complete. P12-PR-03 is complete.
P12-PR-04 is complete. P12-PR-05 is current.

Known limitations must be accepted or resolved before real GA launch. P12
completion means release readiness complete, not production deployed and not
public GA launch happened.

## Required Review

| Limitation class | GA action |
| --- | --- |
| Beta-only UX limitation | Accept with clear release note or fix. |
| Provider readiness-only limitation | Keep disabled or approve future provider work. |
| AI review-only limitation | Keep review-only or approve future AI provider work. |
| Billing readiness-only limitation | Keep non-billing or approve future payment work. |
| Operational readiness limitation | Accept only if no S0/S1 or data exposure risk remains. |
| Support workflow limitation | Must still triage beta issues safely. |
| Security limitation | Fix before GA if it affects auth, workspace isolation, raw sensitive data, secrets, or unsafe activation. |

Provider/payment/AI/outbound activation remains restricted unless future
approved work enables it. Readiness-only/review-only/simulated/demo-safe
boundaries remain intact.
