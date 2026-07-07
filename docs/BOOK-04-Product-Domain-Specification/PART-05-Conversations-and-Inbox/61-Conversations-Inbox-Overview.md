---
book: "Book IV — Product & Domain Specification"
part: "PART-05 — Conversations and Inbox"
chapter: "61"
title: "Conversations Inbox Overview"
version: "1.0.0"
status: "official"
owner: "CLARA Product Architecture Team"
last_updated: "2026-07-07"
classification: "product-domain-specification"
previous: "../PART-04-Customer-CRM/60-Part-04-Summary.md"
next: "62-Conversation-Model.md"
---

# Conversations Inbox Overview

> *"Defines CLARA Conversations and Inbox as the product domain for managing customer communication across channels."*

---

# Purpose

Defines CLARA Conversations and Inbox as the product domain for managing customer communication across channels.

---

# User / Product Problem

Business teams often receive customer messages from many channels. Without a unified inbox, context is fragmented and response quality drops.

---

# Product Decision

## Decision

CLARA Conversations and Inbox should be the operational center for receiving, organizing, assigning, replying to, and resolving customer conversations.

## Status

Accepted.

## Reason

- Centralizes customer communication.
- Gives agents and managers a clear operational queue.
- Links conversations to Customer CRM context.
- Supports AI reply drafting with human control.
- Creates a foundation for ticketing, automation, and analytics.
- Keeps communication access scoped and auditable.

## Product Trade-offs

| Direction | Benefit | Trade-off |
|---|---|---|
| Unified inbox | Less context switching | Requires channel normalization |
| Human-reviewed AI drafts | Safer customer communication | Less automation speed |
| Workspace-scoped conversations | Stronger privacy | Cross-workspace views need explicit permission |
| Simple status model first | Faster MVP | Less advanced workflow control |
| Manual assignment first | Easier to understand | Less automation than routing engine |

---

# Primary Users / Actors

- Support Agent
- Sales Operator
- Manager
- Admin
- AI Assistant

---

# Domain Objects

- Conversation
- Message
- Inbox
- Channel
- Participant
- Assignment
- Conversation Status

---

# Permission Baseline

| Permission | Meaning | Enforcement |
|---|---|---|
| `conversation:read` | Product action permission | Protected by backend authorization |
| `conversation:create` | Product action permission | Protected by backend authorization |
| `conversation:update` | Product action permission | Protected by backend authorization |
| `message:read` | Product action permission | Protected by backend authorization |

---

# Product Flow

```mermaid
flowchart TD
    Channel[Channel] --> Message[Inbound Message]
    Message --> Conversation[Conversation]
    Conversation --> Customer[Customer Context]
    Conversation --> Inbox[Inbox View]
    Inbox --> Agent[Agent / Operator]
    Agent --> Action[Assign / Reply / Resolve]
    Action --> Audit[Audit if Sensitive]
    Agent --> AI[AI Draft if Allowed]
    AI --> Review[Human Review]
    Review --> Send[Send Reply]
```

---

# Conversation Sequence

```mermaid
sequenceDiagram
    participant Customer
    participant Channel
    participant CLARA as CLARA Inbox
    participant Agent
    participant AI as AI Assistant
    participant Audit as Audit Log

    Customer->>Channel: Sends message
    Channel->>CLARA: Delivers inbound message
    CLARA->>CLARA: Match or create conversation
    CLARA->>CLARA: Link customer if possible
    Agent->>CLARA: Opens conversation
    Agent->>AI: Request reply draft if allowed
    AI-->>Agent: Draft suggestion
    Agent->>CLARA: Reviews and sends reply
    CLARA->>Channel: Sends outbound message
    CLARA->>Audit: Records sensitive actions
```

---

# MVP Behavior

MVP must support workspace-scoped conversation list, conversation detail, inbound/outbound messages, assignment, status, and reply.

---

# Future Behavior

Future versions may support advanced routing, SLA automation, omnichannel threading, message templates, and quality review.

---

# Product Requirements

## Functional Requirements

- Conversations must belong to an Organization and Workspace.
- Messages must belong to a Conversation.
- Inbound and outbound message direction must be clear.
- Internal notes must be visually and structurally separate from customer-visible messages.
- Conversation customer link must be visible where known.
- Users must be able to filter conversations by basic operational state.
- Authorized users must be able to assign, reply, and resolve.
- AI draft must require human review before send in MVP.
- Sensitive actions must be auditable.

## Non-Functional Requirements

- Conversation list must be paginated.
- Message timeline must load predictably.
- Channel payloads must be normalized safely.
- Duplicate inbound messages must be prevented through idempotency.
- Message content must not be logged unsafely.
- Attachment handling must be secure if enabled.
- AI context must be scoped by permission and workspace.
- Search must not leak cross-workspace data.

---

# UX Expectations

- Users should clearly see conversation status.
- Users should clearly see customer context.
- Users should clearly see whether a message is internal or customer-visible.
- Users should clearly see if a reply is AI-generated draft.
- Users should have a safe confirmation path before sending sensitive replies where needed.
- Denied access should be explained safely.
- Conversation errors should be recoverable and understandable.

---

# Security and Privacy Considerations

- Do not expose conversations across Workspaces by default.
- Do not trust external channel payloads without validation.
- Do not send AI draft automatically in MVP.
- Do not allow reply without permission.
- Do not expose internal notes to customers.
- Do not allow attachment access without authorization.
- Do not log sensitive message content.
- Do audit reply, assignment, customer relink, status changes, and AI draft usage.

---

# Acceptance Criteria

- [ ] Conversation scope is defined.
- [ ] Message behavior is defined.
- [ ] Channel behavior is defined.
- [ ] Primary users are defined.
- [ ] Permissions are named.
- [ ] MVP behavior is clear.
- [ ] Future behavior is separated from MVP.
- [ ] Privacy concerns are documented.
- [ ] Audit behavior is considered.
- [ ] AI behavior is constrained where relevant.

---

# Anti-patterns

Avoid:

- Treating all messages as the same type.
- Mixing internal notes with customer-visible replies.
- Auto-sending AI responses in MVP.
- Allowing channel payloads to create trusted records without validation.
- Showing conversations across workspace boundaries without explicit permission.
- Adding many channels before one channel workflow is reliable.
- Building SLA automation before basic assignment and status work.
- Logging full message content in unsafe logs.

---

# Related Book III References

- ../../BOOK-03-Implementation-Architecture/PART-03-AI-Architecture/README.md
- ../../BOOK-03-Implementation-Architecture/PART-05-Integration-Architecture/README.md
- ../../BOOK-03-Implementation-Architecture/PART-07-Security-Implementation/README.md
- ../../BOOK-03-Implementation-Architecture/PART-11-Product-Implementation-Architecture/212-Conversation-Inbox-Module.md
- ../../BOOK-03-Implementation-Architecture/APPENDIX/APPENDIX-C-Security-Checklist.md

---

# Navigation

**Previous:** `../PART-04-Customer-CRM/60-Part-04-Summary.md`

**Next:** `62-Conversation-Model.md`
