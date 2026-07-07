---
book: "Book V — Engineering Execution Plan"
part: "PART-05 — Database and Migration Plan"
chapter: "68"
title: "Schema Ownership and Naming Strategy"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan"
previous: "67-Database-Architecture-Execution.md"
next: "69-Tenant-and-Workspace-Data-Model.md"
project: "CLARA"
---

# Schema Ownership and Naming Strategy

> *"Defines naming conventions, ownership rules, and schema organization for database objects."*

---

# Purpose

Defines naming conventions, ownership rules, and schema organization for database objects.

---

# Execution Problem

Inconsistent naming and unclear ownership make queries, migrations, audits, and AI-assisted coding harder to maintain.

---

# Engineering Decision

## Decision

CLARA database objects should use consistent names and clear ownership by product domain.

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

**Previous:** `67-Database-Architecture-Execution.md`

**Next:** `69-Tenant-and-Workspace-Data-Model.md`

---

# Naming Rules

Use consistent snake_case for tables and columns.

Examples:

```text
organizations
workspaces
organization_memberships
customers
customer_contact_points
conversations
conversation_messages
tickets
knowledge_articles
ai_requests
workflow_executions
integration_connections
audit_events
```

---

# Common Columns

Most business tables should include:

```text
id
organization_id
workspace_id
created_at
updated_at
created_by
updated_by
archived_at
deleted_at
```

Use only where appropriate.

Do not add `workspace_id` to purely organization-level tables unless needed.
