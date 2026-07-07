---
book: "Book VI — Security, Governance & Compliance"
part: "PART-08 — Incident Response and Business Continuity Governance"
chapter: "90"
title: "AI Incident Response Governance"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "incident-response-business-continuity-governance"
previous: "89-Reliability-and-Production-Incident-Governance.md"
next: "91-Integration-and-Third-Party-Incident-Governance.md"
project: "CLARA"
---

# AI Incident Response Governance

> *"Defines governance for AI output failures, context leaks, unsafe replies, prompt injection, provider failures, quality regression, cost spikes, and AI feature disablement."*

---

# Purpose

Defines governance for AI output failures, context leaks, unsafe replies, prompt injection, provider failures, quality regression, cost spikes, and AI feature disablement.

---

# Governance Problem

AI incidents are different from normal bugs because they can involve unpredictable output, sensitive context, and provider/model behavior.

---

# Governance Decision

## Decision

CLARA AI incidents should have specific containment controls, including kill switches, prompt rollback, provider fallback, context restriction, and human-only mode.

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

**Previous:** `89-Reliability-and-Production-Incident-Governance.md`

**Next:** `91-Integration-and-Third-Party-Incident-Governance.md`

---

# AI Incident Types

Examples:

```text
AI leaks internal note
AI uses unauthorized context
AI drafts harmful response
prompt injection succeeds
RAG retrieves private/wrong source
provider outage
model quality regression
AI cost spike
provider key leak
```

---

# AI Containment Options

```text
disable AI feature globally
disable per workspace/org
disable provider
rollback prompt version
disable RAG source
disable specific AI action/tool
force human-only mode
reduce context scope
```

---

# AI Incident Evidence

Record:

```text
AI request ID
feature name
model/provider
prompt version
context source references
output reference
reviewer decision
safety block/failure reason
affected workspace/org
```

Do not over-retain raw sensitive content without reason.
