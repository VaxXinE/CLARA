---
project: "CLARA"
artifact: "P4 WhatsApp Official Webhook Inbound Spec"
status: "implemented"
classification: "product-security-spec"
last_updated: "2026-07-13"
---

# CLARA P4 WhatsApp Official Webhook Inbound Spec

This p4 spec documents the official WhatsApp inbound webhook boundary now available in the API service.

## Scope

Implemented:

- `GET /api/v1/whatsapp/webhook` for provider challenge verification.
- `POST /api/v1/whatsapp/webhook` for signed inbound text message callbacks.
- WhatsApp text message normalization into CLARA customer, conversation, message, activity, and inbound idempotency records.
- Server-side workspace resolution through the WhatsApp channel account `externalAccountId`.
- Idempotency by `organization_id`, `workspace_id`, and provider message id.

Provider decision:

- Production WhatsApp integration must use the official WhatsApp Business / Meta provider path.
- Scraping, browser automation, QR hijacking, WhatsApp Web session-cookie reuse, and unofficial client libraries are rejected as production strategies.
- Those strategies are operationally fragile and create unacceptable account, privacy, compliance, and incident-response risk.

Not implemented:

- WhatsApp outbound send.
- WhatsApp templates.
- Media download, attachment storage, contact sync, group messages, or interactive messages.
- Dashboard WhatsApp UI.
- AI draft generation or AI auto-send from inbound WhatsApp messages.

## Security Rules

- Do not commit WhatsApp app secrets, access tokens, refresh tokens, provider API keys, cookies, or private keys.
- Do not trust `organization_id` or `workspace_id` from webhook request query/body.
- Resolve tenant scope only from the server-side channel account mapping.
- Verify webhook challenge token and inbound signature before materialization.
- Persist only normalized safe fields; do not persist raw provider payloads or raw headers.
- Return safe error envelopes and safe error codes/reason codes only.
- Do not log Authorization headers, cookies, tokens, raw provider payloads, or provider raw errors.

## Runtime Notes

Required local/platform env values:

```text
WHATSAPP_WEBHOOK_VERIFY_TOKEN=
WHATSAPP_WEBHOOK_APP_SECRET=
```

Use safe local placeholders only. Production values must come from platform secrets or a secret manager.

## Validation

Required checks:

```bash
cd services/api
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high
```
