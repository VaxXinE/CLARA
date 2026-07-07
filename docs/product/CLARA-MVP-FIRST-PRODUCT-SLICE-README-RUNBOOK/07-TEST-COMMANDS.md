---
project: "CLARA"
artifact: "MVP First Product Slice README / Runbook"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering, DevOps, Security, QA, Product, and AI Team"
last_updated: "2026-07-07"
classification: "readme-runbook"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-UX-UI-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-DATABASE-MIGRATION-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TEST-PLAN/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-BACKLOG-TASK-BREAKDOWN/"
source_of_truth:
  - "README.md"
  - "AGENTS.md"
  - "SECURITY.md"
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-07-Operations-Observability-and-Reliability/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
---


# 07 — Test Commands

> *"Tests are the proof that the MVP is safe enough to demo."*

---

# Purpose

This document defines test command templates.

Exact commands should be updated after final stack/tooling is selected.

---

# Run All Tests

Template:

```bash
npm test
```

or:

```bash
npm run test
```

---

# Unit Tests

```bash
npm run test:unit
```

Must cover:

```text
permissions
scope helper
validators
AI context builder
error mapper
redaction helper
```

---

# Integration Tests

```bash
npm run test:integration
```

Must cover:

```text
conversation APIs
customer profile
AI draft with mock provider
reply simulated send
activity events
workspace scoping
```

---

# API Contract Tests

```bash
npm run test:contract
```

Must cover:

```text
GET /me
GET /conversations
GET /conversations/{id}
GET /customers/{id}
POST /ai-draft
POST /reply
GET /activity
```

---

# Database Tests

```bash
npm run test:db
```

Must cover:

```text
migrations
constraints
indexes
seed idempotency
scope columns
```

---

# Security Tests

```bash
npm run test:security
```

Must cover:

```text
unauthenticated blocked
viewer cannot draft
viewer cannot send
cross-workspace access blocked
AI draft cannot auto-send
safe errors
```

---

# Frontend Tests

```bash
npm run test:frontend
```

Must cover:

```text
inbox renders
conversation detail renders
AI draft states
viewer permission UX
send failure state
XSS rendering smoke test
```

---

# Lint / Typecheck / Build

```bash
npm run lint
npm run typecheck
npm run build
```

---

# Manual QA

```text
Use docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TEST-PLAN/10-MANUAL-QA-AND-DEMO-VALIDATION.md
```

---

# Minimum Demo Test Gate

Before demo:

```bash
npm run test:unit
npm run test:integration
npm run test:security
npm run test:frontend
```

If final stack differs, update this file.

---

# Test Rule

```text
No P0 feature is done unless its P0 tests pass.
```
