---
book: "Book VI — Security, Governance & Compliance"
part: "PART-09 — Secure SDLC Governance"
chapter: "105"
title: "Change Management and Exception Governance"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "secure-sdlc-governance"
previous: "104-Release-Security-Governance.md"
next: "106-Secure-SDLC-Metrics-and-Evidence.md"
project: "CLARA"
---

# Change Management and Exception Governance

> *"Defines governance for change requests, emergency changes, security exceptions, risk acceptance, rollback decisions, and documentation updates."*

---

# Purpose

Defines governance for change requests, emergency changes, security exceptions, risk acceptance, rollback decisions, and documentation updates.

---

# Governance Problem

Uncontrolled changes create production instability, security drift, and audit gaps.

---

# Governance Decision

## Decision

CLARA changes should be traceable, reviewed according to risk, documented, and reversible or recoverable where practical.

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

**Previous:** `104-Release-Security-Governance.md`

**Next:** `106-Secure-SDLC-Metrics-and-Evidence.md`

---

# Change Types

```text
standard change
normal change
high-risk change
emergency change
security exception
policy exception
risk acceptance
```

---

# Change Record Fields

```text
change summary
owner
risk level
affected systems
approval
test evidence
rollback/disable plan
deployment time
post-change validation
related incident/risk if any
```

---

# Exception Rule

Exceptions must be:

```text
explicit
owned
time-bound where possible
compensated by controls
reviewed
closed or renewed with evidence
```
