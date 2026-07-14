---
project: "CLARA"
artifact: "P6 Webhook Hardening Spec"
status: "implemented"
owner: "CLARA Engineering and Security"
classification: "security-spec"
---

# CLARA P6 Webhook Hardening Spec

## Purpose

Webhook Hardening defines the minimum safe boundary for provider callbacks before CLARA accepts or materializes external events.

## Provider Rules

| Provider | Boundary | Required Check |
| --- | --- | --- |
| WhatsApp | official provider webhook | verify token on challenge and provider signature on inbound POST |
| Webchat | CLARA public widget boundary | channel public key resolves organization/workspace server-side |
| Extension bridge | authenticated CLARA bridge | backend AuthContext and role checks required |
| Unsupported providers | blocked | fail closed with `unsupported_provider` |

## Dedup And Replay

Webhook dedup uses provider event id when available. If a provider event id is unavailable, CLARA may use a normalized content hash fallback from safe normalized fields only.

Rules:

- Dedup keys are workspace-scoped by organization, workspace, and provider.
- Replay attempts return safe `duplicate_replay` behavior.
- No raw provider payload is required for dedup.
- No raw provider payload, token, cookie, Authorization header, or provider raw error may be logged or returned.

## Safe Result Policy

Webhook results use safeReasonCode values such as:

- `invalid_signature`
- `invalid_verify_token`
- `unsupported_provider`
- `invalid_payload`
- `duplicate_replay`
- `rate_limited`
- `payload_too_large`

The response must never include provider secrets, full request bodies, raw provider errors, or client-supplied tenant authority. Tenant scope comes from backend AuthContext or server-side channel account mapping only.
