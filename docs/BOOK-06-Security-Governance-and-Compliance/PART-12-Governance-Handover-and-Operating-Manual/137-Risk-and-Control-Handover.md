---
book: "Book VI — Security, Governance & Compliance"
part: "PART-12 — Governance Handover and Operating Manual"
chapter: "137"
title: "Risk and Control Handover"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "governance-handover-operating-manual"
previous: "136-Policy-and-Standards-Handover.md"
next: "138-Evidence-and-Audit-Handover.md"
project: "CLARA"
---

# Risk and Control Handover

> *"Defines handover process for risk register, control library, risk acceptance records, control maturity, open gaps, and review ownership."*

---

# Purpose

Defines handover process for risk register, control library, risk acceptance records, control maturity, open gaps, and review ownership.

---

# Handover Problem

Future teams cannot make good decisions if current risks and controls are not handed over clearly.

---

# Governance Decision

## Decision

CLARA risk and control handover should preserve current posture, open gaps, accepted risks, control owners, maturity levels, and review dates.

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

**Previous:** `136-Policy-and-Standards-Handover.md`

**Next:** `138-Evidence-and-Audit-Handover.md`

---

# Risk and Control Handover Checklist

- [ ] Risk register location known.
- [ ] Control library location known.
- [ ] Critical/high risks reviewed.
- [ ] Accepted risks reviewed.
- [ ] Expiring risk acceptances identified.
- [ ] Control owners confirmed.
- [ ] Control evidence mapped.
- [ ] Open control gaps assigned.
- [ ] Review cadence scheduled.

---

# Handover Summary Format

```markdown
## Risk/Control Handover Summary

Current top risks:
1.
2.
3.

Open control gaps:
1.
2.
3.

Accepted risks expiring soon:
1.
2.
3.

Next review:
Date + owner.
```
