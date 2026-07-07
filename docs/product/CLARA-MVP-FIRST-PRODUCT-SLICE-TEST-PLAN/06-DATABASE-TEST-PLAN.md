---
project: "CLARA"
artifact: "MVP First Product Slice Test Plan"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA QA, Engineering, Security, Product, AI, and Product Operations Team"
last_updated: "2026-07-07"
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


# 06 — Database Test Plan

> *"Database tests prove that schema, constraints, indexes, and seed data support safe product behavior."*

---

# Purpose

This document defines database migration and persistence tests.

---

# Migration Tests

Required:

```text
migrations run from empty database
migrations are repeatable in CI
schema contains expected tables
expected indexes exist
expected constraints exist
rollback works in local/dev if supported
```

---

# Required Table Existence Tests

Verify:

```text
organizations
workspaces
users
workspace_memberships
customers
conversations
messages
reply_drafts
ai_draft_events
activity_events
```

---

# Scope Column Tests

Verify these tables include `organization_id` and `workspace_id`:

```text
customers
conversations
messages
reply_drafts
ai_draft_events
activity_events
```

---

# Constraint Tests

Required:

```text
invalid workspace role rejected
invalid conversation status rejected
invalid message direction rejected
empty message body rejected
empty reply draft body rejected
invalid activity event type rejected
negative ai latency rejected
```

---

# Foreign Key Tests

Required:

```text
conversation requires existing customer
message requires existing conversation
reply draft requires existing conversation
ai draft event references conversation
activity event references conversation
membership requires user/workspace
```

---

# Index Existence Tests

Verify indexes for:

```text
conversation inbox query
message timeline query
activity timeline query
AI draft event query
reply draft query
```

---

# Seed Data Tests

Required:

```text
seed creates demo organization
seed creates demo workspace
seed creates owner/agent/viewer
seed creates demo customers
seed creates demo conversations
seed creates demo messages
seed can run twice safely
seed contains no real domain except .test
```

---

# Tenant Isolation Data Tests

Required:

```text
workspace A and B fixtures exist
same user cannot query B data using A scope
draft_id from B cannot be used in A conversation
```

---

# Database Privacy Tests

Check:

```text
no secrets in seed
no real customer data in seed
AI events do not require raw hidden prompt
activity metadata does not require secrets
```

---

# Database Test Rule

```text
Every table that stores customer/conversation data must have tests proving workspace scope exists and is used.
```
