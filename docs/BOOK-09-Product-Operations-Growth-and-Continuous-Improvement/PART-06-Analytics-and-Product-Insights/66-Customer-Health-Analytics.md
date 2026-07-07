---
book: "Book IX — Product Operations, Growth & Continuous Improvement"
part: "PART-06 — Analytics and Product Insights"
chapter: "66"
title: "Customer Health Analytics"
version: "1.0.0"
status: "official"
owner: "CLARA Analytics and Product Operations Team"
last_updated: "2026-07-07"
classification: "analytics-product-insights"
previous: "65-Funnel-and-Retention-Analysis.md"
next: "67-Support-and-Product-Quality-Analytics.md"
project: "CLARA"
---

# Customer Health Analytics

> *"Defines customer health analytics across activation, usage, support, billing, reliability, integration health, AI quality, and engagement."*

---

# Purpose

Defines customer health analytics across activation, usage, support, billing, reliability, integration health, AI quality, and engagement.

---

# Analytics Problem

Customer health cannot be understood from usage alone.

---

# Analytics Decision

## Decision

CLARA customer health analytics should help teams identify healthy, stuck, at-risk, critical, and expansion-ready customers.

## Status

Accepted.

---

# Analytics Rule

Every CLARA analytics initiative should connect:

```text
Business/Product Question -> Event/Metric Definition -> Data Quality Check -> Dashboard/Analysis -> Insight -> Decision -> Owner -> Follow-Up Validation
```

An analytics artifact is not mature if it cannot answer:

```text
what question it answers
what events/metrics it uses
who owns the definition
how data quality is checked
what decision it supports
what action should happen when it changes
what privacy/security constraints apply
how results are documented
```

---

# Recommended Analytics Flow

```mermaid
sequenceDiagram
    participant Product as Product Ops
    participant Data as Analytics
    participant App as Product Instrumentation
    participant Support as Support/Success
    participant Revenue as Revenue Ops
    participant Review as Review Cadence

    Product->>Data: Defines operating question
    Data->>App: Defines required events/properties
    App->>Data: Emits validated product signals
    Support->>Data: Provides support/customer themes
    Revenue->>Data: Provides billing/revenue signals
    Data->>Review: Produces dashboard/analysis
    Review-->>Product: Decision, experiment, roadmap, or action
```

---

# Production-Ready Checklist

- [ ] Analytics question is defined.
- [ ] Event taxonomy is documented.
- [ ] Metric owner is assigned.
- [ ] Data source is known.
- [ ] Privacy/security review is considered.
- [ ] Data quality checks exist.
- [ ] Dashboard has audience and owner.
- [ ] Insight maps to action.
- [ ] Decision record is created where needed.
- [ ] Follow-up validation is scheduled.

---

# Acceptance Criteria

- [ ] Analytics supports real decisions.
- [ ] Metrics have consistent definitions.
- [ ] Dashboards have owners.
- [ ] Data quality is reviewed.
- [ ] Privacy is preserved.
- [ ] Customer value and trust are included.
- [ ] AI coding assistants can apply this safely.

---

# Anti-patterns

Avoid:

- Vanity metrics.
- Event sprawl.
- Dashboards with no audience.
- Metrics with no owner.
- Different teams using different definitions for the same metric.
- Collecting raw sensitive data unnecessarily.
- Drawing conclusions from tiny or biased cohorts.
- Treating correlation as causation.
- Ignoring support/customer qualitative evidence.
- Insight reports that create no decision.

---

# Related Documents

- ../PART-01-Product-Operations-Foundation/README.md
- ../PART-03-Support-Operations-and-Knowledge-Loop/README.md
- ../PART-04-Growth-Experiments-and-Activation/README.md
- ../PART-05-Billing-Packaging-and-Monetization-Operations/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/
- ../../BOOK-07-Operations-Observability-and-Reliability/
- ../../BOOK-08-Implementation-Delivery-and-Production-Launch/

---

# Navigation

**Previous:** `65-Funnel-and-Retention-Analysis.md`

**Next:** `67-Support-and-Product-Quality-Analytics.md`

---

# Health Score Inputs

Customer health should include:

```text
activation completion
usage frequency
workflow completion
team adoption
integration health
AI acceptance/rejection
support ticket severity
incident impact
billing status
feedback sentiment
feature adoption
```

---

# Health States

Use:

```text
healthy
watch
at_risk
critical
expansion_ready
unknown
```

---

# Health Analytics Flow

```mermaid
flowchart TD
    Usage[Usage Signals] --> Health[Customer Health]
    Support[Support Signals] --> Health
    Billing[Billing Signals] --> Health
    Reliability[Reliability Impact] --> Health
    AI[AI Quality Signals] --> Health
    Integration[Integration Health] --> Health
    Health --> Action[Success / Support / Product Action]
```

---

# Health Rule

Customer health score should trigger owned action, not just appear in dashboards.
