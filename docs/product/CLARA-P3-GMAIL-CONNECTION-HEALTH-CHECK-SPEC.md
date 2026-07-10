---
project: "CLARA"
artifact: "P3 Gmail Connection Health Check Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-PROFILE-VERIFICATION-SPEC.md"
  - "./CLARA-P3-GMAIL-OAUTH-TOKEN-REFRESH-BOUNDARY-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Connection Health Check

## Purpose

Dokumen ini mendefinisikan health check backend untuk koneksi Gmail per provider account.

Scope PR ini hanya mencakup:

- service health check scoped per organization dan workspace,
- DTO health yang aman,
- route management-scoped untuk mengecek health koneksi Gmail,
- mapping aman dari kondisi token/profile ke status health.

PR ini tidak mencakup:

- background scheduler,
- inbound Gmail fetch,
- outbound Gmail send,
- UI frontend Gmail management.

Catatan:

- health check ini dapat dipakai bersama inbound fetch boundary untuk memastikan koneksi masih layak dipakai sebelum future sync dijalankan,
- PR ini sendiri tetap tidak menambahkan sync worker atau persistence Gmail messages.

## Safe Response

DTO hanya boleh berisi:

```text
provider_account_id
provider
status
reason_code
email_address optional
last_verified_at optional
token_expires_at optional
checked_at
```

Tidak boleh berisi:

```text
access_token
refresh_token
client_secret
raw provider error body
```

## Status Mapping

Baseline status:

```text
healthy
degraded
disconnected
action_required
```

Contoh reason code:

```text
ok
token_reference_missing
token_reference_unavailable
access_token_expired
refresh_token_missing
token_refresh_failed
provider_rejected
provider_unavailable
profile_email_mismatch
profile_check_failed
```

## Security Rules

Selalu enforce:

```text
scope lookup by organization_id + workspace_id + provider_account_id
viewer must not call management health route
no cross-workspace health check
no token logging
no token return
no client_secret logging
no raw provider error exposure
```
