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


# 03 — Screen Information Architecture

> *"Information architecture decides what the user sees first, what they act on, and what stays safely out of the way."*

---

# Primary Route

Recommended route:

```text
/app/conversations
```

Alternative:

```text
/dashboard/conversations
```

---

# Screen Regions

```text
Top Bar
Left Panel: Conversation Inbox
Center Panel: Conversation Detail
Bottom Center: Reply Composer
Right Panel: Customer Profile + Activity
```

---

# Layout Structure

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Top Bar: Workspace, User, Status                                             │
├──────────────────────┬──────────────────────────────────────┬────────────────┤
│ Inbox Panel          │ Conversation Thread                  │ Profile Panel  │
│ - Search             │ - Header                             │ - Customer     │
│ - Filters            │ - Messages                           │ - Details      │
│ - Conversation Rows  │ - Composer                           │ - Activity     │
└──────────────────────┴──────────────────────────────────────┴────────────────┘
```

---

# Top Bar

Content:

```text
CLARA logo/name
workspace name
environment label if dev/demo
current user avatar/name
optional connection/status indicator
```

---

# Inbox Panel

Content:

```text
search input
status filters
conversation list
conversation row metadata
empty state
loading state
```

Conversation row fields:

```text
customer display name
latest message snippet
channel/source
status
timestamp
unread indicator if available
assigned user if available
```

---

# Conversation Detail Panel

Content:

```text
conversation header
message thread
message sender/direction
timestamps
reply composer
AI draft action
send button
```

Header fields:

```text
customer name
channel/source
conversation status
assigned user if available
```

---

# Reply Composer

Content:

```text
textarea
Generate AI Draft button
AI draft label/state
Send Reply button
manual edit hint
error message area
```

---

# Profile Panel

Content:

```text
customer name
contact identifier
source/channel
status
last interaction
notes summary
basic tags if available
```

---

# Activity Timeline

Content:

```text
AI draft generated
reply sent
reply failed
status changed
manual note in future
```

---

# Visual Priority

Priority order:

```text
1. selected conversation message thread
2. reply composer
3. customer profile
4. inbox list
5. activity timeline
```

---

# IA Rule

```text
Reply action should always be visually connected to the selected conversation and customer context.
```
