---
book: "Book V — Engineering Execution Plan"
part: "PART-07 — Integration Implementation Plan"
chapter: "107"
title: "Integration Gateway Architecture"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan"
previous: "106-Integration-Implementation-Plan-Overview.md"
next: "108-Provider-Adapter-Pattern.md"
project: "CLARA"
---

# Integration Gateway Architecture

> *"Defines the Integration Gateway as the central backend layer for inbound/outbound provider communication."*

---

# Purpose

Defines the Integration Gateway as the central backend layer for inbound/outbound provider communication.

---

# Execution Problem

Scattered integration logic makes security validation, idempotency, retries, logging, and provider behavior inconsistent.

---

# Engineering Decision

## Decision

CLARA should route all integration behavior through an Integration Gateway rather than scattering provider-specific logic across product modules.

## Status

Accepted.

---

# Integration Implementation Rule

Every integration feature must be designed as:

```text
External Input / Output -> Provider Adapter -> Validation -> Idempotency -> Normalization -> Scoped Domain Action -> Audit / Logs / Metrics
```

Do not treat external payloads as trusted internal data.

Do not store raw secrets in normal tables.

Do not let integrations bypass tenant, workspace, permission, or entitlement boundaries.

---

# Recommended Flow

```mermaid
sequenceDiagram
    participant Provider as External Provider
    participant Gateway as Integration Gateway
    participant Verify as Auth/Signature Verify
    participant Adapter as Provider Adapter
    participant Queue as Queue/Worker
    participant Domain as CLARA Domain Module
    participant Audit as Audit Logger
    participant Health as Integration Health

    Provider->>Gateway: Sends event/webhook/API payload
    Gateway->>Verify: Verify identity/signature if available
    Verify-->>Gateway: Valid or rejected
    Gateway->>Adapter: Validate and normalize payload
    Adapter-->>Gateway: Normalized integration event
    Gateway->>Gateway: Check idempotency
    Gateway->>Queue: Enqueue safe event
    Queue->>Domain: Execute scoped domain behavior
    Domain->>Audit: Emit audit if sensitive
    Queue->>Health: Record success/failure metrics
```

---

# Secure-by-Design Checklist

- [ ] Provider identity is verified where possible.
- [ ] Webhook signature is verified where supported.
- [ ] Payload schema is validated.
- [ ] Payload is normalized before domain use.
- [ ] Idempotency key or external event reference is checked.
- [ ] Organization/workspace scope is resolved safely.
- [ ] Credential values are not logged or returned.
- [ ] Provider-specific logic stays inside adapter.
- [ ] Retry behavior is safe and bounded.
- [ ] Failure is recorded and diagnosable.
- [ ] Sensitive integration actions are audited.
- [ ] Rate limits are considered.
- [ ] Tests cover invalid, duplicate, and unauthorized events.

---

# Acceptance Criteria

- [ ] Implementation direction is clear.
- [ ] External trust boundary is explicit.
- [ ] Credential behavior is safe.
- [ ] Idempotency behavior is defined.
- [ ] Retry/failure handling is included.
- [ ] Observability expectations are included.
- [ ] Security testing expectations are included.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Direct provider logic inside product modules.
- Trusting webhook payloads without validation.
- Ignoring signature verification.
- Processing duplicate provider events.
- Logging raw provider payloads with secrets/PII.
- Storing raw access tokens in visible config tables.
- Building many fragile integrations before one reliable channel.
- Using unofficial scraping as production-grade architecture.
- Allowing integration setup by low-privilege users.
- Hiding integration failures from admins.

---

# Related Documents

- ../PART-03-Backend-Implementation-Plan/README.md
- ../PART-05-Database-and-Migration-Plan/README.md
- ../PART-06-AI-Implementation-Plan/README.md
- ../../BOOK-04-Product-Domain-Specification/PART-10-Integrations-and-Channels/README.md
- ../../BOOK-04-Product-Domain-Specification/PART-09-Workflow-Automation/README.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-PERMISSION-MAP.md

---

# Navigation

**Previous:** `106-Integration-Implementation-Plan-Overview.md`

**Next:** `108-Provider-Adapter-Pattern.md`

---

# Integration Gateway Responsibilities

The Integration Gateway owns:

```text
Provider routing
Payload verification
Schema validation
Adapter execution
Idempotency check
Queue handoff
Failure normalization
Delivery logging
Health metrics
Audit hooks
```

---

# Suggested Module Shape

```text
apps/api/src/modules/integrations/
├── integrations.controller.ts
├── integrations.service.ts
├── integration-gateway.service.ts
├── providers/
│   ├── provider-adapter.interface.ts
│   ├── web-chat.adapter.ts
│   └── custom-api.adapter.ts
├── webhooks/
├── credentials/
├── channels/
├── sync/
├── health/
├── dto/
└── tests/
```

---

# Gateway Rule

Provider adapters may understand provider payloads.

Domain modules should receive normalized internal commands/events only.
