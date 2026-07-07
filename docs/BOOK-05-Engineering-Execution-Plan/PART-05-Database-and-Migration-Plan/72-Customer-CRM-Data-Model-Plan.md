---
book: "Book V — Engineering Execution Plan"
part: "PART-05 — Database and Migration Plan"
chapter: "72"
title: "Customer CRM Data Model Plan"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan"
previous: "71-Core-Identity-and-Access-Tables.md"
next: "73-Conversations-and-Messages-Data-Model-Plan.md"
project: "CLARA"
---

# Customer CRM Data Model Plan

> *"Defines database plan for Customer CRM records, contact points, notes, tags, segments, timeline events, and privacy metadata."*

---

# Purpose

Defines database plan for Customer CRM records, contact points, notes, tags, segments, timeline events, and privacy metadata.

---

# Execution Problem

Customer data powers Inbox, Ticketing, AI, and Analytics; weak CRM schema design creates downstream complexity.

---

# Engineering Decision

## Decision

Customer CRM data model should be workspace-scoped, privacy-aware, searchable, and auditable.

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

**Previous:** `71-Core-Identity-and-Access-Tables.md`

**Next:** `73-Conversations-and-Messages-Data-Model-Plan.md`

---

# Customer CRM Tables

Recommended baseline:

```text
customers
customer_contact_points
customer_notes
customer_tags
customer_tag_assignments
customer_timeline_events
customer_external_references
customer_consents
```

---

# Customer Constraints

Recommended constraints:

```text
unique organization/workspace/customer id
unique normalized contact point where appropriate
foreign key notes -> customers
foreign key tag assignments -> customers/tags
```

---

# Privacy Notes

Customer records may contain PII.

Do not use real customer data in seeds/tests.

Exports must be permission-controlled and audited.
