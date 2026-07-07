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


# 02 — Authentication Checklist

> *"Authentication answers who the user is. It must be resolved before any business data is loaded."*

---

# Scope

Authentication applies to:

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

# Checklist

## Required

- [ ] Every MVP API endpoint requires authenticated user context.
- [ ] Unauthenticated requests return `401 UNAUTHENTICATED`.
- [ ] Auth resolution happens before resource lookup.
- [ ] Auth resolution produces `user_id`.
- [ ] Auth resolution produces `organization_id`.
- [ ] Auth resolution produces `workspace_id`.
- [ ] Auth resolution produces role/permissions.
- [ ] Invalid token/session does not fall back to anonymous access.
- [ ] Expired token/session does not allow access.
- [ ] Dev/mock auth is disabled outside local/demo environments.

---

# `/me` Endpoint Checklist

- [ ] `/me` returns safe current user context.
- [ ] `/me` returns workspace context.
- [ ] `/me` returns permission hints.
- [ ] `/me` does not return password hash.
- [ ] `/me` does not return session token.
- [ ] `/me` does not return JWT secret.
- [ ] `/me` does not return provider credentials.

---

# Production Safety

- [ ] Production cannot start with mock auth enabled.
- [ ] Production cannot start with default auth secret.
- [ ] Auth secret is loaded from environment/secret manager.
- [ ] Auth-related errors are safely logged.
- [ ] Auth logs do not include credentials.

---

# Negative Tests

Required tests:

```text
request without auth returns 401
request with invalid token returns 401
request with expired token/session returns 401
dev mock auth rejected when APP_ENV=production
```

---

# Auth Error Shape

```json
{
  "error": {
    "code": "UNAUTHENTICATED",
    "message": "Authentication is required.",
    "correlation_id": "corr_123",
    "details": []
  }
}
```

---

# Authentication Rule

```text
No business data may be loaded until authenticated user context is resolved.
```
