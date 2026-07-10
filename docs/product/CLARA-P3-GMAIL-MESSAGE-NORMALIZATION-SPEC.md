---
project: "CLARA"
artifact: "P3 Gmail Message Normalization Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-INBOUND-MESSAGE-FETCH-CLIENT-SPEC.md"
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-ORCHESTRATOR-SPEC.md"
  - "./CLARA-P3-EMAIL-INBOUND-PERSISTENCE-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Message Normalization

## Purpose

Dokumen ini mendefinisikan normalisasi aman dari Gmail fetched message DTO ke envelope inbound email internal CLARA.

Scope PR ini hanya mencakup:

- mapping field Gmail yang aman,
- allowlist header,
- snippet sebagai text preview aman,
- metadata thread dan label yang aman,
- hook opsional untuk persist envelope yang sudah dinormalisasi.

PR ini tidak mencakup:

- customer creation dari Gmail,
- conversation creation dari Gmail,
- activity creation dari Gmail,
- AI draft generation,
- outbound Gmail send,
- attachment download atau raw payload storage.

## Safe Normalized Fields

Envelope normalisasi hanya boleh berisi:

```text
provider = gmail
provider_account_id
provider_message_id
provider_thread_id
message_id
in_reply_to
references
snippet
label_ids
cc
bcc
normalized inbound email core fields
```

Core inbound email hanya boleh menyimpan:

```text
fromEmail
fromName
toEmail
subject
textBody
htmlBodyPresent boolean
receivedAt
attachmentsPresent boolean
allowlisted headers only
```

## Security Rules

Selalu enforce:

```text
tidak boleh menyimpan raw Gmail payload
tidak boleh menyimpan raw attachment body/data
tidak boleh menyimpan access token atau refresh token
tidak boleh menyimpan Authorization header
header harus allowlist only
snippet boleh dipakai sebagai text preview aman
persist hook Gmail tidak boleh diam-diam membuat customer/conversation/activity di PR ini
```
