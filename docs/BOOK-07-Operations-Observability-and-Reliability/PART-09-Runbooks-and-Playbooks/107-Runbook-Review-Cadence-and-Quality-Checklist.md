---
book: "Book VII — Operations, Observability & Reliability"
part: "PART-09 — Runbooks and Playbooks"
chapter: "107"
title: "Runbook Review Cadence and Quality Checklist"
version: "1.0.0"
status: "official"
owner: "CLARA Operations Team"
last_updated: "2026-07-07"
classification: "runbooks-playbooks"
previous: "106-Recovery-and-DR-Playbooks.md"
next: "108-Part-09-Summary.md"
project: "CLARA"
---

# Runbook Review Cadence and Quality Checklist

> *"Defines how CLARA reviews, tests, updates, validates, and improves runbooks and playbooks."*

---

# Purpose

Defines how CLARA reviews, tests, updates, validates, and improves runbooks and playbooks.

---

# Operational Problem

Runbooks become dangerous when they describe an old system instead of current production reality.

---

# Operational Decision

## Decision

CLARA runbooks should be reviewed on cadence, after incidents, after major changes, and during readiness reviews.

## Status

Accepted.

---

# Runbook Rule

Every critical CLARA operational procedure must be documented as:

```text
Trigger -> Owner -> Symptoms -> Investigation -> Mitigation -> Escalation -> Evidence -> Follow-Up -> Review
```

A runbook is incomplete if the responder cannot answer:

```text
when to use it
what to check first
what is safe to do
what is dangerous to do
who to escalate to
what evidence to collect
how to confirm recovery
what to update after recovery
```

---

# Recommended Runbook Flow

```mermaid
sequenceDiagram
    participant Signal as Alert / Ticket / Incident
    participant Responder as Responder
    participant Runbook as Runbook
    participant System as CLARA System
    participant Evidence as Evidence
    participant Owner as Owner

    Signal->>Responder: Triggers operational response
    Responder->>Runbook: Opens relevant runbook
    Runbook->>System: Guides investigation and mitigation
    Responder->>Evidence: Captures timeline and findings
    Responder->>Owner: Escalates or closes with follow-up
```

---

# Production-Ready Checklist

- [ ] Trigger is clear.
- [ ] Owner is clear.
- [ ] Required permissions are clear.
- [ ] Dashboards/logs/metrics are linked.
- [ ] Diagnosis steps are actionable.
- [ ] Mitigation steps are safe.
- [ ] Escalation path is defined.
- [ ] Evidence capture is defined.
- [ ] Customer/support communication note exists where needed.
- [ ] Last reviewed date is documented.

---

# Acceptance Criteria

- [ ] Procedure is repeatable.
- [ ] Safety boundaries are clear.
- [ ] Security/privacy warnings are explicit.
- [ ] Evidence expectations are clear.
- [ ] Escalation path is clear.
- [ ] Review cadence exists.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Runbooks that only say “ask senior engineer.”
- Missing owner.
- Missing last reviewed date.
- Commands with no explanation or safety warning.
- Destructive recovery steps without approval.
- Customer data exposure in screenshots/log examples.
- No rollback or stop condition.
- No validation step after mitigation.
- Incident playbooks without communication rules.
- Runbooks that are not updated after incidents.

---

# Related Documents

- ../PART-08-Production-Support-Operations/README.md
- ../PART-07-Backup-Restore-and-Disaster-Recovery/README.md
- ../PART-04-Alerting-and-Incident-Operations/README.md
- ../PART-03-Logging-and-Metrics/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/PART-08-Incident-Response-and-Business-Continuity-Governance/README.md

---

# Navigation

**Previous:** `106-Recovery-and-DR-Playbooks.md`

**Next:** `108-Part-09-Summary.md`

---

# Review Cadence

Recommended review cadence:

```text
after every significant incident
after major feature launch
after major architecture change
quarterly for critical runbooks
semi-annually for lower-risk runbooks
before on-call handover
before customer/enterprise readiness review
```

---

# Runbook Quality Checklist

- [ ] Trigger is clear.
- [ ] Owner is current.
- [ ] Dashboards/logs still work.
- [ ] Steps match current system.
- [ ] Commands are safe and explained.
- [ ] Escalation contacts are current.
- [ ] Security/privacy warnings are clear.
- [ ] Evidence section is useful.
- [ ] Validation step confirms recovery.
- [ ] Last reviewed date updated.

---

# Testing Rule

Critical runbooks should be tested through drills, tabletop exercises, or controlled recovery tests.
