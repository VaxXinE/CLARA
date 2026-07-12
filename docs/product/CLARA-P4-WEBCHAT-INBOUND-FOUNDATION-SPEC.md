---
project: "CLARA"
artifact: "P4 Webchat Inbound Foundation Spec"
status: "implemented-baseline"
classification: "product-spec"
---

# CLARA P4 Webchat Inbound Foundation Spec

## Scope

This p4 baseline adds a public-safe Webchat inbound boundary:

```text
simulated Webchat adapter
validated inbound Webchat API
workspace-scoped inbound persistence
customer/conversation/message/activity materialization
```

## Endpoint

```text
POST /api/v1/webchat/inbound/messages
```

The endpoint is intentionally unauthenticated because it represents a public website widget boundary. It requires `channel_public_key`, which is a non-secret identifier mapped to a server-side `channel_accounts` row.

## Security Rules

```text
organization_id and workspace_id are never trusted from body or query
tenant scope is resolved from channel account only
message_text is required and bounded
customer_email is validated when present
page_url must be http or https
metadata is allowlisted
raw request payloads are not stored
cookies, IP address, Authorization header, tokens, and provider config are not stored
no AI draft is created
no outbound reply is sent
```

## Not Implemented

```text
webchat widget frontend
dashboard UI
webchat outbound reply
resend or retry
external provider calls
queue or scheduler
AI auto-send
```
