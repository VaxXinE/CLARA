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


# 10 — Design to API Handoff

> *"The UI spec should tell API designers exactly what data the screen needs and when."*

---

# Purpose

This document maps UI needs to API requirements.

---

# Screen to API Map

| UI Surface | Data Needed | Candidate API |
|---|---|---|
| Top Bar | current user/workspace | `GET /me` |
| Inbox | conversation list | `GET /conversations` |
| Filters | status/search params | `GET /conversations?status=&search=` |
| Conversation Thread | conversation + messages | `GET /conversations/{id}` |
| Customer Sidebar | customer profile | included in detail or `GET /customers/{id}` |
| AI Draft Button | draft generation | `POST /conversations/{id}/ai-draft` |
| Reply Composer | send reply | `POST /conversations/{id}/reply` |
| Activity Timeline | activity events | `GET /conversations/{id}/activity` |

---

# UI Data Contract Needs

## Conversation Row

Needs:

```text
id
customer_display_name
latest_message_snippet
source
status
updated_at
assigned_user
unread_count optional
```

---

## Conversation Detail

Needs:

```text
conversation_id
customer
messages[]
status
source
assigned_user
permissions
```

---

## Message

Needs:

```text
id
direction
sender_display_name
body
sent_at
delivery_status
```

---

## Customer Profile

Needs:

```text
id
display_name
contact_identifier
source
status
notes_summary
last_interaction_at
tags optional
```

---

## Permissions

The UI benefits from receiving resource-level permissions:

```json
{
  "permissions": {
    "can_generate_ai_draft": true,
    "can_send_reply": true,
    "can_view_activity": true
  }
}
```

Backend must still enforce these.

---

## AI Draft Response

Needs:

```text
draft_id
conversation_id
draft_text
requires_human_review
created_at
```

Optional:

```text
prompt_version
latency_ms
```

Do not expose:

```text
hidden prompt
raw provider response
secret provider metadata
```

---

## Reply Send Response

Needs:

```text
message_id
conversation_id
status
sent_at
activity_event_id
```

---

# Loading Requirements

The UI needs APIs to support:

```text
fast inbox load
conversation detail by id
safe retry on AI draft
safe retry on send failure
```

---

# Error Requirements

API should return consistent errors with:

```text
code
message
correlation_id
details optional
```

---

# Handoff Rule

```text
API responses should support UI permission states without making the UI the source of authorization truth.
```
