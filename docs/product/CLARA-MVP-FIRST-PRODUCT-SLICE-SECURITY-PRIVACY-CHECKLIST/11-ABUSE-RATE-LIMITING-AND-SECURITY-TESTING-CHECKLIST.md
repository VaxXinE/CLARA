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


# 11 — Abuse, Rate Limiting, and Security Testing Checklist

> *"Security controls are only trustworthy when negative tests prove they fail closed."*

---

# Abuse Scenarios

The MVP should consider:

```text
AI draft spam
reply send spam
viewer direct API abuse
cross-workspace ID guessing
search abuse
oversized payloads
prompt injection content
provider failure loops
```

---

# Rate Limiting Checklist

Recommended soft limits:

```text
POST /ai-draft: 10/user/minute
POST /reply: 30/user/minute
GET /conversations: 120/user/minute
GET /activity: 120/user/minute
```

Checklist:

- [ ] AI draft endpoint can be rate-limited.
- [ ] Reply endpoint can be rate-limited.
- [ ] Rate limit response is safe.
- [ ] Rate limit does not expose internals.
- [ ] Rate limit can be disabled/tuned for local demo.

---

# Payload Abuse Checklist

- [ ] Max reply body length enforced.
- [ ] Max AI instruction length enforced.
- [ ] Max search length enforced.
- [ ] Max pagination limit enforced.
- [ ] Invalid enum rejected.
- [ ] Empty body rejected.
- [ ] Oversized payload returns safe error.

---

# Required Security Negative Tests

## Auth

```text
unauthenticated request returns 401
invalid auth returns 401
```

## RBAC

```text
viewer cannot generate AI draft
viewer cannot send reply
```

## Tenant Isolation

```text
workspace A cannot read workspace B conversation
workspace A cannot read workspace B customer
workspace A cannot read workspace B activity
workspace A cannot use workspace B draft_id
```

## AI Safety

```text
AI draft endpoint does not send message
prompt injection text does not reveal hidden prompt
AI failure preserves manual composer
```

## API Validation

```text
invalid status rejected
oversized reply body rejected
empty reply body rejected
invalid tone rejected
```

## Logging

```text
secret-like values are redacted or not logged
raw provider error is not returned to frontend
```

---

# Security Test Gate

No MVP release without passing:

```text
auth negative tests
RBAC negative tests
tenant isolation tests
AI safety tests
API validation tests
safe error tests
```

---

# Abuse Rule

```text
The MVP should fail closed: when uncertain, block the action and return a safe error.
```
