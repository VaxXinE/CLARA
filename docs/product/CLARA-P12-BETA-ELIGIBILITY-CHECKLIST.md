---
project: "CLARA"
artifact: "P12 Beta Eligibility Checklist"
status: "active"
owner: "CLARA Product and Engineering"
classification: "release-readiness-checklist"
---

# CLARA P12 Beta Eligibility Checklist

P12 is current and P12-PR-01 is current work. CLARA is not GA yet and is not
production deployed yet.

## Required Before Beta

| Gate | Required State |
| --- | --- |
| Phase baseline | P1-P11 complete |
| Pre-P12 work | DOCS-REFRESH-BEFORE-P12, UI-POLISH-BEFORE-P12, and PRE-P12-INTERACTION-ACTIVATION complete |
| Scope | Beta / GA scope documented |
| Security | Backend AuthContext remains source of truth and client workspaceId is never authority |
| Demo | Local/demo-safe interactions pass validation |
| Data safety | No token, secret, raw payload, raw prompt, raw payment data, or raw customer message exposure |
| Limitations | Known limitations are documented |
| Support | Beta support and feedback intake path is defined |
| Operations | Manual operator review is available |

## Beta Eligibility Decision

Beta can proceed only when every required gate is pass or explicitly accepted as
a Beta risk. Any auth bypass, workspace isolation failure, data exposure, unsafe
provider activation, unsafe AI activation, or billing/payment activation blocks
Beta.

Unsafe provider activation blocks Beta.
