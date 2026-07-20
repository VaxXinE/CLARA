---
project: "CLARA"
artifact: "P11 Usage Metering Billing Readiness Policy"
status: "draft"
owner: "CLARA Product, Engineering, Security, and Operations"
classification: "billing-readiness-policy"
---

# CLARA P11 Usage Metering Billing Readiness Policy

## Usage Metering Readiness

Usage metering readiness is workspace-scoped and aggregate-first. Safe usage
metadata may include coarse counts, timestamps, channel categories, and plan
readiness labels.

Usage metering must not include raw customer messages, raw provider payload,
raw webhook payload, raw audit metadata, raw evidence, access token, refresh
token, cookies, auth headers, API keys, or secrets.

## Billing Readiness

Billing readiness is not billing launch.

P11-PR-01 explicitly adds:

- No payment provider integration.
- No charging customers.
- No invoice creation.
- No subscription mutation.
- No quota enforcement.
- No entitlement mutation.
- No plan upgrade, downgrade, cancellation, or tax/legal billing logic.
- No financial compliance claim.

## Security Boundary

Backend AuthContext remains required. Billing and usage readiness must not trust
client-provided organization_id, workspace_id, role, user_id, or plan data.
