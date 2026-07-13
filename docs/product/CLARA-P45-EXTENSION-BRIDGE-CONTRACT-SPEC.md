---
project: "CLARA"
artifact: "P4.5 Extension Bridge Contract Spec"
status: "planned-contract"
classification: "product-security-spec"
last_updated: "2026-07-13"
---

# CLARA P4.5 Extension Bridge Contract Spec

This p4.5 spec defines the contract for a future browser extension bridge. It does not implement routes or persistence yet.

## Positioning

- `provider = extension`
- `official_api = false`
- `automation_level = active_conversation_auto_sync`
- `send_mode = manual_assisted`
- Supported initial channels: `whatsapp`, `instagram`, `tiktok`

Official provider APIs remain preferred for full automation. The extension bridge is an operator-assisted, user-visible bridge for the active conversation the operator opened.

## Planned Route Contracts

```text
POST /api/v1/extension/:channel/snapshots
POST /api/v1/extension/:channel/reply-suggestions
POST /api/v1/extension/:channel/manual-send-confirmations
```

These routes are not implemented in this PR.

## Snapshot Payload

Required fields:

- `provider`
- `official_api`
- `channel`
- `captured_at`
- `snapshot_hash`
- `chat_title`
- `messages`

Message fields:

- `id`
- `direction`
- `author`
- `text`
- `timestamp_label`
- `reply_context_text`

Optional debug metadata must be safe, bounded, and non-sensitive.

## Validation Rules

- CLARA auth is required.
- Organization and workspace must come from backend `AuthContext`.
- Channel must be allowlisted.
- Message count and message text length must be bounded.
- `snapshot_hash` is required for dedupe.
- Unknown unsafe fields must be rejected when route validation is implemented.

## Non-Goals

- No full snapshot persistence.
- No browser extension UI.
- No auto-sync engine.
- No official WhatsApp/Instagram/TikTok API integration.
- No unofficial send automation.
- No background inbox crawler.
- No auto-send reply.
