---
book: "Book VIII — Implementation, Delivery & Production Launch"
part: "PART-05 — Database and Migration Implementation"
chapter: "50"
title: "Schema Implementation Standards"
version: "1.0.0"
status: "official"
owner: "CLARA Backend Engineering Team"
last_updated: "2026-07-07"
classification: "database-migration-implementation"
previous: "49-Database-and-Migration-Implementation-Overview.md"
next: "51-Migration-Workflow-and-Safety.md"
project: "CLARA"
---

# Schema Implementation Standards

> *"Defines standards for tables, columns, constraints, relations, enums, timestamps, soft deletes, audit fields, and schema naming."*

---

# Purpose

Defines standards for tables, columns, constraints, relations, enums, timestamps, soft deletes, audit fields, and schema naming.

---

# Database Problem

Weak schema design pushes correctness into application code and increases long-term data quality risk.

---

# Database Decision

## Decision

CLARA schemas should be explicit, normalized where useful, constraint-backed, tenant-aware, and readable by both humans and tools.

## Status

Accepted.

---

# Database Implementation Rule

Every CLARA database-backed capability should be implemented as:

```text
Schema -> Constraints -> Migration -> Repository -> Scoped Query -> Transaction/Consistency Rule -> Observability -> Tests -> Restore Compatibility
```

A database change is not production-ready if it cannot answer:

```text
what data it owns
what constraints protect correctness
how tenant/workspace scope is enforced
how migration runs safely
how rollback/forward-fix works
how queries perform at expected scale
how sensitive data is protected
how data is retained/deleted
how restore validation works
what tests prove the behavior
```

---

# Recommended Database Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Schema as Schema/Migration
    participant Test as Test DB
    participant Repo as Repository
    participant App as Application Service
    participant CI as CI/CD
    participant Prod as Production DB

    Dev->>Schema: Authors schema/migration
    Schema->>Test: Runs migration and validation
    Repo->>Test: Executes scoped repository tests
    App->>Repo: Uses transaction-aware data access
    Test->>CI: Reports migration/query/security tests
    CI->>Prod: Applies approved migration through deployment flow
```

---

# Production-Ready Checklist

- [ ] Schema naming is clear.
- [ ] Constraints protect critical invariants.
- [ ] Migration is reviewed.
- [ ] Migration is tested.
- [ ] Queries are tenant/workspace scoped.
- [ ] Data access is parameterized.
- [ ] Transactions are explicit where needed.
- [ ] Indexes support critical queries.
- [ ] Sensitive data is protected.
- [ ] Restore compatibility is considered.

---

# Acceptance Criteria

- [ ] Data model is understandable.
- [ ] Migration is safe enough for production.
- [ ] Scoping prevents cross-tenant access.
- [ ] Query performance is considered.
- [ ] Data lifecycle rules are clear.
- [ ] Database security expectations are clear.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Migrations that run only on empty databases.
- Unbounded list queries.
- Missing organization/workspace scope.
- Storing secrets in plain database columns without protection strategy.
- Business-critical invariants only in comments.
- Large table rewrites during peak traffic.
- Using production data as local seed data.
- Deleting data with no audit trail when audit is required.
- Repository methods returning data across tenants.
- Tests that do not include wrong-workspace cases.

---

# Related Documents

- ../PART-03-Backend-Implementation/README.md
- ../PART-02-Repository-and-Module-Implementation/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/BOOK-06-Master-Index/README.md
- ../../BOOK-07-Operations-Observability-and-Reliability/PART-07-Backup-Restore-and-Disaster-Recovery/README.md
- ../../BOOK-07-Operations-Observability-and-Reliability/PART-06-Performance-and-Capacity/README.md

---

# Navigation

**Previous:** `49-Database-and-Migration-Implementation-Overview.md`

**Next:** `51-Migration-Workflow-and-Safety.md`

---

# Schema Naming Standards

Use clear names:

```text
organizations
workspaces
workspace_members
customers
conversations
conversation_messages
tickets
ticket_events
integrations
integration_events
ai_requests
audit_events
attachments
exports
```

---

# Required Common Columns

Recommended baseline:

```text
id
organization_id where applicable
workspace_id where applicable
created_at
updated_at
deleted_at where soft delete is needed
created_by where relevant
updated_by where relevant
version where optimistic locking is needed
```

---

# Constraint Examples

Use:

```text
foreign keys
unique constraints
not-null constraints
check constraints
enum constraints where appropriate
composite unique constraints for scoped uniqueness
```

---

# Schema Rule

Do not rely only on application code to protect basic data integrity.
