---
book: "Book VI — Security, Governance & Compliance"
part: "PART-01 — Security Governance Foundation"
chapter: "05"
title: "Risk Management Framework"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "security-governance"
previous: "04-Security-Operating-Model.md"
next: "06-Security-Policy-Framework.md"
project: "CLARA"
---

# Risk Management Framework

> *"Defines how CLARA identifies, assesses, prioritizes, accepts, mitigates, and tracks security and compliance risks."*

---

# Purpose

Defines how CLARA identifies, assesses, prioritizes, accepts, mitigates, and tracks security and compliance risks.

---

# Governance Problem

Untracked risks become forgotten decisions that later turn into incidents.

---

# Governance Decision

## Decision

CLARA should use a simple risk model with likelihood, impact, affected asset, owner, mitigation, due date, and acceptance status.

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

**Previous:** `04-Security-Operating-Model.md`

**Next:** `06-Security-Policy-Framework.md`

---

# Risk Record Template

```markdown
# Security Risk

## ID
RISK-0001

## Title
Short risk name.

## Asset
What is affected.

## Scenario
What could go wrong.

## Likelihood
Low / Medium / High

## Impact
Low / Medium / High

## Owner
Who owns mitigation.

## Mitigation
What will be done.

## Status
Open / Mitigating / Accepted / Closed

## Accepted By
Required if accepted.

## Review Date
Next review.
```

---

# Risk Severity

Use:

```text
Critical
High
Medium
Low
Informational
```

Critical/high risks require explicit mitigation or documented acceptance.
