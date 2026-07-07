---
book: "Book V — Engineering Execution Plan"
part: "PART-03 — Backend Implementation Plan"
chapter: "27"
title: "Backend Architecture Execution"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan"
previous: "26-Backend-Implementation-Plan-Overview.md"
next: "28-API-Service-Structure.md"
project: "CLARA"
---

# Backend Architecture Execution

> *"Defines the practical backend architecture style to be used during implementation."*

---

# Purpose

Defines the practical backend architecture style to be used during implementation.

---

# Execution Problem

A microservice architecture too early increases operational complexity, while an unstructured monolith becomes hard to maintain.

---

# Engineering Decision

## Decision

CLARA backend should use a modular monolith first for MVP, with strong domain boundaries and clear extraction paths for future services.

## Status

Accepted.

---

# Backend Implementation Rule

Every backend feature must be designed as:

```text
Request -> Authentication -> Authorization -> Scope Check -> Validation -> Domain Logic -> Persistence -> Audit/Events -> Safe Response
```

Do not put business rules only in controllers.

Do not rely on frontend-only checks.

Do not query tenant-scoped records without organization/workspace filters.

---

# Recommended Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as API Controller
    participant Auth as Auth Middleware
    participant Guard as Authorization Guard
    participant Service as Domain Service
    participant Repo as Repository
    participant Audit as Audit Logger
    participant DB as Database

    Client->>API: Sends request
    API->>Auth: Resolve actor
    Auth-->>API: Actor context
    API->>Guard: Check permission and scope
    Guard-->>API: Allow or deny
    API->>API: Validate request DTO
    API->>Service: Execute domain behavior
    Service->>Repo: Read/write scoped data
    Repo->>DB: Query with organization/workspace filters
    Service->>Audit: Emit audit event if sensitive
    Service-->>API: Return domain result
    API-->>Client: Return safe response DTO
```

---

# Secure-by-Design Checklist

- [ ] Actor identity is available.
- [ ] Permission check is backend-enforced.
- [ ] Organization scope is checked.
- [ ] Workspace scope is checked where relevant.
- [ ] Input DTO/schema validation exists.
- [ ] Domain service owns business rules.
- [ ] Repository queries are scoped.
- [ ] Response DTO does not leak sensitive fields.
- [ ] Sensitive action emits audit event.
- [ ] Logs do not include secrets or unnecessary PII.
- [ ] Tests include unauthorized and cross-scope cases.
- [ ] Errors return safe messages.

---

# Acceptance Criteria

- [ ] Implementation direction is clear.
- [ ] Security requirements are explicit.
- [ ] Backend boundaries are respected.
- [ ] MVP behavior is separated from future behavior.
- [ ] Testing expectations are included.
- [ ] Documentation references are included.
- [ ] AI coding assistants can follow this chapter safely.

---

# Anti-patterns

Avoid:

- Fat controllers with business logic.
- Direct database access from random modules.
- Missing organization/workspace filters.
- Returning database rows directly as API responses.
- Throwing raw errors to clients.
- Logging raw request bodies with sensitive data.
- Skipping tests for authorization.
- Using AI or automation without backend permission checks.

---

# Related Documents

- ../PART-01-Execution-Strategy/README.md
- ../PART-02-Repository-and-Development-Workflow/README.md
- ../../BOOK-04-Product-Domain-Specification/README.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-PERMISSION-MAP.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-AI-GOVERNANCE-MAP.md

---

# Navigation

**Previous:** `26-Backend-Implementation-Plan-Overview.md`

**Next:** `28-API-Service-Structure.md`

---

# Architecture Decision

Start with a modular monolith.

Why:

- Easier local development.
- Easier transactions.
- Easier documentation alignment.
- Easier AI coding assistant context.
- Lower deployment complexity.
- Still allows future module extraction.

---

# Module Boundary Pattern

```text
modules/
├── auth/
├── organizations/
├── workspaces/
├── memberships/
├── customers/
├── conversations/
├── tickets/
├── knowledge/
├── ai/
├── workflows/
├── integrations/
├── billing-admin/
├── analytics/
└── audit/
```

Each module should expose services, not internal database assumptions.
