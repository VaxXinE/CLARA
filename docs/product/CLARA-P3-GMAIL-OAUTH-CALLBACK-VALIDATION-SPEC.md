---
project: "CLARA"
artifact: "P3 Gmail OAuth Callback Validation Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-OAUTH-CONNECT-URL-SPEC.md"
  - "./CLARA-P3-GMAIL-OAUTH-STATE-PKCE-SPEC.md"
  - "./CLARA-P3-GMAIL-AUTH-BOUNDARY-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail OAuth Callback Validation Route

## Purpose

Dokumen ini mendefinisikan baseline route callback Gmail OAuth yang hanya melakukan validasi callback dan consume one-time state.

Scope PR ini hanya mencakup:

- validasi query callback,
- sanitasi provider error,
- one-time consume untuk `state`,
- validasi `code` sebagai input transient,
- safe response DTO tanpa secret,
- tanpa token exchange.

PR ini tidak mencakup:

- token exchange dengan Google,
- refresh token lifecycle,
- Gmail API client,
- dashboard OAuth UI,
- persistence access token atau refresh token dari Google.

Catatan:

- token exchange boundary internal sekarang sudah ada sebagai service terpisah,
- public callback route tetap tidak otomatis menjalankan token exchange pada build ini.

## Route

Endpoint callback:

```text
GET /api/v1/integrations/gmail/oauth/callback
```

Route ini:

- tidak membutuhkan auth session frontend,
- hanya percaya pada `state` yang sebelumnya dibuat server,
- tidak melakukan network call ke Google,
- tidak menyimpan authorization code,
- tidak mengembalikan code, state, nonce, atau PKCE verifier.

## Query Contract

Contoh callback sukses:

```text
?code=provider-code&state=oauth-state
```

Contoh callback error:

```text
?error=access_denied&error_description=user_cancelled&state=oauth-state
```

Aturan:

- `code` wajib untuk success path.
- `state` wajib untuk success path.
- `error` opsional untuk provider error path.
- `error_description` hanya dianggap input transient dan tidak boleh di-echo ke response.

## Success Response

Contoh response aman:

```json
{
  "provider": "gmail",
  "status": "pending_token_exchange",
  "message": "Gmail OAuth callback validated. Token exchange is not enabled in this build.",
  "workspace_id": "wks_demo_sales",
  "state_consumed_at": "2026-07-10T10:01:00.000Z",
  "state_expires_at": "2026-07-10T10:05:00.000Z"
}
```

## Provider Error Response

Contoh response aman:

```json
{
  "provider": "gmail",
  "status": "provider_error",
  "message": "Gmail connection was cancelled by the provider or user."
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
error_description mentah
```

## Security Rules

Wajib enforce:

```text
authorization code hanya transient input
authorization code tidak boleh dipersist
authorization code tidak boleh dilog
state tidak boleh direuse
expired state harus fail closed
unknown state harus fail closed
provider error harus disanitasi
state boleh direvoke pada provider error bila tersedia
tidak boleh ada Google/Gmail network call pada PR ini
AI draft must never auto-send
```

## Testing Expectations

Minimal harus dibuktikan dengan test offline:

- callback sukses mengonsumsi state tepat sekali,
- reused state ditolak,
- expired state ditolak,
- missing `code` ditolak,
- missing `state` ditolak,
- provider error disanitasi,
- authorization code tidak pernah tersimpan,
- authorization code tidak pernah dikembalikan,
- raw state tidak pernah dikembalikan,
- PKCE verifier tidak pernah dikembalikan,
- tidak ada real network call.
