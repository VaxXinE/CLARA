---
project: "CLARA"
artifact: "P3 Email E2E Internal Smoke Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-EMAIL-CHANNEL-ADAPTER-SPEC.md"
  - "./CLARA-P3-EMAIL-INBOUND-PERSISTENCE-SPEC.md"
  - "./CLARA-P3-EMAIL-INGESTION-HARNESS-SPEC.md"
  - "./CLARA-P3-EMAIL-REPLY-ADAPTER-SPEC.md"
  - "./CLARA-P3-EMAIL-OUTBOUND-DELIVERY-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Email End-to-End Internal Smoke

## Purpose

Dokumen ini mendefinisikan smoke harness internal untuk memverifikasi alur email backend CLARA secara end-to-end tanpa provider nyata dan tanpa network call eksternal.

Harness ini hanya untuk validasi engineering internal.

## Covered Flow

Smoke flow saat ini mencakup:

```text
simulated inbound email adapter
inbound email normalization
inbound persistence
customer/conversation/activity creation or reuse
simulated outbound email reply
outbound delivery record persistence
```

## Out of Scope

Dokumen dan implementasi ini tidak menambahkan:

```text
public webhook endpoint
SMTP integration
Gmail API integration
OAuth flow
attachment handling
HTML rendering
background worker
cron scheduler
frontend behavior changes
```

## Security Rules

Selalu enforce:

```text
do not call external email providers
do not log raw email body
do not log full reply body
do not store raw provider payload
do not store provider tokens or secrets
do not render raw HTML
do not process attachments
do not bypass organization/workspace isolation
viewer must not be allowed to send the smoke reply
AI draft must never auto-send
```

## Expected Result

Smoke result aman hanya mengembalikan:

```text
attempted_count
persisted_count
duplicate_count
failed_count
safe failures
reply result summary
outbound delivery record summary
conversation_id
customer_id
```

Tidak boleh mengembalikan atau menyimpan:

```text
raw provider payload
provider token
raw auth header
raw secret
unallowlisted metadata
```

## Internal-Only Guidance

Harness ini dimaksudkan untuk:

```text
unit/integration-style offline validation
local/dev/test smoke checks
future worker/webhook implementation reference
```

Harness ini tidak boleh dipublish sebagai endpoint publik tanpa desain auth, trust verification, rate limiting, dan security review yang baru.
