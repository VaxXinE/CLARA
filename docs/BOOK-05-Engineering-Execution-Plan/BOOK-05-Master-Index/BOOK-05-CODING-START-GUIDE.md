---
book: "Book V — Engineering Execution Plan"
section: "Master Index"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan-index"
project: "CLARA"
---

# BOOK-05 Coding Start Guide

This file explains how to start coding CLARA after Book V.

---

# Before Coding

Confirm:

- [ ] Book IV Product Domain Specification is available.
- [ ] Book V Engineering Execution Plan is available.
- [ ] Root repository structure is chosen.
- [ ] `AGENTS.md` exists at root.
- [ ] Backend and frontend AGENTS files exist.
- [ ] `.env.example` exists with fake placeholders.
- [ ] `.gitignore` prevents `.env.local` and secrets.
- [ ] PR template exists.
- [ ] Issue/task template exists.
- [ ] Package manager is chosen.
- [ ] Formatting/linting baseline exists.

---

# First Coding Sequence

Start with:

```text
1. Create repo skeleton
2. Add docs folder
3. Add root README
4. Add AGENTS.md files
5. Add backend app skeleton
6. Add frontend app skeleton
7. Add shared package skeleton if needed
8. Add database/migration package
9. Add local env example
10. Add format/lint/test scripts
11. Add CI baseline
12. Implement auth/org/workspace/RBAC foundation
```

---

# First Vertical Slice

The first real product vertical slice should be:

```text
Authenticated user can access one workspace and create/read a workspace-scoped customer.
```

It must include:

```text
database table
migration
backend API
backend authorization
frontend page/form
validation
tests
audit where needed
docs update
```

---

# AI Coding Assistant Rule

When using Codex/Cursor/AI assistant:

```text
Tell it which Book IV and Book V files to read first.
Ask it to implement one small task.
Require tests.
Require docs update if behavior changes.
Review all generated code before merge.
```

---

# Safe First Prompt Example

```text
Read docs/BOOK-05-Engineering-Execution-Plan/BOOK-05-Master-Index/README.md,
docs/BOOK-05-Engineering-Execution-Plan/PART-02-Repository-and-Development-Workflow/README.md,
and docs/BOOK-05-Engineering-Execution-Plan/PART-11-MVP-Milestones-and-Backlog/188-Phase-0-Repo-and-Docs-Hygiene.md.

Create the initial CLARA repo skeleton only. Do not implement product features yet.
Add README, AGENTS.md, .gitignore, .env.example, and basic folders.
Avoid secrets. Keep changes small and explain every file created.
```
