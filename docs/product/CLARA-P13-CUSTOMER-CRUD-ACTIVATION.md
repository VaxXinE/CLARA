---
project: "CLARA"
artifact: "P13 Customer CRUD Activation"
status: "active"
owner: "CLARA Product and Engineering"
classification: "product-spec"
---

# CLARA P13 Customer CRUD Activation

## Scope

P12 release-readiness is complete. P13 is current. P13 focuses internal CRM
usage. billing/payment is deferred. CLARA is not production deployed yet. CLARA
is not public GA launched yet.

P13-PR-01 activates internal customer management for workspace operators:

- list workspace-scoped customers
- open safe customer detail
- create a customer with safe fields
- update safe customer fields
- search and filter customers
- show loading, empty, error, and success states
- audit create/update with allowlisted metadata only

## Safe Customer Fields

Customer CRUD is internal workspace-scoped. Backend AuthContext is the
authority. The first activation uses existing safe schema fields:

- `displayName`
- `contactIdentifier`
- `source`
- `status`
- `notesSummary`

The API rejects unknown fields. It also rejects empty required names and invalid
status/source values. The dashboard validates for usability, but backend
validation and authorization remain authoritative.

## Non-Goals

This PR does not add billing/payment, payment SDKs, subscription mutation,
quota enforcement, real AI provider calls, autonomous AI actions, real external
provider calls, production deployment automation, or dashboard mutation outside
customer create/update.
