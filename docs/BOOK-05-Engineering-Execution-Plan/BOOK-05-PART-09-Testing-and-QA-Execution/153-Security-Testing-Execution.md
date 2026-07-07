---
book: "Book V — Engineering Execution Plan"
part: "PART-09 — Testing and QA Execution"
chapter: "153"
title: "Security Testing Execution"
version: "1.0.0"
status: "official"
owner: "CLARA Quality Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan"
previous: "152-Database-and-Migration-Testing.md"
next: "154-AI-Evaluation-and-Testing.md"
project: "CLARA"
---

# Security Testing Execution

> *"Defines security testing execution for authorization, tenant isolation, validation, XSS, CSRF, injection, SSRF, secrets, audit, and abuse cases."*

---

# Purpose

Defines security testing execution for authorization, tenant isolation, validation, XSS, CSRF, injection, SSRF, secrets, audit, and abuse cases.

---

# Quality Problem

Functional tests can pass even when security is broken.

---

# Testing Decision

## Decision

Security tests must be part of normal CI and release gates, especially for auth, RBAC, scoped data access, AI, integrations, and admin actions.

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

**Previous:** `152-Database-and-Migration-Testing.md`

**Next:** `154-AI-Evaluation-and-Testing.md`

---

# Security Test Categories

Required:

```text
authentication required
missing permission denied
wrong organization denied
wrong workspace denied
invalid input rejected
XSS payload safely rendered
SQL injection-like filters rejected
invalid webhook signature rejected
duplicate webhook idempotent
AI context does not include unauthorized data
secret values not exposed
audit event emitted for sensitive action
```

---

# Abuse Test Principle

For every feature, ask:

```text
What happens if a low-privilege user tries this?
What happens if the resource belongs to another workspace?
What happens if the payload is malicious?
What happens if the provider sends duplicate data?
```
