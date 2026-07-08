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

# 05 — API Contract Test Plan

> _"API contract tests protect the frontend/backend boundary from silent drift."_

---

# Purpose

This document defines API contract tests based on the API Spec.

---

# Contract Test Scope

Endpoints:

```text
GET /api/v1/me
GET /api/v1/conversations
GET /api/v1/conversations/{conversation_id}
GET /api/v1/customers/{customer_id}
POST /api/v1/conversations/{conversation_id}/ai-draft
POST /api/v1/conversations/{conversation_id}/reply
GET /api/v1/conversations/{conversation_id}/activity
```

---

# Shared Contract Tests

Every endpoint must verify:

```text
response is JSON
response includes X-Correlation-Id
errors use standard error envelope
unauthenticated request returns 401
forbidden request returns safe 403 where applicable
resource not found returns safe 404
```

---

# GET /me Contract Tests

Validate response includes:

```text
user
organization
workspace
permissions
environment safe metadata
```

Validate response excludes:

```text
password hash
session token
JWT secret
provider credentials
```

---

# GET /conversations Contract Tests

Validate:

```text
data is array
pagination object exists
conversation row has id/customer/source/status/snippet/timestamp
permissions object exists
limit max enforced
invalid status rejected
```

---

# GET /conversations/{id} Contract Tests

Validate:

```text
conversation object exists
customer object exists
messages array exists
permissions exists
message body exists
delivery_status exists
```

---

# GET /customers/{id} Contract Tests

Validate:

```text
customer object exists
contact identifier present if allowed
notes_summary present
no unnecessary sensitive fields
```

---

# POST /ai-draft Contract Tests

Validate success response includes:

```text
draft.id
draft.draft_text
draft.requires_human_review = true
ai_metadata.prompt_version
permissions.can_send_reply
```

Validate it excludes:

```text
hidden prompt
raw provider response
provider secret
```

---

# POST /reply Contract Tests

Validate success response includes:

```text
message.id
message.direction = outbound
message.body
message.delivery_status
activity_event.id
```

Validate errors:

```text
empty body returns validation error
viewer returns forbidden
send failure returns safe SEND_FAILED
```

---

# GET /activity Contract Tests

Validate:

```text
data is array
event_type exists
summary exists
created_at exists
metadata safe
pagination exists
```

---

# OpenAPI Validation

When implementation exists, contract tests should validate against:

```text
12-OPENAPI-STARTER-SKELETON.yaml
```

or its finalized implementation version.

---

# API Contract Rule

```text
If frontend depends on a field, the API contract test should protect it.
```
