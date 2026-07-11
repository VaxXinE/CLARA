---
project: "CLARA"
artifact: "P3 Gmail Outbound Client Service Boundary Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-12"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-API-CLIENT-BOUNDARY-SPEC.md"
  - "./CLARA-P3-GMAIL-INBOUND-FINAL-HARDENING-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Outbound Client + Service Boundary

## Purpose

Add an internal Gmail outbound send boundary without exposing a public API route or dashboard UI.

This PR only provides:

- safe Gmail outbound send client types,
- safe Gmail outbound send service types,
- validation for trusted server-side callers,
- simulated Gmail outbound client for local/test,
- safe result DTOs.

## Trusted Caller Model

The service requires a trusted backend actor context:

```text
user_id
organization_id
workspace_id
role
```

The message payload must not provide `organization_id`, `workspace_id`, or role. Those values come from backend auth context only.

## Validation

The service validates:

- provider account ID is present,
- at least one recipient exists,
- recipient count is capped,
- recipients are valid email addresses,
- subject is single-line and length-limited,
- empty subject falls back to `(no subject)`,
- body is non-empty and length-limited,
- unsupported fields are rejected.

## Safe Result

Allowed result fields:

```text
status
provider=gmail
provider_message_id optional
reason_code optional
sent_at optional
correlation_id optional
```

Forbidden result fields:

```text
access_token
refresh_token
Authorization header
client secret
raw Gmail payload
provider raw error body
```

## Security Rules

- Viewer role cannot send through this boundary.
- AI draft generation is not called.
- Inbound sync is not called.
- No real Google/Gmail network call is made by the simulated client.
- Provider failures map to a safe `provider_send_failed` reason code.
- No public HTTP route is added in this PR.

## Non-Goals

- No public Gmail outbound send route.
- No dashboard Gmail send UI.
- No Gmail reply route integration.
- No real Gmail API send implementation.
- No SMTP or IMAP.
- No queue/retry/distributed lock.
- No attachment sending.
- No AI draft generation or auto-send.
