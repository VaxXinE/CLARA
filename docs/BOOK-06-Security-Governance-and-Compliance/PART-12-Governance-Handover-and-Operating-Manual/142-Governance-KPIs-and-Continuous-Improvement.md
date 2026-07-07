---
book: "Book VI — Security, Governance & Compliance"
part: "PART-12 — Governance Handover and Operating Manual"
chapter: "142"
title: "Governance KPIs and Continuous Improvement"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "governance-handover-operating-manual"
previous: "141-Governance-Runbooks.md"
next: "143-Book-VI-Closure.md"
project: "CLARA"
---

# Governance KPIs and Continuous Improvement

> *"Defines practical metrics and improvement loops for security governance maturity."*

---

# Purpose

Defines practical metrics and improvement loops for security governance maturity.

---

# Handover Problem

Metrics are only useful when they improve decisions and reduce risk.

---

# Governance Decision

## Decision

CLARA governance should track a small number of useful indicators and convert review findings, incidents, gaps, and customer questions into improvements.

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

**Previous:** `141-Governance-Runbooks.md`

**Next:** `143-Book-VI-Closure.md`

---

# Recommended Governance KPIs

Track:

```text
open critical/high risks
overdue risk reviews
expired risk acceptances
controls without evidence
policy reviews overdue
privileged access review completion
open vulnerabilities by severity
AI eval failures and unresolved issues
integration health incidents
postmortem action completion
customer security review turnaround time
```

---

# Continuous Improvement Loop

```text
review metrics
identify weak area
create remediation task
assign owner
validate evidence
update control/policy/runbook
review again
```

---

# KPI Rule

KPIs should improve decisions.

Do not create vanity metrics that nobody acts on.
