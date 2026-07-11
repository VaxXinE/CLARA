---
project: "CLARA"
artifact: "P3 Gmail Manual Sync API Hardening Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-11"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-ORCHESTRATOR-SPEC.md"
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-STATE-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Manual Sync API Hardening

## Purpose

Dokumen ini mendefinisikan hardening untuk manual Gmail inbound sync route yang sudah ada.

Scope PR ini hanya mencakup:

- auth wajib,
- viewer diblokir,
- scope organization/workspace tetap dari `AuthContext`,
- body validation strict,
- safe page token validation,
- safe manual sync response dengan `sync_state`,
- conflict aman saat sync state masih `running`.

PR ini tidak mencakup:

- background worker,
- scheduled sync,
- outbound Gmail send,
- raw Gmail payload persistence,
- token exposure.

## Safe Response

Response manual sync hanya boleh berisi:

```text
provider_account_id
provider
status
fetched_count
normalized_count
persisted_count
materialized_count
skipped_count
failed_count
next_page_token optional
last_history_id optional
reason_code optional
sync_state
synced_at
```

Tidak boleh berisi:

```text
access_token
refresh_token
Authorization header
raw Gmail payload
raw attachment data
```
