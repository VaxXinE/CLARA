---
book: "Book V — Engineering Execution Plan"
part: "PART-02 — Repository and Development Workflow"
chapter: "14"
title: "Branching Strategy"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan"
previous: "13-Monorepo-vs-Multi-Repo-Decision.md"
next: "15-Commit-and-Pull-Request-Convention.md"
project: "CLARA"
---

# Branching Strategy

> *"Defines how CLARA branches should be created, named, protected, and merged."*

---

# Purpose

Defines how CLARA branches should be created, named, protected, and merged.

---

# Execution Problem

Long-lived branches create merge pain, hidden drift, and delayed integration bugs.

---

# Engineering Decision

## Decision

CLARA should use trunk-based development with short-lived feature branches and protected main branch.

## Status

Accepted.

## Expected Output

A safe branching model for MVP and production-oriented development.

---

# Context

This chapter supports the Book V execution strategy.

It exists to make sure CLARA implementation work is:

- Traceable to documentation.
- Easy to review.
- Safe for production.
- Friendly to AI coding assistants.
- Secure by default.
- Consistent across backend, frontend, database, AI, integrations, and DevOps.

---

# Workflow Model

```mermaid
flowchart TD
    Spec[Book IV / Book V Docs] --> Task[Issue / Task]
    Task --> Branch[Short-Lived Branch]
    Branch --> Code[Code Changes]
    Code --> Test[Tests and Checks]
    Test --> Docs[Documentation Update]
    Docs --> PR[Pull Request]
    PR --> Review[Human Review]
    Review --> CI[CI Gates]
    CI --> Merge[Protected Merge]
```

---

# Practical Rules

- Every non-trivial change must be linked to a documented task.
- Every feature task should reference the relevant Book IV domain.
- Every implementation task should reference the relevant Book V plan.
- Every protected backend action must include authorization checks.
- Every tenant-scoped record must include organization scope.
- Every workspace-scoped record must include workspace scope.
- Every AI-generated change must be reviewed by a human.
- Every PR must be small enough to review meaningfully.
- Every secrets/config change must avoid exposing sensitive values.
- Every docs-affecting implementation must update documentation.

---

# Secure-by-Design Requirements

| Area | Requirement |
|---|---|
| Repository | Secrets must not be committed |
| Branches | Main branch must be protected |
| Pull Requests | Security-sensitive changes require careful review |
| CI | Tests and checks must run before merge |
| Dependencies | Lockfiles must be committed and reviewed |
| AI Coding | AI output must be reviewed before merge |
| Docs | Documentation must not contain real credentials |
| Configuration | `.env.example` must use fake safe placeholders |

---

# Acceptance Criteria

- [ ] The workflow is understandable by junior and senior engineers.
- [ ] The workflow is usable with AI coding assistants.
- [ ] The workflow protects main branch quality.
- [ ] The workflow supports documentation-first development.
- [ ] The workflow includes security expectations.
- [ ] The workflow prevents obvious production-risk shortcuts.
- [ ] The workflow prepares the next implementation part.

---

# Anti-patterns

Avoid:

- Coding without reading related docs.
- Creating huge PRs with unrelated changes.
- Merging code without tests.
- Keeping long-lived branches alive for weeks.
- Putting secrets in repository files.
- Letting AI coding assistants modify architecture without review.
- Adding dependencies without review.
- Updating code without updating docs.

---

# Related Documents

- ../PART-01-Execution-Strategy/README.md
- ../../BOOK-04-Product-Domain-Specification/README.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-MVP-SCOPE-MAP.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-PERMISSION-MAP.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-AI-GOVERNANCE-MAP.md

---

# Navigation

**Previous:** `13-Monorepo-vs-Multi-Repo-Decision.md`

**Next:** `15-Commit-and-Pull-Request-Convention.md`

---

# Branching Model

Use:

```text
main
feature/<short-description>
fix/<short-description>
docs/<short-description>
chore/<short-description>
security/<short-description>
```

Examples:

```text
feature/customer-create-api
fix/workspace-scope-check
docs/book-05-part-02
security/redact-ai-logs
```

---

# Main Branch Rules

`main` must be protected:

- No direct push.
- PR required.
- CI must pass.
- Review required.
- Security-sensitive changes need extra review.
- Deployment should come from main or tagged releases.

---

# Branch Lifetime

Feature branches should be short-lived.

Recommended:

```text
1-3 days for small tasks
Less than 1 week for larger vertical slices
```
