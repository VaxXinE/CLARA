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


# 02 — System Architecture

> *"Architecture should make the safe path the easiest path."*

---

# Purpose

This document defines the MVP system architecture.

---

# System Architecture Diagram

```mermaid
flowchart TD
    subgraph Client
        UI[Dashboard UI]
    end

    subgraph APIService[API Service]
        Router[HTTP Router]
        Auth[Auth Middleware]
        Authz[Authorization Guard]
        ConversationSvc[Conversation Application Service]
        CustomerSvc[Customer Application Service]
        AIDraftSvc[AI Draft Application Service]
        ActivitySvc[Activity / Audit Service]
        ErrorHandler[Safe Error Handler]
    end

    subgraph Domain
        ConversationDomain[Conversation Domain Rules]
        CustomerDomain[Customer Domain Rules]
        ReplyDomain[Reply Draft / Send Rules]
    end

    subgraph Infra
        Repo[Repositories]
        DB[(Database)]
        AIGateway[AI Gateway Adapter]
        SendAdapter[Send Adapter / Simulated Send]
        Logger[Structured Logger]
    end

    UI --> Router
    Router --> Auth
    Auth --> Authz
    Authz --> ConversationSvc
    Authz --> CustomerSvc
    Authz --> AIDraftSvc
    ConversationSvc --> ConversationDomain
    CustomerSvc --> CustomerDomain
    AIDraftSvc --> ReplyDomain
    ConversationSvc --> Repo
    CustomerSvc --> Repo
    AIDraftSvc --> Repo
    ActivitySvc --> Repo
    Repo --> DB
    AIDraftSvc --> AIGateway
    ConversationSvc --> SendAdapter
    Router --> ErrorHandler
    ErrorHandler --> Logger
```

---

# Architecture Decisions

## Decision 1 — API Owns Authorization

The API service must enforce all permissions.

Frontend checks may hide UI actions, but backend remains source of truth.

---

## Decision 2 — AI Gateway Boundary

The AI provider should be called only through an AI Gateway adapter.

Reason:

```text
central safety checks
mock provider support
cost/latency monitoring
fallback support
prompt/version control
```

---

## Decision 3 — Send Adapter Boundary

Reply sending should use a send adapter interface.

Reason:

```text
MVP can simulate send
future channels can be added
provider-specific logic stays isolated
```

---

## Decision 4 — Activity Logging as First-Class Component

Activity events should not be an afterthought.

Reason:

```text
debuggability
auditability
product operations analytics
AI quality review
support traceability
```

---

# Deployment Assumption

For MVP, assume:

```text
single API service
single dashboard app
single database
optional AI provider/mock
local/dev environment first
```

---

# Future Evolution

The architecture should allow future extraction:

```text
AI Gateway can become separate service
Integration Gateway can become separate service
workers can process ingestion/automation
analytics pipeline can be added later
```

---

# Architecture Rule

```text
Provider-specific logic must not leak into product domain or UI.
```
