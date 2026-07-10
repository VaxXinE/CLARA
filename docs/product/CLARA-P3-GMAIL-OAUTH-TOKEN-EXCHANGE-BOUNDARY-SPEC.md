---
project: "CLARA"
artifact: "P3 Gmail OAuth Token Exchange Boundary Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-OAUTH-CALLBACK-VALIDATION-SPEC.md"
  - "./CLARA-P3-GMAIL-ENCRYPTED-TOKEN-VAULT-SPEC.md"
  - "./CLARA-P3-GMAIL-PROVIDER-ACCOUNT-PERSISTENCE-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail OAuth Token Exchange Boundary

## Purpose

Dokumen ini mendefinisikan boundary internal untuk token exchange Gmail OAuth setelah callback berhasil divalidasi.

Scope PR ini hanya mencakup:

- interface client token exchange,
- simulated token exchange client untuk local/test,
- real Google OAuth token exchange client dengan HTTP boundary, timeout, dan sanitasi error,
- service internal untuk menukar authorization code melalui abstraction,
- penyimpanan token hasil exchange hanya melalui encrypted vault,
- create/update Gmail provider account dengan metadata aman,
- sanitasi provider error.

PR ini tidak mencakup:

- real Gmail API client,
- refresh scheduler,
- dashboard OAuth UI.

Catatan:

- callback route sekarang bisa memanggil boundary ini pada mode `simulated`,
- mode `real` sekarang punya real token exchange client boundary,
- tetapi callback completion publik masih fail closed untuk full completion sampai profile resolution Gmail dan Gmail API client diimplementasikan.

## Core Boundary

Aturan inti:

```text
authorization code hanya transient input
authorization code tidak boleh dipersist
authorization code tidak boleh dilog
raw access_token dan refresh_token tidak boleh keluar dari token vault boundary
public route tidak boleh mengembalikan raw token
```

## Service Flow

Flow internal yang diizinkan:

```text
validated callback context
-> token exchange client abstraction
-> encrypted token vault write
-> provider account create/update
-> safe DTO result
```

## Safe Output

Boundary result hanya boleh memuat:

```text
provider
status=connected
safe provider account public DTO
token_expires_at optional
```

Tidak boleh memuat:

```text
authorization code
raw state
raw nonce
pkce verifier
access token
refresh token
client secret
raw provider payload
```

## Guardrails

Wajib enforce:

```text
simulated token exchange client tidak boleh dipakai di production
real token exchange client wajib pakai config lengkap dan timeout aman
real token exchange client tidak boleh membocorkan raw provider body, authorization code, atau client_secret
cross-workspace token exchange harus fail closed
token exchange error harus disanitasi
AI draft must never auto-send
```

## Testing Expectations

Minimal harus dibuktikan:

- successful simulated token exchange menulis token terenkripsi ke vault,
- successful real token exchange client mengirim form body yang benar ke token endpoint dengan fetch yang dimock,
- real token exchange timeout dan non-2xx response disanitasi,
- invalid JSON atau payload provider yang tidak lengkap ditolak aman,
- provider account connected/updated dengan metadata aman,
- raw access_token dan refresh_token tidak pernah muncul di output,
- authorization code tidak dipersist,
- provider error disanitasi,
- simulated client diblok di production,
- tidak ada real network call.
