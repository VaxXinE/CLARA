---
book: "Book V — Engineering Execution Plan"
part: "PART-09 — Testing and QA Execution"
chapter: "152"
title: "Database and Migration Testing"
version: "1.0.0"
status: "official"
owner: "CLARA Quality Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan"
previous: "151-End-to-End-Testing-Plan.md"
next: "153-Security-Testing-Execution.md"
project: "CLARA"
---

# Database and Migration Testing

> *"Defines database and migration testing for schema changes, constraints, seed data, rollback/forward-fix behavior, and scoped queries."*

---

# Purpose

Defines database and migration testing for schema changes, constraints, seed data, rollback/forward-fix behavior, and scoped queries.

---

# Quality Problem

Database bugs can corrupt data, leak tenant records, or break production deployments.

---

# Testing Decision

## Decision

CLARA database changes must be tested through migration execution, schema validation, data access tests, and tenant/workspace isolation cases.

## Status

Accepted.

---

# Testing Implementation Rule

Every testable feature must be designed as:

```text
Requirement -> Risk -> Test Type -> Test Data -> Expected Result -> CI/QA Gate
```

Do not test only happy paths.

Do not rely only on manual testing.

Do not allow protected workflows to ship without authorization and scope tests.

---

# Recommended QA Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant CI as CI Pipeline
    participant QA as QA Reviewer
    participant Stage as Staging
    participant Release as Release Gate

    Dev->>CI: Push PR
    CI->>CI: Run unit/integration/security checks
    CI-->>Dev: Pass/fail feedback
    Dev->>QA: Request review for risky/critical flow
    QA->>Stage: Validate release candidate
    Stage-->>QA: Smoke/regression result
    QA->>Release: Approve, block, or request fix
```

---

# Secure-by-Design Checklist

- [ ] Tests include unauthorized access cases.
- [ ] Tests include wrong organization/workspace cases.
- [ ] Tests include invalid input cases.
- [ ] Tests include safe error responses.
- [ ] Tests do not use real customer data.
- [ ] Tests do not require real secrets in CI.
- [ ] External providers are mocked/sandboxed.
- [ ] AI provider calls are mocked for deterministic tests.
- [ ] Critical journeys are covered.
- [ ] CI gate is clear.

---

# Acceptance Criteria

- [ ] Test objective is clear.
- [ ] Test layer is appropriate.
- [ ] Test data is safe.
- [ ] Security coverage is included where relevant.
- [ ] Failure behavior is tested.
- [ ] CI/QA ownership is defined.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Testing only happy paths.
- Relying on manual testing for every release.
- Using real customer data in tests.
- Calling real AI providers in normal CI.
- Calling real payment/integration providers in normal CI.
- Skipping authorization tests.
- Skipping migration tests.
- Building flaky E2E tests for every tiny behavior.
- Treating screenshots as proof of correctness.
- Marking bugs fixed without reproduction and verification.

---

# Related Documents

- ../PART-03-Backend-Implementation-Plan/README.md
- ../PART-04-Frontend-Implementation-Plan/README.md
- ../PART-05-Database-and-Migration-Plan/README.md
- ../PART-06-AI-Implementation-Plan/README.md
- ../PART-07-Integration-Implementation-Plan/README.md
- ../PART-08-Security-Implementation-Plan/README.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-MVP-SCOPE-MAP.md

---

# Navigation

**Previous:** `151-End-to-End-Testing-Plan.md`

**Next:** `153-Security-Testing-Execution.md`

---

# Migration Test Coverage

Test:

```text
fresh database migration
migration order
constraints
foreign keys
indexes where verifiable
seed data compatibility
basic rollback/forward-fix path
cross-scope query behavior
```

---

# Database Safety Tests

For scoped repositories, test:

```text
same workspace allowed
wrong workspace denied/not found
wrong organization denied/not found
archived/deleted record behavior
```

---

# Destructive Migration Rule

Any destructive migration requires explicit test and review.
