---
project: "CLARA"
artifact: "MVP First Product Slice TDD"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering, Architecture, Security, AI, and Product Team"
last_updated: "2026-07-07"
classification: "technical-design-document"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
source_of_truth:
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-03-Implementation-Architecture/"
  - "docs/BOOK-04-Product-Domain-Specification/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-07-Operations-Observability-and-Reliability/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 08 — Database Design Direction

> *"The database model should make tenant isolation and auditability easy, not optional."*

---

# Purpose

This document defines database design direction before creating the formal Database Migration Spec.

---

# Core Tables

Recommended MVP tables:

```text
organizations
workspaces
users
workspace_memberships
customers
conversations
messages
reply_drafts
activity_events
ai_draft_events
```

---

# Entity Relationship Draft

```mermaid
erDiagram
    organizations ||--o{ workspaces : owns
    organizations ||--o{ users : contains
    workspaces ||--o{ workspace_memberships : has
    users ||--o{ workspace_memberships : belongs_to
    workspaces ||--o{ customers : contains
    customers ||--o{ conversations : has
    conversations ||--o{ messages : contains
    conversations ||--o{ reply_drafts : has
    conversations ||--o{ activity_events : logs
    reply_drafts ||--o{ ai_draft_events : records
```

---

# Required Tenant Fields

Most business tables should include:

```text
organization_id
workspace_id
```

Examples:

```text
customers
conversations
messages
reply_drafts
activity_events
ai_draft_events
```

---

# Customers

Minimum fields:

```text
id
organization_id
workspace_id
display_name
contact_identifier
source
status
notes_summary
created_at
updated_at
```

---

# Conversations

Minimum fields:

```text
id
organization_id
workspace_id
customer_id
source
status
assigned_user_id
last_message_at
created_at
updated_at
```

---

# Messages

Minimum fields:

```text
id
organization_id
workspace_id
conversation_id
direction
sender_type
body
sent_at
delivery_status
created_at
```

---

# Reply Drafts

Minimum fields:

```text
id
organization_id
workspace_id
conversation_id
created_by_user_id
draft_body
source
status
created_at
updated_at
```

Source:

```text
manual
ai
```

Status:

```text
draft
sent
discarded
```

---

# Activity Events

Minimum fields:

```text
id
organization_id
workspace_id
conversation_id
actor_user_id
event_type
event_payload_json
created_at
```

---

# AI Draft Events

Minimum fields:

```text
id
organization_id
workspace_id
conversation_id
reply_draft_id
created_by_user_id
prompt_version
provider
model
latency_ms
status
error_code
created_at
```

Do not store raw prompt by default unless explicitly approved.

---

# Indexing Direction

Add indexes for:

```text
workspace_id + updated_at
workspace_id + status
conversation_id + sent_at
customer_id
activity conversation timeline
```

---

# Deletion and Retention

For MVP:

```text
prefer soft delete for customer/conversation where needed
avoid destructive deletion until policy exists
```

---

# Database Rules

```text
every customer/conversation/message query must be workspace scoped
do not store secrets in database
do not store raw AI provider credentials
do not store unnecessary raw prompts
```

---

# Next Step

Create formal:

```text
CLARA MVP First Product Slice Database Migration Spec
```
