---
book: "Book VIII — Implementation, Delivery & Production Launch"
part: "PART-02 — Repository and Module Implementation"
chapter: "17"
title: "Apps Services and Packages Layout"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Team"
last_updated: "2026-07-07"
classification: "repository-module-implementation"
previous: "16-Workspace-and-Package-Strategy.md"
next: "18-Backend-Module-Structure.md"
project: "CLARA"
---

# Apps Services and Packages Layout

> *"Defines the top-level implementation layout for deployable apps, backend services, workers, shared packages, infrastructure, and tools."*

---

# Purpose

Defines the top-level implementation layout for deployable apps, backend services, workers, shared packages, infrastructure, and tools.

---

# Implementation Problem

Mixing deployable code, shared code, scripts, and infra in random folders makes CI/CD and production ownership harder.

---

# Implementation Decision

## Decision

CLARA should separate deployable applications from shared libraries and operational tooling so ownership, CI, testing, and deployment remain clear.

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

**Previous:** `16-Workspace-and-Package-Strategy.md`

**Next:** `18-Backend-Module-Structure.md`

---

# Top-Level Layout Example

```text
apps/
├── web/
└── admin/

services/
├── api/
├── auth/
├── integration-gateway/
└── ai-gateway/

workers/
├── message-worker/
├── integration-worker/
├── ai-worker/
└── export-worker/

packages/
├── contracts/
├── config/
├── database/
├── logger/
├── observability/
├── security/
├── validation/
└── test-utils/
```

---

# Deployable vs Shared

```text
deployable = apps, services, workers
shared = packages
operational = infra, scripts, tools
documentation = docs
```

---

# Layout Rule

Every deployable unit should have:

```text
README
owner
entrypoint
config example
test command
health/observability notes
deployment notes
```
