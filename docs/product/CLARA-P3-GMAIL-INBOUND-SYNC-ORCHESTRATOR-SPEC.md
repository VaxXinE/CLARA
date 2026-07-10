---
project: "CLARA"
artifact: "P3 Gmail Inbound Sync Orchestrator Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-INBOUND-MESSAGE-FETCH-CLIENT-SPEC.md"
  - "./CLARA-P3-GMAIL-CONNECTION-HEALTH-CHECK-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Inbound Sync Orchestrator

## Purpose

Dokumen ini mendefinisikan orchestrator backend untuk bounded Gmail inbound sync.

Scope PR ini hanya mencakup:

- cek health koneksi Gmail sebelum sync,
- list message IDs,
- fetch detail message secara bounded,
- normalisasi aman Gmail message ke envelope inbound email internal,
- hook opsional untuk persist envelope yang sudah dinormalisasi,
- summary hasil sync yang aman,
- route management-scoped untuk trigger sync manual.

PR ini tidak mencakup:

- customer creation,
- conversation creation,
- activity creation,
- AI draft generation,
- outbound send,
- worker/background scheduler.

## Safe Summary DTO

Summary hanya boleh berisi:

```text
provider_account_id
provider
status
fetched_count
normalized_count
persisted_count
skipped_count
failed_count
next_page_token optional
reason_code optional
synced_at
```

Tidak boleh berisi:

```text
access_token
refresh_token
client_secret
raw Gmail message payload
attachment body/data
```

## Security Rules

Selalu enforce:

```text
sync batch size harus dibatasi
viewer tidak boleh trigger sync
cross-workspace sync harus fail closed
persist_normalized harus explicit dan tidak boleh default implicit
tidak boleh membuat customer/conversation/activity/AI draft di PR ini
tidak boleh menyimpan attachment body/data
```
