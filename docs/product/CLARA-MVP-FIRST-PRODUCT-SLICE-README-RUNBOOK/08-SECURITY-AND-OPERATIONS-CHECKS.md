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


# 08 — Security and Operations Checks

> *"Security and operations checks should be quick enough to run often."*

---

# Purpose

This document defines quick checks before demo, merge, or release-like testing.

---

# Secret Hygiene Checks

Run:

```bash
find . -name ".env" -o -name ".env.local" -o -name ".env.production"
```

Expected:

```text
local files may exist locally but must not be committed
```

Git check:

```bash
git status --short
```

Confirm no `.env` files are staged.

---

# OS Junk Check

```bash
find . -name ".DS_Store"
```

Expected:

```text
no output
```

---

# Secret Scan Lite

```bash
grep -RInE "(api[_-]?key|secret|password|token|private[_-]?key)" .   --exclude-dir=.git   --exclude="*.zip"   --exclude="*.png"   --exclude="*.jpg"   | head -100
```

Manual review required.

Documentation placeholders are okay. Real secrets are not.

---

# Auth Safety Check

Confirm:

```text
mock auth disabled outside local/demo
/me does not expose tokens
unauthenticated API requests return 401
```

---

# RBAC Safety Check

Confirm:

```text
viewer cannot generate AI draft
viewer cannot send reply
backend blocks direct API attempts
```

---

# Tenant Isolation Check

Confirm:

```text
workspace A cannot read workspace B conversation
workspace A cannot read workspace B customer
workspace A cannot use workspace B draft
AI context excludes workspace B data
```

---

# AI Safety Check

Confirm:

```text
AI draft endpoint does not send reply
AI draft requires human review
AI failure returns safe error
manual reply remains possible
hidden prompt not exposed
```

---

# Logging Check

Confirm logs do not include:

```text
Authorization header
cookies
API keys
session tokens
full hidden prompts
raw provider errors
```

---

# Activity Check

Confirm:

```text
AI draft event recorded
reply sent event recorded
metadata safe
correlation id traceable
```

---

# Operations Rule

```text
If you cannot trace an action safely, you cannot debug it safely.
```
