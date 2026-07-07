---
book: "Book VI — Security, Governance & Compliance"
part: "PART-03 — Identity and Access Governance"
chapter: "33"
title: "Access Review and Recertification"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "identity-access-governance"
previous: "32-Access-Request-and-Approval-Workflow.md"
next: "34-Emergency-Break-Glass-Access.md"
project: "CLARA"
---

# Access Review and Recertification

> *"Defines periodic access review process for human users, privileged users, service accounts, integrations, and external collaborators."*

---

# Purpose

Defines periodic access review process for human users, privileged users, service accounts, integrations, and external collaborators.

---

# Governance Problem

Access naturally expands over time unless reviewed and recertified.

---

# Governance Decision

## Decision

CLARA should perform recurring access reviews with owners confirming, reducing, or revoking access.

## Status

Accepted.

---

# Access Governance Rule

Every access decision in CLARA must be governed as:

```text
Identity -> Scope -> Role -> Permission -> Approval -> Evidence -> Review
```

No protected capability should exist without:

```text
owner
risk level
scope
approval path
audit evidence
review cadence
revocation path
```

---

# Recommended Governance Flow

```mermaid
sequenceDiagram
    participant User as User / Service
    participant Request as Access Request
    participant Approver as Approver
    participant System as CLARA Access System
    participant Audit as Audit Evidence
    participant Review as Access Review

    User->>Request: Requests scoped access
    Request->>Approver: Sends justification and scope
    Approver-->>Request: Approve, deny, or ask for change
    Request->>System: Applies role/permission if approved
    System->>Audit: Records access change
    Review->>Audit: Reviews access evidence periodically
    Review-->>System: Keep, reduce, or revoke access
```

---

# Secure-by-Design Checklist

- [ ] Identity owner is clear.
- [ ] Scope is clear.
- [ ] Role is appropriate.
- [ ] Permission risk level is understood.
- [ ] Approval path is defined.
- [ ] Access is time-bound where needed.
- [ ] Audit evidence is generated.
- [ ] Review cadence is defined.
- [ ] Revocation/offboarding path exists.
- [ ] Emergency process is defined where relevant.

---

# Acceptance Criteria

- [ ] Governance process is clear.
- [ ] Owners and approvers are clear.
- [ ] Evidence requirements are clear.
- [ ] Review cadence is clear.
- [ ] Exception process is explicit.
- [ ] Implementation references are aligned with Book V.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Shared user accounts.
- Permanent admin access without review.
- Roles with unclear purpose.
- Permissions created without owner or tests.
- Access granted through informal chat only.
- Service accounts with no owner.
- API keys without rotation/revocation plan.
- Break-glass access with no audit.
- Access reviews that do not remove anything.

---

# Related Documents

- ../PART-01-Security-Governance-Foundation/README.md
- ../PART-02-Security-Policies-and-Standards/14-Access-Control-Policy.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-03-Backend-Implementation-Plan/31-Authorization-RBAC-Implementation-Plan.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-08-Security-Implementation-Plan/129-Authorization-and-RBAC-Enforcement.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-PERMISSION-MAP.md

---

# Navigation

**Previous:** `32-Access-Request-and-Approval-Workflow.md`

**Next:** `34-Emergency-Break-Glass-Access.md`

---

# Review Scope

Access reviews should cover:

```text
active users
organization memberships
workspace memberships
privileged roles
service accounts
API keys
integration credentials
external collaborators
break-glass usage
```

---

# Review Decisions

Each access entry should be marked:

```text
keep
reduce
revoke
needs investigation
temporarily extend
```

---

# Review Cadence

Recommended:

```text
monthly for privileged access
quarterly for normal access
per incident for suspicious access
per major org/team change
```
