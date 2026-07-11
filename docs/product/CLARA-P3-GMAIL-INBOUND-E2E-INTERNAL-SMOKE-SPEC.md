---
project: "CLARA"
artifact: "P3 Gmail Inbound E2E Internal Smoke Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-11"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-INBOUND-CONVERSATION-MATERIALIZATION-SPEC.md"
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-ORCHESTRATOR-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Inbound E2E Internal Smoke

## Purpose

Dokumen ini mendefinisikan harness smoke internal untuk memverifikasi flow Gmail inbound end-to-end secara offline dan aman.

Scope PR ini hanya mencakup:

- scoped provider account check,
- token vault test-only fixture,
- healthy connection verification,
- mocked Gmail list/detail fetch,
- Gmail normalization,
- normalized-envelope persistence,
- inbound materialization ke customer/conversation/message/activity yang sudah ada.

PR ini tidak mencakup:

- real Google/Gmail network call,
- scheduled sync,
- background worker,
- outbound Gmail send,
- AI draft generation.

## Security Rules

Selalu enforce:

```text
smoke hanya boleh pakai mocks atau fakes
viewer tidak boleh menjalankan smoke
organization_id dan workspace_id tetap datang dari auth context
raw Gmail payload, attachment body/data, token, dan Authorization header tidak boleh keluar di response
smoke tidak boleh membuat AI draft atau outbound reply
```
