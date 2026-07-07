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


# 10 — Privacy, Data Minimization, and Retention Checklist

> *"Privacy starts by not collecting or storing what the MVP does not need."*

---

# Data Minimization Checklist

Only collect/store MVP-needed fields:

```text
customer display name
contact identifier
source/channel label
customer status
notes summary
conversation messages
reply drafts
AI draft metadata
activity events
```

Avoid collecting/storing:

```text
payment data
government ID
sensitive personal attributes
unrelated customer history
unnecessary internal notes
raw provider payloads by default
```

---

# Customer Data Checklist

- [ ] Customer contact identifier is necessary.
- [ ] Notes summary avoids unnecessary sensitive data.
- [ ] Profile sidebar shows only needed data.
- [ ] Customer data is scoped to workspace.
- [ ] Customer data is not exposed in logs.

---

# Conversation Data Checklist

- [ ] Messages are scoped to workspace.
- [ ] Messages are not logged raw by default.
- [ ] Messages used for AI are limited to selected conversation.
- [ ] Message retention is noted before production.

---

# AI Privacy Checklist

- [ ] AI context contains only necessary conversation/customer context.
- [ ] AI provider receives no secrets.
- [ ] AI provider receives no unrelated workspace data.
- [ ] Raw hidden prompt not stored by default.
- [ ] AI metadata is safe.
- [ ] Prompt version is recorded.

---

# Demo Data Checklist

- [ ] Fake names only.
- [ ] `.test` emails only.
- [ ] Dummy phone numbers only.
- [ ] No real screenshots.
- [ ] No copied real customer chats.
- [ ] Seed data marked local/demo only.

---

# Retention Checklist

Before production, define retention for:

```text
customer profiles
messages
reply drafts
AI draft events
activity events
logs
backups
```

MVP internal demo may defer automation but must document the gap.

---

# Deletion/Export Direction

Future design should support:

```text
customer deletion request
conversation archive
data export
redaction
retention-based purge
```

Do not implement destructive deletion casually in MVP.

---

# Privacy Review Questions

Before implementation:

```text
What data do we actually need?
Who can see it?
Does AI need it?
Will it appear in logs?
Will it appear in analytics?
How long should we keep it?
How do we remove it later?
```

---

# Privacy Rule

```text
If data is not required for the reply workflow, do not collect it in MVP.
```
