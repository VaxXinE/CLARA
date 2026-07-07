---
book: "Book VII — Operations, Observability & Reliability"
part: "PART-04 — Alerting and Incident Operations"
chapter: "39"
title: "Alert Severity and Priority Model"
version: "1.0.0"
status: "official"
owner: "CLARA Operations Team"
last_updated: "2026-07-07"
classification: "alerting-incident-operations"
previous: "38-Alerting-Strategy.md"
next: "40-Alert-Routing-and-Ownership.md"
project: "CLARA"
---

# Alert Severity and Priority Model

> *"Defines alert severity, priority, urgency, user impact, data/security impact, and response expectations."*

---

# Purpose

Defines alert severity, priority, urgency, user impact, data/security impact, and response expectations.

---

# Operational Problem

If all alerts look equally urgent, responders cannot prioritize correctly.

---

# Operational Decision

## Decision

CLARA should classify alerts by impact, urgency, confidence, and required action.

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

**Previous:** `38-Alerting-Strategy.md`

**Next:** `40-Alert-Routing-and-Ownership.md`

---

# Alert Severity Model

| Severity | Response Expectation | Examples |
|---|---|---|
| Critical | Immediate response | outage, data exposure, auth bypass |
| High | Prompt response | major workflow degraded |
| Medium | Same-day/next review | repeated errors, risk trend |
| Low | Periodic review | informational health trend |

---

# Priority Inputs

Classify by:

```text
customer impact
data/security impact
revenue/business impact
number of users affected
duration
confidence
available workaround
```

---

# Severity Rule

If data/security impact is possible but unknown, start high and downgrade later with evidence.
