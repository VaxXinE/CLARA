---
project: "CLARA"
artifact: "P4 WhatsApp Outbound Routing Spec"
status: "implemented"
classification: "product-security-spec"
last_updated: "2026-07-13"
---

# CLARA P4 WhatsApp Outbound Routing Spec

This p4 spec documents the simulated WhatsApp outbound boundary and the unified channel routing rules.

## Scope

Implemented:

- Unified channel routing for Gmail/email, Webchat, WhatsApp, and default simulated reply paths.
- Simulated WhatsApp outbound send client for local/test only.
- WhatsApp outbound delivery persistence with scoped safe metadata.
- WhatsApp reply send service for explicit human/operator replies through `POST /api/v1/conversations/:conversation_id/reply`.
- Channel capability metadata now marks WhatsApp outbound support as available through the simulated boundary.

Not implemented:

- Real WhatsApp network send.
- WhatsApp templates, media, contact sync, groups, interactive messages, retry queues, scheduler-triggered sends, or dashboard WhatsApp UI.
- Instagram, TikTok, scraping, QR hijacking, session-cookie reuse, unofficial WhatsApp Web automation, or AI auto-send.

## Routing Rules

- Gmail/email conversations route only through the Gmail/email reply boundary when it is wired.
- Webchat conversations route only through the Webchat reply boundary.
- WhatsApp conversations route only through the WhatsApp reply boundary.
- Unknown legacy/demo sources keep the existing default simulated reply behavior.
- Cross-workspace conversation access continues to return safe not-found behavior.
- `organization_id` and `workspace_id` from query/body are ignored as authorization truth.

## Security Rules

- Viewer role cannot send replies.
- Owner/agent send remains an explicit human API action.
- AI draft generation never sends a reply.
- WhatsApp outbound records must not store access tokens, refresh tokens, webhook verification tokens, Authorization headers, cookies, raw provider payloads, raw provider errors, unsafe HTML, or full message bodies.
- WhatsApp outbound responses expose only safe delivery metadata such as provider, status, reason code, provider message id, delivery id, and timestamps.
- Tests must not call Meta/WhatsApp or any external provider network.

## Validation

Required checks:

```bash
cd services/api
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high
```
