---
book: "Book IX — Product Operations, Growth & Continuous Improvement"
part: "PART-09 — Continuous Reliability and Performance Improvement"
chapter: "103"
title: "Customer Impact Reliability Analytics"
version: "1.0.0"
status: "official"
owner: "CLARA Reliability and Performance Operations Team"
last_updated: "2026-07-07"
classification: "continuous-reliability-performance-improvement"
previous: "102-Incident-to-Roadmap-Improvement.md"
next: "104-Integration-and-AI-Reliability-Improvement.md"
project: "CLARA"
---

# Customer Impact Reliability Analytics

> *"Defines analytics for reliability impact by customer, workspace, plan, segment, workflow, integration, AI feature, and support burden."*

---

# Purpose

Defines analytics for reliability impact by customer, workspace, plan, segment, workflow, integration, AI feature, and support burden.

---

# Reliability and Performance Problem

A system can look healthy technically while specific customers or workflows are suffering.

---

# Reliability and Performance Decision

## Decision

CLARA reliability analytics should measure customer impact, not only infrastructure symptoms.

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

**Previous:** `102-Incident-to-Roadmap-Improvement.md`

**Next:** `104-Integration-and-AI-Reliability-Improvement.md`

---

# Customer Impact Dimensions

Analyze impact by:

```text
customer/workspace
plan type
customer segment
workflow affected
integration type
AI feature usage
geography/timezone if relevant
support ticket correlation
revenue/customer success risk
```

---

# Customer Impact Metrics

Track:

```text
affected customer count
affected critical workflows
duration of degradation
failed workflow count
support tickets generated
customer health score movement
churn/renewal risk signal
compensation/SLA impact where applicable
```

---

# Customer Impact Map

```mermaid
flowchart TD
    TechnicalSignal[Technical Signal] --> Workflow[Workflow Impact]
    Workflow --> Customer[Customer Segment Impact]
    Customer --> Support[Support Burden]
    Customer --> Revenue[Revenue/Retention Risk]
    Customer --> Priority[Roadmap Priority]
```

---

# Customer Impact Rule

Reliability prioritization should be based on customer impact, not only technical severity.
