---
project: "CLARA"
artifact: "P3 Gmail Inbound Sync State Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-11"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-ORCHESTRATOR-SPEC.md"
  - "./CLARA-P3-GMAIL-INBOUND-E2E-INTERNAL-SMOKE-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Inbound Sync State

## Purpose

Dokumen ini mendefinisikan persistence state/cursor aman untuk Gmail inbound sync per provider account yang sudah scoped ke organization dan workspace.

Scope PR ini hanya mencakup:

- state row scoped per provider account,
- cursor aman seperti `last_history_id` dan `last_page_token`,
- status sync aman: `idle`, `running`, `completed`, `partial`, `failed`,
- timestamp dan counter summary aman,
- wiring minimal ke manual sync orchestrator yang sudah ada.

PR ini tidak mencakup:

- background worker,
- scheduled sync,
- raw Gmail payload storage,
- token storage,
- attachment body storage,
- outbound Gmail send.

## Persisted Fields

State aman yang boleh disimpan:

```text
organization_id
workspace_id
provider_account_id
provider
last_history_id optional
last_page_token optional
last_sync_status
last_started_at optional
last_completed_at optional
last_failed_at optional
last_failure_reason_code optional
last_fetched_count
last_normalized_count
last_persisted_count
last_materialized_count
created_at
updated_at
```

Tidak boleh disimpan:

```text
access_token
refresh_token
Authorization header
raw Gmail message payload
raw attachment body/data
```

## Security Rules

Selalu enforce:

```text
state harus scoped oleh organization_id dan workspace_id
provider_account_id tidak boleh dibaca atau diupdate lintas workspace
failure reason harus berupa safe enum saja
cursor hanya boleh menyimpan metadata aman, bukan raw payload
sync state tidak boleh melemahkan auth, RBAC, atau workspace isolation yang sudah ada
```
