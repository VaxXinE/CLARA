---
book: "Book VIII — Implementation, Delivery & Production Launch"
part: "PART-02 — Repository and Module Implementation"
chapter: "14"
title: "Root Repository Skeleton"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Team"
last_updated: "2026-07-07"
classification: "repository-module-implementation"
previous: "13-Repository-and-Module-Implementation-Overview.md"
next: "15-Root-Documentation-Files.md"
project: "CLARA"
---

# Root Repository Skeleton

> *"Defines the recommended root repository skeleton for CLARA, including docs, apps, services, workers, packages, infra, scripts, tests, tools, and governance files."*

---

# Purpose

Defines the recommended root repository skeleton for CLARA, including docs, apps, services, workers, packages, infra, scripts, tests, tools, and governance files.

---

# Implementation Problem

If the root repository is unclear, every future folder becomes a subjective decision.

---

# Implementation Decision

## Decision

CLARA should start from a predictable root skeleton that separates product apps, backend services, workers, shared packages, infrastructure, documentation, and automation.

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

**Previous:** `13-Repository-and-Module-Implementation-Overview.md`

**Next:** `15-Root-Documentation-Files.md`

---

# Recommended Root Skeleton

```text
clara/
├── docs/
├── apps/
├── services/
├── workers/
├── packages/
├── infra/
├── scripts/
├── tests/
├── tools/
├── .github/
├── .vscode/
├── AGENTS.md
├── README.md
├── SECURITY.md
├── CONTRIBUTING.md
├── CODEOWNERS
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .env.example
├── .gitignore
└── .editorconfig
```

---

# Folder Purpose

| Folder | Purpose |
|---|---|
| docs | Project documentation/books/specs/runbooks |
| apps | Deployable user-facing apps |
| services | Backend services/APIs |
| workers | Async workers and scheduled processors |
| packages | Shared libraries/contracts/utilities |
| infra | Infrastructure and deployment definitions |
| scripts | Safe repository automation |
| tests | Cross-cutting integration/e2e/security tests |
| tools | Developer/internal tooling |
| .github | CI/CD workflows and repo automation |

---

# Root Rule

The root should guide first-time developers within 5 minutes.
