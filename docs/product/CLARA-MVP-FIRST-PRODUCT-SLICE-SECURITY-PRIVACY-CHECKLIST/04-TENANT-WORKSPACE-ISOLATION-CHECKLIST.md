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


# 04 — Tenant and Workspace Isolation Checklist

> *"Cross-tenant leakage is one of the highest-impact bugs in a SaaS-style system."*

---

# Scope

Tenant/workspace isolation applies to:

```text
customers
conversations
messages
reply_drafts
ai_draft_events
activity_events
```

---

# Database Design Checklist

- [ ] `customers` has `organization_id`.
- [ ] `customers` has `workspace_id`.
- [ ] `conversations` has `organization_id`.
- [ ] `conversations` has `workspace_id`.
- [ ] `messages` has `organization_id`.
- [ ] `messages` has `workspace_id`.
- [ ] `reply_drafts` has `organization_id`.
- [ ] `reply_drafts` has `workspace_id`.
- [ ] `ai_draft_events` has `organization_id`.
- [ ] `ai_draft_events` has `workspace_id`.
- [ ] `activity_events` has `organization_id`.
- [ ] `activity_events` has `workspace_id`.

---

# Query Checklist

Every query must include:

```text
organization_id = current_user.organization_id
workspace_id = current_user.workspace_id
```

Check:

- [ ] Conversation list query includes workspace scope.
- [ ] Conversation detail query includes workspace scope.
- [ ] Message query includes workspace scope.
- [ ] Customer profile query includes workspace scope.
- [ ] AI context builder query includes workspace scope.
- [ ] Reply draft lookup includes workspace scope.
- [ ] Activity timeline query includes workspace scope.

---

# Bad Query Pattern

```sql
SELECT * FROM conversations WHERE id = :conversation_id;
```

---

# Good Query Pattern

```sql
SELECT *
FROM conversations
WHERE id = :conversation_id
  AND organization_id = :organization_id
  AND workspace_id = :workspace_id;
```

---

# AI Context Isolation

- [ ] AI context builder loads only selected conversation.
- [ ] AI context builder loads only selected customer.
- [ ] AI context builder never loads another workspace.
- [ ] AI context builder does not use global customer search without scope.
- [ ] AI context builder is covered by cross-workspace test.

---

# Negative Tests

Required:

```text
workspace A user cannot read workspace B conversation
workspace A user cannot read workspace B customer
workspace A user cannot read workspace B activity
workspace A user cannot use workspace B draft_id
AI draft for workspace A does not include workspace B messages
```

---

# Isolation Rule

```text
A query touching business data without workspace scope is a P0 security bug.
```
