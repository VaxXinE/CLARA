---
project: "CLARA"
artifact: "P3 Gmail Inbound Sync Scheduler Skeleton Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-11"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-JOB-BOUNDARY-SPEC.md"
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-SCHEDULER-RUNTIME-BOUNDARY-SPEC.md"
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-STATE-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Inbound Sync Scheduler Skeleton

## Purpose

Dokumen ini mendefinisikan skeleton scheduler internal untuk Gmail inbound sync.

Scope PR ini hanya mencakup:

- service internal `tickOnce()`,
- disabled-by-default behavior,
- bounded account selection,
- skip saat sync state masih `running`,
- handoff ke Gmail inbound sync job boundary,
- safe scheduler summary.
- runtime boundary disabled-by-default di PR berikutnya.

PR ini tidak mencakup:

- auto-start dari HTTP server,
- cron runtime,
- queue adapter,
- retry queue,
- external scheduler integration.

Runtime boundary sekarang tersedia sebagai internal service yang harus dipanggil eksplisit oleh trusted server-side code. Service tersebut tetap tidak auto-start dari HTTP server.

## Safe Summary

Scheduler result hanya boleh berisi:

```text
status
checked_account_count
scheduled_job_count
skipped_count
failed_count
started_at
finished_at
reason_code optional
```

Tidak boleh berisi:

```text
access_token
refresh_token
Authorization header
raw Gmail payload
raw attachment data
```
