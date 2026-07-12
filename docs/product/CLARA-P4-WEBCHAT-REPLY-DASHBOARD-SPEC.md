---
project: "CLARA"
artifact: "P4 Webchat Reply Dashboard Spec"
status: "implemented-baseline"
classification: "product-spec"
---

# CLARA P4 Webchat Reply Dashboard Spec

## Scope

P4-PR-03 adds the smallest safe Webchat reply and visibility baseline:

```text
simulated Webchat reply adapter
workspace-scoped Webchat outbound delivery records
Webchat reply wiring through the existing human-triggered reply API
read-only Webchat outbound status API
dashboard Webchat source and delivery status visibility
```

## API Behavior

Webchat replies are sent through the existing endpoint:

```text
POST /api/v1/conversations/:conversation_id/reply
```

The Webchat path is used only when the scoped conversation source is `webchat`
or the demo-compatible `web_chat_demo`.

Read-only delivery status is available at:

```text
GET /api/v1/integrations/webchat/outbound/deliveries/:deliveryId
```

The status route requires authentication and derives `organization_id` and
`workspace_id` only from backend `AuthContext`.

## Security Rules

```text
viewer cannot send Webchat replies
agent and owner can send through the existing reply:send permission
Webchat replies are explicit human-triggered actions only
AI drafts never auto-send
wrong-channel sends are blocked safely
delivery records store metadata allowlist only
responses do not expose tokens, cookies, Authorization headers, raw provider payloads, raw provider errors, or unsafe HTML
cross-workspace delivery reads return safe not found behavior
dashboard renders text safely and does not use dangerouslySetInnerHTML
```

## Dashboard

The dashboard now shows:

```text
Webchat conversation source badge
latest Webchat outbound delivery status after a send
safe reason_code and timestamps when available
```

No resend, retry, widget builder, OAuth UI, or public widget frontend is added.

## Not Implemented

```text
real Webchat provider network calls
public widget frontend
resend or retry controls
queue or scheduler-triggered Webchat send
WhatsApp, Instagram, or TikTok integration
AI auto-send
raw request/provider payload persistence
```
