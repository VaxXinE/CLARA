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


# 05 — API Input Validation and Output Safety Checklist

> *"Every input is untrusted. Every output is a potential leak if shaped carelessly."*

---

# Input Validation Scope

Validate:

```text
path parameters
query parameters
request bodies
headers if used
```

---

# Path Parameter Checklist

- [ ] `conversation_id` is validated.
- [ ] `customer_id` is validated.
- [ ] Invalid IDs return safe error.
- [ ] Resource existence is not leaked across workspace boundaries.

---

# Query Parameter Checklist

## `status`

- [ ] Allowed values only: `open`, `pending`, `closed`.

## `search`

- [ ] Trimmed.
- [ ] Max length enforced.
- [ ] Parameterized in database query.
- [ ] No raw SQL concatenation.

## `limit`

- [ ] Default limit applied.
- [ ] Max limit enforced.
- [ ] Negative/zero rejected.

## `cursor`

- [ ] Cursor format validated.
- [ ] Invalid cursor returns safe validation error.

---

# AI Draft Body Checklist

## `instruction`

- [ ] Optional.
- [ ] Max 500 chars.
- [ ] Treated as untrusted input.
- [ ] Does not override system safety instruction.
- [ ] Not logged raw by default.

## `tone`

- [ ] Allowed values only: `friendly`, `professional`, `concise`.

---

# Reply Body Checklist

- [ ] Required.
- [ ] Non-whitespace.
- [ ] Max 4000 chars.
- [ ] Stored safely.
- [ ] Rendered safely on frontend.
- [ ] Not logged raw by default.

---

# Output Safety Checklist

- [ ] API does not return hidden prompt.
- [ ] API does not return provider raw errors.
- [ ] API does not return stack traces.
- [ ] API does not return SQL errors.
- [ ] API does not return secrets/tokens/cookies.
- [ ] API returns correlation ID.
- [ ] API uses standard error envelope.

---

# Injection Prevention Checklist

- [ ] Database queries are parameterized.
- [ ] Search filters do not concatenate SQL.
- [ ] Sort fields are allowlisted if added.
- [ ] JSON metadata is not blindly rendered as HTML.
- [ ] Message body is rendered as text, not raw HTML.

---

# Validation Error Shape

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "correlation_id": "corr_123",
    "details": [
      {
        "field": "body",
        "message": "Reply body is required."
      }
    ]
  }
}
```

---

# API Safety Rule

```text
Validation must happen before business logic, database query, AI call, or send adapter call.
```
