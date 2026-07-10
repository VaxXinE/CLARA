---
project: "CLARA"
artifact: "P3 Gmail Inbound Message Fetch Client Boundary Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-API-CLIENT-BOUNDARY-SPEC.md"
  - "./CLARA-P3-GMAIL-CONNECTION-HEALTH-CHECK-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Inbound Message Fetch Client Boundary

## Purpose

Dokumen ini mendefinisikan boundary backend untuk fetch inbound Gmail messages secara aman.

Scope PR ini hanya mencakup:

- list messages boundary,
- get single message boundary,
- validasi aman untuk query, label IDs, page token, dan maxResults,
- DTO aman tanpa attachment body data.

PR ini tidak mencakup:

- sync orchestrator,
- persistence database Gmail messages,
- conversation creation,
- attachment download,
- outbound Gmail send,
- worker/background job.

## Safe DTO Rules

Response hanya boleh berisi:

```text
provider_message_id
thread_id
label_ids
snippet
internal_date
headers allowlist only
payload metadata only
next_page_token optional
```

Tidak boleh berisi:

```text
access_token
refresh_token
Authorization header
attachment body data
raw Gmail error body
```

## Query Guardrails

Baseline guardrail:

```text
userId selalu "me"
maxResults diclamp ke limit aman
labelIds hanya allowlist konservatif
query string harus lolos validasi karakter aman
raw format tidak didukung di PR ini
```
