---
project: "CLARA"
artifact: "Final P11 Production Runbook"
status: "draft"
owner: "CLARA Operations"
classification: "p11-runbook"
---

# Final P11 Production Runbook

## Scope

This runbook supports Final P11 Scale / Reliability / Billing readiness. It is
readiness not billing launch.

## Operator Checks

1. Confirm API, dashboard, and extension builds pass.
2. Confirm production runtime config validation passes.
3. Confirm readiness endpoints require auth and derive scope from Backend
   AuthContext.
4. Confirm client workspaceId is never authority.
5. Confirm frontend role guard is UX-only.
6. Confirm outputs are workspace-scoped and aggregate-first.

## Readiness Smoke

- Queue / Job Reliability: verify Retry, Idempotency, and Dead Letter policies
  are visible.
- Rate Limit, Quota, Usage Metering: verify readiness summaries are visible
  without quota enforcement.
- Observability, SLO Dashboard, Alert Readiness, Error Budget: verify safe
  summaries are visible without alert execution.
- Billing Readiness and Plan Entitlement: verify no payment provider
  integration, no charging customers, no invoice creation, and no subscription
  mutation.
- Performance, Load Test, Capacity: verify no heavy load test in normal
  validation and no production target by default.

## Safe Response Requirements

Responses must include no raw telemetry, no raw logs, no raw traces, no raw
metric events, no raw usage events, no raw payment data, no raw customer
messages, no raw provider payload, no raw webhook payload, no access token, no
refresh token, and no cookies.

## Rollback Notes

If a readiness page or endpoint fails, roll back the application image or config
only. Do not enable payment, quota enforcement, CRM mutation, outbound send, or
real AI provider behavior as a workaround.

## P12 Handoff

P11-PR-07 hands readiness evidence to P12 Beta / GA Release Readiness. P12 must
add separate approval gates before real billing, quota blocking, load execution,
provider calls, or customer-impacting automation.
