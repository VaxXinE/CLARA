---
project: "CLARA"
artifact: "MVP First Product Slice README / Runbook"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering, DevOps, Security, QA, Product, and AI Team"
last_updated: "2026-07-08"
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

> _"Tests are the proof that the MVP is safe enough to demo."_

---

# Purpose

This document defines the current validation commands for the implemented MVP slice.

---

# Run All Tests

```bash
bash scripts/validate-repo-structure.sh
```

# API Validation

```bash
cd services/api
npm ci
npm run db:check
npx --yes prettier "src/**/*.ts" "tests/**/*.ts" --write
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high
```

Coverage focus:

```text
mock auth
workspace scoping
viewer write restrictions
owner/agent AI draft and reply send
invalid IDs -> safe 400
cross-workspace resources -> 404
provider failure -> safe 502 envelope
AI draft cannot auto-send
```

---

# Dashboard Validation

```bash
cd apps/dashboard
npm ci
npx --yes prettier "src/**/*.ts" --write
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high
```

Coverage focus:

```text
viewer permission UX
AI draft label visibility
explicit human send click
safe API error rendering as text
XSS smoke test via plain React escaping
```

---

# Manual QA

Use:

```text
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TEST-PLAN/10-MANUAL-QA-AND-DEMO-VALIDATION.md
```

---

# Minimum Demo Gate

Run all of the following before demo:

```bash
bash scripts/validate-repo-structure.sh
cd services/api && npm run typecheck && npm run test && npm run build
cd apps/dashboard && npm run typecheck && npm run test && npm run build
```

---

# Test Rule

```text
No P0 feature is done unless its P0 tests pass.
```
