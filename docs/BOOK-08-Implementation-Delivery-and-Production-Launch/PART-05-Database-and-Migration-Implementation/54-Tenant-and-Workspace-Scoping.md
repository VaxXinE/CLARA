---
book: "Book VIII — Implementation, Delivery & Production Launch"
part: "PART-05 — Database and Migration Implementation"
chapter: "54"
title: "Tenant and Workspace Scoping"
version: "1.0.0"
status: "official"
owner: "CLARA Backend Engineering Team"
last_updated: "2026-07-07"
classification: "database-migration-implementation"
previous: "53-Repository-Integration-with-Database.md"
next: "55-Indexing-and-Query-Performance-Implementation.md"
project: "CLARA"
---

# Tenant and Workspace Scoping

> *"Defines tenant, organization, workspace, membership, and resource scoping implementation rules for all database-backed workflows."*

---

# Purpose

Defines tenant, organization, workspace, membership, and resource scoping implementation rules for all database-backed workflows.

---

# Database Problem

Cross-tenant data exposure is a severe production security failure.

---

# Database Decision

## Decision

CLARA database queries should enforce organization/workspace scope consistently and make cross-tenant access difficult by design.

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

**Previous:** `53-Repository-Integration-with-Database.md`

**Next:** `55-Indexing-and-Query-Performance-Implementation.md`

---

# Scope Model

CLARA should distinguish:

```text
organization
workspace
user
membership
role
resource ownership
service/system actor
```

---

# Scoped Query Pattern

Every workspace-owned resource query should include:

```text
workspace_id = actor.workspace_id or authorized workspace scope
```

For organization-level resources:

```text
organization_id = actor.organization_id
```

---

# Tenant Isolation Test Cases

Test:

```text
user can access own workspace resource
user cannot access another workspace resource
user cannot mutate resource outside role permission
admin scope is explicit
service account scope is explicit
deleted/suspended membership cannot access
```

---

# Scoping Rule

Make unsafe cross-tenant queries rare, named, audited, and reviewed.
