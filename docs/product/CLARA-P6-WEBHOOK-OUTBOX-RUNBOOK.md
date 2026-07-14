---
project: "CLARA"
artifact: "P6 Webhook Outbox Runbook"
status: "implemented"
owner: "CLARA Engineering and Security"
classification: "operator-runbook"
---

# CLARA P6 Webhook Outbox Runbook

## Local Validation

Run:

```bash
bash scripts/validate-p6-webhook-outbox-hardening.sh
```

The validator checks API, dashboard, extension, repository structure, production runtime config, Docker compose config, expected files, and secret/payload redaction patterns.

## Webhook Smoke Checks

Expected behavior:

- WhatsApp challenge with invalid verify token fails closed.
- WhatsApp inbound POST without valid signature fails closed.
- Unsupported provider webhook policy fails closed.
- Duplicate webhook replay returns safe duplicate handling.
- Request size and rate guardrails remain active through existing API middleware.
- Client-supplied `organization_id` or `workspace_id` is not authorization truth.

## Outbox Smoke Checks

Expected behavior:

- new delivery starts at `queued`
- active send moves to `sending`
- success moves to `sent`
- transient failure before max attempts moves to `retrying`
- transient failure at max attempts moves to `dead_letter`
- permanent failure moves to `failed`
- idempotency prevents `no double-send`

## Security Checklist

- Do not commit `.env` files or provider secrets.
- Do not log access tokens, refresh tokens, cookies, Authorization headers, client secrets, raw provider payload, or provider raw errors.
- Keep the `no raw provider payload` rule in webhook responses, outbound status DTOs, audit metadata, and logs.
- Keep backend AuthContext as the source of truth for authorization.
- Keep all dedup and idempotency behavior workspace-scoped.
- Keep provider webhooks fail-closed until their official verification path is implemented.

## Rollback

This PR adds policy helpers, regression tests, docs, and a validator only. If a regression appears, revert the branch commit and rerun the previous P6 validators.
