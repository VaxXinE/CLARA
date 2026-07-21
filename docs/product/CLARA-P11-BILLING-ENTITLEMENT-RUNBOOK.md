---
project: "CLARA"
artifact: "P11 Billing Entitlement Runbook"
status: "draft"
owner: "CLARA Product, Engineering, Security, and Operations"
classification: "billing-readiness-runbook"
---

# CLARA P11 Billing Entitlement Runbook

## Purpose

This runbook is the P11-PR-05 operator checklist for Billing Readiness, Plan
Entitlement, Plan Catalog, Subscription Lifecycle, and Payment Provider
Boundary work.

This PR has no real billing execution.

## Plan Catalog Checklist

- Confirm Plan Catalog policy exists.
- Confirm plan comparison is documented.
- Confirm no plan mutation exists.
- Confirm no upgrade, downgrade, or cancellation behavior exists.

## Entitlement Checklist

- Confirm entitlement policy exists.
- Confirm feature gate policy exists.
- Confirm entitlement mutation is not implemented.
- Confirm hard enforcement is not implemented.

## Quota Linkage Checklist

- Confirm quota linkage is policy-only.
- Confirm no quota enforcement.
- Confirm no production quota blocking.
- Confirm readiness does not mutate usage counters.

## Payment Provider Future Rollout Checklist

- Pick a provider in a future decision record.
- Store secrets only in platform secret manager.
- Add provider webhook verification before webhook exposure.
- Add idempotency before any charge execution.
- Add audit events before payment state changes.
- Add rollback and incident runbooks before production use.

## Invoice Future Rollout Checklist

- Define invoice ownership and legal/tax scope.
- Add invoice idempotency.
- Add safe audit metadata.
- Add retention and export policy.
- Keep customer PII minimized.

## Subscription Lifecycle Future Rollout Checklist

- Define checkout, renewal, cancellation, proration, and tax/legal ownership.
- Require backend AuthContext for all admin actions.
- Require workspace scope from the server only.
- Add tests before any mutation endpoint exists.

## Security Checklist

- no payment provider integration
- no charging customers
- no invoice creation
- no checkout session
- no subscription mutation
- no plan mutation
- no entitlement mutation
- no quota enforcement
- no raw usage events
- no raw customer messages
- no raw provider payload
- no raw webhook payload
- no access token
- no refresh token
- no cookies
- no CRM mutation
- no outbound send
- no real AI provider

## Smoke Command

```bash
curl -sS http://127.0.0.1:3000/api/v1/billing/plan-entitlement/readiness \
  -H "x-mock-user-id: usr_demo_owner" \
  -H "x-mock-organization-id: org_demo" \
  -H "x-mock-workspace-id: wks_demo_sales" \
  -H "x-mock-role: owner"
```

Expected result: HTTP 200 with `phase: "p11"`, workspace-scoped output, and
all financial side-effect flags set to `false`.
