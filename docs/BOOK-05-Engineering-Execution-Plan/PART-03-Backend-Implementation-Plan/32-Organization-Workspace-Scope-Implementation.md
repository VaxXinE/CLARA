---
book: "Book V — Engineering Execution Plan"
part: "PART-03 — Backend Implementation Plan"
chapter: "32"
title: "Organization Workspace Scope Implementation"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan"
previous: "31-Authorization-RBAC-Implementation-Plan.md"
next: "33-Request-Validation-and-DTO-Strategy.md"
project: "CLARA"
---

# Organization Workspace Scope Implementation

> *"Defines how organization and workspace scope must be enforced in backend queries and mutations."*

---

# Purpose

Defines how organization and workspace scope must be enforced in backend queries and mutations.

---

# Execution Problem

Cross-tenant or cross-workspace data leakage is one of the highest-impact failures for CLARA.

---

# Engineering Decision

## Decision

Every tenant-scoped backend operation must explicitly check organization and workspace boundaries.

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

**Previous:** `31-Authorization-RBAC-Implementation-Plan.md`

**Next:** `33-Request-Validation-and-DTO-Strategy.md`

---

# Scope Enforcement Rules

Every tenant-scoped table should include:

```text
organization_id
```

Every workspace-scoped table should include:

```text
organization_id
workspace_id
```

---

# Query Rule

Good:

```sql
SELECT * FROM customers
WHERE id = $1
AND organization_id = $2
AND workspace_id = $3
```

Bad:

```sql
SELECT * FROM customers
WHERE id = $1
```

---

# Security Test

For every module, create a cross-workspace access test.

This is non-negotiable.
