---
project: "CLARA"
artifact: "P3 Gmail OAuth Connect URL Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-AUTH-BOUNDARY-SPEC.md"
  - "./CLARA-P3-GMAIL-OAUTH-STATE-PKCE-SPEC.md"
  - "./CLARA-P3-GMAIL-PROVIDER-ACCOUNT-PERSISTENCE-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail OAuth Connect URL Service + Route Skeleton

## Purpose

Dokumen ini mendefinisikan baseline service dan route backend untuk memulai Gmail OAuth connect flow secara aman.

Scope PR ini hanya mencakup:

- service pembuat authorization URL,
- route authenticated untuk membuat connect intent,
- persistence OAuth state + PKCE melalui service yang sudah ada,
- redirect URI exact allowlist validation,
- scope allowlist validation,
- safe response DTO tanpa secret.

PR ini tidak mencakup:

- OAuth callback route,
- token exchange dengan Google,
- refresh flow,
- Gmail API client,
- dashboard OAuth UI.

## Route

Endpoint internal backend:

```text
POST /api/v1/integrations/gmail/oauth/connect
```

Route harus:

- require authenticated server-side auth context,
- memakai role/permission backend, bukan data dari frontend,
- block viewer,
- tidak melakukan network call ke Google,
- membuat connect intent melalui Gmail OAuth state service,
- mengembalikan authorization URL yang aman dipakai frontend di fase berikutnya.

## Request Contract

Request body yang diizinkan:

```json
{
  "redirect_uri": "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
  "scopes": ["gmail.readonly", "gmail.send"]
}
```

Aturan validasi:

- `redirect_uri` opsional, tetapi bila dikirim harus valid URL dan exact-match dengan allowlist.
- `scopes` opsional, tetapi bila dikirim harus subset dari allowlist scope.
- Scope arbitrary tidak boleh diterima.
- `organization_id`, `workspace_id`, `role`, `user_id`, token, atau PKCE input tidak boleh diterima dari body.

## Response Contract

Response aman:

```json
{
  "provider": "gmail",
  "authorization_url": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "scopes": ["gmail.readonly", "gmail.send"],
  "expires_at": "2026-07-10T12:00:00.000Z",
  "state_expires_at": "2026-07-10T12:00:00.000Z"
}
```

Response tidak boleh memuat:

```text
pkce verifier
raw nonce
access token
refresh token
client secret
raw provider payload
```

## Config Boundary

Env/config yang dipakai:

```text
GMAIL_OAUTH_AUTHORIZATION_ENDPOINT
GMAIL_OAUTH_CLIENT_ID
GMAIL_OAUTH_REDIRECT_URI
GMAIL_OAUTH_REDIRECT_URI_ALLOWLIST
GMAIL_OAUTH_ALLOWED_SCOPES
```

Aturan:

- `GMAIL_OAUTH_CLIENT_ID` boleh placeholder kosong di local sampai feature benar-benar diaktifkan.
- `GMAIL_OAUTH_REDIRECT_URI_ALLOWLIST` harus berupa daftar exact URI yang diizinkan.
- `GMAIL_OAUTH_ALLOWED_SCOPES` harus allowlist ketat, bukan passthrough arbitrary scope.
- Tidak boleh ada `client_secret` di route atau response.

## Security Rules

Wajib enforce:

```text
viewer tidak boleh initiate provider connection
route requires auth
redirect_uri exact-match allowlist
scope harus allowlisted
state disimpan hashed, bukan raw
pkce verifier tidak boleh dikembalikan ke client
nonce tidak boleh dikembalikan ke client
tidak boleh log state, nonce, pkce verifier, token, atau Authorization header
tidak boleh ada Google/Gmail network call pada PR ini
AI draft must never auto-send
```

## Testing Expectations

Test deterministik offline minimal harus membuktikan:

- connect URL berhasil dibuat untuk owner/agent yang valid,
- response mengandung `code_challenge`,
- PKCE verifier tidak pernah muncul di response,
- raw nonce tidak pernah muncul di response,
- state disimpan hashed,
- unsafe redirect URI ditolak,
- unallowlisted scope ditolak,
- viewer mendapat 403,
- request tanpa auth mendapat 401,
- tidak ada real network call.
