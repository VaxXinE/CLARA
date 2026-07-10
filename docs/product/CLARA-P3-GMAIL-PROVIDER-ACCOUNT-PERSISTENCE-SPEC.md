---
project: "CLARA"
artifact: "P3 Gmail Provider Account Persistence Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-AUTH-BOUNDARY-SPEC.md"
  - "./CLARA-P3-GMAIL-ENCRYPTED-TOKEN-VAULT-SPEC.md"
  - "./CLARA-P3-EMAIL-PROVIDER-INTEGRATION-DECISION.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Provider Account Persistence

## Purpose

Dokumen ini menjelaskan baseline persistence untuk akun provider Gmail di backend CLARA.

Scope PR ini hanya mencakup:

- tabel database `gmail_provider_accounts`,
- migration awal untuk persistence akun Gmail,
- repository DB yang scoped per organization dan workspace,
- wiring service agar state akun provider bisa dipersist,
- test deterministik offline untuk create, read, update, revoke, dan duplicate handling.

PR ini tidak mencakup:

- real OAuth redirect atau callback,
- real Gmail API client,
- penyimpanan raw access token atau raw refresh token,
- encrypted token vault production implementation,
- public HTTP route.

## Stored Fields

Tabel ini hanya menyimpan metadata aman:

```text
id
organization_id
workspace_id
provider=gmail
email_address
display_name optional
status
scopes
token_reference_id optional
last_verified_at optional
metadata allowlist only
created_at
updated_at
```

Boundary penting:

```text
token_reference_id hanya referensi internal ke vault boundary
raw access token tidak boleh masuk database
raw refresh token tidak boleh masuk database
OAuth client secret tidak boleh masuk database
raw provider payload tidak boleh masuk database
encrypted token persistence berada di gmail_token_vault_entries dan bukan di tabel akun provider
```

## Scope and Isolation

Aturan akses:

```text
semua read/write harus discoped dengan organization_id + workspace_id
duplicate provider + email hanya dicek di dalam scope workspace yang sama
cross-workspace access harus fail closed
DTO publik tidak boleh mengandung token values
```

## Constraints

Constraint baseline:

```text
provider hanya boleh gmail
status hanya boleh not_connected, connected, revoked, error
email_address tidak boleh kosong
display_name bila ada tidak boleh kosong
token_reference_id bila ada tidak boleh kosong
scopes harus berupa JSON array
metadata harus berupa JSON object
organization_id + workspace_id + provider + email_address harus unique
organization_id + workspace_id + token_reference_id harus unique bila token_reference_id tidak null
```

## Security Notes

Selalu enforce:

```text
no raw token persistence
no token value in DTO
no token value in logs
no raw provider payload storage
no cross-workspace mutation
viewer must remain read-only for future provider connection management routes
AI draft must never auto-send
```
