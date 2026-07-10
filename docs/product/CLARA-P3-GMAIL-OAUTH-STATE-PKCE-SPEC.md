---
project: "CLARA"
artifact: "P3 Gmail OAuth State and PKCE Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-AUTH-BOUNDARY-SPEC.md"
  - "./CLARA-P3-GMAIL-ENCRYPTED-TOKEN-VAULT-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail OAuth State + PKCE Boundary Persistence

## Purpose

Dokumen ini mendefinisikan baseline persistence untuk Gmail OAuth connect intent di backend CLARA.

Scope PR ini hanya mencakup:

- tabel `gmail_oauth_state_entries`,
- service internal untuk membuat dan consume OAuth state,
- hashing state dan nonce,
- enkripsi PKCE verifier,
- redirect URI allowlist,
- one-time consume semantics dan expiry handling.

PR ini tidak mencakup:

- real OAuth HTTP redirect route,
- real OAuth callback route,
- real token exchange dengan Google,
- real Gmail API client,
- dashboard OAuth UI.

## Stored Data

Database hanya menyimpan:

```text
state_hash
nonce_hash
pkce_verifier_ciphertext
pkce_verifier_iv
pkce_verifier_auth_tag
pkce_key_version
code_challenge
code_challenge_method=S256
organization_id
workspace_id
actor_user_id
redirect_uri
scopes
status
expires_at
consumed_at
revoked_at
metadata allowlist only
```

Tidak boleh disimpan:

```text
raw state
raw nonce bila tidak dibutuhkan di persistence
plaintext pkce verifier
access token
refresh token
OAuth client secret
raw provider payload
```

## Security Rules

Selalu enforce:

```text
viewer tidak boleh initiate provider connection
redirect_uri harus exact-match allowlist
consume harus one-time only
expired state harus fail closed
cross-workspace consume harus fail closed
state, nonce, dan pkce verifier tidak boleh dilog
AI draft must never auto-send
```
