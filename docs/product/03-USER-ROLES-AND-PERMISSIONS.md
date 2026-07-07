---
project: "CLARA"
artifact: "MVP First Product Slice PRD"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Product, Engineering, Security, and Product Operations Team"
last_updated: "2026-07-07"
classification: "product-requirements-document"
repository: "https://github.com/VaxXinE/CLARA"
source_of_truth:
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-02-Master-Blueprint/"
  - "docs/BOOK-04-Product-Domain-Specification/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 03 — User Roles and Permissions

> *"Role design should protect customer data before the team grows."*

---

# Purpose

This document defines MVP roles and permission boundaries.

---

# MVP Roles

## Owner

Can:

```text
access all MVP conversations in workspace
view customer profiles
generate AI drafts
edit/send replies
view activity log
manage basic demo data in future
```

## Agent

Can:

```text
view assigned or workspace-permitted conversations
view customer profiles for accessible conversations
generate AI drafts
edit/send replies
view activity for accessible conversations
```

## Viewer

Can:

```text
view accessible conversations
view customer profiles
view activity log
```

Cannot:

```text
generate AI drafts
send replies
edit customer data
```

---

# Future Roles

Out of MVP but reserved:

```text
Admin
Team Lead
Customer Success Manager
Growth Operator
Security Auditor
Superadmin
```

---

# Permission Matrix

| Capability | Owner | Agent | Viewer |
|---|---:|---:|---:|
| View inbox | Yes | Yes | Yes |
| View conversation detail | Yes | Yes | Yes |
| View customer profile | Yes | Yes | Yes |
| Generate AI draft | Yes | Yes | No |
| Edit reply composer | Yes | Yes | No |
| Send reply | Yes | Yes | No |
| View activity log | Yes | Yes | Yes |
| Manage workspace settings | Future | No | No |
| Manage roles | Future | No | No |

---

# Authorization Rules

All permission checks must be enforced:

```text
server-side
per workspace/organization
per conversation access scope
per action
```

Frontend checks are UX only.

---

# Tenant Boundary

Every conversation and customer profile must belong to:

```text
organization_id
workspace_id
```

Every query must be scoped.

---

# Security Requirements

The system must prevent:

```text
user seeing another workspace's conversation
viewer generating AI draft
viewer sending reply
agent accessing unauthorized workspace
AI context including unauthorized customer data
activity log exposing data outside user's scope
```

---

# Audit Events

Record audit/activity events for:

```text
AI draft generated
reply sent
reply failed
conversation status changed
customer profile viewed in future if needed
```

---

# Permission Rule

```text
If the backend does not enforce the permission, the permission does not exist.
```
