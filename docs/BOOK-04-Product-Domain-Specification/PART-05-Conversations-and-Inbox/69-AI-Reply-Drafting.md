---
book: "Book IV — Product & Domain Specification"
part: "PART-05 — Conversations and Inbox"
chapter: "69"
title: "AI Reply Drafting"
version: "1.0.0"
status: "official"
owner: "CLARA Product Architecture Team"
last_updated: "2026-07-07"
classification: "product-domain-specification"
previous: "68-Reply-Workflow.md"
next: "70-Internal-Notes.md"
---

# AI Reply Drafting

> *"Defines AI-assisted reply drafting behavior inside a conversation."*

---

# Purpose

Defines AI-assisted reply drafting behavior inside a conversation.

---

# User / Product Problem

AI can help agents respond faster, but unsafe or inaccurate AI replies can harm customer trust.

---

# Product Decision

## Decision

CLARA AI Reply Drafting should suggest replies but require human review before sending in MVP.

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
- AI Assistant

---

# Domain Objects

- AI Draft
- Prompt Context
- Customer Context
- Knowledge Context
- Draft Review
- Human Approval

---

# Permission Baseline

| Permission | Meaning | Enforcement |
|---|---|---|
| `ai.reply_draft:create` | Product action permission | Protected by backend authorization |
| `conversation:read` | Product action permission | Protected by backend authorization |
| `knowledge:read` | Product action permission | Protected by backend authorization |

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

MVP must allow authorized users to generate an AI reply draft using scoped customer, conversation, and knowledge context, but not auto-send it.

---

# Future Behavior

Future versions may support tone controls, brand voice, confidence indicators, policy checks, draft comparison, and approval workflows.

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

**Previous:** `68-Reply-Workflow.md`

**Next:** `70-Internal-Notes.md`
