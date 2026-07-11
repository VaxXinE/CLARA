---
project: "CLARA"
artifact: "P3 Gmail Inbound Conversation Materialization Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-MESSAGE-NORMALIZATION-SPEC.md"
  - "./CLARA-P3-EMAIL-INBOUND-PERSISTENCE-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Inbound Conversation Materialization

## Purpose

Dokumen ini mendefinisikan wiring aman dari Gmail inbound envelope ke domain record CLARA yang sudah ada.

Scope PR ini hanya mencakup:

- reuse persistence/materialization service email inbound yang sudah ada,
- create or reuse scoped customer,
- create or reuse scoped conversation by provider thread id,
- create inbound message dan activity secara aman,
- idempotency by scoped provider message id,
- trigger opsional dari Gmail sync manual.

PR ini tidak mencakup:

- background worker,
- automatic sync scheduler,
- AI draft generation,
- outbound Gmail send,
- raw Gmail payload storage.

## Security Rules

Selalu enforce:

```text
organization_id dan workspace_id tetap datang dari trusted server scope
viewer tidak boleh trigger materialization lewat route sync management
provider_message_id yang sama tidak boleh membuat duplicate customer/conversation/activity
raw Gmail payload, attachment body/data, dan token tidak boleh ikut tersimpan
materialization tidak boleh auto-send reply atau auto-create AI draft
```
