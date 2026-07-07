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


# 08 — Empty, Loading, and Error States

> *"State design is product quality. Bad states make MVPs feel broken even when the backend works."*

---

# Purpose

This document defines required empty, loading, and error states.

---

# Inbox Loading

Message:

```text
Loading conversations...
```

UI:

```text
skeleton rows
disable filters until loaded
```

---

# Inbox Empty

Message:

```text
No conversations yet.
```

Helper:

```text
Import demo data or connect your first channel to start.
```

Action:

```text
Import Demo Data
```

Action can be disabled if not implemented.

---

# Conversation Not Selected

Message:

```text
Select a conversation to view the message history.
```

Right panel:

```text
No customer selected.
```

---

# Conversation Loading

Message:

```text
Loading conversation...
```

UI:

```text
message skeletons
profile skeleton
composer disabled until loaded
```

---

# Customer Profile Missing

Message:

```text
Customer profile is incomplete.
```

Helper:

```text
Add more customer details later to improve reply quality.
```

MVP can be read-only.

---

# AI Draft Loading

Message:

```text
Generating AI draft...
```

Helper:

```text
You can still write manually if needed.
```

---

# AI Draft Error

Message:

```text
AI draft is unavailable right now.
```

Helper:

```text
You can still write a manual reply.
```

Action:

```text
Try AI Again
```

---

# Reply Send Loading

Message:

```text
Sending reply...
```

Behavior:

```text
disable send button
do not clear composer until success
```

---

# Reply Send Error

Message:

```text
Reply could not be sent.
```

Helper:

```text
Your draft is still here. Please try again.
```

---

# Forbidden Action

Message:

```text
You do not have permission to perform this action.
```

---

# Generic Error

Message:

```text
Something went wrong.
```

Helper:

```text
Please try again. If the issue continues, contact support.
```

Optional:

```text
Reference: correlation_id
```

---

# Error Copy Rules

Do not show:

```text
stack trace
SQL query
provider raw error
API key
token
internal service name if sensitive
hidden prompt
```

---

# State Rule

```text
Recoverable errors should preserve user input.
```
