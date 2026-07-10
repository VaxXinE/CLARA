---
project: "CLARA"
artifact: "P3 Gmail Profile Verification Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-API-CLIENT-BOUNDARY-SPEC.md"
  - "./CLARA-P3-GMAIL-AUTH-BOUNDARY-SPEC.md"
  - "./CLARA-P3-GMAIL-PROVIDER-ACCOUNT-PERSISTENCE-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Profile Verification

## Purpose

Dokumen ini mendefinisikan verification client/service untuk akun Gmail provider yang sudah terkoneksi.

Scope PR ini mencakup:

- pemanggilan `GET /gmail/v1/users/me/profile` lewat Gmail API client boundary,
- safe profile DTO,
- verifikasi email akun Gmail terhadap provider account internal,
- update metadata aman seperti `historyId`,
- update `lastVerifiedAt` dan status aman pada provider account.

PR ini tidak mencakup:

- inbound message fetch,
- outbound send,
- token refresh scheduler,
- background worker.

## Safe Profile DTO

Service hanya boleh mengembalikan:

```text
email_address
messages_total optional
threads_total optional
history_id optional
verified_at
```

Tidak boleh mengembalikan:

```text
access token
refresh token
raw provider response body
raw Gmail API error body
```

## Verification Rules

Harus selalu enforce:

```text
provider account lookup discoped dengan organization_id + workspace_id
access token hanya dibaca lewat token vault boundary
profile email harus match dengan provider account email yang sudah tersimpan
historyId hanya boleh disimpan sebagai allowlisted metadata
cross-workspace verification harus fail closed
provider error harus disanitasi
```
