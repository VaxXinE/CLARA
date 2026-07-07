---
book: "Book VI — Security, Governance & Compliance"
part: "PART-09 — Secure SDLC Governance"
chapter: "98"
title: "Security Requirements in Planning"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "secure-sdlc-governance"
previous: "97-Secure-SDLC-Governance-Overview.md"
next: "99-Threat-Modeling-Governance.md"
project: "CLARA"
---

# Security Requirements in Planning

> *"Defines how security, privacy, AI, integration, access, data, and operational requirements should be captured during planning."*

---

# Purpose

Defines how security, privacy, AI, integration, access, data, and operational requirements should be captured during planning.

---

# Governance Problem

Features planned without security requirements often need rework or ship with missing controls.

---

# Governance Decision

## Decision

Every CLARA feature should define security requirements before implementation begins, especially when it affects data, access, AI, integrations, admin controls, exports, or workflows.

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

**Previous:** `97-Secure-SDLC-Governance-Overview.md`

**Next:** `99-Threat-Modeling-Governance.md`

---

# Security Requirements Trigger Areas

Capture explicit security requirements when work affects:

```text
authentication
authorization
organization/workspace scope
customer/conversation/ticket data
internal notes
AI context/output
integrations/webhooks
admin/billing/security settings
exports/downloads
file uploads
workflow automation
database migrations
production deployment
```

---

# Requirement Template

```markdown
## Security Requirements

- Protected resources:
- Required permissions:
- Tenant/workspace scope:
- Sensitive data involved:
- Input validation:
- Output rendering:
- Audit events:
- Tests required:
- Rollback/disable path:
```

---

# Planning Rule

A backlog item is not ready if security-sensitive behavior is unclear.
