---
project: "CLARA"
artifact: "MVP First Product Slice Security & Privacy Checklist"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Security, Engineering, Product, AI, Data, and Product Operations Team"
last_updated: "2026-07-07"
classification: "security-privacy-checklist"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-UX-UI-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-DATABASE-MIGRATION-SPEC/"
source_of_truth:
  - "SECURITY.md"
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-07-Operations-Observability-and-Reliability/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 06 — Database Security and Privacy Checklist

> *"The database should help enforce safety instead of relying only on developer discipline."*

---

# Schema Checklist

- [ ] Business tables include `organization_id`.
- [ ] Business tables include `workspace_id`.
- [ ] Required fields are `NOT NULL`.
- [ ] Enum/check constraints exist.
- [ ] Foreign keys exist.
- [ ] Indexes support scoped queries.
- [ ] Demo seed is separate from schema migration.
- [ ] Rollback is documented.

---

# Sensitive Table Checklist

## customers

- [ ] Contact identifier is treated as sensitive.
- [ ] Notes summary avoids unnecessary sensitive data.
- [ ] Queries are workspace scoped.

## messages

- [ ] Message body is treated as sensitive.
- [ ] Message query is workspace scoped.
- [ ] Body not logged by default.

## reply_drafts

- [ ] Draft body is treated as sensitive.
- [ ] Draft lookup validates conversation/workspace.
- [ ] Draft from another workspace cannot be used.

## ai_draft_events

- [ ] Does not store provider secret.
- [ ] Does not store raw hidden prompt by default.
- [ ] Stores safe metadata only.
- [ ] Failed AI attempt can be recorded safely.

## activity_events

- [ ] Metadata is safe.
- [ ] Activity query is workspace scoped.
- [ ] Raw provider errors are not stored.
- [ ] Secrets are not stored.

---

# Secret Storage Checklist

Confirm database does not store:

```text
API keys
OAuth tokens
JWT secrets
session cookies
password plaintext
private keys
provider credentials
```

---

# Index Review Checklist

- [ ] Inbox query has index.
- [ ] Message timeline query has index.
- [ ] Activity timeline query has index.
- [ ] AI draft event query has index.
- [ ] Indexes include `workspace_id` early.

---

# Migration Checklist

- [ ] Migration is reviewable.
- [ ] Migration can run locally.
- [ ] Migration order is documented.
- [ ] Rollback strategy exists.
- [ ] Destructive migration requires explicit approval.
- [ ] Production-like rollback avoids blind drop.

---

# Seed Data Checklist

- [ ] Fake names only.
- [ ] Fake emails use `.test`.
- [ ] Fake phone numbers are clearly dummy.
- [ ] No real customer conversation.
- [ ] Seed is local/demo only.
- [ ] Seed is idempotent.

---

# Database Security Rule

```text
If the database stores it, assume it may one day appear in logs, exports, backups, or analytics. Store less.
```
