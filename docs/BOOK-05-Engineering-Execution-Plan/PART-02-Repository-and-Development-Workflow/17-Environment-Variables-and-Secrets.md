---
book: "Book V — Engineering Execution Plan"
part: "PART-02 — Repository and Development Workflow"
chapter: "17"
title: "Environment Variables and Secrets"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan"
previous: "16-Local-Development-Environment.md"
next: "18-Dependency-Management.md"
project: "CLARA"
---

# Environment Variables and Secrets

> *"Defines how CLARA manages configuration, environment variables, secrets, and sensitive values."*

---

# Purpose

Defines how CLARA manages configuration, environment variables, secrets, and sensitive values.

---

# Execution Problem

Hard-coded credentials and leaked secrets are high-impact security failures.

---

# Engineering Decision

## Decision

CLARA should keep secrets out of code and documentation, use environment variables locally, and use secret manager patterns for deployed environments.

## Status

Accepted.

## Expected Output

A secure configuration and secrets handling standard.

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

**Previous:** `16-Local-Development-Environment.md`

**Next:** `18-Dependency-Management.md`

---

# Environment File Rules

Use:

```text
.env.example   # committed, fake values only
.env.local     # local only, ignored by git
.env.test      # safe test values
```

---

# Secret Handling Rules

Do not commit:

- API keys.
- Database passwords.
- OAuth client secrets.
- JWT secrets.
- Webhook signing secrets.
- Provider tokens.
- Private keys.
- Real customer data.

---

# Safe `.env.example`

Example:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/clara_dev"
JWT_SECRET="replace-with-local-dev-secret"
AI_PROVIDER_API_KEY="replace-with-your-sandbox-key"
WEBHOOK_SIGNING_SECRET="replace-with-local-secret"
```

These values must be placeholders, not real secrets.
