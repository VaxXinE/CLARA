---
book: "Book IX — Product Operations, Growth & Continuous Improvement"
part: "PART-06 — Analytics and Product Insights"
chapter: "65"
title: "Funnel and Retention Analysis"
version: "1.0.0"
status: "official"
owner: "CLARA Analytics and Product Operations Team"
last_updated: "2026-07-07"
classification: "analytics-product-insights"
previous: "64-Dashboard-Strategy.md"
next: "66-Customer-Health-Analytics.md"
project: "CLARA"
---

# Funnel and Retention Analysis

> *"Defines funnel analysis, activation drop-off, cohort retention, conversion paths, repeat usage, lifecycle progress, and interpretation rules."*

---

# Purpose

Defines funnel analysis, activation drop-off, cohort retention, conversion paths, repeat usage, lifecycle progress, and interpretation rules.

---

# Analytics Problem

Growth metrics are incomplete if they only measure signup and ignore activation and retention.

---

# Analytics Decision

## Decision

CLARA funnel and retention analysis should identify where customers fail to reach or sustain value.

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

**Previous:** `64-Dashboard-Strategy.md`

**Next:** `66-Customer-Health-Analytics.md`

---

# Funnel Types

Analyze:

```text
signup to workspace creation
workspace creation to team invite
team invite to integration connection
integration connection to first value
first value to repeat usage
trial to paid
paid to retained
```

---

# Retention Cohorts

Track cohorts by:

```text
signup week/month
activation date
plan type
customer segment
integration type
AI enabled status
onboarding version
acquisition source
```

---

# Funnel Map

```mermaid
flowchart LR
    Signup --> Workspace[Workspace Created]
    Workspace --> Integration[Integration Connected]
    Integration --> FirstValue[First Value]
    FirstValue --> Repeat[Repeat Usage]
    Repeat --> Retention[Retained]
    Retention --> Expansion[Expansion]
```

---

# Funnel Rule

A funnel drop-off should trigger investigation into product friction, support themes, reliability, trust, or customer fit.
