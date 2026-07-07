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


# 03 — Tenant and Workspace Scoping Rules

> *"Tenant isolation should be enforced in data shape, query pattern, tests, and review."*

---

# Purpose

This document defines tenant/workspace scoping rules for MVP persistence.

---

# Required Scope Columns

The following tables must include:

```text
organization_id
workspace_id
```

```text
customers
conversations
messages
reply_drafts
ai_draft_events
activity_events
```

---

# Why Duplicate Scope on Child Tables

Even though scope could be inferred through joins, duplicating scope on child tables makes it easier to:

```text
write safer queries
create useful composite indexes
avoid accidental cross-tenant joins
enforce backend guardrails
build security tests
```

---

# Query Rule

Never query by resource ID alone.

Bad:

```sql
SELECT * FROM conversations WHERE id = :conversation_id;
```

Good:

```sql
SELECT *
FROM conversations
WHERE id = :conversation_id
  AND organization_id = :organization_id
  AND workspace_id = :workspace_id;
```

---

# Message Query Rule

Bad:

```sql
SELECT * FROM messages WHERE conversation_id = :conversation_id;
```

Good:

```sql
SELECT *
FROM messages
WHERE conversation_id = :conversation_id
  AND organization_id = :organization_id
  AND workspace_id = :workspace_id
ORDER BY sent_at ASC;
```

---

# Draft Query Rule

When using `draft_id` during send, verify:

```text
draft belongs to same organization
draft belongs to same workspace
draft belongs to same conversation
draft is accessible to current user/action
```

---

# Foreign Key Scope Consistency

Application/service layer must ensure:

```text
customer.workspace_id == conversation.workspace_id
conversation.workspace_id == message.workspace_id
conversation.workspace_id == reply_draft.workspace_id
conversation.workspace_id == activity_event.workspace_id
```

Optional advanced DB-level composite foreign keys can be considered later.

---

# Cross-Tenant Behavior

If user requests resource outside workspace:

```text
return safe 404 or forbidden based on API policy
do not reveal existence
log safe security event if suspicious
```

---

# Test Requirements

Must test:

```text
user cannot read another workspace conversation
user cannot read another workspace customer
user cannot send reply to another workspace conversation
AI context builder does not load another workspace messages
activity timeline is workspace-scoped
```

---

# Tenant Scoping Rule

```text
If a query touches business data and does not include workspace scope, treat it as a security bug.
```
