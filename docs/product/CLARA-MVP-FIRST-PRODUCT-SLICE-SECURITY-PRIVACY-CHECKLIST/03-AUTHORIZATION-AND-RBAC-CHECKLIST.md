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


# 03 — Authorization and RBAC Checklist

> *"Authorization answers what the authenticated user is allowed to do."*

---

# MVP Roles

```text
owner
agent
viewer
```

---

# Permission Matrix

| Permission | Owner | Agent | Viewer |
|---|---:|---:|---:|
| `conversation:read` | Yes | Yes | Yes |
| `customer:read` | Yes | Yes | Yes |
| `activity:read` | Yes | Yes | Yes |
| `ai_draft:create` | Yes | Yes | No |
| `reply:send` | Yes | Yes | No |

---

# Endpoint Permission Checklist

## GET /api/v1/conversations

- [ ] Requires `conversation:read`.
- [ ] Returns only accessible workspace conversations.

## GET /api/v1/conversations/{conversation_id}

- [ ] Requires `conversation:read`.
- [ ] Validates resource belongs to workspace.

## GET /api/v1/customers/{customer_id}

- [ ] Requires `customer:read`.
- [ ] Validates resource belongs to workspace.

## POST /api/v1/conversations/{conversation_id}/ai-draft

- [ ] Requires `ai_draft:create`.
- [ ] Viewer is blocked.
- [ ] Conversation belongs to workspace.
- [ ] Activity event is recorded on success/failure.

## POST /api/v1/conversations/{conversation_id}/reply

- [ ] Requires `reply:send`.
- [ ] Viewer is blocked.
- [ ] Conversation belongs to workspace.
- [ ] Draft belongs to same conversation/workspace if provided.
- [ ] Activity event is recorded on success/failure.

## GET /api/v1/conversations/{conversation_id}/activity

- [ ] Requires `activity:read`.
- [ ] Conversation belongs to workspace.

---

# Backend Enforcement Checklist

- [ ] Permission checks are centralized or consistently reusable.
- [ ] Permission checks happen before action execution.
- [ ] Permission checks are not based on client-provided role.
- [ ] Frontend permissions are treated as hints only.
- [ ] Forbidden action returns safe `403`.
- [ ] Cross-workspace resource returns safe `404` where appropriate.

---

# Negative Tests

Required:

```text
viewer cannot generate AI draft
viewer cannot send reply
agent cannot access other workspace conversation
viewer direct API call still fails
user cannot send reply using draft from another conversation
```

---

# Forbidden Error Shape

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action.",
    "correlation_id": "corr_123",
    "details": []
  }
}
```

---

# Authorization Rule

```text
If the backend does not enforce it, the permission does not exist.
```
