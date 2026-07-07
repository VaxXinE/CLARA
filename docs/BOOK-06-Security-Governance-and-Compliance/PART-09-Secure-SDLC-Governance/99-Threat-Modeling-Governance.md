---
book: "Book VI — Security, Governance & Compliance"
part: "PART-09 — Secure SDLC Governance"
chapter: "99"
title: "Threat Modeling Governance"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "secure-sdlc-governance"
previous: "98-Security-Requirements-in-Planning.md"
next: "100-Secure-Coding-Standards-Governance.md"
project: "CLARA"
---

# Threat Modeling Governance

> *"Defines lightweight threat modeling governance for high-risk CLARA features and system changes."*

---

# Purpose

Defines lightweight threat modeling governance for high-risk CLARA features and system changes.

---

# Governance Problem

Teams miss predictable attack paths when they only think about happy-path behavior.

---

# Governance Decision

## Decision

CLARA should use practical threat modeling for risky features to identify abuse cases, trust boundaries, assets, controls, and residual risk before coding.

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

**Previous:** `98-Security-Requirements-in-Planning.md`

**Next:** `100-Secure-Coding-Standards-Governance.md`

---

# Lightweight Threat Model Template

```markdown
# Threat Model

## Feature
Name.

## Assets
What must be protected.

## Actors
Legitimate users and possible attackers.

## Trust Boundaries
Where untrusted input enters.

## Abuse Cases
How feature can be misused.

## Required Controls
Controls that reduce risk.

## Residual Risk
Risk after controls.

## Review Decision
Approved / Needs mitigation / Deferred.
```

---

# Threat Modeling Triggers

Threat model required for:

```text
auth/RBAC changes
AI context or tool action changes
new integration/channel
data export
file upload
admin/security/billing controls
workflow automation actions
major database permission model changes
```
