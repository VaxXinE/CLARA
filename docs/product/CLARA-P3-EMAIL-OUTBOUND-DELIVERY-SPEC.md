---
project: "CLARA"
artifact: "P3 Email Outbound Delivery Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-EMAIL-REPLY-ADAPTER-SPEC.md"
  - "./CLARA-P3-EMAIL-CHANNEL-ADAPTER-SPEC.md"
  - "./CLARA-P3-EMAIL-INBOUND-PERSISTENCE-SPEC.md"
  - "./CLARA-P3-EMAIL-INGESTION-HARNESS-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Email Outbound Delivery Spec

## Purpose

Dokumen ini mendefinisikan baseline persistence untuk hasil pengiriman email outbound dari adapter reply email internal CLARA.

Scope PR ini hanya mencakup:

- penyimpanan record delivery outbound email yang aman,
- idempotency scoped per `organization_id` dan `workspace_id`,
- status `simulated`, `sent`, dan `failed`,
- metadata allowlist yang kecil dan aman.

Di luar scope:

- SMTP/Gmail API integration,
- OAuth flow,
- attachment sending,
- HTML email rendering,
- queue/retry worker,
- public webhook,
- auto-send dari AI draft.

## Data Model

Tabel `email_outbound_deliveries` menyimpan:

- `organization_id`
- `workspace_id`
- `conversation_id`
- `customer_id` nullable
- `reply_id` nullable
- `actor_user_id`
- `channel`
- `provider`
- `provider_message_id` nullable
- `provider_thread_id` nullable
- `idempotency_key` nullable
- `status`
- `failure_code` nullable
- `metadata`
- `sent_at` nullable
- `failed_at` nullable
- `created_at`

## Security Rules

- Jangan simpan raw provider response payload.
- Jangan simpan Authorization header, token, cookie, atau raw JWT.
- Jangan simpan full reply body di delivery record.
- Jangan simpan metadata provider yang tidak di-allowlist.
- Scope duplicate detection wajib memakai `organization_id` dan `workspace_id`.
- `actor_user_id` harus berasal dari server-side context, bukan input frontend.
- Viewer tetap tidak boleh mengirim reply.
- AI draft tetap tidak boleh auto-send.

## Idempotency

Duplicate detection dilakukan dengan urutan:

1. `organization_id + workspace_id + idempotency_key`
2. `organization_id + workspace_id + provider + provider_message_id`

Artinya key atau provider message yang sama di workspace lain tidak dianggap duplicate.

## Metadata Allowlist

Metadata aman yang disimpan saat ini:

- `source = email_reply_adapter`
- `transport = simulated`

Jika field lain muncul dari adapter/provider, field tersebut harus di-drop sampai ada review arsitektur dan security yang jelas.

## Current Limitation

- Belum ada real provider send.
- Belum ada retry lifecycle.
- Belum ada reconciliation webhook/provider callback.
- Belum ada dashboard UI untuk melihat outbound delivery records.
