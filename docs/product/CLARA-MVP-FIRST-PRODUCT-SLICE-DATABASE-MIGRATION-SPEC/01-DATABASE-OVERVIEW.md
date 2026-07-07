---
project: "CLARA"
artifact: "MVP First Product Slice Database Migration Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Backend, Data, Security, Product, and Product Operations Team"
last_updated: "2026-07-07"
classification: "database-migration-specification"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-UX-UI-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/"
source_of_truth:
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-04-Product-Domain-Specification/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-07-Operations-Observability-and-Reliability/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 01 — Database Overview

> *"The MVP database should be simple enough to build quickly and strict enough to protect customer data."*

---

# Purpose

This document gives a high-level overview of the MVP database design.

---

# Supported Product Surfaces

The database supports:

```text
Conversation Inbox
Conversation Detail
Customer Profile Sidebar
Reply Composer
AI Draft Generation
Reply Send / Simulated Send
Activity Timeline
Role-Based Access
Demo Data
```

---

# Database Style

Recommended:

```text
relational model
explicit foreign keys
tenant-scoped business tables
controlled enums/check constraints
JSONB only for safe metadata
indexed query paths
```

---

# Why Not NoSQL for MVP

NoSQL could work, but for this MVP relational is safer because:

```text
tenant scoping can be consistently enforced
foreign keys protect relationships
activity trails are easier to join
indexes are predictable
migrations are reviewable
authorization queries are clearer
```

---

# High-Level Table Groups

## Identity and Workspace

```text
organizations
workspaces
users
workspace_memberships
```

## Customer Conversation Domain

```text
customers
conversations
messages
```

## AI Draft Domain

```text
reply_drafts
ai_draft_events
```

## Audit/Product Operations Domain

```text
activity_events
```

---

# Data Classification

| Data Type | Examples | Sensitivity |
|---|---|---|
| Workspace data | org/workspace names | internal |
| User data | name/email/role | sensitive |
| Customer data | name/contact/notes | sensitive |
| Conversation data | messages | sensitive |
| AI metadata | provider/model/status | internal |
| Activity metadata | event summaries | internal/sensitive |
| Secrets | provider keys/tokens | must not be stored here |

---

# MVP Storage Rule

```text
Store only what is needed to complete the MVP workflow.
```

Avoid storing:

```text
raw AI hidden prompts
provider secrets
unnecessary customer PII
raw external provider payloads unless required and reviewed
payment/billing data
```

---

# Database Rule

```text
Every data model decision must preserve tenant isolation and future auditability.
```
