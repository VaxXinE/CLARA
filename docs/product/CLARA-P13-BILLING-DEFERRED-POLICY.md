---
project: "CLARA"
artifact: "P13 Billing Deferred Policy"
status: "active"
owner: "CLARA Product and Engineering"
classification: "policy"
---

# CLARA P13 Billing Deferred Policy

P12 release-readiness is complete. P13 is current. P13 focuses internal CRM
usage. P13-PR-01 is complete. P13-PR-02 is complete. P13-PR-03 is complete.
Internal CRM usage is the focus. billing/payment is deferred. Billing/payment
remains deferred. CLARA is not production deployed yet. CLARA is not public GA
launched yet.

CLARA is not production deployed yet. CLARA is not public GA launched yet.

## Policy

P13 must not activate public SaaS monetization. Customer CRUD is internal
workspace-scoped and exists to make CLARA usable by an internal team first.
Notes/timeline are workspace-scoped internal CRM features. lifecycle/owner
assignment are workspace-scoped internal CRM features. owner assignment requires
valid workspace membership. Backend AuthContext is the authority for all
workspace access. Timeline/audit must not expose raw provider/audit/secrets.

Deferred until a future explicitly approved phase:

- payment provider integration
- checkout sessions
- invoice creation
- customer charging
- subscription mutation
- plan mutation
- entitlement mutation
- production quota blocking

## Validation

P13 validators and tests scan customer CRUD runtime paths to ensure internal CRM
activation does not add billing/payment side effects.
