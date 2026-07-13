---
project: "CLARA"
artifact: "P4.5 Extension Bridge Security Spec"
status: "planned-contract"
classification: "security-spec"
last_updated: "2026-07-13"
---

# CLARA P4.5 Extension Bridge Security Spec

The extension bridge is a user-visible active-conversation bridge, not a background crawler or unofficial provider automation layer.

## Hard Rules

- No provider cookies.
- No WhatsApp, Instagram, or TikTok session token capture.
- No browser automation background crawl.
- No credential capture.
- No QR hijacking.
- No unofficial provider send automation.
- No raw DOM persistence.
- No raw HTML persistence.
- No auto-send.
- No storage of access tokens, refresh tokens, or provider secrets.
- No Authorization header persistence.
- No message body in audit metadata.

## Auto-Sync Rules

- Auto-sync is allowed only for the active conversation opened by the user.
- Auto-sync must be visible to the user.
- Auto-sync must not crawl inbox lists.
- Auto-sync must not crawl background conversations.
- Auto-sync must deduplicate by `snapshot_hash`.
- Auto-sync must throttle or debounce.
- Auto-sync must be auditable.

## Safe Audit Metadata

Allowed audit metadata:

- `provider`
- `channel`
- `source`
- `snapshot_hash`
- `message_count`
- `incoming_count`
- `outgoing_count`
- `conversation_id`
- `customer_id`
- `correlation_id`
- `status`
- `reason_code`

Audit metadata must never include provider credentials, browser session material, raw DOM, raw HTML, raw provider payloads, or message bodies.
