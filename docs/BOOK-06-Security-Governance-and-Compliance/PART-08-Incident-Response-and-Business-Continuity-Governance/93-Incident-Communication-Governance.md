---
book: "Book VI — Security, Governance & Compliance"
part: "PART-08 — Incident Response and Business Continuity Governance"
chapter: "93"
title: "Incident Communication Governance"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "incident-response-business-continuity-governance"
previous: "92-Data-Breach-and-Privacy-Incident-Governance.md"
next: "94-Postmortem-and-Learning-Governance.md"
project: "CLARA"
---

# Incident Communication Governance

> *"Defines internal and external communication governance for incidents, including status updates, stakeholder notifications, customer communication, and disclosure boundaries."*

---

# Purpose

Defines internal and external communication governance for incidents, including status updates, stakeholder notifications, customer communication, and disclosure boundaries.

---

# Governance Problem

Poor communication can create confusion, legal risk, customer mistrust, or accidental disclosure.

---

# Governance Decision

## Decision

CLARA incident communication should be accurate, timely, role-appropriate, evidence-aware, and careful not to overclaim or leak sensitive details.

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

**Previous:** `92-Data-Breach-and-Privacy-Incident-Governance.md`

**Next:** `94-Postmortem-and-Learning-Governance.md`

---

# Communication Channels

Define channels for:

```text
incident coordination
engineering updates
security/privacy review
executive/stakeholder updates
support/customer-facing updates
postmortem publication
```

---

# Communication Rules

- Be accurate.
- Be timely.
- Separate confirmed facts from assumptions.
- Do not speculate publicly.
- Do not reveal sensitive technical details unnecessarily.
- Update cadence should match severity.
- Keep a timeline of communications.

---

# Customer-Facing Update Pattern

```text
What is impacted
Current status
What users can do
What CLARA is doing
Next update timing
```

Do not include unverified root cause.
