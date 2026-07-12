---
title: CLARA P3 Gmail Reply Send E2E Smoke Spec
status: implemented
phase: P3
last_updated: 2026-07-12
---

# CLARA P3 Gmail Reply Send E2E Smoke Spec

## Scope

P3-PR-39 wires Gmail outbound send into the existing reply send flow when it is
explicitly configured server-side and the scoped conversation source is
`email` or Gmail-like.

This is still simulated/local-test Gmail outbound only. No real Google/Gmail
network call is made.

## Reply Send Flow

The existing endpoint remains:

```text
POST /api/v1/conversations/:conversation_id/reply
```

The route still accepts only:

```json
{
  "body": "Human reviewed reply body",
  "draft_id": "optional_draft_id"
}
```

The route does not accept `organization_id`, `workspace_id`, role, provider
tokens, or provider payloads from the client.

## Gmail Path Conditions

Gmail outbound is used only when all conditions are true:

- request is authenticated,
- role has `reply:send`,
- conversation is found through scoped organization/workspace lookup,
- reply body is valid,
- `ReplyService` was explicitly configured with Gmail outbound send,
- conversation source is `email` or Gmail-like,
- customer contact identifier is an email address accepted by the Gmail
  outbound send boundary.

Non-Gmail conversations keep the existing simulated reply provider.

## Safe Response

Successful Gmail simulated send returns the normal reply response plus safe
send metadata:

```json
{
  "data": {
    "message": {
      "id": "msg_generated",
      "conversation_id": "conv_demo_sari_followup",
      "direction": "outbound",
      "body": "Human reviewed reply body",
      "sender": {
        "type": "user",
        "id": "usr_demo_agent",
        "name": "Agent Demo"
      },
      "created_at": "2026-07-12T00:00:00.000Z"
    },
    "send": {
      "provider": "gmail",
      "status": "simulated",
      "provider_message_id": "gmail_msg_generated",
      "outbound_delivery_id": "email_outbound_generated",
      "reason_code": "simulated_send_completed",
      "sent_at": "2026-07-12T00:00:00.000Z",
      "correlation_id": "request-correlation-id"
    }
  }
}
```

Provider failure returns safe send status without creating a local reply
message:

```json
{
  "data": {
    "send": {
      "provider": "gmail",
      "status": "failed",
      "outbound_delivery_id": "email_outbound_generated",
      "reason_code": "provider_send_failed",
      "correlation_id": "request-correlation-id"
    }
  }
}
```

## Persistence

Gmail reply send persists a safe `email_outbound_deliveries` row with scoped
organization/workspace IDs, actor user ID from AuthContext, conversation ID,
safe provider message ID when available, status, safe failure code when
applicable, and allowlisted metadata only.

It does not persist raw Gmail payloads, raw provider error bodies, access
tokens, refresh tokens, Authorization headers, client secrets, or attachment
bytes.

## Internal E2E Smoke

The internal Gmail outbound smoke service runs the same `ReplyService` path
with a trusted AuthContext and simulated Gmail client. It has no public route.

The smoke verifies:

- simulated Gmail send,
- safe outbound delivery persistence,
- safe reply result,
- no real provider call,
- no AI draft auto-send,
- no inbound sync or scheduler-triggered send.

## Non-Goals

This PR does not implement:

- dashboard Gmail send UI,
- real Gmail outbound send,
- SMTP or IMAP,
- queue, retry, or distributed locking,
- scheduler-triggered outbound send,
- AI draft generation,
- AI auto-send,
- attachment sending,
- raw Gmail payload persistence.
