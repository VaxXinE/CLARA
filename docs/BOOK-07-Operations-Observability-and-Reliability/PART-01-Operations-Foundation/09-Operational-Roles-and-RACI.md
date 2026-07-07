---
book: "Book VII — Operations, Observability & Reliability"
part: "PART-01 — Operations Foundation"
chapter: "09"
title: "Operational Roles and RACI"
version: "1.0.0"
status: "official"
owner: "CLARA Operations Team"
last_updated: "2026-07-07"
classification: "operations-foundation"
previous: "08-Runbook-and-Playbook-Standards.md"
next: "10-Operations-Cadence-and-Review-Rhythm.md"
project: "CLARA"
---

# Operational Roles and RACI

> *"Defines operational roles and accountability across engineering, security, product, support, DevOps/platform, and business stakeholders."*

---

# Purpose

Defines operational roles and accountability across engineering, security, product, support, DevOps/platform, and business stakeholders.

---

# Operational Problem

Production operations fail when everyone assumes someone else owns the decision.

---

# Operational Decision

## Decision

CLARA operations should use role clarity and RACI mapping so operational decisions have accountable owners.

## Status

Accepted.

---

# Operations Rule

Every production capability in CLARA must be operated as:

```text
Capability -> Owner -> Health Signal -> Alert/Review Path -> Runbook -> Evidence -> Improvement Loop
```

A feature is not production-ready if the team cannot answer:

```text
who owns it
how to observe it
how to detect failure
how to recover it
how to support users
how to prove what happened
how to improve after failure
```

---

# Recommended Operations Flow

```mermaid
sequenceDiagram
    participant Feature as Feature/Service Owner
    participant Ops as Operations
    participant Obs as Observability
    participant Support as Support
    participant Incident as Incident Response
    participant Evidence as Evidence/Reports

    Feature->>Ops: Defines operational ownership and readiness
    Ops->>Obs: Defines metrics, logs, alerts, dashboards
    Support->>Ops: Reports user/customer pain
    Obs->>Incident: Signals abnormal behavior
    Incident->>Evidence: Records timeline, actions, outcome
    Evidence-->>Feature: Drives improvements and runbook updates
```

---

# Production-Ready Checklist

- [ ] Owner is assigned.
- [ ] Backup/escalation owner is defined where critical.
- [ ] Health signal is defined.
- [ ] Logs/metrics/traces are defined where relevant.
- [ ] Alerts or review signals are defined.
- [ ] Runbook exists.
- [ ] Fallback/recovery path exists.
- [ ] Support impact is understood.
- [ ] Evidence/reporting source is defined.
- [ ] Security and data boundaries are respected.

---

# Acceptance Criteria

- [ ] Operational responsibility is clear.
- [ ] Monitoring/observability expectations are clear.
- [ ] Failure handling is clear.
- [ ] Support escalation is clear.
- [ ] Evidence expectations are clear.
- [ ] Continuous improvement loop is clear.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Shipping production features without owners.
- Alerts with no responder.
- Dashboards nobody uses.
- Logs that expose secrets/customer data.
- Runbooks that only one engineer understands.
- No rollback or disable path.
- No support escalation process.
- Measuring uptime without user-impact context.
- Treating AI/integrations as normal low-risk services.
- Fixing incidents without improving docs/tests/alerts.

---

# Related Documents

- ../../BOOK-06-Security-Governance-and-Compliance/BOOK-06-Master-Index/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/PART-08-Incident-Response-and-Business-Continuity-Governance/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/PART-09-Secure-SDLC-Governance/README.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-10-DevOps-and-Release-Execution/README.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-12-Production-Readiness-and-Handover/README.md

---

# Navigation

**Previous:** `08-Runbook-and-Playbook-Standards.md`

**Next:** `10-Operations-Cadence-and-Review-Rhythm.md`

---

# Operational RACI

| Area | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|
| Production deployment | Engineering/DevOps | Engineering Lead | Security/Product | Support |
| Incident response | Incident Commander | Ops/Engineering Lead | Security/Product/Support | Stakeholders |
| Security incident | Security Lead | Security Owner | Engineering/Legal/Product | Leadership |
| AI incident | AI Owner | Product/AI Lead | Security/Ops/Support | Stakeholders |
| Integration outage | Integration Owner | Engineering/Ops Lead | Provider/Support/Product | Users if impacted |
| Customer escalation | Support | Support Lead | Product/Engineering | Account owner |

---

# RACI Rule

For every critical operational workflow, there must be one accountable owner.

Many can help.

One must decide.
