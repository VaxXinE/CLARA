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


# 05 — Table Spec: Customers, Conversations, Messages

> *"This is the heart of the MVP: who the customer is, what they said, and what the team replied."*

---

# Table: customers

## Purpose

Stores customer profile context shown in sidebar.

## Columns

| Column | Type | Required | Notes |
|---|---|---:|---|
| `id` | text/uuid | Yes | Primary key |
| `organization_id` | text/uuid | Yes | Tenant scope |
| `workspace_id` | text/uuid | Yes | Workspace scope |
| `display_name` | text | Yes | Customer display name |
| `contact_identifier` | text | No | Phone/email/handle; sensitive |
| `source` | text | Yes | demo/whatsapp_demo/web_chat_demo |
| `status` | text | Yes | new/active/archived/blocked |
| `notes_summary` | text | No | Short safe summary |
| `last_interaction_at` | timestamptz | No | Latest known interaction |
| `created_at` | timestamptz | Yes | Default now |
| `updated_at` | timestamptz | Yes | Updated on change |

## Constraints

```text
primary key id
foreign key organization_id
foreign key workspace_id
status in new, active, archived, blocked
source in demo, whatsapp_demo, web_chat_demo
```

## Indexes

```text
idx_customers_workspace_status
idx_customers_workspace_contact_identifier
idx_customers_workspace_last_interaction
```

---

# Table: conversations

## Purpose

Stores conversation thread metadata.

## Columns

| Column | Type | Required | Notes |
|---|---|---:|---|
| `id` | text/uuid | Yes | Primary key |
| `organization_id` | text/uuid | Yes | Tenant scope |
| `workspace_id` | text/uuid | Yes | Workspace scope |
| `customer_id` | text/uuid | Yes | FK customers.id |
| `source` | text | Yes | demo/whatsapp_demo/web_chat_demo |
| `status` | text | Yes | open/pending/closed |
| `assigned_user_id` | text/uuid | No | FK users.id |
| `last_message_at` | timestamptz | No | For inbox sorting |
| `created_at` | timestamptz | Yes | Default now |
| `updated_at` | timestamptz | Yes | Updated on change |

## Constraints

```text
primary key id
foreign key customer_id
foreign key assigned_user_id nullable
status in open, pending, closed
source in demo, whatsapp_demo, web_chat_demo
```

## Indexes

```text
idx_conversations_workspace_status_last_message
idx_conversations_workspace_customer
idx_conversations_workspace_assigned_user
idx_conversations_workspace_last_message
```

---

# Table: messages

## Purpose

Stores inbound/outbound/internal messages for a conversation.

## Columns

| Column | Type | Required | Notes |
|---|---|---:|---|
| `id` | text/uuid | Yes | Primary key |
| `organization_id` | text/uuid | Yes | Tenant scope |
| `workspace_id` | text/uuid | Yes | Workspace scope |
| `conversation_id` | text/uuid | Yes | FK conversations.id |
| `direction` | text | Yes | inbound/outbound/internal |
| `sender_type` | text | Yes | customer/agent/system |
| `sender_user_id` | text/uuid | No | FK users.id for agent/system |
| `body` | text | Yes | Message body |
| `sent_at` | timestamptz | Yes | Message timestamp |
| `delivery_status` | text | Yes | received/sent/simulated/failed |
| `created_at` | timestamptz | Yes | Default now |

## Constraints

```text
primary key id
foreign key conversation_id
foreign key sender_user_id nullable
direction in inbound, outbound, internal
sender_type in customer, agent, system
delivery_status in received, sent, simulated, failed
body not empty
```

## Indexes

```text
idx_messages_workspace_conversation_sent_at
idx_messages_workspace_created_at
```

---

# Sensitive Data Notes

Message bodies and contact identifiers are sensitive.

Rules:

```text
do not log full message body by default
do not include message body in analytics metadata unnecessarily
do not use raw message data in AI context beyond selected conversation
```

---

# Acceptance Criteria

- [ ] Customer profile supports sidebar.
- [ ] Conversation supports inbox sorting/filtering.
- [ ] Messages support thread rendering.
- [ ] Every row is workspace scoped.
- [ ] Indexes support MVP query paths.
