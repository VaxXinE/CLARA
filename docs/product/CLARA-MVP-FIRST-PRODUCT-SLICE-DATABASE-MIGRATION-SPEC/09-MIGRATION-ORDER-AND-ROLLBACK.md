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


# 09 — Migration Order and Rollback

> *"Migrations should be small, ordered, reversible in development, and cautious in production."*

---

# Purpose

This document defines migration order and rollback strategy.

---

# Recommended Migration Files

```text
001_create_organizations_workspaces_users.sql
002_create_customers_conversations_messages.sql
003_create_reply_drafts_ai_draft_events.sql
004_create_activity_events.sql
005_create_indexes.sql
006_seed_demo_data.sql
```

If using Alembic/Prisma/Drizzle/etc, use equivalent migration naming.

---

# Migration 001

Creates:

```text
organizations
workspaces
users
workspace_memberships
```

Why first:

```text
all business tables depend on organization/workspace/user scope
```

---

# Migration 002

Creates:

```text
customers
conversations
messages
```

Why second:

```text
core conversation domain depends on workspace/user tables
```

---

# Migration 003

Creates:

```text
reply_drafts
ai_draft_events
```

Why third:

```text
AI draft depends on conversations/messages/users
```

---

# Migration 004

Creates:

```text
activity_events
```

Why fourth:

```text
activity events reference conversations/users
```

---

# Migration 005

Creates indexes.

Why separate:

```text
easier review
easier performance tuning
```

---

# Migration 006

Creates optional seed/demo data.

Rules:

```text
local/dev/demo only
idempotent
no production secrets
no real customer data
```

---

# Rollback Strategy

## Dev/Local

Rollback can drop tables in reverse order:

```text
activity_events
ai_draft_events
reply_drafts
messages
conversations
customers
workspace_memberships
users
workspaces
organizations
```

---

## Staging/Production-Like

Avoid destructive rollback after data exists.

Prefer:

```text
forward-fix migration
backup before destructive changes
feature flag disable
safe data migration plan
```

---

# Rollback SQL Warning

Do not blindly run:

```sql
DROP TABLE ...
```

in production-like environments.

---

# Migration Safety Checklist

- [ ] Migration is small.
- [ ] Migration order is correct.
- [ ] Foreign keys are valid.
- [ ] Tenant scope columns exist.
- [ ] Indexes support query paths.
- [ ] Seed data is optional.
- [ ] Rollback is documented.
- [ ] No real data/secrets in seed.
- [ ] Migration tested locally.

---

# Migration Rule

```text
Schema changes should be reviewable before they are executable.
```
