---
project: "CLARA"
artifact: "P4 Multi-Channel Foundation Spec"
status: "implemented-baseline"
classification: "product-spec"
---

# CLARA P4 Multi-Channel Foundation Spec

## Scope

P4-PR-01 adds the smallest shared channel foundation needed before adding more providers:

This p4 baseline is intentionally read-only: it exposes safe channel metadata without enabling provider mutation, webhooks, or sends.

```text
generic channel capability registry
workspace-scoped channel account persistence
read-only channel account health DTO
safe authenticated API routes
```

## API

```text
GET /api/v1/channels/capabilities
GET /api/v1/channels/accounts
GET /api/v1/channels/accounts/:channelAccountId
GET /api/v1/channels/accounts/:channelAccountId/health
```

All routes require authentication. Viewer, agent, and owner can read. No route accepts `organization_id` or `workspace_id` as authorization truth.

## Providers

| Provider  | Channel type | Status    |
| --------- | ------------ | --------- |
| Gmail     | email        | available |
| WhatsApp  | messaging    | available |
| Instagram | social       | planned   |
| TikTok    | social       | planned   |
| Webchat   | webchat      | available |

Instagram and TikTok planned providers are metadata only. They have no webhook, OAuth, send, sync, or dashboard mutation behavior in this phase.

## Security Rules

Channel responses must not expose:

```text
access tokens
refresh tokens
Authorization headers
client secrets
raw provider payloads
raw provider error bodies
provider config secrets
```

Channel account queries are always scoped by backend `AuthContext`:

```text
organization_id from AuthContext
workspace_id from AuthContext
```

Cross-workspace account access returns safe 404.

## Not Implemented

```text
real WhatsApp provider outbound send
Instagram integration
TikTok integration
provider webhooks
provider account mutation APIs
dashboard channel management UI
Gmail outbound real send
AI auto-send
```
