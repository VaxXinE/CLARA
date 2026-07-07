---
project: "CLARA"
artifact: "MVP First Product Slice UX Flow + UI Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Product Design, Product, Engineering, Security, and AI Team"
last_updated: "2026-07-07"
classification: "ux-flow-ui-specification"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
source_of_truth:
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-02-Master-Blueprint/"
  - "docs/BOOK-04-Product-Domain-Specification/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 07 — Permission and Role UX

> *"Permission UX should reduce confusion, but security must still be enforced by the backend."*

---

# Purpose

This document defines how roles and permissions appear in the UI.

---

# MVP Roles

```text
Owner
Agent
Viewer
```

---

# Role-Based UI Behavior

| UI Element | Owner | Agent | Viewer |
|---|---:|---:|---:|
| Inbox | Visible | Visible | Visible |
| Conversation Detail | Visible | Visible | Visible |
| Customer Profile | Visible | Visible | Visible |
| Activity Timeline | Visible | Visible | Visible |
| Reply Composer | Editable | Editable | Read-only/hidden |
| Generate AI Draft | Visible | Visible | Hidden/Disabled |
| Send Reply | Visible | Visible | Hidden/Disabled |

---

# Viewer UX

Viewer should see:

```text
You have view-only access to this conversation.
```

Viewer should not see active send controls.

If composer is shown, it should be clearly read-only.

---

# Unauthorized Resource UX

When user opens inaccessible conversation:

```text
Conversation not found or you do not have access.
```

Prefer safe copy that does not confirm resource existence.

---

# Forbidden Action UX

If action is blocked:

```text
You do not have permission to perform this action.
```

Include correlation ID only if useful:

```text
Reference: corr_123
```

---

# Workspace Scope UX

If user has multiple workspaces in future:

```text
workspace selector
clear workspace label
```

For MVP, show current workspace in top bar.

---

# Permission Loading State

Before permissions load:

```text
disable high-impact actions
show skeleton/loading state
```

Do not briefly show send/AI buttons and then hide them.

---

# Security UX Rule

```text
Never reveal whether another workspace's resource exists.
```

---

# Backend Rule Reminder

```text
UI permission checks are convenience. Backend authorization is mandatory.
```
