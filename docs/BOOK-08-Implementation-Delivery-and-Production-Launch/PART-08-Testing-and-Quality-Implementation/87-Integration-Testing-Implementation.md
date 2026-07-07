---
book: "Book VIII — Implementation, Delivery & Production Launch"
part: "PART-08 — Testing and Quality Implementation"
chapter: "87"
title: "Integration Testing Implementation"
version: "1.0.0"
status: "official"
owner: "CLARA Quality Engineering Team"
last_updated: "2026-07-07"
classification: "testing-quality-implementation"
previous: "86-Unit-Testing-Implementation.md"
next: "88-Contract-Testing-Implementation.md"
project: "CLARA"
---

# Integration Testing Implementation

> *"Defines integration testing standards for database repositories, API-service boundaries, queues, workers, external adapters, and important infrastructure interactions."*

---

# Purpose

Defines integration testing standards for database repositories, API-service boundaries, queues, workers, external adapters, and important infrastructure interactions.

---

# Quality Problem

Unit tests alone cannot prove that database queries, transactions, queues, and adapters work together correctly.

---

# Quality Decision

## Decision

CLARA integration tests should prove that modules work with real or realistic dependencies while preserving test isolation and repeatability.

## Status

Accepted.

---

# Testing Implementation Rule

Every CLARA production feature should be protected by the smallest useful set of tests across:

```text
unit
integration
contract
end-to-end
security
performance
AI quality/safety where applicable
release regression
```

A feature is not production-ready if it cannot answer:

```text
what critical behavior is tested
what failure cases are tested
what authorization cases are tested
what tenant/workspace isolation cases are tested
what contract is protected
what performance expectation exists
what security abuse case is covered
what test data is used
what CI gate blocks unsafe changes
```

---

# Recommended Quality Flow

```mermaid
sequenceDiagram
    participant Dev as Developer/AI Assistant
    participant Unit as Unit Tests
    participant Int as Integration/Contract Tests
    participant Sec as Security/Performance/AI Tests
    participant CI as CI Quality Gates
    participant Release as Release Regression
    participant Prod as Production Monitoring

    Dev->>Unit: Validate local logic
    Unit->>Int: Validate module boundaries
    Int->>Sec: Validate risk scenarios
    Sec->>CI: Produce gate evidence
    CI->>Release: Approve release candidate
    Release->>Prod: Validate production behavior
    Prod-->>Dev: Feed defects/regressions back to tests
```

---

# Production-Ready Checklist

- [ ] Critical business rules are tested.
- [ ] Important failure paths are tested.
- [ ] Authorization is tested.
- [ ] Tenant/workspace isolation is tested.
- [ ] Contracts are tested.
- [ ] Security abuse cases are tested.
- [ ] Performance risks are considered.
- [ ] AI safety/quality is tested where relevant.
- [ ] Test data is safe and deterministic.
- [ ] CI gate blocks unsafe changes.
- [ ] Release regression is defined.

---

# Acceptance Criteria

- [ ] Quality strategy is layered.
- [ ] Tests map to production risks.
- [ ] CI gates are actionable.
- [ ] Security and reliability are included.
- [ ] Test data is safe.
- [ ] Release readiness is measurable.
- [ ] AI coding assistants can apply this safely.

---

# Anti-patterns

Avoid:

- Only testing happy paths.
- Tests that require real production credentials.
- Tests that depend on execution order without reason.
- Snapshot-only frontend testing.
- Contract changes without contract tests.
- Authorization tests only for admin users.
- Performance assumptions from tiny seed data.
- AI prompt demos without adversarial tests.
- Non-blocking CI gates for critical failures.
- Using real customer data in test fixtures.

---

# Related Documents

- ../PART-03-Backend-Implementation/README.md
- ../PART-04-Frontend-and-Client-Implementation/README.md
- ../PART-05-Database-and-Migration-Implementation/README.md
- ../PART-06-AI-Gateway-and-Automation-Implementation/README.md
- ../PART-07-Integration-and-Webhook-Implementation/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/BOOK-06-Master-Index/README.md
- ../../BOOK-07-Operations-Observability-and-Reliability/BOOK-07-Master-Index/README.md

---

# Navigation

**Previous:** `86-Unit-Testing-Implementation.md`

**Next:** `88-Contract-Testing-Implementation.md`

---

# Integration Test Targets

Use integration tests for:

```text
repository + database
API route + validation + service
worker + queue + database
adapter + mocked provider
migration + existing data
auth middleware + protected endpoint
transaction behavior
outbox/dead-letter flow
```

---

# Integration Test Environment

Integration tests should use:

```text
isolated test database
repeatable migrations
safe fixtures
test containers or equivalent where practical
fake external providers
deterministic clocks/IDs where useful
```

---

# Database Integration Cases

Test:

```text
scoped query returns own workspace data
scoped query rejects other workspace data
constraints prevent invalid state
transactions rollback correctly
migrations preserve existing data
pagination behaves correctly
```

---

# Integration Rule

Integration tests should prove boundaries work, not recreate full e2e coverage.
