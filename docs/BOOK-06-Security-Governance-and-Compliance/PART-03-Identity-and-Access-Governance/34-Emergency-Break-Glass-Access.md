---
book: "Book VI — Security, Governance & Compliance"
part: "PART-03 — Identity and Access Governance"
chapter: "34"
title: "Emergency Break Glass Access"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "identity-access-governance"
previous: "33-Access-Review-and-Recertification.md"
next: "35-Access-Audit-Evidence-and-Monitoring.md"
project: "CLARA"
---

# Emergency Break Glass Access

> *"Defines emergency access governance for incidents, outages, security events, and production recovery."*

---

# Purpose

Defines emergency access governance for incidents, outages, security events, and production recovery.

---

# Governance Problem

Emergency access is necessary, but uncontrolled emergency access becomes a privileged bypass.

---

# Governance Decision

## Decision

Break-glass access should be rare, time-bound, strongly logged, approved or post-approved, and reviewed after use.

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

**Previous:** `33-Access-Review-and-Recertification.md`

**Next:** `35-Access-Audit-Evidence-and-Monitoring.md`

---

# Break-Glass Purpose

Break-glass access is for:

```text
production outage
security incident
data recovery
critical customer-impacting failure
lost admin access
```

---

# Break-Glass Rules

- Use only when normal access path is insufficient.
- Require approval when possible.
- If not pre-approved, require post-incident review.
- Time-bound by default.
- Strongly logged.
- Reviewed after use.
- Revoked immediately after emergency.

---

# Break-Glass Evidence

Record:

```text
who used it
when it started
when it ended
why it was needed
what actions were taken
who approved/reviewed
follow-up tasks
```
