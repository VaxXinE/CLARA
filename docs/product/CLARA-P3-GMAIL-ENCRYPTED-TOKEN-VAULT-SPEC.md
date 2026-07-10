---
project: "CLARA"
artifact: "P3 Gmail Encrypted Token Vault Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-AUTH-BOUNDARY-SPEC.md"
  - "./CLARA-P3-GMAIL-PROVIDER-ACCOUNT-PERSISTENCE-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Encrypted Token Vault Persistence

## Purpose

Dokumen ini mendefinisikan baseline persistence terenkripsi untuk token Gmail di backend CLARA.

Scope PR ini hanya mencakup:

- tabel `gmail_token_vault_entries`,
- boundary enkripsi/dekripsi internal,
- repository DB scoped per organization dan workspace,
- vault service terenkripsi untuk penyimpanan dan pembacaan token internal,
- config guardrail untuk key enkripsi.

PR ini tidak mencakup:

- real OAuth redirect,
- real OAuth callback,
- real Gmail API client,
- token refresh lifecycle,
- operator-facing route atau UI.

## Stored Data

Row vault hanya menyimpan:

```text
id
organization_id
workspace_id
provider_account_id optional
provider=gmail
token_purpose
ciphertext
iv
auth_tag
key_version
expires_at optional
revoked_at optional
metadata allowlist only
created_at
updated_at
```

Tidak boleh disimpan:

```text
plaintext access token
plaintext refresh token
OAuth client secret
raw provider payload
```

## Encryption Boundary

Aturan baseline:

```text
gunakan AES-256-GCM
key harus base64 dan decode ke 32 byte
key_version harus disimpan per row
dekripsi harus fail closed jika key salah, key_version mismatch, atau ciphertext rusak
plaintext token hanya boleh keluar dari vault melalui internal getTokenReference
```

## Scope and Revocation

Aturan akses:

```text
semua read/write harus discoped dengan organization_id + workspace_id
token yang sudah revoked tidak boleh dibaca lagi
wrong organization/workspace harus fail closed
viewer tidak boleh menjadi sumber kebenaran untuk mutasi state provider
```

## Security Notes

Selalu enforce:

```text
no hardcoded encryption key
no real token samples in docs
no token logging
no token values in DTO
no cross-workspace token access
AI draft must never auto-send
```
