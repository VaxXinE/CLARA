---
project: "CLARA"
artifact: "P3 Gmail OAuth Token Refresh Boundary Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-ENCRYPTED-TOKEN-VAULT-SPEC.md"
  - "./CLARA-P3-GMAIL-PROVIDER-ACCOUNT-PERSISTENCE-SPEC.md"
  - "./CLARA-P3-GMAIL-REAL-OAUTH-TOKEN-EXCHANGE-CLIENT-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail OAuth Token Refresh Boundary

## Purpose

Dokumen ini mendefinisikan boundary refresh token Gmail untuk backend CLARA.

Scope PR ini hanya mencakup:

- client abstraction untuk refresh access token,
- real HTTP refresh client di balik config explicit,
- simulated refresh client untuk local/test,
- service internal untuk refresh token secara scoped per organization dan workspace,
- penyimpanan access token baru hanya melalui encrypted token vault,
- rotasi refresh token bila provider mengembalikan token baru.

PR ini tidak mencakup:

- background refresh scheduler,
- auto-refresh di Gmail API client,
- Gmail inbound fetch,
- Gmail outbound send,
- UI frontend.

Catatan:

- Gmail connection health check boleh memakai refresh boundary ini secara internal bila access token lama sudah expired atau provider menolak token saat verifikasi profile,
- refresh tetap tidak boleh mengembalikan raw token ke caller.

## Flow

Flow internal yang diizinkan:

```text
trusted server input
-> scoped provider account lookup
-> scoped encrypted token vault lookup
-> refresh token dipakai hanya di refresh boundary
-> provider refresh client dipanggil
-> token baru ditulis kembali ke vault
-> provider account diupdate dengan token_reference_id baru
```

## Response Safety

Result service hanya boleh berisi:

```text
provider
status=refreshed
safe provider account DTO
refreshed_at
token_expires_at optional
```

Tidak boleh berisi:

```text
access_token
refresh_token
client_secret
raw provider payload
```

## Security Rules

Selalu enforce:

```text
no token logging
no client_secret logging
no raw provider error body in responses
cross-workspace refresh must fail closed
simulated refresh mode blocked in production
real refresh mode requires client_id, client_secret, and token endpoint
AI draft must never auto-send
```
