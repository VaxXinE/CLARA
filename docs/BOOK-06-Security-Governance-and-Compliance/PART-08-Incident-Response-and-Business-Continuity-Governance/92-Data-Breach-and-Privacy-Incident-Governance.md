---
book: "Book VI — Security, Governance & Compliance"
part: "PART-08 — Incident Response and Business Continuity Governance"
chapter: "92"
title: "Data Breach and Privacy Incident Governance"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "incident-response-business-continuity-governance"
previous: "91-Integration-and-Third-Party-Incident-Governance.md"
next: "93-Incident-Communication-Governance.md"
project: "CLARA"
---

# Data Breach and Privacy Incident Governance

> *"Defines governance for suspected or confirmed data exposure, unauthorized data access, privacy incidents, internal note leakage, export misuse, and data loss."*

---

# Purpose

Defines governance for suspected or confirmed data exposure, unauthorized data access, privacy incidents, internal note leakage, export misuse, and data loss.

---

# Governance Problem

Data breach handling requires speed, accuracy, evidence, legal/privacy review, and careful communication.

---

# Governance Decision

## Decision

CLARA data/privacy incidents should be treated as high-risk until assessed and should preserve evidence while minimizing further exposure.

## Status

Accepted.

---

# Incident Governance Rule

Every CLARA incident must be governed as:

```text
Signal -> Declaration -> Severity -> Owner -> Containment -> Evidence -> Recovery -> Communication -> Postmortem -> Control Improvement
```

A serious incident is not complete until:

```text
impact is understood
recovery is verified
evidence is preserved
stakeholders are updated
follow-up actions are owned
risk/control updates are recorded
```

---

# Recommended Incident Flow

```mermaid
sequenceDiagram
    participant Signal as Alert/User/Team Signal
    participant IC as Incident Commander
    participant Team as Response Team
    participant Evidence as Evidence Repository
    participant Stakeholder as Stakeholders
    participant Post as Postmortem

    Signal->>IC: Incident suspected or detected
    IC->>Team: Declare severity and assign roles
    Team->>Team: Contain and investigate
    Team->>Evidence: Preserve logs, timeline, decisions
    IC->>Stakeholder: Send appropriate updates
    Team->>Team: Recover and validate
    IC->>Post: Schedule postmortem and follow-up tasks
```

---

# Secure-by-Design Checklist

- [ ] Severity can be classified.
- [ ] Incident owner can be assigned.
- [ ] Containment path is known.
- [ ] Evidence preservation is defined.
- [ ] Customer/data impact assessment is defined.
- [ ] Communication boundary is defined.
- [ ] Recovery validation is defined.
- [ ] Postmortem requirement is defined.
- [ ] Follow-up task ownership is defined.
- [ ] Control improvement path is defined.

---

# Acceptance Criteria

- [ ] Incident process is clear.
- [ ] Severity model is clear.
- [ ] Ownership and escalation are clear.
- [ ] Evidence and communication rules are clear.
- [ ] Recovery and continuity expectations are clear.
- [ ] AI/integration/data incident variants are covered where relevant.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Debating severity forever instead of containing impact.
- Debugging before preserving evidence.
- Restarting systems and destroying useful logs without decision.
- Publicly communicating unverified root cause.
- Treating data/privacy incidents as normal bugs.
- Leaving incident communication to random chat.
- No postmortem for serious incidents.
- Postmortems with no owners or due dates.
- No continuity plan for critical workflows.
- Ignoring AI/integration-specific kill switches.

---

# Related Documents

- ../PART-02-Security-Policies-and-Standards/21-Incident-Response-Policy.md
- ../PART-03-Identity-and-Access-Governance/34-Emergency-Break-Glass-Access.md
- ../PART-05-AI-Governance-and-Model-Risk/59-AI-Incident-Handling-and-Kill-Switch-Governance.md
- ../PART-06-Integration-and-Third-Party-Governance/69-Third-Party-Incident-and-Outage-Governance.md
- ../PART-07-Audit-Evidence-and-Compliance-Readiness/README.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-10-DevOps-and-Release-Execution/180-Incident-Response-Execution.md

---

# Navigation

**Previous:** `91-Integration-and-Third-Party-Incident-Governance.md`

**Next:** `93-Incident-Communication-Governance.md`

---

# Privacy/Data Incident Types

Examples:

```text
customer data exposed to wrong workspace
internal note sent to customer
export sent to wrong recipient
audit log exposes sensitive data
AI context leak
attachment exposed publicly
database data loss/corruption
unauthorized data access
```

---

# Privacy/Data Response Steps

```text
contain exposure
preserve evidence
identify affected data categories
identify affected users/customers
stop further processing/sharing
assess legal/privacy obligations
recover or delete where appropriate
prepare communication if required
postmortem and control update
```

---

# Data Incident Rule

Treat suspected data exposure as high severity until proven otherwise.
