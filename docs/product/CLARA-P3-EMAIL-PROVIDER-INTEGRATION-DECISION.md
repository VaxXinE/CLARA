---
project: "CLARA"
artifact: "P3 Email Provider Integration Decision"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "decision-spike"
related_documents:
  - "./CLARA-P3-EMAIL-PROVIDER-RISK-MATRIX.md"
  - "./CLARA-P3-EMAIL-CHANNEL-ADAPTER-SPEC.md"
  - "./CLARA-P3-EMAIL-INBOUND-PERSISTENCE-SPEC.md"
  - "./CLARA-P3-EMAIL-INGESTION-HARNESS-SPEC.md"
  - "./CLARA-P3-EMAIL-REPLY-ADAPTER-SPEC.md"
  - "./CLARA-P3-EMAIL-OUTBOUND-DELIVERY-SPEC.md"
  - "./CLARA-P3-EMAIL-E2E-INTERNAL-SMOKE-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Email Provider Integration Decision / Spike

## Purpose

Dokumen ini adalah spike keputusan arsitektur untuk integrasi provider email nyata pertama di CLARA.

PR ini tidak mengimplementasikan provider nyata. Tujuannya hanya:

- membandingkan opsi provider,
- memilih arah integrasi pertama,
- menetapkan boundary implementasi,
- menetapkan security dan operational guardrail untuk PR berikutnya.

## Decision Summary

Rekomendasi awal:

```text
pilih Gmail API sebagai first production integration path untuk Gmail / Google Workspace users
simpan IMAP + SMTP sebagai fallback atau adapter tahap berikutnya
simpan SMTP-only sebagai opsi outbound-only yang lebih sempit
simpan transactional provider API sebagai opsi outbound-only masa depan
```

## Why Gmail API First

Alasan utama:

```text
inbound dan outbound bisa berada dalam satu ecosystem provider yang sama
OAuth dan scope model lebih jelas daripada menyimpan kredensial IMAP/SMTP tradisional
thread dan message identity lebih kuat untuk idempotency dan conversation linking
Google Workspace adalah target yang cukup umum untuk tim bisnis
lebih cocok untuk auditability, revoke flow, dan least-privilege access dibanding username/password mailbox access
```

Alasan keamanan:

```text
lebih mudah mendorong encrypted token storage dibanding password mailbox statis
lebih mudah revoke access tanpa reset password mailbox
lebih jelas memisahkan scope baca inbox vs kirim reply
lebih kecil risiko mendorong penyimpanan kredensial SMTP/IMAP jangka panjang
```

## Candidate Comparison

### 1. Gmail API

Kelebihan:

```text
supports inbound read/fetch and outbound send
OAuth-based trust boundary
message and thread identifiers membantu idempotency
lebih cocok untuk future webhook/polling hybrid design
```

Kekurangan:

```text
bergantung pada Google ecosystem
butuh OAuth flow dan token lifecycle yang lebih matang
scope harus dirancang ketat sejak awal
```

### 2. IMAP + SMTP

Kelebihan:

```text
lebih portable untuk mailbox provider non-Google
inbound dan outbound tersedia
```

Kekurangan:

```text
operasional lebih kompleks
sering mendorong penggunaan credential-style access yang lebih berisiko
threading dan metadata consistency lebih lemah antar provider
lebih sulit untuk secure-by-default jika dibanding Gmail API
```

### 3. SMTP-only

Kelebihan:

```text
sederhana untuk outbound-only send
berguna bila inbound dikelola di jalur lain
```

Kekurangan:

```text
tidak menyelesaikan inbound path
tidak cukup untuk CLARA inbox workflow end-to-end
```

### 4. Transactional Provider API

Kelebihan:

```text
baik untuk outbound reliability, analytics, dan provider-delivery tooling
sering punya retry, status, dan webhook yang lebih baik untuk send path
```

Kekurangan:

```text
sering outbound-only
tidak menyelesaikan operator inbox ingestion dengan send-only capability
menambah vendor coupling lebih awal
```

## Recommended First Production Path

Urutan rekomendasi:

1. Gmail API untuk first real integration.
2. IMAP + SMTP hanya setelah Gmail path stabil atau bila ada kebutuhan mailbox non-Google yang kuat.
3. Transactional provider API sebagai opsi outbound-only future enhancement.
4. SMTP-only bukan jalur utama CLARA inbox karena tidak menyelesaikan inbound.

## Non-Goals

PR ini tidak memutuskan:

```text
final OAuth consent screen implementation
final token table schema
final worker topology
final webhook design
final provider failover strategy
multi-provider routing policy
operator UI untuk provider setup
```

## Deferred Decisions

Ditunda ke PR implementasi berikutnya:

```text
polling vs webhook-first inbox sync
exact Google scopes yang dipilih setelah prototype verification
encrypted token storage implementation detail
token refresh cadence
provider reconnect UX
dead-letter remediation UX
```

## Integration Boundaries

### Inbound Fetch / Webhook Boundary

Aturan:

```text
provider fetch or webhook payload is untrusted
provider payload must be normalized at the adapter boundary
no business persistence before trusted provider verification and workspace resolution
no raw provider payload storage
```

### Outbound Reply Send Boundary

Aturan:

```text
human explicit send remains required
AI draft must remain draft-only
provider send result must be reduced to allowlisted metadata only
provider raw response must never cross into product modules
```

### OAuth / Token Boundary

Aturan:

```text
no client secret in repo
no refresh token in repo
encrypted token storage only
least-privilege scopes only
revocation and reconnect flow required
token values must never be logged
```

### Audit / Logging Boundary

Aturan:

```text
do not log raw email body
do not log raw provider payload
do not log auth headers or tokens
store safe provider metadata only
sanitize provider errors before they reach API users or logs
```

### Workspace Isolation Boundary

Aturan:

```text
provider mailbox access must resolve to trusted CLARA organization/workspace mapping server-side
organization_id and workspace_id must never come from frontend or raw provider payload
cross-workspace resource reuse must fail closed
```

## Security Requirements For Future Implementation

Future PR wajib memenuhi:

```text
no secrets in repo
encrypted token storage only
token rotation and revocation support
least-privilege scopes
no raw provider payload storage
no raw body logging
metadata allowlist
provider error sanitization
rate limit and exponential backoff
idempotency for inbound and outbound operations
```

Tambahan requirement:

```text
provider auth failure must fail closed
provider reconnect and revoke path must be auditable
no auto-send of AI drafts
```

## Operational Requirements

Future implementation harus punya baseline berikut:

```text
retry strategy with capped backoff
dead-letter or explicit failed-state handling
structured observability for fetch/send/refresh failures
staging smoke plan with non-production mailbox
rollback plan that can disable provider path without data corruption
```

## Suggested Future Delivery Order

Urutan implementasi yang disarankan:

1. Gmail OAuth/token storage design.
2. Trusted workspace mailbox mapping design.
3. Inbound fetch prototype with strict normalization.
4. Outbound send prototype with safe delivery record updates.
5. Staging smoke runbook and revoke/rollback test.

## Final Position

Keputusan spike ini:

```text
Gmail API adalah first real integration path yang paling production-minded untuk CLARA saat ini
IMAP + SMTP bukan first choice karena security dan operational complexity lebih tinggi
SMTP-only dan transactional provider API tetap berguna, tetapi bukan jalur pertama untuk inbox workflow end-to-end
```
