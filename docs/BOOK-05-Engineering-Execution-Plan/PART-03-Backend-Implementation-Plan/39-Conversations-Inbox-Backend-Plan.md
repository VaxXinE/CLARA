---
book: "Book V — Engineering Execution Plan"
part: "PART-03 — Backend Implementation Plan"
chapter: "39"
title: "Conversations Inbox Backend Plan"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan"
previous: "38-Customer-CRM-Backend-Plan.md"
next: "40-Ticketing-Backend-Plan.md"
project: "CLARA"
---

# Conversations Inbox Backend Plan

> *"Defines backend implementation plan for Conversations and Inbox."*

---

# Purpose

Defines backend implementation plan for Conversations and Inbox.

---

# Execution Problem

Inbox backend must reliably handle customer communication without duplicate messages, permission leaks, or unsafe replies.

---

# Engineering Decision

## Decision

Conversation backend should implement message ingestion, conversation threading, assignment, status, reply flow, internal notes, customer linking, and audit.

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

**Previous:** `38-Customer-CRM-Backend-Plan.md`

**Next:** `40-Ticketing-Backend-Plan.md`

---

# Conversation APIs

MVP endpoints may include:

```text
GET    /conversations
GET    /conversations/:id
PATCH  /conversations/:id/status
PATCH  /conversations/:id/assignee
POST   /conversations/:id/replies
POST   /conversations/:id/internal-notes
POST   /conversations/:id/ai/reply-draft
```

---

# Backend Requirements

- Enforce conversation read/reply permissions.
- Separate internal notes from customer-visible messages.
- Prevent duplicate message ingestion with idempotency.
- Audit reply sent, assignment, status change, customer relink, AI draft generation.
- Do not auto-send AI drafts.
