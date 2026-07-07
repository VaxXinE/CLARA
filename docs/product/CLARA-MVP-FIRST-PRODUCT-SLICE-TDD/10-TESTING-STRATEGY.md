---
project: "CLARA"
artifact: "MVP First Product Slice TDD"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering, Architecture, Security, AI, and Product Team"
last_updated: "2026-07-07"
classification: "technical-design-document"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
source_of_truth:
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-03-Implementation-Architecture/"
  - "docs/BOOK-04-Product-Domain-Specification/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-07-Operations-Observability-and-Reliability/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 10 — Testing Strategy

> *"The first slice needs tests that prove both happy path and security boundaries."*

---

# Purpose

This document defines the technical testing strategy for the MVP.

---

# Test Layers

Use:

```text
unit tests
integration tests
API tests
UI tests
security negative tests
AI mock tests
```

---

# Unit Tests

Cover:

```text
permission checks
context builder
AI draft validation
reply send rules
error mapping
redaction utility
```

---

# Integration Tests

Cover:

```text
conversation inbox with workspace scope
conversation detail with messages/customer
AI draft generation using mock provider
reply send using simulated adapter
activity event recording
```

---

# API Tests

Cover:

```text
GET /conversations
GET /conversations/{id}
POST /conversations/{id}/ai-draft
POST /conversations/{id}/reply
GET /conversations/{id}/activity
```

---

# Security Negative Tests

Required:

```text
unauthenticated user rejected
viewer cannot generate AI draft
viewer cannot send reply
user cannot access other workspace conversation
invalid conversation id returns safe error
AI context does not include other workspace data
```

---

# AI Tests

Use mock provider for:

```text
successful draft
provider timeout
provider error
unsafe/malformed output
```

---

# UI Tests

Cover:

```text
inbox renders
conversation detail renders
customer sidebar renders
AI draft loading state
AI draft error state
draft editable before send
viewer send button hidden or disabled
```

Remember:

```text
backend authorization test is still required even if UI hides button
```

---

# Acceptance Test Scenario

```text
agent logs in
agent opens inbox
agent opens conversation
agent generates AI draft
agent edits reply
agent sends reply
activity event appears
```

---

# Definition of Done for Tests

- [ ] Happy path tested.
- [ ] Authz negative path tested.
- [ ] AI failure tested.
- [ ] Send failure tested.
- [ ] Activity event tested.
- [ ] Safe error shape tested.
- [ ] No secret exposure in health/error tested where applicable.

---

# Testing Rule

```text
If a permission exists, there must be a negative test proving it blocks unauthorized action.
```
