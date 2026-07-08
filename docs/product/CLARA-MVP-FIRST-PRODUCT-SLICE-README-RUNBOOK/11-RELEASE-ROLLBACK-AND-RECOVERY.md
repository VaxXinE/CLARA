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

# 11 — Release, Rollback, and Recovery

> _"Even an MVP needs a plan for stopping, disabling, and recovering safely."_

---

# Purpose

This document defines release, rollback, and recovery direction for MVP demo/internal release.

---

# Internal Demo Release Checklist

- [ ] PRD/TDD/API/DB/Security/Test/Backlog/Runbook docs complete.
- [ ] API starts locally.
- [ ] Dashboard starts locally.
- [ ] Migrations run.
- [ ] Demo seed loads.
- [ ] Agent flow works.
- [ ] Viewer restrictions work.
- [ ] AI failure fallback works.
- [ ] Send failure fallback works.
- [ ] Security negative tests pass.
- [ ] Manual QA completed.
- [ ] Demo script ready.

---

# Disable AI Draft

If AI feature is failing:

```bash
AI_PROVIDER=disabled
# or
AI_MOCK_MODE=provider_error
```

Expected product behavior:

```text
manual reply remains available
safe error shown
```

---

# Disable Send Adapter

If send adapter is failing:

```bash
SEND_ADAPTER=disabled
```

or use simulated failure mode:

```bash
SIMULATED_SEND_MODE=failure
```

Expected behavior:

```text
draft preserved
safe error shown
no accidental duplicate sends
```

---

# Rollback Local Database

Local only:

```bash
npm run db:reset
npm run db:migrate
npm run db:seed:demo
```

Never run destructive reset in production-like environment without explicit approval and backup.

---

# Rollback PR

If a PR causes critical failure:

```bash
git revert <commit_sha>
```

or revert the PR via GitHub.

---

# Critical Security Incident Response

If discovered:

```text
viewer can send
viewer can generate draft
cross-workspace data visible
secret committed
real customer data committed
```

Immediate actions:

```text
stop demo/release
remove exposed secret/data
rotate secret if needed
add failing regression test
fix authorization/scope
document incident notes
```

---

# Recovery Rule

```text
For security failures, never just patch the UI. Fix the backend control and add a negative test.
```
