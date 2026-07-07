---
project: "CLARA"
artifact: "MVP First Product Slice Demo Script"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Product, Engineering, Security, QA, AI, and Product Operations Team"
last_updated: "2026-07-07"
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


# 07 — Security and Trust Callouts

> *"Trust should be visible in the demo, not hidden in the architecture docs."*

---

# Human Review Before Send

```text
AI only drafts the reply. It does not send. The human must review and click Send Reply.
```

Why it matters:

```text
reduces hallucination risk
preserves accountability
prevents accidental autonomous communication
```

---

# Server-Side Authorization

```text
The UI hides actions for Viewer, but the backend must also block direct API attempts.
```

Why it matters:

```text
frontend-only security is not security
```

---

# Workspace Scoping

```text
Every conversation, customer, message, draft, and activity event is scoped by organization and workspace.
```

Why it matters:

```text
prevents cross-tenant data leakage
```

---

# AI Context Minimization

```text
The AI draft should only use the selected conversation and authorized customer context.
```

Why it matters:

```text
reduces privacy exposure
limits blast radius
improves relevance
```

---

# Safe Logging and Errors

```text
Errors should be understandable without exposing stack traces, provider internals, tokens, or secrets.
```

---

# Fake Demo Data

```text
This demo uses fake data only. No real customer messages, tokens, or provider credentials are required.
```

---

# Trust Rule

```text
Every AI convenience feature must have a matching human control and security boundary.
```
