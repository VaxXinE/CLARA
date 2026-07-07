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


# 06 — Table Spec: Reply Drafts and AI Draft Events

> *"AI draft records should prove assistance happened without turning AI into an unreviewed actor."*

---

# Table: reply_drafts

## Purpose

Stores generated or manual reply drafts.

## Columns

| Column | Type | Required | Notes |
|---|---|---:|---|
| `id` | text/uuid | Yes | Primary key |
| `organization_id` | text/uuid | Yes | Tenant scope |
| `workspace_id` | text/uuid | Yes | Workspace scope |
| `conversation_id` | text/uuid | Yes | FK conversations.id |
| `created_by_user_id` | text/uuid | Yes | FK users.id |
| `draft_body` | text | Yes | Editable draft content |
| `source` | text | Yes | manual/ai |
| `status` | text | Yes | draft/sent/discarded |
| `created_at` | timestamptz | Yes | Default now |
| `updated_at` | timestamptz | Yes | Updated on change |

## Constraints

```text
primary key id
foreign key conversation_id
foreign key created_by_user_id
source in manual, ai
status in draft, sent, discarded
draft_body not empty
```

## Indexes

```text
idx_reply_drafts_workspace_conversation_created
idx_reply_drafts_workspace_user_created
idx_reply_drafts_workspace_status
```

---

# Table: ai_draft_events

## Purpose

Stores metadata about AI draft generation.

This is not a raw prompt log.

## Columns

| Column | Type | Required | Notes |
|---|---|---:|---|
| `id` | text/uuid | Yes | Primary key |
| `organization_id` | text/uuid | Yes | Tenant scope |
| `workspace_id` | text/uuid | Yes | Workspace scope |
| `conversation_id` | text/uuid | Yes | FK conversations.id |
| `reply_draft_id` | text/uuid | No | FK reply_drafts.id; nullable on failure |
| `created_by_user_id` | text/uuid | Yes | FK users.id |
| `prompt_version` | text | Yes | e.g. mvp_reply_draft_v1 |
| `provider` | text | Yes | mock/openai/etc |
| `model` | text | Yes | model name or mock |
| `latency_ms` | integer | No | duration |
| `status` | text | Yes | succeeded/failed |
| `error_code` | text | No | safe error code only |
| `created_at` | timestamptz | Yes | Default now |

## Constraints

```text
primary key id
foreign key conversation_id
foreign key reply_draft_id nullable
foreign key created_by_user_id
status in succeeded, failed
latency_ms >= 0
```

## Indexes

```text
idx_ai_draft_events_workspace_conversation_created
idx_ai_draft_events_workspace_user_created
idx_ai_draft_events_workspace_status_created
```

---

# What Not to Store

Do not store by default:

```text
raw hidden system prompt
provider API key
raw provider request
raw provider response
full sensitive customer context
```

If raw prompt logging is ever needed, it requires:

```text
security review
privacy review
retention policy
redaction strategy
explicit configuration
```

---

# AI Event Rule

```text
AI draft events are for traceability and quality metrics, not for storing sensitive prompt transcripts.
```

---

# Acceptance Criteria

- [ ] AI draft can be stored as editable reply draft.
- [ ] AI event metadata can be audited.
- [ ] Failed AI generation can be recorded.
- [ ] No raw secrets/prompts are stored by default.
- [ ] All rows are workspace scoped.
