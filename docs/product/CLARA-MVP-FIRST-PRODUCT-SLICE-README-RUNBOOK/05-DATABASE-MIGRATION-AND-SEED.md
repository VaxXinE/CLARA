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

# 05 — Database Migration and Seed

> _"Migrations create the structure. Seeds create safe demo reality."_

---

# Purpose

This document defines how to run database migrations and seed demo data.

---

# Migration Commands

Final commands depend on chosen migration tool.

Template:

```bash
npm run db:migrate
```

Alternative examples:

```bash
npm run prisma:migrate
npm run drizzle:migrate
npm run db:push
```

---

# Migration Order

Expected migration groups:

```text
001 identity/workspace tables
002 customer/conversation/message tables
003 reply draft/AI event tables
004 activity events
005 indexes
006 optional demo seed
```

---

# Verify Tables

Template:

```bash
npm run db:verify
```

Manual expected tables:

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

# Seed Demo Data

Template:

```bash
npm run db:seed:demo
```

Seed should create:

```text
Demo Organization
Demo Sales Workspace
Owner Demo User
Agent Demo User
Viewer Demo User
Budi Demo Customer
Sari Demo Customer
Demo Conversations
Demo Messages
Cross-workspace fixture for security tests
```

---

# Seed Safety

Seed data must:

```text
use fake names
use .test emails
use dummy phone numbers
contain no real customer content
be idempotent
run only in local/demo
```

---

# Reset Local Database

Template:

```bash
npm run db:reset
npm run db:migrate
npm run db:seed:demo
```

Warning:

```text
Only reset local/dev database.
Never run destructive reset in production-like environment.
```

---

# Migration Troubleshooting

## Migration fails because table exists

Try:

```bash
npm run db:status
```

Then check if previous migration partially ran.

## Seed duplicates data

Seed must be idempotent. Fix seed script to upsert or skip existing IDs.

## Cross-workspace tests missing fixture

Run demo seed again or verify seed includes workspace B fixture.

---

# Database Rule

```text
Do not use real customer data to test conversation workflows.
```
