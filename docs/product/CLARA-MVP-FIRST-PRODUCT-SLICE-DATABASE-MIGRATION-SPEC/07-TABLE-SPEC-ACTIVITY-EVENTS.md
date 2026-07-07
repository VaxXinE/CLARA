---
project: "CLARA"
artifact: "MVP First Product Slice Database Migration Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Backend, Data, Security, Product, and Product Operations Team"
last_updated: "2026-07-07"
classification: "database-migration-specification"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-UX-UI-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/"
source_of_truth:
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-04-Product-Domain-Specification/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-07-Operations-Observability-and-Reliability/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 07 — Table Spec: Activity Events

> *"Activity events are the customer conversation timeline for humans, support, audit, and product operations."*

---

# Table: activity_events

## Purpose

Stores activity timeline for a conversation.

Used by:

```text
right panel activity timeline
support debugging
AI quality review
product operations analysis
security review where relevant
```

---

# Columns

| Column | Type | Required | Notes |
|---|---|---:|---|
| `id` | text/uuid | Yes | Primary key |
| `organization_id` | text/uuid | Yes | Tenant scope |
| `workspace_id` | text/uuid | Yes | Workspace scope |
| `conversation_id` | text/uuid | Yes | FK conversations.id |
| `actor_user_id` | text/uuid | No | FK users.id; nullable for system |
| `event_type` | text | Yes | controlled enum/check |
| `summary` | text | Yes | Human-readable safe summary |
| `metadata` | jsonb | No | Safe structured metadata |
| `created_at` | timestamptz | Yes | Default now |

---

# Event Types

MVP event types:

```text
ai_draft_generated
ai_draft_failed
reply_sent
reply_failed
conversation_status_changed
```

Future event types:

```text
conversation_assigned
customer_note_added
customer_profile_updated
handoff_requested
channel_connected
```

---

# Metadata Examples

## AI Draft Generated

```json
{
  "draft_id": "draft_123",
  "prompt_version": "mvp_reply_draft_v1",
  "provider": "mock",
  "model": "mock-reply-draft",
  "latency_ms": 250
}
```

## Reply Sent

```json
{
  "message_id": "msg_999",
  "send_mode": "simulated",
  "delivery_status": "simulated"
}
```

## Reply Failed

```json
{
  "draft_id": "draft_123",
  "send_mode": "simulated",
  "error_code": "SEND_FAILED"
}
```

---

# Metadata Safety Rules

Metadata must not contain:

```text
API keys
tokens
cookies
raw hidden prompts
raw provider errors
unnecessary raw customer messages
sensitive customer data beyond needed references
```

---

# Constraints

```text
primary key id
foreign key conversation_id
foreign key actor_user_id nullable
event_type in allowed values
summary not empty
```

---

# Indexes

```text
idx_activity_events_workspace_conversation_created
idx_activity_events_workspace_event_type_created
idx_activity_events_workspace_actor_created
```

---

# UI Query

Activity timeline query:

```sql
SELECT *
FROM activity_events
WHERE organization_id = :organization_id
  AND workspace_id = :workspace_id
  AND conversation_id = :conversation_id
ORDER BY created_at DESC
LIMIT :limit;
```

---

# Activity Rule

```text
Every AI draft generation and reply send attempt should have a traceable activity event.
```
