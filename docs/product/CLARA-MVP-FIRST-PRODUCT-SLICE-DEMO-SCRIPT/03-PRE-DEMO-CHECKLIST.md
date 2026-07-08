---
project: "CLARA"
artifact: "MVP First Product Slice Demo Script"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Product, Engineering, Security, QA, AI, and Product Operations Team"
last_updated: "2026-07-08"
classification: "demo-script"
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
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-README-RUNBOOK/"
source_of_truth:
  - "README.md"
  - "AGENTS.md"
  - "SECURITY.md"
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 03 — Pre-Demo Checklist

> *"The best demo is boring operationally and exciting product-wise."*

---

# Environment Checklist

- [ ] API service starts.
- [ ] Dashboard starts.
- [ ] Database is running.
- [ ] Migrations applied.
- [ ] Demo seed data loaded.
- [ ] Mock auth enabled only for demo/local.
- [ ] Mock AI provider set to success.
- [ ] Simulated send adapter set to success.
- [ ] Activity timeline works.
- [ ] No production secrets used.
- [ ] No real customer data used.

---

# Security Checklist

- [ ] Viewer cannot generate AI draft.
- [ ] Viewer cannot send reply.
- [ ] Cross-workspace access is blocked in tests.
- [ ] AI draft does not auto-send.
- [ ] AI failure fallback works.
- [ ] Send failure preserves draft.
- [ ] No stack traces shown in UI.
- [ ] No tokens/secrets visible in logs or UI.

---

# Pre-Demo Commands

```bash
bash scripts/validate-repo-structure.sh

cd services/api
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd ../../apps/dashboard
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high
```

---

# Rule

```text
Never demo with real customer data, real secrets, or unsafe production-like configuration.
```
