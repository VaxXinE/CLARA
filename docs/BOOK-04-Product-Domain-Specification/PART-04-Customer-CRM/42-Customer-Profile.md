---
book: "Book IV — Product & Domain Specification"
part: "PART-04 — Customer CRM"
chapter: "42"
title: "Customer Profile"
version: "1.0.0"
status: "official"
owner: "CLARA Product Architecture Team"
last_updated: "2026-07-07"
classification: "product-domain-specification"
previous: "41-Customer-CRM-Overview.md"
next: "43-Contact-Points.md"
---

# Customer Profile

> *"Defines the Customer Profile object and the core fields visible to business users."*

---

# Purpose

Defines the Customer Profile object and the core fields visible to business users.

---

# User / Product Problem

Users need to understand who they are talking to without jumping between channels, spreadsheets, and scattered notes.

---

# Product Decision

## Decision

CLARA Customer Profile should represent a person or business contact with stable identity, display name, status, contact points, metadata, and timeline.

## Status

Accepted.

## Reason

- Gives users a consistent customer context.
- Supports conversations, tickets, AI assistance, analytics, and automation.
- Keeps customer data scoped by Organization and Workspace.
- Makes privacy and audit behavior explicit.
- Prevents CRM scope from expanding too early.
- Supports MVP without blocking future advanced CRM capabilities.

## Product Trade-offs

| Direction | Benefit | Trade-off |
|---|---|---|
| Simple CRM first | Faster MVP and easier adoption | Less advanced than enterprise CRM |
| Workspace-scoped customers | Stronger data separation | Cross-workspace views need explicit design |
| Structured contact points | Better channel matching | More validation needed |
| Timeline-based history | Better customer context | Requires event consistency |
| Privacy-aware exports | Better trust | More admin friction |

---

# Primary Users / Actors

- Support Agent
- Sales Operator
- Manager

---

# Domain Objects

- Customer ID
- Display Name
- Customer Type
- Status
- Primary Contact
- Metadata

---

# Permission Baseline

| Permission | Meaning | Enforcement |
|---|---|---|
| `customer:read` | Product action permission | Protected by backend authorization |
| `customer:update` | Product action permission | Protected by backend authorization |

---

# Product Flow

```mermaid
flowchart TD
    Actor[User / Actor] --> Workspace[Workspace Scope]
    Workspace --> Customer[Customer Profile]
    Customer --> Contact[Contact Points]
    Customer --> Timeline[Timeline]
    Customer --> Notes[Notes]
    Customer --> Tags[Tags]
    Customer --> Search[Search / Filter]
    Customer --> Audit[Audit if Sensitive]
    Customer --> AI[AI Context if Allowed]
```

---

# Customer Context Sequence

```mermaid
sequenceDiagram
    participant User as User
    participant UI as CLARA UI
    participant API as CLARA API
    participant Auth as Authorization
    participant CRM as Customer CRM
    participant Audit as Audit Log

    User->>UI: Opens customer profile
    UI->>API: Request customer by ID
    API->>Auth: Check customer:read with workspace scope
    Auth-->>API: Allow or deny
    API->>CRM: Load customer context
    CRM-->>API: Return safe customer DTO
    API-->>UI: Render customer profile
    User->>UI: Updates customer field
    UI->>API: Submit update
    API->>Auth: Check customer:update
    API->>CRM: Apply validated update
    CRM->>Audit: Record sensitive change if required
    API-->>UI: Return updated customer
```

---

# MVP Behavior

MVP must support display name, customer type, status, primary email/phone where available, tags, notes, and timeline preview.

---

# Future Behavior

Future versions may support custom fields, relationship mapping, company/person linking, account hierarchy, and customer health score.

---

# Product Requirements

## Functional Requirements

- Customer records must belong to an Organization.
- Customer records must belong to a Workspace by default.
- Users must be able to view customer details if authorized.
- Users must be able to update customer details if authorized.
- Customer contact points must support conversation matching.
- Customer timeline must show important customer-related events.
- Customer notes must preserve author and timestamp.
- Customer search must be scoped and paginated.
- Sensitive customer actions must be auditable.
- AI customer context must respect permissions and scope.

## Non-Functional Requirements

- Customer list must support pagination.
- Search must not leak cross-workspace data.
- Customer data must be privacy-aware.
- Customer export/import must require elevated permissions.
- Duplicate merge must avoid destructive automatic behavior.
- Customer timeline must remain understandable to business users.
- AI context must minimize sensitive data exposure.

---

# UX Expectations

- Customer profile should be easy to understand at a glance.
- Important contact points should be visible.
- Recent timeline events should be visible.
- Notes should be clearly marked as internal.
- Tags should be easy to add and remove where authorized.
- Archived customers should be visually distinct.
- Users should understand when data is unavailable due to permission.
- AI-generated summaries should be labeled as AI-generated.

---

# Security and Privacy Considerations

- Do not expose customer records across workspaces by default.
- Do not expose sensitive fields without permission.
- Do not allow bulk export without elevated permission.
- Do not store unnecessary PII.
- Do not allow AI to access customer data outside actor scope.
- Do not log sensitive customer fields.
- Audit sensitive changes such as archive, export, merge, and privacy changes.
- Treat imported data as untrusted until validated.

---

# Acceptance Criteria

- [ ] Customer scope is defined.
- [ ] Primary users are defined.
- [ ] Domain objects are defined.
- [ ] Permissions are named.
- [ ] MVP behavior is clear.
- [ ] Future behavior is separated from MVP.
- [ ] Privacy concerns are documented.
- [ ] Audit behavior is considered.
- [ ] AI context behavior is constrained where relevant.
- [ ] Related Book III references are linked.

---

# Anti-patterns

Avoid:

- Treating CRM as an unscoped global address book.
- Storing customers without workspace scope.
- Allowing bulk export to normal users.
- Auto-merging customers without human review.
- Putting sensitive notes into AI context without controls.
- Treating imported data as trusted.
- Using free-form contact identifiers without provider scope.
- Building advanced CRM features before conversation context is stable.

---

# Related Book III References

- ../../BOOK-03-Implementation-Architecture/PART-04-Data-Architecture/README.md
- ../../BOOK-03-Implementation-Architecture/PART-07-Security-Implementation/README.md
- ../../BOOK-03-Implementation-Architecture/PART-11-Product-Implementation-Architecture/211-Customer-CRM-Module.md
- ../../BOOK-03-Implementation-Architecture/APPENDIX/APPENDIX-B-API-Checklist.md
- ../../BOOK-03-Implementation-Architecture/APPENDIX/APPENDIX-C-Security-Checklist.md

---

# Navigation

**Previous:** `41-Customer-CRM-Overview.md`

**Next:** `43-Contact-Points.md`
