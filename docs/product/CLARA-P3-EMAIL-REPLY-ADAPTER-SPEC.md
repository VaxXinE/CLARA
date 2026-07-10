---
project: "CLARA"
artifact: "P3 Email Reply Adapter Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-EMAIL-CHANNEL-ADAPTER-SPEC.md"
  - "../../services/api/README.md"
  - "./CLARA-MVP-GAP-REVIEW.md"
---

# CLARA P3 Email Reply Adapter Skeleton

## Purpose

This document defines the first outbound email reply adapter boundary for CLARA.

The goal is to make future email providers pluggable without changing the public reply API contract or exposing provider-specific payloads to product modules.

## Current Scope

This PR adds:

```text
outbound email reply command type
reply adapter interface
simulated email reply adapter
reply service/harness for adapter invocation
deterministic offline tests
```

This PR does not add:

```text
SMTP integration
Gmail API integration
OAuth flow
attachment sending
HTML email rendering
public send endpoint
queue or retry worker
```

## Safe Command Shape

Current command fields:

```text
organization_id
workspace_id
conversation_id
customer_id
from_email
to_email
subject
text_body
provider_thread_id optional
idempotency_key optional
```

## Safe Result Shape

Current result fields:

```text
status
provider_message_id
provider_thread_id optional
sent_at
metadata allowlist only
```

Metadata is intentionally minimal:

```text
provider
transport
```

## Security Rules

Always enforce:

```text
do not commit SMTP credentials, OAuth secrets, refresh tokens, or provider API keys
do not log provider credentials
do not log Authorization headers, cookies, tokens, or raw JWTs
do not log full reply body
do not store raw provider response payload
do not send attachments in this skeleton
do not render raw HTML email
treat reply body as untrusted text
do not bypass organization/workspace isolation
do not auto-send AI drafts
human explicit reply action remains required
```

## Future Direction

Later implementations should plug in here:

```text
Gmail API adapter
SMTP adapter
other trusted outbound email providers
```

The existing core reply send route may adopt this adapter later, but this PR keeps the skeleton separate to avoid public API behavior changes.
