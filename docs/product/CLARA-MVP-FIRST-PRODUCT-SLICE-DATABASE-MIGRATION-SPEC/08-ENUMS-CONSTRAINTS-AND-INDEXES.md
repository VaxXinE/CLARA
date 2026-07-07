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


# 08 — Enums, Constraints, and Indexes

> *"Constraints encode product rules where the database can help prevent bad states."*

---

# Purpose

This document defines MVP enum/check values, constraints, and indexes.

---

# Recommended Enum Strategy

For MVP, use either:

```text
PostgreSQL CHECK constraints
```

or:

```text
PostgreSQL enum types
```

Recommendation:

```text
Use CHECK constraints first for easier migration iteration.
```

Why:

```text
MVP values may evolve quickly
CHECK constraints are easier to alter than enum types
```

---

# Enum / Check Values

## organization_status

```text
active
suspended
archived
```

## workspace_status

```text
active
archived
```

## user_status

```text
active
disabled
```

## workspace_member_role

```text
owner
agent
viewer
```

## customer_source

```text
demo
whatsapp_demo
web_chat_demo
```

## customer_status

```text
new
active
archived
blocked
```

## conversation_status

```text
open
pending
closed
```

## message_direction

```text
inbound
outbound
internal
```

## sender_type

```text
customer
agent
system
```

## delivery_status

```text
received
sent
simulated
failed
```

## reply_draft_source

```text
manual
ai
```

## reply_draft_status

```text
draft
sent
discarded
```

## ai_draft_status

```text
succeeded
failed
```

## activity_event_type

```text
ai_draft_generated
ai_draft_failed
reply_sent
reply_failed
conversation_status_changed
```

---

# Required Not-Null Constraints

Must be not null:

```text
organization_id on scoped business tables
workspace_id on scoped business tables
created_at
primary display fields
message body
reply draft body
event_type
activity summary
```

---

# Unique Constraints

Recommended:

```text
organizations.id primary
workspaces.id primary
users.id primary
workspace_memberships.id primary
customers.id primary
conversations.id primary
messages.id primary
reply_drafts.id primary
ai_draft_events.id primary
activity_events.id primary

users: unique organization_id + email
workspaces: unique organization_id + name
workspace_memberships: unique workspace_id + user_id
```

---

# Index Plan

## Workspace/User

```text
idx_workspaces_organization_id
idx_users_organization_email
idx_memberships_workspace_user
idx_memberships_user_workspace
```

## Customers

```text
idx_customers_workspace_status
idx_customers_workspace_contact_identifier
idx_customers_workspace_last_interaction
```

## Conversations

```text
idx_conversations_workspace_status_last_message
idx_conversations_workspace_customer
idx_conversations_workspace_assigned_user
idx_conversations_workspace_last_message
```

## Messages

```text
idx_messages_workspace_conversation_sent_at
idx_messages_workspace_created_at
```

## Reply Drafts

```text
idx_reply_drafts_workspace_conversation_created
idx_reply_drafts_workspace_user_created
idx_reply_drafts_workspace_status
```

## AI Draft Events

```text
idx_ai_draft_events_workspace_conversation_created
idx_ai_draft_events_workspace_user_created
idx_ai_draft_events_workspace_status_created
```

## Activity Events

```text
idx_activity_events_workspace_conversation_created
idx_activity_events_workspace_event_type_created
idx_activity_events_workspace_actor_created
```

---

# Index Rule

```text
Every common MVP query should have an index that starts with workspace_id or includes workspace_id early.
```
