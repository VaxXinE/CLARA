---
book: "Book IV — Product & Domain Specification"
part: "PART-05 — Conversations and Inbox"
chapter: "72"
title: "Attachments and Media"
version: "1.0.0"
status: "official"
owner: "CLARA Product Architecture Team"
last_updated: "2026-07-07"
classification: "product-domain-specification"
previous: "71-Conversation-Customer-Linking.md"
next: "73-Conversation-Search-and-Filters.md"
---

# Attachments and Media

> *"Defines product behavior for message attachments, images, documents, and other media."*

---

# Purpose

Defines product behavior for message attachments, images, documents, and other media.

---

# User / Product Problem

Attachments may contain malware, PII, sensitive documents, or unsupported formats. Mishandling creates security and privacy risk.

---

# Product Decision

## Decision

CLARA should treat attachments as potentially sensitive and unsafe until validated, scanned, stored, and permission-controlled.

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
- Customer
- System Service

---

# Domain Objects

- Attachment
- Media File
- File Metadata
- Scan Status
- Storage Reference
- Download Permission

---

# Permission Baseline

| Permission | Meaning | Enforcement |
|---|---|---|
| `attachment:read` | Product action permission | Protected by backend authorization |
| `attachment:upload` | Product action permission | Protected by backend authorization |
| `attachment:download` | Product action permission | Protected by backend authorization |

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

MVP may defer attachments or support limited safe attachment viewing/download with validation.

---

# Future Behavior

Future versions may support rich media, virus scanning, OCR, file previews, attachment redaction, and retention policies.

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

**Previous:** `71-Conversation-Customer-Linking.md`

**Next:** `73-Conversation-Search-and-Filters.md`
