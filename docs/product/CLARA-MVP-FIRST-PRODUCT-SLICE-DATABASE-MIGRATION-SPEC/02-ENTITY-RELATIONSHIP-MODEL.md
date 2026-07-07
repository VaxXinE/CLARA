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


# 02 — Entity Relationship Model

> *"The ERD should make product behavior and data ownership obvious."*

---

# Purpose

This document defines the MVP entity relationship model.

---

# Entity Relationship Diagram

```mermaid
erDiagram
    organizations {
        string id PK
        string name
        timestamp created_at
        timestamp updated_at
    }

    workspaces {
        string id PK
        string organization_id FK
        string name
        timestamp created_at
        timestamp updated_at
    }

    users {
        string id PK
        string organization_id FK
        string email
        string display_name
        string status
        timestamp created_at
        timestamp updated_at
    }

    workspace_memberships {
        string id PK
        string organization_id FK
        string workspace_id FK
        string user_id FK
        string role
        timestamp created_at
        timestamp updated_at
    }

    customers {
        string id PK
        string organization_id FK
        string workspace_id FK
        string display_name
        string contact_identifier
        string source
        string status
        text notes_summary
        timestamp last_interaction_at
        timestamp created_at
        timestamp updated_at
    }

    conversations {
        string id PK
        string organization_id FK
        string workspace_id FK
        string customer_id FK
        string source
        string status
        string assigned_user_id FK
        timestamp last_message_at
        timestamp created_at
        timestamp updated_at
    }

    messages {
        string id PK
        string organization_id FK
        string workspace_id FK
        string conversation_id FK
        string direction
        string sender_type
        string sender_user_id FK
        text body
        timestamp sent_at
        string delivery_status
        timestamp created_at
    }

    reply_drafts {
        string id PK
        string organization_id FK
        string workspace_id FK
        string conversation_id FK
        string created_by_user_id FK
        text draft_body
        string source
        string status
        timestamp created_at
        timestamp updated_at
    }

    ai_draft_events {
        string id PK
        string organization_id FK
        string workspace_id FK
        string conversation_id FK
        string reply_draft_id FK
        string created_by_user_id FK
        string prompt_version
        string provider
        string model
        integer latency_ms
        string status
        string error_code
        timestamp created_at
    }

    activity_events {
        string id PK
        string organization_id FK
        string workspace_id FK
        string conversation_id FK
        string actor_user_id FK
        string event_type
        json metadata
        timestamp created_at
    }

    organizations ||--o{ workspaces : owns
    organizations ||--o{ users : contains
    workspaces ||--o{ workspace_memberships : has
    users ||--o{ workspace_memberships : joins
    workspaces ||--o{ customers : contains
    customers ||--o{ conversations : has
    conversations ||--o{ messages : contains
    conversations ||--o{ reply_drafts : has
    reply_drafts ||--o{ ai_draft_events : records
    conversations ||--o{ activity_events : logs
```

---

# Relationship Notes

## Organization -> Workspace

One organization can have multiple workspaces.

For MVP, one organization and one workspace may be enough for demo seed data.

---

## Workspace -> Customer

Customers belong to one workspace.

Do not share customers across workspaces in MVP.

---

## Customer -> Conversation

A customer can have multiple conversations.

---

## Conversation -> Message

A conversation has many messages.

---

## Conversation -> ReplyDraft

A conversation can have multiple drafts.

For MVP, keeping draft history is useful for traceability.

---

## ReplyDraft -> AIDraftEvent

AI draft event references the created draft.

If AI fails and no draft is created, `reply_draft_id` may be nullable.

---

## Conversation -> ActivityEvent

Activity timeline is conversation-scoped.

---

# ERD Rule

```text
Every child business entity should preserve organization_id and workspace_id for direct scoping and safer queries.
```
