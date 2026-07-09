---
project: "CLARA"
artifact: "P3 Email Inbound Persistence Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-09"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-EMAIL-CHANNEL-ADAPTER-SPEC.md"
  - "../../services/api/README.md"
  - "./CLARA-MVP-GAP-REVIEW.md"
  - "./CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/"
  - "./CLARA-MVP-FIRST-PRODUCT-SLICE-TEST-PLAN/"
---

# CLARA P3 Email Inbound Persistence

## Purpose

This document defines the first persistence baseline for trusted normalized inbound email inside CLARA.

The goal is to persist email into existing CLARA domain entities safely:

```text
customer
conversation
message
activity
email inbound idempotency record
```

## Current Scope

This PR adds:

```text
inbound email persistence service
fixture-backed and DB-backed repository implementations
scoped customer reuse by from_email
scoped conversation reuse by provider thread identity
idempotency by scoped provider_message_id
deterministic offline tests
minimal schema for email inbound records
internal ingestion harness can now call the persistence service in batch mode
```

This PR does not add:

```text
public webhook endpoint
real Gmail API integration
real IMAP integration
SMTP send
OAuth flow
attachment processing
HTML rendering
background worker or queue
```

## Persistence Rules

Trusted inputs:

```text
organization_id from trusted server scope
workspace_id from trusted server scope
normalized inbound email from the adapter boundary
```

Persistence behavior:

```text
reuse existing customer by from_email inside the same organization/workspace
reuse existing conversation by provider + provider_thread_id inside the same organization/workspace
create inbound message using text_body only
create activity event for inbound email
create idempotency record for provider_message_id
```

## Security Rules

Always enforce:

```text
treat inbound email as untrusted input
do not log raw email body
do not log provider tokens or email auth headers
do not store raw provider payload
do not store raw email headers outside the allowlist
do not process attachments
do not render raw HTML
persist html_body_present as boolean only
do not allow organization_id or workspace_id to come from the email payload
do not allow cross-workspace customer or conversation reuse
duplicate provider_message_id must not create duplicate domain rows
```

## Minimal Email Inbound Record

Current table fields:

```text
id
organization_id
workspace_id
provider
provider_message_id
provider_thread_id
customer_id
conversation_id
activity_id
received_at
created_at
```

Purpose:

```text
idempotency
thread-to-conversation lookup
safe traceability without raw payload storage
```

## Known Limitations

Current limitations:

```text
html-only emails are rejected because CLARA does not persist raw HTML in this baseline
attachments are reduced to attachments_present only
no public ingestion endpoint exists yet
no real provider trust flow exists yet
no automatic workspace routing from mailbox/provider configuration exists yet
```
