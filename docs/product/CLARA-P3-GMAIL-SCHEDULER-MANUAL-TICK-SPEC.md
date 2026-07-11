---
project: "CLARA"
artifact: "P3 Gmail Scheduler Manual Tick Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-11"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-SCHEDULER-OPERATOR-STATUS-SPEC.md"
  - "./CLARA-P3-GMAIL-SCHEDULER-OPERATOR-HARDENING-SPEC.md"
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-SCHEDULER-RUNTIME-BOUNDARY-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Scheduler Manual Tick

## Purpose

Expose a safe operator-only endpoint to run one Gmail inbound scheduler tick through the existing runtime boundary.

## Endpoint

```text
POST /api/v1/integrations/gmail/scheduler/tick
```

## Access Rules

- Requires authenticated API user.
- Owner and agent roles may trigger one manual tick.
- Viewer role is blocked.
- Organization and workspace scope come only from server-side `AuthContext`.
- `organization_id`, `workspace_id`, and unknown body fields are rejected by request validation.

## Optional Body

```json
{
  "max_accounts_per_tick": 10,
  "max_messages_per_account": 25
}
```

Values are clamped by the runtime and scheduler boundaries.

## Safe Response Fields

```text
status
checked_account_count
scheduled_job_count
skipped_count
failed_count
started_at
finished_at
reason_code
scheduler_running
correlation_id
```

## Audit Behavior

When audit logging is wired, the route records:

- `gmail.scheduler.tick_requested`
- `gmail.scheduler.tick_completed`
- `gmail.scheduler.tick_disabled`
- `gmail.scheduler.tick_skipped`
- `gmail.scheduler.tick_failed`

Metadata is allowlisted and contains only provider, status, reason code, safe counters, actor, organization, workspace, and correlation ID.

## Forbidden Response Data

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
