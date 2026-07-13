---
project: "CLARA"
artifact: "P4 Multi-Channel Audit Privacy Hardening Spec"
status: "implemented"
classification: "product-security-spec"
last_updated: "2026-07-13"
---

# CLARA P4 Multi-Channel Audit Privacy Hardening Spec

This p4 spec defines the safe audit metadata policy for Gmail/email, Webchat, WhatsApp, and future Instagram/TikTok channels.

## Allowed Audit Metadata

Audit metadata should prefer small identifiers, status values, reason codes, counts, booleans, and correlation ids:

- `provider`
- `channel_account_id`
- `conversation_id`
- `delivery_id`
- `outbound_delivery_id`
- `reason_code`
- `status`
- `direction`
- `correlation_id`
- `recipient_count`
- `message_count`
- `has_attachments`
- `html_body_present`

## Forbidden Audit Metadata

Audit metadata must not include:

- Access tokens or refresh tokens.
- Webhook verification tokens.
- OAuth client secrets.
- Authorization headers.
- Cookies.
- Raw provider payloads.
- Raw provider errors.
- Message body content.
- Unsafe HTML.
- Full phone/contact payloads.

## Runtime Boundary

The helper in `services/api/src/audit/multichannel-audit-policy.ts` provides the shared allowlist sanitizer used by the P4 final regression tests.

It is intentionally small. Existing audit writers may keep their specific methods, but channel metadata must follow this policy before adding new provider writes.
