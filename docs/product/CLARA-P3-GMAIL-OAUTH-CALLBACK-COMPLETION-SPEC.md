---
project: "CLARA"
artifact: "P3 Gmail OAuth Callback Completion Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-OAUTH-CALLBACK-VALIDATION-SPEC.md"
  - "./CLARA-P3-GMAIL-OAUTH-TOKEN-EXCHANGE-BOUNDARY-SPEC.md"
  - "./CLARA-P3-GMAIL-ENCRYPTED-TOKEN-VAULT-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail OAuth Callback Completion Wiring

## Purpose

Dokumen ini mendefinisikan wiring aman dari callback Gmail OAuth ke token exchange boundary pada mode simulated/internal.

Scope PR ini mencakup:

- callback consume one-time state,
- callback memanggil token exchange boundary pada mode `simulated`,
- penyimpanan token hanya melalui encrypted vault,
- create/update Gmail provider account secara aman,
- safe completion response tanpa secret,
- fail-closed untuk mode `real` sampai profile resolution Gmail siap.

## Modes

Mode callback completion:

```text
disabled   -> callback hanya validasi dan mengembalikan pending_token_exchange
simulated  -> callback menyelesaikan koneksi internal dan mengembalikan connected
real       -> fail closed karena real token exchange client sudah ada, tetapi profile resolution Gmail dan Gmail API client belum diimplementasikan
```

## Safe Completion Response

Contoh response mode `simulated`:

```json
{
  "provider": "gmail",
  "status": "connected",
  "message": "Gmail provider account connected successfully.",
  "workspace_id": "wks_demo_sales",
  "account": {
    "id": "gmail_account_demo_001",
    "provider": "gmail",
    "emailAddress": "simulated.gmail.account@example.test",
    "displayName": "Simulated Gmail Account",
    "status": "connected",
    "scopes": ["gmail.readonly", "gmail.send"],
    "lastVerifiedAt": "2026-07-10T12:00:30.000Z",
    "metadata": {
      "mailboxType": "google_workspace",
      "connectionOrigin": "test"
    }
  },
  "token_expires_at": "2026-07-10T14:00:00.000Z"
}
```

Response tidak boleh memuat:

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

## Security Rules

Wajib enforce:

```text
state tetap one-time only
simulated mode tidak boleh production
real mode harus fail closed
authorization code tidak boleh dipersist
raw token tidak boleh keluar dari encrypted vault boundary
cross-workspace completion harus fail closed
AI draft must never auto-send
```
