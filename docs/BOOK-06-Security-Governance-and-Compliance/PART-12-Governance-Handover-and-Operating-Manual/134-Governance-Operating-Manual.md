---
book: "Book VI — Security, Governance & Compliance"
part: "PART-12 — Governance Handover and Operating Manual"
chapter: "134"
title: "Governance Operating Manual"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "governance-handover-operating-manual"
previous: "133-Governance-Handover-and-Operating-Manual-Overview.md"
next: "135-Security-Ownership-Handover.md"
project: "CLARA"
---

# Governance Operating Manual

> *"Defines the daily, weekly, monthly, quarterly, and release-based operating model for CLARA security governance."*

---

# Purpose

Defines the daily, weekly, monthly, quarterly, and release-based operating model for CLARA security governance.

---

# Handover Problem

Security governance decays quickly if it is treated as a one-time documentation project.

---

# Governance Decision

## Decision

CLARA governance should operate through lightweight recurring routines that keep risks, controls, access, evidence, incidents, AI, integrations, and compliance current.

## Status

Accepted.

---

# Handover Rule

Every governance area must be handed over as:

```text
Area -> Owner -> Backup Owner -> Current Status -> Evidence -> Open Gaps -> Review Cadence -> Runbook -> Escalation Path
```

A handover is incomplete if the next team cannot answer:

```text
what exists
who owns it
where evidence lives
what is risky
what must be reviewed next
how to operate it
how to escalate
```

---

# Recommended Handover Flow

```mermaid
sequenceDiagram
    participant Current as Current Owner
    participant Next as Next Owner
    participant Evidence as Evidence Repository
    participant Risk as Risk Register
    participant Calendar as Governance Calendar
    participant Runbook as Runbooks

    Current->>Next: Transfers ownership context
    Current->>Evidence: Confirms evidence locations
    Current->>Risk: Reviews open risks and accepted risks
    Current->>Calendar: Confirms review cadence
    Current->>Runbook: Confirms operating procedures
    Next-->>Current: Accepts or requests remediation before handover
```

---

# Secure-by-Design Checklist

- [ ] Primary owner is assigned.
- [ ] Backup owner is assigned for critical areas.
- [ ] Current status is documented.
- [ ] Evidence location is documented.
- [ ] Open risks/gaps are documented.
- [ ] Accepted risks and expiration dates are documented.
- [ ] Review cadence is scheduled.
- [ ] Runbook exists.
- [ ] Escalation path exists.
- [ ] Customer/external disclosure boundaries are documented where relevant.

---

# Acceptance Criteria

- [ ] Handover process is clear.
- [ ] Ownership is explicit.
- [ ] Evidence and risk locations are clear.
- [ ] Recurring reviews are scheduled.
- [ ] Runbooks are actionable.
- [ ] Book VI can be operated after handover.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Handover as a folder dump.
- No backup owner for critical governance.
- Open risks without owner/date.
- Evidence links missing or private to one person.
- Review calendar not created.
- Runbooks that only original author understands.
- Customer trust materials with no approval owner.
- Accepted risks with no expiration.
- Compliance roadmap with no operating milestones.
- Governance that is not connected to engineering work.

---

# Related Documents

- ../PART-01-Security-Governance-Foundation/README.md
- ../PART-07-Audit-Evidence-and-Compliance-Readiness/README.md
- ../PART-10-Risk-Register-and-Control-Mapping/README.md
- ../PART-11-Compliance-Roadmap/README.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-12-Production-Readiness-and-Handover/README.md

---

# Navigation

**Previous:** `133-Governance-Handover-and-Operating-Manual-Overview.md`

**Next:** `135-Security-Ownership-Handover.md`

---

# Operating Rhythm

Daily/ongoing:

```text
watch critical alerts and incidents
review urgent security findings
track high-risk access or AI/integration issues
```

Weekly:

```text
review open security tasks
review high-risk PRs/changes
update active incidents/gaps
```

Monthly:

```text
risk register review
privileged access review
dependency/vulnerability review
AI/integration health review
```

Quarterly:

```text
policy review
control evidence review
third-party review
privacy/data review
compliance roadmap review
```

Per release:

```text
security release gates
smoke/security evidence
rollback readiness
known risk review
```
