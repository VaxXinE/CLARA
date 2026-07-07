---
book: "Book VII — Operations, Observability & Reliability"
part: "PART-09 — Runbooks and Playbooks"
chapter: "100"
title: "Incident Playbook Template Standard"
version: "1.0.0"
status: "official"
owner: "CLARA Operations Team"
last_updated: "2026-07-07"
classification: "runbooks-playbooks"
previous: "99-Runbook-Template-Standard.md"
next: "101-Service-Runbooks.md"
project: "CLARA"
---

# Incident Playbook Template Standard

> *"Defines the template for CLARA incident playbooks covering incident declaration, roles, timeline, investigation, mitigation, communication, and follow-up."*

---

# Purpose

Defines the template for CLARA incident playbooks covering incident declaration, roles, timeline, investigation, mitigation, communication, and follow-up.

---

# Operational Problem

Incident response fails when technical steps exist but coordination rules are missing.

---

# Operational Decision

## Decision

CLARA incident playbooks should coordinate people, decisions, evidence, communication, and recovery actions for known incident classes.

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

**Previous:** `99-Runbook-Template-Standard.md`

**Next:** `101-Service-Runbooks.md`

---

# Incident Playbook Template

```markdown
# Incident Playbook: <Scenario>

## Scenario
What incident this covers.

## Declaration Criteria
When to declare.

## Initial Severity
Recommended starting severity.

## Roles
Incident Commander, Tech Lead, Scribe, Comms, Support, Security.

## First 15 Minutes
Immediate steps.

## Investigation Path
What to check.

## Mitigation Options
Safe actions.

## Communication Cadence
Internal and customer update timing.

## Evidence
What to preserve.

## Recovery Validation
How to confirm recovery.

## Post-Incident Follow-Up
Postmortem, actions, owners.
```

---

# Incident Playbook Rule

Incident playbooks must include coordination and communication, not only technical debugging.
