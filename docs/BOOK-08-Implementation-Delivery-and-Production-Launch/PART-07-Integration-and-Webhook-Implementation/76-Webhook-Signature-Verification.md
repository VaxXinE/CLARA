---
book: "Book VIII — Implementation, Delivery & Production Launch"
part: "PART-07 — Integration and Webhook Implementation"
chapter: "76"
title: "Webhook Signature Verification"
version: "1.0.0"
status: "official"
owner: "CLARA Integration Engineering Team"
last_updated: "2026-07-07"
classification: "integration-webhook-implementation"
previous: "75-Webhook-Ingestion-Implementation.md"
next: "77-Idempotency-and-Replay-Protection.md"
project: "CLARA"
---

# Webhook Signature Verification

> *"Defines implementation standards for webhook signature verification, timestamp checks, raw payload usage, secret rotation, provider-specific schemes, and failure handling."*

---

# Purpose

Defines implementation standards for webhook signature verification, timestamp checks, raw payload usage, secret rotation, provider-specific schemes, and failure handling.

---

# Integration Problem

Unsigned or incorrectly verified webhooks allow attackers to inject fake external events into internal workflows.

---

# Integration Decision

## Decision

CLARA should verify webhook authenticity before trusting payload contents and should fail closed when verification cannot be completed.

## Status

Accepted.

---

# Integration Implementation Rule

Every CLARA integration should be implemented as:

```text
Provider Adapter -> Inbound/Outbound Contract -> Authentication/Signature Verification -> Event Persistence -> Idempotency -> Normalization -> Queue/Worker -> Business Workflow -> Observability -> Audit -> Tests
```

An integration change is not production-ready if it cannot answer:

```text
what provider/channel it connects to
what credentials/scopes it needs
how inbound events are verified
how duplicate events are handled
how replay is prevented
what internal event contract is produced
how tenant/workspace scope is enforced
how provider failures are retried or degraded
how failed events are reprocessed
what telemetry supports operations
what tests prove safe behavior
```

---

# Recommended Integration Flow

```mermaid
sequenceDiagram
    participant Provider as External Provider
    participant Webhook as Webhook Endpoint
    participant Verify as Signature Verification
    participant Store as Event Store
    participant Queue as Queue
    participant Worker as Integration Worker
    participant Domain as Domain Workflow
    participant Obs as Observability/Audit

    Provider->>Webhook: Sends webhook event
    Webhook->>Verify: Verify raw payload and headers
    Verify->>Store: Persist verified event + metadata
    Store->>Queue: Enqueue processing job
    Queue->>Worker: Process event idempotently
    Worker->>Domain: Apply normalized internal event
    Domain->>Obs: Emit logs/metrics/audit evidence
    Webhook-->>Provider: Return fast 2xx/4xx/5xx response
```

---

# Production-Ready Checklist

- [ ] Provider adapter contract exists.
- [ ] Webhook raw body is preserved where required.
- [ ] Signature verification is implemented.
- [ ] Timestamp/replay protection exists.
- [ ] Events are persisted before processing.
- [ ] Processing is idempotent.
- [ ] Internal event schema is versioned.
- [ ] Retry policy is bounded.
- [ ] Dead-letter handling exists.
- [ ] Reprocessing is safe.
- [ ] Observability dashboard exists.
- [ ] Credentials and payloads are protected.
- [ ] Tests cover provider failures and malicious inputs.

---

# Acceptance Criteria

- [ ] External input is treated as untrusted.
- [ ] Integration provider details are isolated.
- [ ] Duplicate and replay risks are controlled.
- [ ] Business logic consumes internal contracts.
- [ ] Failures are observable and recoverable.
- [ ] Security and privacy boundaries are clear.
- [ ] AI coding assistants can apply this safely.

---

# Anti-patterns

Avoid:

- Processing webhook business logic synchronously in the HTTP handler.
- Skipping signature verification in production.
- Trusting provider payloads without validation.
- Using provider event ID without checking scope/source.
- No idempotency key.
- Infinite retries.
- Dead-letter events with no owner.
- Reprocessing without duplicate side-effect protection.
- Logging full payloads with sensitive data.
- Scattered provider-specific code across domain services.

---

# Related Documents

- ../PART-03-Backend-Implementation/README.md
- ../PART-05-Database-and-Migration-Implementation/README.md
- ../PART-06-AI-Gateway-and-Automation-Implementation/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/BOOK-06-Master-Index/README.md
- ../../BOOK-07-Operations-Observability-and-Reliability/PART-03-Logging-and-Metrics/README.md
- ../../BOOK-07-Operations-Observability-and-Reliability/PART-09-Runbooks-and-Playbooks/README.md

---

# Navigation

**Previous:** `75-Webhook-Ingestion-Implementation.md`

**Next:** `77-Idempotency-and-Replay-Protection.md`

---

# Signature Verification Requirements

Verify using:

```text
raw body
provider signature header
timestamp header where available
configured webhook secret
constant-time comparison
provider-specific signing algorithm
```

---

# Verification Failure Handling

On failure:

```text
do not process event
emit security-safe telemetry
return correct status code
avoid logging raw secret/signature
store minimal failure evidence where useful
rate limit repeated failures
```

---

# Secret Rotation

Support:

```text
current secret
previous secret during rotation window
rotation start/end metadata
provider-specific rotation procedure
audit event for rotation
```

---

# Signature Rule

Parsing or modifying body before signature verification can break verification and create security bugs.
