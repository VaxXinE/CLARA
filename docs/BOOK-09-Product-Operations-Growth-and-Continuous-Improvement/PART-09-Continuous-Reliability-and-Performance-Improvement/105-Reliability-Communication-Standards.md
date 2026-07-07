---
book: "Book IX — Product Operations, Growth & Continuous Improvement"
part: "PART-09 — Continuous Reliability and Performance Improvement"
chapter: "105"
title: "Reliability Communication Standards"
version: "1.0.0"
status: "official"
owner: "CLARA Reliability and Performance Operations Team"
last_updated: "2026-07-07"
classification: "continuous-reliability-performance-improvement"
previous: "104-Integration-and-AI-Reliability-Improvement.md"
next: "106-Reliability-and-Performance-Metrics.md"
project: "CLARA"
---

# Reliability Communication Standards

> *"Defines customer and internal communication standards for incidents, degraded performance, known reliability issues, maintenance, mitigation, and resolution updates."*

---

# Purpose

Defines customer and internal communication standards for incidents, degraded performance, known reliability issues, maintenance, mitigation, and resolution updates.

---

# Reliability and Performance Problem

Customers lose trust when reliability issues are communicated late, vaguely, or inconsistently.

---

# Reliability and Performance Decision

## Decision

CLARA reliability communication should be timely, factual, customer-impact-focused, and aligned with support, incident, product, and leadership workflows.

## Status

Accepted.

---

# Continuous Reliability Rule

Every CLARA reliability or performance improvement should connect:

```text
Signal -> Customer Impact -> SLO/Metric Review -> Root Cause/Constraint -> Owner -> Roadmap/Backlog Item -> Validation -> Runbook/Knowledge Update
```

A reliability operation is not mature if it cannot answer:

```text
which customer journey was affected
what customer impact occurred
which metric/SLO detected or missed it
what root cause or constraint exists
who owns remediation
what will prevent recurrence
how success will be validated
what runbook/dashboard/alert should be updated
```

---

# Recommended Reliability Improvement Flow

```mermaid
sequenceDiagram
    participant Signal as Alert/Support/Metric
    participant Ops as Reliability Ops
    participant Product as Product Ops
    participant Eng as Engineering
    participant Support as Support/Success
    participant Roadmap as Roadmap Review
    participant Evidence as Evidence/Runbooks

    Signal->>Ops: Reliability/performance signal
    Ops->>Product: Map to customer impact
    Ops->>Eng: Investigate root cause or constraint
    Support->>Product: Provide customer/support impact
    Product->>Roadmap: Prioritize improvement
    Eng->>Evidence: Update runbook/dashboard/alert after fix
    Ops->>Product: Validate improved reliability metric
```

---

# Production-Ready Checklist

- [ ] Customer-impact signal is captured.
- [ ] Affected workflow is identified.
- [ ] Metric/SLO impact is reviewed.
- [ ] Root cause or bottleneck is documented.
- [ ] Owner is assigned.
- [ ] Improvement item is linked to roadmap/backlog.
- [ ] Validation metric is defined.
- [ ] Runbook/dashboard/alert updates are identified.
- [ ] Support/customer communication path is clear.
- [ ] Follow-up review is scheduled.

---

# Acceptance Criteria

- [ ] Reliability work is customer-impact driven.
- [ ] SLOs inform product decisions.
- [ ] Performance regressions are reviewed.
- [ ] Capacity risks are visible.
- [ ] Incidents feed roadmap improvements.
- [ ] External dependency reliability is managed.
- [ ] AI coding assistants can apply this safely.

---

# Anti-patterns

Avoid:

- Measuring uptime only.
- Ignoring customer-specific impact.
- Postmortem action items with no owner.
- Alert fatigue.
- Unbounded retries.
- No capacity planning.
- Performance regressions treated as minor forever.
- Integration failures blamed on providers without mitigation.
- AI degraded mode missing.
- Customers receiving no clear update during degradation.

---

# Related Documents

- ../PART-08-Continuous-Security-and-Compliance-Operations/README.md
- ../../BOOK-07-Operations-Observability-and-Reliability/
- ../../BOOK-08-Implementation-Delivery-and-Production-Launch/
- ../PART-06-Analytics-and-Product-Insights/README.md
- ../PART-07-Feedback-Prioritization-and-Roadmap-Operations/README.md

---

# Navigation

**Previous:** `104-Integration-and-AI-Reliability-Improvement.md`

**Next:** `106-Reliability-and-Performance-Metrics.md`

---

# Communication Types

Reliability communication includes:

```text
incident update
degraded performance notice
maintenance notice
known issue update
post-incident summary
customer-specific impact update
workaround guidance
resolution confirmation
```

---

# Communication Content

Include:

```text
what is affected
who is affected where known
current status
workaround if available
next update timing
what customer should do
resolution/mitigation when available
```

---

# Communication Flow

```mermaid
flowchart TD
    Issue[Reliability Issue] --> Assess[Assess Customer Impact]
    Assess --> Internal[Internal Update]
    Assess --> External{Customer Communication Needed?}
    External -- Yes --> Approved[Approved Customer Message]
    Approved --> Support[Support/Success Updates]
    Approved --> Status[Status/Trust Channel]
    External -- No --> Monitor[Monitor Internally]
```

---

# Communication Rule

Reliability communication should be honest about impact and clear about next update.
