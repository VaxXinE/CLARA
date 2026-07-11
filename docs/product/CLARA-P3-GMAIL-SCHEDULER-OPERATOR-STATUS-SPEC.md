---
project: "CLARA"
artifact: "P3 Gmail Scheduler Operator Status Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-11"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-INBOUND-SCHEDULER-LIFECYCLE-SPEC.md"
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-SCHEDULER-RUNTIME-BOUNDARY-SPEC.md"
  - "./CLARA-P3-GMAIL-SCHEDULER-OPERATOR-HARDENING-SPEC.md"
  - "./CLARA-P3-GMAIL-SCHEDULER-MANUAL-TICK-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Scheduler Operator Status

## Purpose

Expose a safe read-only API for operators to inspect the Gmail inbound scheduler runtime state without exposing provider secrets or raw Gmail payloads.

## Endpoint

```text
GET /api/v1/integrations/gmail/scheduler/status
```

## Access Rules

- Requires authenticated API user.
- Owner and agent roles may read status.
- Viewer role is blocked.
- Organization and workspace scope come only from server-side `AuthContext`.
- Request body, query, and client-provided organization/workspace values are not used for authorization.

## Safe Response Fields

```text
scheduler_enabled
scheduler_running
interval_ms
max_accounts_per_tick
max_messages_per_account
last_started_at
last_stopped_at
last_tick_started_at
last_tick_finished_at
last_tick_status
last_reason_code
```

Optional fields may be omitted when no lifecycle or tick has occurred yet.

## Audit Behavior

When audit logging is wired, status reads record `gmail.scheduler.status_read` with safe provider/status/reason metadata only.

## Forbidden Response Data

- No access tokens.
- No refresh tokens.
- No Authorization headers.
- No Gmail raw payloads.
- No provider raw error bodies.
- No OAuth client secret.

## Related Operator Action

Manual tick is exposed separately by:

```text
POST /api/v1/integrations/gmail/scheduler/tick
```

It returns a bounded safe tick summary and does not start the background scheduler interval.

## Non-Goals

- No external cron integration.
- No queue adapter or distributed lock.
- No Gmail outbound send workflow.
- No AI draft generation or AI auto-send.
