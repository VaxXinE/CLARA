---
book: "Book VII — Operations, Observability & Reliability"
part: "PART-04 — Alerting and Incident Operations"
chapter: "42"
title: "Incident Declaration and Classification"
version: "1.0.0"
status: "official"
owner: "CLARA Operations Team"
last_updated: "2026-07-07"
classification: "alerting-incident-operations"
previous: "41-On-Call-Workflow-and-Responder-Readiness.md"
next: "43-Incident-Command-Operations.md"
project: "CLARA"
---

# Incident Declaration and Classification

> *"Defines when CLARA declares an incident, how severity is assigned, how ownership is created, and how incidents are tracked."*

---

# Purpose

Defines when CLARA declares an incident, how severity is assigned, how ownership is created, and how incidents are tracked.

---

# Operational Problem

Delayed incident declaration slows coordination and evidence capture.

---

# Operational Decision

## Decision

CLARA should declare incidents early when customer, data, security, AI, integration, or reliability impact may be significant.

## Status

Accepted.

---

# Alerting and Incident Rule

Every production alert or incident path must define:

```text
Signal -> Owner -> Severity -> Route -> Runbook -> Evidence -> Follow-Up
```

An alert is production-ready only when:

```text
someone owns it
someone can act on it
the action is documented
the severity is clear
the signal is trustworthy
the follow-up loop exists
```

---

# Recommended Response Flow

```mermaid
sequenceDiagram
    participant Signal as Alert / User Report
    participant Router as Routing System
    participant Responder as Responder
    participant IC as Incident Commander
    participant Timeline as Timeline/Evidence
    participant FollowUp as Follow-Up Tracker

    Signal->>Router: Trigger signal
    Router->>Responder: Notify owner/on-call
    Responder->>Responder: Triage and validate impact
    Responder->>IC: Declare incident if needed
    IC->>Timeline: Record severity, decisions, actions
    IC->>FollowUp: Create post-incident actions after recovery
```

---

# Production-Ready Checklist

- [ ] Signal has owner.
- [ ] Severity is defined.
- [ ] Routing path is defined.
- [ ] Escalation path is defined.
- [ ] Runbook is linked.
- [ ] Dashboard/log query is linked where useful.
- [ ] Incident declaration criteria are clear.
- [ ] Evidence capture is defined.
- [ ] Security/privacy risk is considered.
- [ ] Follow-up process exists.

---

# Acceptance Criteria

- [ ] Alerting purpose is clear.
- [ ] Incident process is clear.
- [ ] Ownership and routing are clear.
- [ ] Runbook and evidence expectations are clear.
- [ ] Escalation path is clear.
- [ ] Alert tuning loop exists.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Alerts without responders.
- Alerts without runbooks.
- Alerts that page for non-actionable symptoms.
- Multiple teams assuming someone else owns the incident.
- Incident debugging with no timeline.
- Customer communication before facts are confirmed.
- Security/data incidents treated as normal bugs.
- Closing incidents without follow-up.
- Keeping noisy alerts because “maybe useful someday.”
- Making every warning a page.

---

# Related Documents

- ../PART-02-Observability-Strategy/README.md
- ../PART-03-Logging-and-Metrics/README.md
- ../PART-01-Operations-Foundation/08-Runbook-and-Playbook-Standards.md
- ../../BOOK-06-Security-Governance-and-Compliance/PART-08-Incident-Response-and-Business-Continuity-Governance/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/PART-07-Audit-Evidence-and-Compliance-Readiness/README.md

---

# Navigation

**Previous:** `41-On-Call-Workflow-and-Responder-Readiness.md`

**Next:** `43-Incident-Command-Operations.md`

---

# Incident Declaration Triggers

Declare incident when:

```text
critical workflow unavailable
customer data may be exposed
security boundary may be bypassed
AI leaks sensitive/wrong harmful output
integration sends duplicate/wrong messages
production deploy causes significant regression
database/queue/storage failure affects users
support receives multiple similar complaints
```

---

# Incident Fields

Record:

```text
incident_id
title
severity
status
incident commander
technical lead
start time
detected by
affected systems
customer impact
data/security impact
current mitigation
communication channel
```

---

# Declaration Rule

It is better to declare early and downgrade than to coordinate too late.
