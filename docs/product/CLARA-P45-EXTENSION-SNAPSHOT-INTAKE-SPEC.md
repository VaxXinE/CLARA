---
project: "CLARA"
artifact: "P4.5 Extension Snapshot Intake Spec"
status: "implemented"
classification: "product-security-spec"
last_updated: "2026-07-13"
---

# CLARA P4.5 Extension Snapshot Intake Spec

This p4.5 snapshot intake implements the backend route for safe browser extension snapshots from active conversations only.

## Route

```text
POST /api/v1/extension/:channel/snapshots
```

Supported channels:

- `whatsapp`
- `instagram`
- `tiktok`

The snapshot provider is always `extension`, with `official_api = false`.

## Backend Behavior

- Requires CLARA authentication.
- Allows owner and agent operational intake; viewer is blocked.
- Derives `organization_id` and `workspace_id` from server `AuthContext`.
- Rejects tenant scope fields from query/body.
- Validates channel, provider, `official_api`, `snapshot_hash`, bounded chat fields, and bounded messages.
- Persists safe normalized snapshot and message records.
- Deduplicates snapshots by organization, workspace, channel, conversation fingerprint, and `snapshot_hash`.
- Materializes safe customer/conversation/message/activity records with source `extension_bridge`.
- Emits safe audit metadata only.

## Safety Boundaries

- No raw DOM persistence.
- No raw HTML persistence.
- No raw provider payload persistence.
- No provider cookie, token, Authorization header, or ChatGPT session storage.
- No outbound send.
- No AI draft generation.
- No scheduler trigger.
- No external network call.

## Not Implemented

- Browser extension UI.
- Extension auto-sync engine.
- ChatGPT UI/context builder.
- Official WhatsApp, Instagram, or TikTok APIs.
- Background inbox crawler.
- Any automated reply sending.
