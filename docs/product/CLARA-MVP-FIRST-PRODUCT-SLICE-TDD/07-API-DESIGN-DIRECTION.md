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


# 07 — API Design Direction

> *"The API should expose user workflows, not database tables."*

---

# Purpose

This document defines API design direction before creating the formal API Spec.

---

# API Style

Recommended:

```text
REST JSON API
resource-oriented endpoints
consistent error envelope
cursor or offset pagination for inbox
server-side authorization on every endpoint
```

---

# Candidate Endpoints

## Auth/User Context

```text
GET /me
```

Returns current user context.

---

## Conversation Inbox

```text
GET /conversations
```

Query params:

```text
status
assigned_to
search
limit
cursor
```

---

## Conversation Detail

```text
GET /conversations/{conversation_id}
```

Returns:

```text
conversation
messages
customer summary
activity summary if needed
```

---

## Customer Profile

```text
GET /customers/{customer_id}
```

MVP may also include customer profile inside conversation detail to reduce API roundtrips.

---

## AI Draft

```text
POST /conversations/{conversation_id}/ai-draft
```

Body:

```json
{
  "instruction": "optional user instruction",
  "tone": "friendly"
}
```

Returns:

```json
{
  "draft_id": "draft_123",
  "conversation_id": "conv_123",
  "draft_text": "Hello...",
  "requires_human_review": true
}
```

---

## Send Reply

```text
POST /conversations/{conversation_id}/reply
```

Body:

```json
{
  "body": "Final human-reviewed message",
  "draft_id": "optional_draft_id"
}
```

---

## Activity

```text
GET /conversations/{conversation_id}/activity
```

Returns activity timeline.

---

# Error Envelope

Use consistent shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "correlation_id": "corr_123",
    "details": []
  }
}
```

---

# API Security Requirements

Every endpoint must:

```text
authenticate user
authorize action
scope resource by workspace
validate input
return safe error
emit correlation id
avoid leaking secrets
```

---

# API Design Rules

```text
do not expose raw database schema
do not let client choose workspace without authorization
do not include hidden prompts in response
do not return provider raw errors
do not trust client role claims
```

---

# Next Step

Create formal:

```text
CLARA MVP First Product Slice API Spec
```
