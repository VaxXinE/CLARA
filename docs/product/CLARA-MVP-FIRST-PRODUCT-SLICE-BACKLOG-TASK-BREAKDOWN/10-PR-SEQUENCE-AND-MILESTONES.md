---
project: "CLARA"
artifact: "MVP First Product Slice Backlog / Task Breakdown"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Product, Engineering, Security, QA, AI, Data, and Product Operations Team"
last_updated: "2026-07-07"
classification: "backlog-task-breakdown"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-UX-UI-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-DATABASE-MIGRATION-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TEST-PLAN/"
source_of_truth:
  - "SECURITY.md"
  - "AGENTS.md"
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-05-Engineering-Execution-Plan/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 10 — PR Sequence and Milestones

> *"PR sequence decides whether the MVP is reviewable or chaotic."*

---

# Recommended PR Sequence

## PR-01 — Repository Skeleton

Includes:

```text
apps/services/workers/packages/infra/scripts/tests/tools
folder READMEs
root governance updates
```

No product logic.

---

## PR-02 — API Bootstrap

Includes:

```text
services/api setup
health endpoint
config validation
safe error handler
correlation id
basic tests
```

---

## PR-03 — Auth/Authz/Scope Baseline

Includes:

```text
mock/dev auth
user context
role permissions
workspace scope helper
negative tests
```

---

## PR-04 — Database Migrations and Seed

Includes:

```text
tables
constraints
indexes
demo seed
cross-workspace fixture
migration tests
```

---

## PR-05 — Conversation and Customer APIs

Includes:

```text
GET /conversations
GET /conversations/{id}
GET /customers/{id}
contract tests
integration tests
```

---

## PR-06 — Activity Service Base

Includes:

```text
activity event writer
GET /activity
metadata safety
tests
```

---

## PR-07 — AI Draft API

Includes:

```text
context builder
mock AI provider
POST /ai-draft
reply draft persistence
AI event + activity event
AI failure tests
```

---

## PR-08 — Reply Send API

Includes:

```text
simulated send adapter
POST /reply
outbound message persistence
activity event
send failure tests
```

---

## PR-09 — Frontend Conversation Workspace

Includes:

```text
three-panel layout
inbox
conversation detail
customer profile
composer
AI draft UX
send UX
activity timeline
permission UX
```

---

## PR-10 — Security and QA Hardening

Includes:

```text
security negative tests
safe logging review
manual QA fixes
demo validation
accessibility smoke
```

---

## PR-11 — Runbook and Demo Script

Includes:

```text
README/runbook
demo script
troubleshooting
known limitations
release gate record template
```

---

# Milestone Map

```text
M0 Docs Complete
M1 Repo Skeleton
M2 API/Data/Auth Foundation
M3 Core APIs
M4 AI/Reply/Activity
M5 Frontend Workspace
M6 Security + QA Gate
M7 Demo Ready
```

---

# PR Rule

```text
Every PR must include tests or explicitly state why tests are not applicable.
```
