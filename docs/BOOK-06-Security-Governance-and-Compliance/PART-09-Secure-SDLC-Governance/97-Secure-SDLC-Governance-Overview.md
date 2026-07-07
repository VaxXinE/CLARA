---
book: "Book VI — Security, Governance & Compliance"
part: "PART-09 — Secure SDLC Governance"
chapter: "97"
title: "Secure SDLC Governance Overview"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "secure-sdlc-governance"
previous: "../PART-08-Incident-Response-and-Business-Continuity-Governance/96-Part-08-Summary.md"
next: "98-Security-Requirements-in-Planning.md"
project: "CLARA"
---

# Secure SDLC Governance Overview

> *"Introduces CLARA's governance model for building, reviewing, testing, releasing, and improving software securely across the full development lifecycle."*

---

# Purpose

Introduces CLARA's governance model for building, reviewing, testing, releasing, and improving software securely across the full development lifecycle.

---

# Governance Problem

Security becomes expensive and fragile when it is added only after features are built.

---

# Governance Decision

## Decision

CLARA Secure SDLC should make security part of planning, design, implementation, review, testing, release, operations, and incident learning.

## Status

Accepted.

---

# Secure SDLC Rule

Every meaningful CLARA change must be governed as:

```text
Requirement -> Risk Review -> Design/Threat Model -> Implementation -> Review -> Test -> Release Gate -> Evidence -> Learning
```

High-risk changes require stronger controls before merge and before production.

---

# Recommended SDLC Flow

```mermaid
sequenceDiagram
    participant Plan as Planning
    participant Sec as Security/Privacy Review
    participant Dev as Development
    participant PR as Pull Request
    participant CI as CI / Security Tests
    participant Release as Release Gate
    participant Evidence as Evidence Repository

    Plan->>Sec: Identify security requirements and risk
    Sec-->>Plan: Required controls and review depth
    Plan->>Dev: Create ready task with security criteria
    Dev->>PR: Implement with tests and docs
    PR->>CI: Run lint, tests, scans, builds
    CI-->>Release: Provide evidence
    Release->>Evidence: Store release/security evidence
```

---

# Secure-by-Design Checklist

- [ ] Security requirements are captured.
- [ ] Risk level is assigned.
- [ ] Threat modeling is done where needed.
- [ ] Secure coding standard is followed.
- [ ] Authorization/scoping is reviewed.
- [ ] Data/privacy impact is reviewed.
- [ ] AI/integration impact is reviewed where relevant.
- [ ] Security tests are defined.
- [ ] Release gate is defined.
- [ ] Evidence is retained.
- [ ] Incident/audit learnings are fed back.

---

# Acceptance Criteria

- [ ] SDLC step is clear.
- [ ] Governance owner is clear.
- [ ] Security review triggers are clear.
- [ ] Testing and evidence expectations are clear.
- [ ] Release and change control expectations are clear.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Security review only after code is done.
- Huge PRs with unclear risk.
- Frontend-only authorization.
- No cross-workspace test for scoped data.
- Adding dependencies without review.
- Ignoring secret scan findings.
- Shipping migrations without rollback/forward-fix plan.
- Emergency changes with no follow-up review.
- Incidents that do not produce SDLC improvements.
- AI-generated code merged without human review.

---

# Related Documents

- ../PART-02-Security-Policies-and-Standards/16-Secure-Development-Policy.md
- ../PART-08-Incident-Response-and-Business-Continuity-Governance/94-Postmortem-and-Learning-Governance.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-02-Repository-and-Development-Workflow/README.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-08-Security-Implementation-Plan/README.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-09-Testing-and-QA-Execution/README.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-10-DevOps-and-Release-Execution/README.md

---

# Navigation

**Previous:** `../PART-08-Incident-Response-and-Business-Continuity-Governance/96-Part-08-Summary.md`

**Next:** `98-Security-Requirements-in-Planning.md`

---

# Secure SDLC Scope

CLARA Secure SDLC governance applies to:

```text
backend code
frontend code
database migrations
AI prompts and model changes
integration connectors
infrastructure/configuration
CI/CD workflows
security policies
runbooks
documentation that affects implementation
```

---

# Core SDLC Questions

For every change, CLARA should answer:

```text
What risk does this change introduce?
What security requirements apply?
What tests prove the control works?
What evidence will be retained?
How can this change be rolled back or disabled?
What docs/runbooks must be updated?
```
