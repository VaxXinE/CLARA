---
project: "CLARA"
artifact: "P3 Gmail API Client Boundary Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-AUTH-BOUNDARY-SPEC.md"
  - "./CLARA-P3-GMAIL-REAL-OAUTH-TOKEN-EXCHANGE-CLIENT-SPEC.md"
  - "./CLARA-P3-GMAIL-ENCRYPTED-TOKEN-VAULT-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail API Client Boundary

## Purpose

Dokumen ini mendefinisikan boundary aman untuk HTTP client Gmail API pada backend CLARA.

Scope PR ini mencakup:

- interface Gmail API client,
- real Gmail API HTTP client,
- access token provider boundary yang membaca token hanya lewat encrypted vault,
- config mode `disabled`, `mocked`, atau `real`,
- timeout dan sanitasi error provider,
- test offline penuh dengan fetch mock.

PR ini tidak mencakup:

- Gmail profile verification service,
- inbound fetch workflow,
- outbound send workflow,
- refresh scheduler.

## Core Rule

Boundary ini hanya boleh menerima access token dari internal token vault boundary.

```text
token tidak boleh datang dari public request body
token tidak boleh dilog
token tidak boleh dikembalikan ke caller
provider raw error body tidak boleh diekspos
```

## Modes

```text
disabled -> tidak ada Gmail API client yang dibuat
mocked   -> hanya untuk local/test, diblok di production
real     -> Gmail API HTTP client aktif dengan config eksplisit
```

## Real Client Requirements

Mode `real` wajib:

```text
GMAIL_API_BASE_URL explicit
GMAIL_API_TIMEOUT_MS valid
authorization header dibangun server-side dari token vault
timeout fail closed
non-2xx Gmail response disanitasi
invalid JSON/provider payload ditolak aman
```

## Testing Expectations

Minimal harus dibuktikan:

- request Gmail API outbound memakai Bearer token,
- access token tidak muncul di error,
- timeout disanitasi,
- non-2xx response disanitasi,
- invalid JSON/provider payload ditolak aman,
- missing token fail closed,
- tidak ada real Google network call saat test.
