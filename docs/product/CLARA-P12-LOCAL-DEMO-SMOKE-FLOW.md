---
project: "CLARA"
artifact: "P12 Local Demo Smoke Flow"
status: "active"
owner: "CLARA Product and Engineering"
classification: "local-demo-smoke"
---

# CLARA P12 Local Demo Smoke Flow

## Preconditions

- Local API runs with safe local/demo config.
- Dashboard points to local API.
- Demo auth is enabled only for local/demo/test.
- Seed data is available.

## Flow

1. Open dashboard.
2. Confirm owner, agent, and viewer role switcher behavior.
3. Select a conversation.
4. Confirm customer context and activity timeline update.
5. Type in composer.
6. Copy and clear local draft.
7. Generate/review AI suggestion only where allowed.
8. Confirm viewer remains read-only.
9. Confirm readiness-only panels expose no mutation controls.

## Expected Result

Local demo interaction works without real provider calls, real AI provider
calls, billing/payment activation, outbound auto-send, queue execution, backup,
restore, alert, load-test, or production deployment.
