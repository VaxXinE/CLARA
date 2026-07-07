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


# 11 — Data Retention, Privacy, and Security

> *"Conversation data is sensitive by default, even in an MVP."*

---

# Purpose

This document defines data retention, privacy, and security requirements for the MVP database.

---

# Sensitive Data Categories

MVP stores:

```text
user email
customer display name
customer contact identifier
customer notes summary
conversation messages
reply drafts
AI draft metadata
activity events
```

Treat these as sensitive:

```text
customer contact identifiers
message body
reply draft body
customer notes
```

---

# Do Not Store

Do not store:

```text
provider API keys
OAuth tokens
session cookies
JWT secrets
password plaintext
raw hidden AI system prompts
raw provider errors with secrets
real customer data in demo seeds
payment data
```

---

# Data Minimization

Only store fields needed for MVP workflow:

```text
conversation handling
customer context
AI draft traceability
reply traceability
activity timeline
```

---

# AI Context Privacy

AI context builder should read:

```text
selected conversation messages
selected customer summary
workspace-safe context only
```

AI context builder must not read:

```text
other workspace messages
other customer conversations
unrelated private notes
secrets
tokens
billing/payment fields
```

---

# Logging Privacy

Logs should not include:

```text
full message body
full draft body
contact identifier unless necessary and redacted
raw AI prompt
tokens/secrets
```

Use IDs and correlation IDs instead.

---

# Retention Direction

For MVP:

```text
no automatic deletion required yet
soft delete can be introduced later
retention policy should be defined before production
```

Before production, define:

```text
customer data retention
message retention
AI draft retention
activity event retention
deletion/export process
```

---

# Deletion Direction

Avoid hard delete for conversation data until product and compliance policy is clear.

Future options:

```text
soft delete
archive
redaction
retention-based purge
```

---

# Access Control Review

Before coding, confirm:

```text
which roles can view customers
which roles can view messages
which roles can generate AI drafts
which roles can send replies
which roles can view activity
```

---

# Database Security Checklist

- [ ] Business tables include organization_id and workspace_id.
- [ ] Common indexes include workspace scope.
- [ ] No secrets stored.
- [ ] Seed data is fake.
- [ ] AI events do not store raw hidden prompts by default.
- [ ] Activity metadata is safe.
- [ ] Message/draft logging policy exists.
- [ ] Cross-workspace tests are required.

---

# Privacy Rule

```text
If data is not needed for the MVP workflow, do not store it yet.
```
