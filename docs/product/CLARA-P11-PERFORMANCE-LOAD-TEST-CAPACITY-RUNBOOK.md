---
project: "CLARA"
artifact: "P11 Performance Load Test Capacity Runbook"
status: "draft"
owner: "CLARA Product and Engineering"
classification: "runbook"
---

# CLARA P11 Performance / Load Test / Capacity Runbook

## Local Smoke Checklist

Use synthetic local traffic only:

1. Start API and dashboard locally.
2. Call `/health` and `/ready`.
3. Call `GET /api/v1/reliability/performance-capacity/readiness`.
4. Confirm the dashboard Performance / Load Test / Capacity panel renders.
5. Confirm response safety flags show readiness not execution.

## Manual Baseline Checklist

- Use a non-production target.
- Use synthetic users and synthetic payloads only.
- Keep provider, payment, AI, and outbound integrations disabled.
- Record aggregate latency, throughput, error rate, and timeout behavior.
- Do not store raw telemetry, raw logs, raw traces, raw metric events, raw
  customer messages, raw provider payload, or raw webhook payload.

## Manual Stress Checklist

Stress tests are manual only and must not be part of normal validation or CI.
Do not target production by default. Stop the test if error rate, queue backlog,
database pressure, or rate-limit behavior becomes unsafe.

## Manual Soak Checklist

Soak tests are manual only. Use synthetic traffic, bounded duration, explicit
operator approval, safe logging, and rollback notes.

## Production Safety Checklist

- no heavy load test in normal validation
- no production target by default
- no external provider call
- no payment provider integration
- no charging customers
- no invoice creation
- no subscription mutation
- no CRM mutation
- no outbound send
- no real AI provider
- no access token, no refresh token, no cookies, no secrets in output

## Rollback Considerations

This PR adds readiness views only. Rollback is limited to removing the
readiness route, dashboard panel, docs, and tests. No customer data, billing
state, CRM state, quota state, usage counter, load test job, or benchmark job
is mutated.
