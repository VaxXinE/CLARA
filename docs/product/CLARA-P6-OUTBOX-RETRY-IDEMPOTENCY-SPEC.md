---
project: "CLARA"
artifact: "P6 Outbox Retry Idempotency Spec"
status: "implemented"
owner: "CLARA Engineering and Security"
classification: "security-spec"
---

# CLARA P6 Outbox Retry Idempotency Spec

## Purpose

Outbox hardening prevents duplicate provider sends, retry storms, unsafe provider error exposure, and cross-workspace idempotency bypass.

## Delivery Lifecycle

Outbound delivery records must use explicit lifecycle statuses:

- `queued`
- `sending`
- `sent`
- `failed`
- `retrying`
- `dead_letter`

`sent`, `failed`, and `dead_letter` are terminal. Terminal records must not be restarted by accident.

## Retry Policy

Retry behavior must be bounded:

- max attempts must be explicit
- backoff must be explicit
- transient provider failures may move to `retrying`
- permanent provider failures move to `failed`
- exhausted transient failures move to `dead_letter`

This prevents infinite retry loops and retry storms.

## Idempotency Policy

Outbound idempotency keys are workspace-scoped by:

- organization id
- workspace id
- channel
- channel account id
- caller-supplied idempotency key hash

The idempotency key must not contain raw reply body, access token, refresh token, Authorization header, client secret, provider raw error, or raw provider payload.

## No Double-Send

`no double-send` is enforced by reserving the scoped idempotency key before provider send work. A duplicate reservation returns a safe duplicate result instead of sending again.

## Safe Result Policy

Outbound errors return safeReasonCode values such as:

- `provider_timeout`
- `provider_rate_limited`
- `provider_unavailable`
- `provider_rejected`
- `duplicate_send`
- `max_attempts_exceeded`
- `outbound_send_failed`

Provider raw error details stay internal and must not be logged or returned.
