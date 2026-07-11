---
title: CLARA P3 Gmail Outbound Persistence Route Spec
status: implemented
phase: P3
last_updated: 2026-07-12
---

# CLARA P3 Gmail Outbound Persistence Route Spec

## Scope

P3-PR-38 adds a backend-only Gmail outbound send route that reuses the existing
Gmail outbound send service boundary and email outbound delivery persistence.

The route is for explicit human/operator send intent only. It does not create
AI drafts, auto-send AI output, run inbound sync, or call real Google/Gmail
network endpoints.

## Endpoint

```text
POST /api/v1/integrations/gmail/outbound/send
```

Request body:

```json
{
  "provider_account_id": "gmail_account_demo",
  "conversation_id": "conv_demo_budi_stock",
  "to": ["customer@example.test"],
  "cc": ["copy@example.test"],
  "bcc": ["audit@example.test"],
  "subject": "Follow up",
  "body": "Hello, we are checking this and will reply shortly.",
  "idempotency_key": "gmail_outbound_idem_001"
}
```

Response example:

```json
{
  "status": "simulated",
  "provider": "gmail",
  "provider_message_id": "gmail_msg_generated",
  "outbound_delivery_id": "email_outbound_generated",
  "reason_code": "simulated_send_completed",
  "sent_at": "2026-07-12T00:00:00.000Z",
  "correlation_id": "request-correlation-id"
}
```

Failure result example:

```json
{
  "status": "failed",
  "provider": "gmail",
  "outbound_delivery_id": "email_outbound_generated",
  "reason_code": "provider_send_failed",
  "correlation_id": "request-correlation-id"
}
```

## Authorization

- The route requires authenticated API access.
- `owner` and `agent` can call the route through the existing `reply:send`
  permission.
- `viewer` is blocked server-side.
- `organization_id`, `workspace_id`, `role`, and `actor_user_id` are derived
  from backend AuthContext only.
- Client-provided `organization_id` or `workspace_id` fields are rejected by the
  strict body schema.

## Validation

The route validates:

- `provider_account_id` is present.
- `to` has at least one valid email address.
- `cc` and `bcc` are optional valid email arrays.
- Total recipients across `to`, `cc`, and `bcc` are capped.
- `subject` is capped.
- `body` is required, trimmed by the service, and capped.
- Unknown fields are rejected.

## Persistence

When `conversation_id` is provided, the service writes a safe
`email_outbound_deliveries` record with:

- scoped `organization_id` and `workspace_id`
- `conversation_id`
- backend `actor_user_id`
- `provider = gmail`
- `provider_message_id` when available
- `status`
- safe `failure_code` when provider send fails
- allowlisted metadata only

Idempotency remains scoped by `organization_id`, `workspace_id`, and
`idempotency_key`.

## Security Guardrails

The route and persistence layer must never return or store:

- access tokens
- refresh tokens
- Authorization headers
- client secrets
- raw Gmail payloads
- raw provider error bodies
- attachment bytes

Provider errors are collapsed to safe reason codes. The current implementation
uses the simulated Gmail outbound client only.

## Non-Goals

This PR does not implement:

- real Gmail outbound send
- Gmail dashboard send UI
- SMTP or IMAP
- queue, retry, or distributed locking
- AI draft generation
- AI auto-send
- attachment sending
- raw provider payload persistence
