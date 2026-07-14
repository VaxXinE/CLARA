---
project: "CLARA"
artifact: "P6 Audit Trail Spec"
status: "implemented"
owner: "CLARA Engineering and Security"
classification: "audit-spec"
---

# CLARA P6 Audit Trail Spec

## Purpose

Audit Trail defines safe provider/channel event taxonomy for production investigations.

## Event Taxonomy

- `provider_account_connected`
- `provider_account_disconnected`
- `provider_account_reconnect_required`
- `provider_token_refresh_failed_safe`
- `channel_health_checked`
- `webhook_received_safe`
- `webhook_rejected_safe`
- `webhook_replay_detected`
- `outbound_queued`
- `outbound_sending`
- `outbound_sent`
- `outbound_retry_scheduled`
- `outbound_dead_lettered`
- `provider_policy_blocked`
- `extension_snapshot_received_safe`
- `extension_snapshot_rejected_safe`

## Required Fields

Audit records should include eventType, workspaceId, userId when applicable, channel, provider, safe accountId, correlationId, safeReasonCode, createdAt, and sanitized metadata.

## Safe Metadata Policy

Metadata is allowlist-only. It may include safe fields like provider, channel, account id, conversation id, delivery id, status, retry count, dead-letter count, recipient count, and correlation id.

Audit metadata must include no raw provider payload, no access token, no refresh token, no cookies, no authorization header, no raw webhook body, no raw email body, no raw DOM, no raw HTML, no service role key, and no OpenAI API key.

## Retention And Investigation

Retention is a production operations decision and must match the compliance policy for workspace data. Audit logs are for incident investigation, provider support review, and security regression checks.

## Non-Goals

This spec does not add SIEM integration, analytics dashboards, billing events, CRM reporting, or role/user mutation auditing beyond existing read-only readiness boundaries.
