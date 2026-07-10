---
project: "CLARA"
artifact: "P3 Gmail Real OAuth Token Exchange Client Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-OAUTH-TOKEN-EXCHANGE-BOUNDARY-SPEC.md"
  - "./CLARA-P3-GMAIL-OAUTH-CALLBACK-COMPLETION-SPEC.md"
  - "./CLARA-P3-GMAIL-ENCRYPTED-TOKEN-VAULT-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Real OAuth Token Exchange Client

## Purpose

Dokumen ini mendefinisikan client boundary untuk real Google OAuth token exchange pada backend CLARA.

Scope PR ini mencakup:

- HTTP client real untuk token endpoint Google OAuth,
- pemilihan mode `disabled`, `simulated`, atau `real`,
- request form-urlencoded dengan PKCE verifier,
- timeout dan sanitasi provider error,
- validasi config ketat untuk mode `real`,
- test penuh dengan fetch mock tanpa real network call.

PR ini tidak mencakup:

- Gmail API client,
- profile lookup Gmail,
- refresh scheduler,
- public callback completion real end-to-end.

Update status:

```text
Gmail API client boundary sekarang sudah ada sebagai boundary terpisah,
tetapi profile lookup Gmail dan callback completion real end-to-end masih belum diimplementasikan.
```

## Required Request Shape

Client real wajib POST ke token endpoint terkonfigurasi dengan body:

```text
grant_type=authorization_code
code=<authorization code>
client_id=<env only>
client_secret=<env only>
redirect_uri=<allowlisted redirect uri>
code_verifier=<pkce verifier>
```

## Security Rules

Harus selalu enforce:

```text
authorization code tidak boleh dipersist
authorization code tidak boleh dilog
client_secret tidak boleh dilog
raw provider response body tidak boleh diekspos ke API response
raw access_token dan refresh_token tidak boleh keluar dari token vault boundary
simulated mode tidak boleh production
real mode harus fail closed jika config tidak lengkap
```

## Current Limitation

Walaupun real token exchange client sudah ada, CLARA belum menyelesaikan koneksi Gmail real di public callback flow karena:

```text
email address/display name provider account belum bisa diresolusikan tanpa Gmail API client
refresh lifecycle belum diimplementasikan
public callback flow tetap harus fail closed sampai profile resolution siap
```

## Testing Expectations

Minimal harus dibuktikan:

- request body outbound sudah benar,
- code_verifier ikut terkirim,
- client_secret hanya ada di outbound request body ke provider,
- timeout disanitasi,
- non-2xx response disanitasi,
- invalid JSON atau payload provider tidak lengkap ditolak aman,
- tidak ada real Google network call saat test.
