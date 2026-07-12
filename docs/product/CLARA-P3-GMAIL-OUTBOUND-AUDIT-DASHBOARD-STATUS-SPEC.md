---
title: CLARA P3 Gmail Outbound Audit Dashboard Status Spec
status: implemented
updated: 2026-07-12
---

# CLARA P3 Gmail Outbound Audit Dashboard Status Spec

## Scope

P3-PR-40 adds safe observability for Gmail outbound send paths:

- Gmail outbound send request/result audit events.
- Gmail reply send request/result audit events.
- Read-only scoped delivery status lookup.
- Dashboard read-only outbound status visibility after a send returns an outbound delivery id.

## API

`GET /api/v1/integrations/gmail/outbound/deliveries/:deliveryId`

Requirements:

- Requires authentication.
- Uses `organization_id` and `workspace_id` only from backend `AuthContext`.
- Viewer may read delivery status because the route is read-only.
- Cross-workspace delivery access returns safe `404`.
- Response excludes recipients, subject, body, token material, Authorization headers, raw Gmail payloads, and raw provider errors.

## Audit Events

Safe action values:

- `gmail.outbound_send.requested`
- `gmail.outbound_send.succeeded`
- `gmail.outbound_send.failed`
- `gmail.reply_send.requested`
- `gmail.reply_send.succeeded`
- `gmail.reply_send.failed`

Allowed metadata is limited to provider, conversation id, outbound delivery id, status, reason code, recipient count, and correlation id through the audit row.

## Dashboard

The dashboard shows a read-only Gmail outbound status panel only after the reply send response includes `outbound_delivery_id`.

The panel never renders access tokens, refresh tokens, client secrets, Authorization headers, raw Gmail payloads, raw provider errors, recipients, subject, or message body.

## Non-Goals

- No resend or retry button.
- No Gmail outbound send UI.
- No OAuth connect UI.
- No real Gmail network send implementation.
- No AI draft auto-send.
