---
project: "CLARA"
artifact: "P3 Gmail Scheduler Operator Hardening Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-11"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-SCHEDULER-OPERATOR-STATUS-SPEC.md"
  - "./CLARA-P3-GMAIL-SCHEDULER-MANUAL-TICK-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Scheduler Operator Hardening

## Purpose

Harden Gmail scheduler operator routes with safe audit events, existing request guards, and production smoke guidance.

## Operator Routes

```text
GET /api/v1/integrations/gmail/scheduler/status
POST /api/v1/integrations/gmail/scheduler/tick
```

Both routes require authentication, block viewer role, and derive organization/workspace from server-side `AuthContext`.

## Audit Events

```text
gmail.scheduler.status_read
gmail.scheduler.tick_requested
gmail.scheduler.tick_completed
gmail.scheduler.tick_disabled
gmail.scheduler.tick_skipped
gmail.scheduler.tick_failed
```

Audit metadata is allowlisted:

```text
provider
status
reason_code
checked_account_count
scheduled_job_count
skipped_count
failed_count
correlation_id
```

## Production Smoke Guidance

1. Confirm scheduler is disabled by default with the status route.
2. Run one manual tick only from an authenticated owner/agent operator session.
3. Confirm response contains safe status/counters and correlation ID.
4. Confirm audit logs contain scheduler action records without token material.
5. Roll back by disabling Gmail scheduler wiring/config and redeploying the previous API image.

## Forbidden Data

- No access tokens.
- No refresh tokens.
- No Authorization headers.
- No Gmail raw payloads.
- No provider raw error bodies.
- No OAuth client secret.

## Non-Goals

- No external cron integration.
- No queue adapter or distributed lock.
- No Gmail outbound send workflow.
- No AI draft generation or AI auto-send.
