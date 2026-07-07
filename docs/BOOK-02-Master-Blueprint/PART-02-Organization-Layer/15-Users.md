---
book: "Book II — Master Blueprint"
part: "PART-02 — Organization Layer"
chapter: "15"
title: "Users"
version: "1.0.0"
status: "official"
owner: "Clara Core Team"
last_updated: "2026-07-06"
classification: "blueprint"
previous: "./14-Teams.md"
next: "./16-Identity.md"
---

# Users

> *"A User is an accountable human identity in Clara."*

---

# Purpose

This chapter defines Users as human identities that interact with Clara.

Users perform work, manage resources, approve actions, collaborate with AI, and remain accountable for their actions.

---

# Overview

A User may belong to one or more Organizations and Workspaces.

Access depends on membership, roles, permissions, and policies.

A User represents a real human, not an automated system.

Automated actors should be modeled separately as service accounts, integrations, or AI agents.

---

# User Relationship Map

```mermaid
flowchart TD
    A[User] --> B[Organization Membership]
    A --> C[Workspace Membership]
    A --> D[Roles]
    D --> E[Permissions]
    A --> F[Audit Events]
```

---

# User Lifecycle

A User may move through these states:

```mermaid
stateDiagram-v2
    [*] --> Invited
    Invited --> Active
    Active --> Suspended
    Suspended --> Active
    Active --> Deactivated
    Deactivated --> Archived
```

---

# User Responsibilities

Users may:

- Manage customers.
- Reply to conversations.
- Handle tickets.
- Configure workflows.
- Review AI recommendations.
- Approve sensitive actions.
- Manage integrations.
- View analytics.
- Administer workspaces.

---

# Security Considerations

User identity must be protected through:

- Authentication.
- Authorization.
- Session management.
- Least privilege.
- Audit logging.
- Account lifecycle controls.
- Multi-factor authentication where appropriate.

---

# Key Takeaways

- Users represent accountable human actors.
- Users may belong to multiple Organizations or Workspaces.
- User access is determined by roles, permissions, and policies.
- User lifecycle changes must be auditable.

---

# Related Documents

- ../../glossary/User.md
- ../../glossary/Role.md
- ../../glossary/Permission.md

---

# Navigation

**Previous:** 14-Teams.md

**Next:** 16-Identity.md
