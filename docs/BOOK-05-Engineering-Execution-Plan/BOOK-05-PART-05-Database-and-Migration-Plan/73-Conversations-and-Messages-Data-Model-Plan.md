---
book: "Book V — Engineering Execution Plan"
part: "PART-05 — Database and Migration Plan"
chapter: "73"
title: "Conversations and Messages Data Model Plan"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan"
previous: "72-Customer-CRM-Data-Model-Plan.md"
next: "74-Ticketing-Data-Model-Plan.md"
project: "CLARA"
---

# Conversations and Messages Data Model Plan

> *"Defines database plan for conversations, messages, channels, participants, assignments, statuses, internal notes, attachments, and idempotent message ingestion."*

---

# Purpose

Defines database plan for conversations, messages, channels, participants, assignments, statuses, internal notes, attachments, and idempotent message ingestion.

---

# Execution Problem

Communication data is operationally critical and high-volume; incorrect modeling can cause duplicate messages, lost replies, or data leaks.

---

# Engineering Decision

## Decision

Conversation and message tables should preserve external provider references, threading, message visibility, and safe distinction between internal and customer-visible content.

## Status

Accepted.

---

# Database Implementation Rule

Every database change must be designed as:

```text
Product requirement -> Data model -> Migration -> Constraints -> Indexes -> Access pattern -> Tests -> Rollback/forward-fix plan
```

Do not change schema manually in production.

Do not add tenant-scoped tables without tenant scope.

Do not store sensitive secrets as normal visible data.

---

# Recommended Data Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Docs as Book IV / Book V Docs
    participant Migration as Migration File
    participant DB as Database
    participant API as Backend API
    participant Test as Tests / CI

    Dev->>Docs: Confirm domain and data requirement
    Dev->>Migration: Create schema migration
    Migration->>DB: Apply locally
    Dev->>API: Implement scoped repository queries
    API->>DB: Read/write with constraints and indexes
    Dev->>Test: Add migration and data access tests
    Test-->>Dev: Pass or fail
```

---

# Secure-by-Design Checklist

- [ ] Table ownership is clear.
- [ ] Tenant/workspace scope is included where required.
- [ ] Foreign keys are defined where practical.
- [ ] Unique constraints prevent duplicate critical records.
- [ ] Indexes support common scoped queries.
- [ ] Sensitive values are not stored raw.
- [ ] Audit impact is considered.
- [ ] Retention/deletion behavior is considered.
- [ ] Migration can be tested locally and in CI.
- [ ] Rollback or forward-fix strategy exists.
- [ ] Seed data is fake and safe.
- [ ] Cross-tenant query tests are planned.

---

# Acceptance Criteria

- [ ] Data ownership is defined.
- [ ] Table scope is clear.
- [ ] Migration strategy is clear.
- [ ] Security risks are considered.
- [ ] Query patterns are considered.
- [ ] Indexing needs are considered.
- [ ] Retention needs are considered.
- [ ] Testing expectations are included.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Creating global tables for tenant-specific resources.
- Returning raw database records directly to clients.
- Storing provider secrets or API keys in plain columns.
- Using JSON blobs to avoid schema design.
- Adding migrations without reviewing data impact.
- Ignoring indexes until performance breaks.
- Hard-deleting business records without retention rules.
- Using real customer data in seed or test data.
- Running destructive migrations without backup/rollback planning.

---

# Related Documents

- ../PART-03-Backend-Implementation-Plan/README.md
- ../PART-04-Frontend-Implementation-Plan/README.md
- ../../BOOK-04-Product-Domain-Specification/README.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-MVP-SCOPE-MAP.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-PERMISSION-MAP.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-AI-GOVERNANCE-MAP.md

---

# Navigation

**Previous:** `72-Customer-CRM-Data-Model-Plan.md`

**Next:** `74-Ticketing-Data-Model-Plan.md`

---

# Conversation Tables

Recommended baseline:

```text
channels
channel_connections
conversations
conversation_participants
conversation_messages
conversation_assignments
conversation_internal_notes
conversation_attachments
conversation_external_references
message_delivery_events
```

---

# Idempotency Fields

Inbound messages should preserve:

```text
provider
provider_account_id
external_conversation_id
external_message_id
idempotency_key
received_at
```

Create unique constraints to prevent duplicate ingestion.
