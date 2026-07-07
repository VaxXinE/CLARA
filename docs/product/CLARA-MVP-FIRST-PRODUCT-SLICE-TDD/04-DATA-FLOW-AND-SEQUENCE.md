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


# 04 — Data Flow and Sequence

> *"Data flow should show exactly where authorization, AI safety, and activity logging happen."*

---

# Purpose

This document defines MVP data flow and sequence diagrams.

---

# Inbox Data Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as Dashboard UI
    participant API as API Service
    participant Authz as Authorization Guard
    participant Conv as Conversation Service
    participant Repo as Conversation Repository
    participant DB as Database

    User->>UI: Open Inbox
    UI->>API: GET /conversations
    API->>Authz: Check user workspace access
    Authz-->>API: Allowed
    API->>Conv: List conversations
    Conv->>Repo: Query scoped conversations
    Repo->>DB: SELECT by workspace_id
    DB-->>Repo: Rows
    Repo-->>Conv: Conversations
    Conv-->>API: Response DTO
    API-->>UI: Conversation list
```

---

# Conversation Detail Data Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant API
    participant Authz
    participant Conv
    participant Cust
    participant Repo
    participant DB

    User->>UI: Select conversation
    UI->>API: GET /conversations/{id}
    API->>Authz: Can view conversation?
    Authz-->>API: Allowed
    API->>Conv: Get conversation detail
    Conv->>Repo: Query messages scoped by workspace
    Repo->>DB: SELECT conversation/messages
    DB-->>Repo: Conversation rows
    API->>Cust: Get customer profile
    Cust->>Repo: Query customer scoped by workspace
    Repo->>DB: SELECT customer
    DB-->>Repo: Customer row
    API-->>UI: Conversation detail + customer context
```

---

# AI Draft Data Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant API
    participant Authz
    participant AIDraft as AI Draft Service
    participant Context as Context Builder
    participant Gateway as AI Gateway
    participant Activity as Activity Service
    participant DB as Database

    User->>UI: Click Generate AI Draft
    UI->>API: POST /conversations/{id}/ai-draft
    API->>Authz: Can generate AI draft?
    Authz-->>API: Allowed
    API->>AIDraft: Generate draft
    AIDraft->>Context: Build scoped context
    Context->>DB: Read conversation/customer scoped data
    DB-->>Context: Context data
    Context-->>AIDraft: Minimized AI context
    AIDraft->>Gateway: Request draft
    Gateway-->>AIDraft: Draft text
    AIDraft->>Activity: Record AI draft event
    Activity->>DB: Insert activity event
    AIDraft-->>API: Draft response
    API-->>UI: Editable draft
```

---

# Reply Send Data Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant API
    participant Authz
    participant Conv as Conversation Service
    participant Send as Send Adapter
    participant Activity
    participant DB

    User->>UI: Click Send
    UI->>API: POST /conversations/{id}/reply
    API->>Authz: Can send reply?
    Authz-->>API: Allowed
    API->>Conv: Send reply
    Conv->>Send: Send or simulate
    Send-->>Conv: Send result
    Conv->>DB: Store outgoing message
    Conv->>Activity: Record reply event
    Activity->>DB: Insert activity event
    Conv-->>API: Reply result
    API-->>UI: Reply sent
```

---

# Failure Flow: AI Provider Fails

```mermaid
flowchart TD
    Request[AI Draft Request] --> Authz[Authz OK]
    Authz --> Context[Build Context]
    Context --> Provider[AI Provider Call]
    Provider --> Fail[Provider Failure]
    Fail --> Log[Safe Structured Log]
    Fail --> Activity[Optional Failure Activity]
    Fail --> UI[Safe Error + Manual Reply Still Available]
```

---

# Data Flow Rules

```text
authorization before data fetch
workspace scope in every query
AI context minimized before provider call
activity logging after high-value action
safe error returned on failure
draft remains human editable
```
