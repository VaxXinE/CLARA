---
book: "Book VIII — Implementation, Delivery & Production Launch"
part: "PART-02 — Repository and Module Implementation"
chapter: "20"
title: "Worker and Async Module Structure"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Team"
last_updated: "2026-07-07"
classification: "repository-module-implementation"
previous: "19-Frontend-and-Client-Module-Structure.md"
next: "21-Shared-Packages-and-Libraries.md"
project: "CLARA"
---

# Worker and Async Module Structure

> *"Defines worker and async module structure for job handlers, queue contracts, retries, idempotency, dead-letter handling, observability, and tests."*

---

# Purpose

Defines worker and async module structure for job handlers, queue contracts, retries, idempotency, dead-letter handling, observability, and tests.

---

# Implementation Problem

Async code is dangerous when it silently fails, retries unsafely, or mutates state without idempotency.

---

# Implementation Decision

## Decision

CLARA workers should be implemented as first-class production modules with clear job contracts, idempotency, retry policy, and operational visibility.

## Status

Accepted.

---

# Repository Implementation Rule

Every CLARA folder, package, and module should answer:

```text
what it owns
who owns it
what depends on it
what it may import
what it must not import
how it is tested
how it is deployed or consumed
what security boundary it touches
```

A repository structure is not production-ready if:

```text
ownership is unclear
deployable code and shared code are mixed randomly
security-sensitive code has no obvious owner
tests are hard to locate
environment files are inconsistent
AI assistants cannot infer safe boundaries
CI/CD cannot target modules cleanly
```

---

# Recommended Repository Flow

```mermaid
sequenceDiagram
    participant Docs as Documentation
    participant Repo as Repository
    participant Module as Module
    participant Tests as Tests
    participant CI as CI/CD
    participant Ops as Operations

    Docs->>Repo: Defines structure and ownership
    Repo->>Module: Hosts bounded implementation units
    Module->>Tests: Provides local and integration tests
    Tests->>CI: Runs quality/security checks
    CI->>Ops: Produces deployable/reviewable artifacts
```

---

# Production-Ready Checklist

- [ ] Folder has clear purpose.
- [ ] Owner is clear.
- [ ] Import direction is clear.
- [ ] Tests are discoverable.
- [ ] Public interface is clear where relevant.
- [ ] Security-sensitive files are protected.
- [ ] Config/secrets rules are documented.
- [ ] CI/CD can target the folder.
- [ ] AI assistant guidance exists where needed.
- [ ] Documentation links to related architecture/security/operations docs.

---

# Acceptance Criteria

- [ ] Repository structure is understandable.
- [ ] Module boundaries are explicit.
- [ ] Shared code has ownership.
- [ ] Tests and tooling are discoverable.
- [ ] Security risks are reduced by structure.
- [ ] Future implementation can proceed safely.

---

# Anti-patterns

Avoid:

- `utils/` becoming a dumping ground.
- Controllers owning business logic.
- UI components calling random internal services directly.
- Shared packages depending on deployable apps.
- Worker jobs mutating data without idempotency.
- Scripts that can accidentally target production.
- Multiple competing environment conventions.
- Tests hidden beside unrelated code with no pattern.
- AI assistant instructions only in chat history, not repository files.
- Committing generated artifacts without reason.

---

# Related Documents

- ../PART-01-Implementation-Foundation/README.md
- ../../BOOK-07-Operations-Observability-and-Reliability/BOOK-07-Master-Index/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/BOOK-06-Master-Index/README.md
- ../../BOOK-04-Data-API-AI-and-Integration-Design/README.md
- ../../BOOK-03-Architecture-and-Engineering/README.md

---

# Navigation

**Previous:** `19-Frontend-and-Client-Module-Structure.md`

**Next:** `21-Shared-Packages-and-Libraries.md`

---

# Worker Module Structure

Recommended pattern:

```text
workers/<worker-name>/src/jobs/<job-name>/
├── handler.ts
├── contract.ts
├── idempotency.ts
├── retry-policy.ts
├── dead-letter.ts
├── observability.ts
├── tests/
└── index.ts
```

---

# Worker Requirements

Each job should define:

```text
job name
payload schema
owner
idempotency key
retry policy
dead-letter behavior
timeout
observability fields
failure modes
runbook link
```

---

# Async Safety Rule

A job that can retry must be safe to retry.

If not, it needs compensation logic or manual approval.
