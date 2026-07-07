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


# 04 — Integration Test Plan

> *"Integration tests prove that services, database, auth, and adapters work together safely."*

---

# Purpose

This document defines integration tests across application services, database, and mock adapters.

---

# Integration Test Stack

Use:

```text
test database
mock auth/current user
mock AI provider
simulated send adapter
seed fixtures
```

---

# Conversation Inbox Integration Tests

## IT-001 — Agent Lists Conversations

Given:

```text
agent in workspace A
workspace A has conversations
```

When:

```text
GET /conversations
```

Then:

```text
only workspace A conversations returned
pagination shape exists
permissions included
```

---

## IT-002 — Viewer Lists Conversations

Then:

```text
viewer sees conversations
viewer permission hints cannot generate draft/send
```

---

# Conversation Detail Integration Tests

## IT-003 — Agent Opens Conversation Detail

Then:

```text
conversation returned
messages returned
customer profile returned
permissions returned
```

---

## IT-004 — Cross-Workspace Conversation Blocked

Given:

```text
user in workspace A
conversation in workspace B
```

When:

```text
GET /conversations/{workspace_b_conversation_id}
```

Then:

```text
safe 404 or forbidden
no workspace B data returned
```

---

# AI Draft Integration Tests

## IT-005 — Agent Generates AI Draft

Then:

```text
reply_draft created
ai_draft_event created
activity_event created
draft requires human review
no outbound message created
```

---

## IT-006 — Viewer AI Draft Blocked

Then:

```text
403 returned
no reply_draft created
no ai success event created
```

---

## IT-007 — AI Provider Failure

Then:

```text
safe error returned
manual reply remains possible
failure event recorded if designed
no outbound message created
```

---

# Reply Send Integration Tests

## IT-008 — Agent Sends Simulated Reply

Then:

```text
outbound message created
delivery_status simulated/sent
reply draft status updated if draft_id provided
activity_event reply_sent created
```

---

## IT-009 — Viewer Send Blocked

Then:

```text
403 returned
no message created
no reply_sent event created
```

---

## IT-010 — Draft From Another Workspace Rejected

Then:

```text
safe error returned
no message created
```

---

# Activity Integration Tests

## IT-011 — Activity Timeline Returned

Then:

```text
events for selected conversation returned
events sorted descending
metadata safe
workspace scoped
```

---

# Integration Test Rule

```text
Every high-value action should assert both state change and activity event.
```
