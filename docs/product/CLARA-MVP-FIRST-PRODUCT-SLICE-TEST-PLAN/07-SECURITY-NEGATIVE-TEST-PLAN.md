---
project: "CLARA"
artifact: "MVP First Product Slice Test Plan"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA QA, Engineering, Security, Product, AI, and Product Operations Team"
last_updated: "2026-07-08"
classification: "test-plan"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-UX-UI-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-DATABASE-MIGRATION-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/"
source_of_truth:
  - "SECURITY.md"
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-07-Operations-Observability-and-Reliability/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 07 — Security Negative Test Plan

> *"Negative tests prove the system fails closed instead of trusting good behavior."*

---

# Purpose

This document defines mandatory security negative tests.

---

# Authentication Negative Tests

```text
GET /me without auth returns 401
GET /conversations without auth returns 401
POST /ai-draft without auth returns 401
POST /reply without auth returns 401
invalid token/session returns 401
expired token/session returns 401
```

---

# Authorization Negative Tests

```text
viewer cannot generate AI draft
viewer cannot send reply
unknown role denied by default
agent cannot perform owner-only future action
client-provided role is ignored
```

---

# Tenant Isolation Negative Tests

```text
workspace A user cannot read workspace B conversation
workspace A user cannot read workspace B customer
workspace A user cannot read workspace B activity
workspace A user cannot use workspace B draft_id
workspace A AI draft context excludes workspace B messages
```

---

# API Validation Negative Tests

```text
invalid conversation status rejected
search over max length rejected
limit over max rejected
invalid tone rejected
AI instruction over max rejected
empty reply body rejected
oversized reply body rejected
invalid cursor rejected
```

---

# AI Safety Negative Tests

```text
AI draft endpoint does not create outbound message
AI draft endpoint does not call send adapter
prompt injection message does not reveal hidden prompt
prompt injection message does not cause auto-send
AI provider raw error not returned
AI output rendered safely
```

---

# Logging Negative Tests

Where testable:

```text
Authorization header not logged
cookie not logged
API key-like value redacted
raw provider error not exposed to frontend
hidden prompt not logged by default
```

---

# Frontend Negative Tests

```text
viewer does not see send button
viewer does not see AI draft button
send button disabled when reply body empty
draft preserved when send fails
AI error does not remove manual composer
frontend does not expose API keys or hidden provider payloads
```

---

# Security Gate Tests

These must pass before demo:

```text
viewer cannot send reply
viewer cannot generate AI draft
cross-workspace conversation blocked
AI draft cannot auto-send
safe error envelope used
cross-workspace reads return 404 instead of leaked existence
```

---

# Negative Test Rule

```text
Every permission and tenant boundary must have at least one negative test.
```
