---
project: "CLARA"
artifact: "P3 Gmail Inbound Sync Job Boundary Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-11"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-ORCHESTRATOR-SPEC.md"
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-STATE-SPEC.md"
  - "./CLARA-P3-GMAIL-MANUAL-SYNC-API-HARDENING-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Inbound Sync Job Boundary

## Purpose

Dokumen ini mendefinisikan boundary internal-only untuk menjalankan Gmail inbound sync sebagai job terkontrol tanpa menambahkan worker, scheduler, atau queue runtime.

Scope PR ini hanya mencakup:

- trusted job input,
- scoped provider account lookup,
- safe running-state guard,
- reuse orchestrator sync yang sudah ada,
- safe job result DTO.
- entrypoint internal untuk scheduler skeleton.

PR ini tidak mencakup:

- background worker runtime,
- cron scheduler,
- retry queue,
- outbound Gmail send.

## Security Rules

Selalu enforce:

```text
job input harus datang dari trusted server-side caller
organization_id dan workspace_id tidak boleh datang dari untrusted request body
cross-workspace provider account harus fail closed
job result tidak boleh berisi token, Authorization header, atau raw Gmail payload
duplicate run untuk provider account yang masih running harus di-skip aman
```
