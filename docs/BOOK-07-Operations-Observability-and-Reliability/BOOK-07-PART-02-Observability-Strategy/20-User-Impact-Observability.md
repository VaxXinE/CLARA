---
book: "Book VII — Operations, Observability & Reliability"
part: "PART-02 — Observability Strategy"
chapter: "20"
title: "User Impact Observability"
version: "1.0.0"
status: "official"
owner: "CLARA Operations Team"
last_updated: "2026-07-07"
classification: "observability-strategy"
previous: "19-Alerting-Philosophy-and-Signal-Quality.md"
next: "21-AI-Observability.md"
project: "CLARA"
---

# User Impact Observability

> *"Defines how CLARA should measure real user/customer impact instead of only infrastructure health."*

---

# Purpose

Defines how CLARA should measure real user/customer impact instead of only infrastructure health.

---

# Operational Problem

A server can look healthy while users cannot complete critical workflows.

---

# Operational Decision

## Decision

CLARA observability should connect technical signals to user workflows such as login, inbox, reply sending, ticketing, knowledge search, AI draft, and integrations.

## Status

Accepted.

---

# Observability Rule

Every important CLARA capability must define:

```text
Capability -> Owner -> User Impact Signal -> Logs -> Metrics -> Trace/Correlation -> Dashboard -> Alert/Review Path -> Runbook
```

Observability should help teams answer:

```text
is it working
who is affected
where is it failing
why is it failing
how bad is it
what changed
how to recover
how to prevent recurrence
```

---

# Recommended Observability Flow

```mermaid
sequenceDiagram
    participant User as User / Customer
    participant App as CLARA Application
    participant Telemetry as Telemetry Pipeline
    participant Dashboard as Dashboard
    participant Alert as Alert/Review Signal
    participant Owner as Service Owner

    User->>App: Performs workflow
    App->>Telemetry: Emits safe logs, metrics, traces
    Telemetry->>Dashboard: Aggregates health and impact
    Telemetry->>Alert: Triggers actionable signal if threshold breached
    Alert->>Owner: Routes to owner with runbook
    Owner-->>Dashboard: Validates impact and recovery
```

---

# Production-Ready Checklist

- [ ] User-impact signal is defined.
- [ ] Owner is assigned.
- [ ] Logs are structured and safe.
- [ ] Metrics are defined.
- [ ] Trace/correlation ID is propagated.
- [ ] Dashboard exists or is planned.
- [ ] Alert/review signal is actionable.
- [ ] Runbook is linked.
- [ ] Telemetry access is permission-controlled.
- [ ] Sensitive data is redacted/minimized.

---

# Acceptance Criteria

- [ ] Observability goal is clear.
- [ ] Telemetry sources are clear.
- [ ] User-impact mapping is clear.
- [ ] Dashboard and alert expectations are clear.
- [ ] Security/privacy boundaries are clear.
- [ ] Operational owner can act on the signal.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Logging full customer messages by default.
- Logging secrets, tokens, API keys, or credentials.
- Dashboards with no owner.
- Alerts without runbooks.
- Metrics that do not connect to user impact.
- No correlation ID across async jobs.
- Only monitoring infrastructure and not product workflows.
- Treating AI/integration observability as optional.
- Keeping noisy alerts that everyone ignores.
- Storing telemetry forever without retention decision.

---

# Related Documents

- ../PART-01-Operations-Foundation/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/PART-07-Audit-Evidence-and-Compliance-Readiness/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/PART-08-Incident-Response-and-Business-Continuity-Governance/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/PART-05-AI-Governance-and-Model-Risk/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/PART-06-Integration-and-Third-Party-Governance/README.md

---

# Navigation

**Previous:** `19-Alerting-Philosophy-and-Signal-Quality.md`

**Next:** `21-AI-Observability.md`

---

# Critical User Workflows

Monitor user-impact for:

```text
login/session
inbox load
conversation read
reply draft/send
ticket create/update
customer search
knowledge search
AI draft generation
integration message ingestion
attachment upload/download
export generation
```

---

# User-Impact Metrics

Examples:

```text
workflow success rate
workflow latency
workflow error rate
failed send count
message ingestion delay
ticket update failure rate
AI draft generation failure rate
search empty/error rate
```

---

# User Impact Rule

Infrastructure can be green while product workflows are red.

User-impact signals win.
