---
project: "CLARA"
artifact: "P3 Gmail Auth Boundary Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-EMAIL-PROVIDER-INTEGRATION-DECISION.md"
  - "./CLARA-P3-EMAIL-PROVIDER-RISK-MATRIX.md"
  - "./CLARA-P3-EMAIL-CHANNEL-ADAPTER-SPEC.md"
  - "./CLARA-P3-GMAIL-PROVIDER-ACCOUNT-PERSISTENCE-SPEC.md"
  - "./CLARA-P3-GMAIL-ENCRYPTED-TOKEN-VAULT-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Auth Boundary Skeleton

## Purpose

Dokumen ini mendefinisikan boundary skeleton untuk koneksi akun Gmail provider di backend CLARA.

Scope PR ini hanya mencakup:

- type/domain model akun provider Gmail,
- token vault interface,
- mock in-memory vault untuk test,
- service skeleton untuk account state,
- production guardrail config.

PR ini tidak mengimplementasikan:

- real OAuth redirect,
- real OAuth callback,
- real Gmail API client,
- real token refresh,
- real encrypted token storage,
- public HTTP route.

## Core Rule

Boundary ini bersifat internal-only.

```text
tidak ada token yang boleh keluar dari vault boundary
tidak ada token yang boleh masuk dari public request body
tidak ada network call ke Google di PR ini
```

## Provider Account Shape

Current model:

```text
id
organization_id
workspace_id
provider=gmail
email_address
display_name optional
status
scopes
last_verified_at
created_at
updated_at
metadata allowlist only
token_reference_id internal only
```

Persistence baseline:

```text
provider account state is now persisted in gmail_provider_accounts
only safe metadata and token_reference_id are stored
raw access_token and refresh_token stay outside the database
duplicate provider + email in the same organization/workspace scope is rejected
```

Public DTO hanya mengandung:

```text
provider
email_address
display_name
status
scopes
last_verified_at
metadata allowlist only
```

## Token Vault Boundary

Vault interface saat ini:

```text
storeTokenReference
getTokenReference
revokeTokenReference
```

Aturan:

```text
token values never appear in public DTOs
token values never appear in logs
mock vault is test-only
mock vault is blocked in production
encrypted vault persistence requires explicit base64 AES-256-GCM key material plus key_version
encrypted rows store ciphertext, iv, auth_tag, key_version, token_purpose, and allowlisted metadata only
```

## Security Notes

Selalu enforce:

```text
no Gmail OAuth client secret in repo
no refresh token in repo
no access token in repo
no raw provider payload storage
no raw body logging
workspace isolation stays server-side
AI draft must never auto-send
```
