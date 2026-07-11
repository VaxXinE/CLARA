---
project: "CLARA"
artifact: "P3 Gmail Inbound Final Hardening Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-12"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-ORCHESTRATOR-SPEC.md"
  - "./CLARA-P3-GMAIL-MESSAGE-NORMALIZATION-SPEC.md"
  - "./CLARA-P3-GMAIL-SCHEDULER-OPERATOR-HARDENING-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Inbound Final Hardening

## Purpose

Lock the Gmail inbound path with final safety regressions before moving to later provider work.

This pack covers:

- inbound fetch response safety,
- normalization and materialization safety,
- manual sync summary safety,
- scheduler/operator readiness notes,
- logging redaction for provider raw payload/error fields.

## Regression Contract

Gmail inbound API responses and persisted inbound records must never include:

- access tokens,
- refresh tokens,
- Authorization headers,
- OAuth client secrets,
- raw Gmail payloads,
- raw provider error bodies,
- raw attachment bytes.

Inbound sync must not create:

- AI draft rows,
- reply draft rows,
- outbound messages,
- outbound delivery records.

## Safe Result Shape

Manual sync and scheduler summaries may include only safe operational data:

- status,
- reason_code from a safe enum,
- counters,
- scoped provider_account_id,
- safe sync state timestamps,
- safe scheduler status/config values.

Provider raw errors must be converted to safe reason codes such as:

- `connection_unhealthy`,
- `provider_fetch_failed`,
- `message_fetch_failed`,
- `no_messages`,
- `sync_completed`.

## Production Readiness Runbook

### Disabled-By-Default Check

Confirm scheduler config is disabled unless intentionally enabled:

```bash
grep GMAIL_INBOUND_SYNC_SCHEDULER_ENABLED services/api/.env
```

Expected local-safe default:

```text
GMAIL_INBOUND_SYNC_SCHEDULER_ENABLED=false
```

### Scheduler Status Smoke

Call the status route from an authenticated owner/agent operator session:

```bash
curl -sS "$CLARA_API_BASE_URL/api/v1/integrations/gmail/scheduler/status"
```

Expected safe response:

```text
scheduler_enabled
scheduler_running
interval_ms
max_accounts_per_tick
max_messages_per_account
last_* timestamps if present
```

The response must not include tokens, Authorization headers, raw Gmail payloads, or provider raw errors.

### Manual Tick Smoke

Run one bounded manual tick only from an authenticated owner/agent operator session:

```bash
curl -sS -X POST "$CLARA_API_BASE_URL/api/v1/integrations/gmail/scheduler/tick" \
  -H "content-type: application/json" \
  -d '{"max_accounts_per_tick":1,"max_messages_per_account":1}'
```

Expected safe response:

```text
status
checked_account_count
scheduled_job_count
skipped_count
failed_count
reason_code if applicable
correlation_id
```

## Troubleshooting

- `connection_unhealthy`: verify provider account status, token vault state, and profile verification health.
- `provider_fetch_failed`: check Gmail API mode/config and provider availability without logging raw provider response bodies.
- `message_fetch_failed`: inspect safe correlation ID logs; do not dump raw Gmail payloads.
- `no_messages`: verify account labels/query and last sync cursor.
- `rate limited`: wait for the configured rate window or reduce operator/manual tick frequency.

## Rollback Notes

- Disable scheduler config first.
- Stop manual tick usage.
- Roll back the API image if sync summaries or logs show unsafe data.
- Review migrations separately before database rollback.
- Preserve correlation IDs and safe audit events for incident notes.

## Security Checklist

- No Gmail OAuth client secrets in repo.
- No access or refresh tokens in logs/responses.
- No raw Gmail payload persistence.
- No attachment body byte persistence.
- No frontend-trusted workspace or role.
- Viewer remains blocked from operator routes.
- AI draft still requires explicit AI draft endpoint.
- Outbound send still requires explicit reply/send endpoint and is not part of Gmail inbound.

## Non-Goals

- No Gmail outbound send.
- No SMTP or IMAP.
- No queue/retry worker.
- No distributed lock.
- No frontend UI change.
- No AI draft generation or auto-send.
