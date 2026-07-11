---
project: "CLARA"
artifact: "P3 Gmail Inbound Sync Scheduler Runtime Boundary Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-11"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-INBOUND-SCHEDULER-LIFECYCLE-SPEC.md"
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-SCHEDULER-SKELETON-SPEC.md"
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-JOB-BOUNDARY-SPEC.md"
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-STATE-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Inbound Sync Scheduler Runtime Boundary

## Purpose

Dokumen ini mendefinisikan runtime boundary internal untuk memanggil Gmail inbound sync scheduler `tickOnce()` secara periodik.

Scope PR ini hanya mencakup:

- runtime service `start()`, `stop()`, `isRunning()`, dan `tickNow()`,
- disabled-by-default behavior,
- duplicate start yang idempotent,
- skip aman untuk overlapping tick,
- safe failure summary jika tick gagal,
- interval dan limit yang di-clamp aman,
- konfigurasi env placeholder.

PR ini tidak mencakup:

- auto-start dari HTTP server,
- external cron,
- queue adapter,
- distributed lock,
- multi-process leader election,
- outbound Gmail send,
- AI draft generation atau AI auto-send.

## Runtime Rules

Runtime hanya boleh berjalan jika trusted server-side code memanggil `start()` dengan config enabled.

Safe defaults:

```text
GMAIL_INBOUND_SYNC_SCHEDULER_ENABLED=false
GMAIL_INBOUND_SYNC_SCHEDULER_INTERVAL_MS=300000
GMAIL_INBOUND_SYNC_SCHEDULER_MAX_ACCOUNTS_PER_TICK=10
GMAIL_INBOUND_SYNC_SCHEDULER_MAX_MESSAGES_PER_ACCOUNT=25
```

Runtime result tidak boleh berisi:

```text
access_token
refresh_token
Authorization header
raw Gmail payload
raw attachment data
full Gmail body
```

## Lifecycle Wiring

The API app can now accept an explicitly constructed scheduler runtime and start/stop it through lifecycle hooks. The default app still does not construct or start Gmail scheduler work unless trusted server-side bootstrap code wires the runtime.

## Current Limitation

Runtime lifecycle wiring is available, but there is still no external cron, queue adapter, distributed lock, or multi-process leader election.
