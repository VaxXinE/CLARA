---
book: "Book VI — Security, Governance & Compliance"
part: "PART-01 — Security Governance Foundation"
chapter: "04"
title: "Security Operating Model"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "security-governance"
previous: "03-Security-Ownership-and-Accountability.md"
next: "05-Risk-Management-Framework.md"
project: "CLARA"
---

# Security Operating Model

> *"Defines how CLARA security work is planned, reviewed, executed, escalated, and improved over time."*

---

# Purpose

Defines how CLARA security work is planned, reviewed, executed, escalated, and improved over time.

---

# Governance Problem

Security governance fails when it exists only as documents and not as repeated operating routines.

---

# Governance Decision

## Decision

CLARA should operate security through recurring reviews, risk tracking, control ownership, incident learning, and release gates.

## Status

Accepted.

---

# Governance Rule

Every security governance area must be managed as:

```text
Principle -> Owner -> Control -> Evidence -> Review Cadence -> Risk Decision
```

A control is not mature unless there is:

```text
clear owner
clear implementation path
clear evidence
clear review rhythm
clear exception process
```

---

# Recommended Governance Flow

```mermaid
sequenceDiagram
    participant Team as Product/Engineering Team
    participant Sec as Security Owner
    participant Risk as Risk Register
    participant Evidence as Evidence Repository
    participant Review as Governance Review

    Team->>Sec: Raises security-sensitive decision or risk
    Sec->>Risk: Records risk/control/owner
    Sec->>Evidence: Links PRs, tests, logs, audit evidence
    Review->>Risk: Reviews status and acceptance
    Review-->>Team: Approve, mitigate, defer, or escalate
```

---

# Secure-by-Design Checklist

- [ ] Owner is defined.
- [ ] Backup owner is defined where needed.
- [ ] Risk is documented.
- [ ] Control is mapped to implementation.
- [ ] Evidence source is defined.
- [ ] Review cadence is defined.
- [ ] Exception path is defined.
- [ ] Escalation path is defined.
- [ ] Impact on AI/integrations/data is considered where relevant.

---

# Acceptance Criteria

- [ ] Governance responsibility is clear.
- [ ] Risk/control relationship is clear.
- [ ] Evidence expectations are clear.
- [ ] Review rhythm is clear.
- [ ] Security exceptions are handled explicitly.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Security ownership by assumption.
- Risk acceptance without named approver.
- Policies with no implementation controls.
- Controls with no evidence.
- Reviews with no follow-up owner.
- Audit readiness only after an audit request.
- Treating AI and integrations as normal low-risk features.
- Hiding known risks inside informal chat.

---

# Related Documents

- ../../BOOK-05-Engineering-Execution-Plan/PART-08-Security-Implementation-Plan/README.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-10-DevOps-and-Release-Execution/README.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-12-Production-Readiness-and-Handover/README.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-AI-GOVERNANCE-MAP.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-PERMISSION-MAP.md

---

# Navigation

**Previous:** `03-Security-Ownership-and-Accountability.md`

**Next:** `05-Risk-Management-Framework.md`

---

# Operating Model Activities

CLARA security operating model includes:

```text
security design review
risk register review
access review
dependency review
AI safety review
integration review
incident review
production readiness review
policy review
audit evidence review
```

---

# Lightweight Governance

For early CLARA, governance should be lightweight:

```text
small checklists
clear owners
recurring reviews
evidence links
risk decisions
follow-up tasks
```

Not heavy bureaucracy.
