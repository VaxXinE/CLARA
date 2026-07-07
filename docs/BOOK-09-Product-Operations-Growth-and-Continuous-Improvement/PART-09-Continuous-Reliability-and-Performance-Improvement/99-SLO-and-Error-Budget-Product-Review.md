---
book: "Book IX — Product Operations, Growth & Continuous Improvement"
part: "PART-09 — Continuous Reliability and Performance Improvement"
chapter: "99"
title: "SLO and Error Budget Product Review"
version: "1.0.0"
status: "official"
owner: "CLARA Reliability and Performance Operations Team"
last_updated: "2026-07-07"
classification: "continuous-reliability-performance-improvement"
previous: "98-Reliability-Feedback-Loop.md"
next: "100-Performance-Review-Cadence.md"
project: "CLARA"
---

# SLO and Error Budget Product Review

> *"Defines how SLOs, SLIs, error budgets, burn rates, reliability targets, customer journeys, and product decisions are reviewed together."*

---

# Purpose

Defines how SLOs, SLIs, error budgets, burn rates, reliability targets, customer journeys, and product decisions are reviewed together.

---

# Reliability and Performance Problem

SLOs lose value when they are treated as engineering dashboards instead of product decision inputs.

---

# Reliability and Performance Decision

## Decision

CLARA should use SLO and error budget reviews to balance feature delivery, reliability investment, customer trust, and operational risk.

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

**Previous:** `98-Reliability-Feedback-Loop.md`

**Next:** `100-Performance-Review-Cadence.md`

---

# SLO Review Inputs

Review:

```text
critical user journey
SLI
SLO target
actual performance
error budget remaining
burn rate
customer impact
incident correlation
support correlation
planned feature/reliability trade-off
```

---

# Error Budget Decisions

Possible decisions:

```text
continue feature delivery
slow feature delivery
prioritize reliability hardening
freeze risky changes
increase testing/validation
review architecture bottleneck
adjust SLO if target is unrealistic or misaligned
```

---

# SLO Review Flow

```mermaid
flowchart TD
    Report[SLO Report] --> Burn[Error Budget Burn Review]
    Burn --> Impact[Customer Impact Review]
    Impact --> Decision{Budget Healthy?}
    Decision -- Yes --> Continue[Continue Planned Work]
    Decision -- No --> Hardening[Prioritize Reliability Work]
    Hardening --> Roadmap[Roadmap/Backlog Update]
```

---

# SLO Rule

Error budget is a product decision tool, not just an engineering metric.
