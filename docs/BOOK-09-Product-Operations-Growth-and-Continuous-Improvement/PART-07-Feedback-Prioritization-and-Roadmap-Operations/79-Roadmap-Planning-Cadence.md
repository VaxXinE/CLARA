---
book: "Book IX — Product Operations, Growth & Continuous Improvement"
part: "PART-07 — Feedback Prioritization and Roadmap Operations"
chapter: "79"
title: "Roadmap Planning Cadence"
version: "1.0.0"
status: "official"
owner: "CLARA Product Operations Team"
last_updated: "2026-07-07"
classification: "feedback-prioritization-roadmap-operations"
previous: "78-Risk-and-Trust-Prioritization.md"
next: "80-Product-Decision-Records.md"
project: "CLARA"
---

# Roadmap Planning Cadence

> *"Defines roadmap review cadence, planning horizons, quarterly/monthly/weekly rhythm, stakeholder review, trade-off decisions, and change control."*

---

# Purpose

Defines roadmap review cadence, planning horizons, quarterly/monthly/weekly rhythm, stakeholder review, trade-off decisions, and change control.

---

# Roadmap Operations Problem

Roadmaps lose credibility when priorities change constantly without evidence or governance.

---

# Roadmap Operations Decision

## Decision

CLARA roadmap operations should run on a predictable cadence that separates strategy, planning, review, and execution updates.

## Status

Accepted.

---

# Roadmap Operations Rule

Every CLARA roadmap decision should connect:

```text
Feedback/Signal -> Evidence Score -> Impact Score -> Risk/Trust Score -> Effort/Dependency Review -> Decision -> Owner -> Roadmap/Backlog State -> Communication
```

A roadmap decision is not mature if it cannot answer:

```text
what evidence supports it
what customer segment is affected
what business outcome it supports
what trust/security/reliability risk exists
what trade-off is being made
who owns the decision
what was rejected or deferred
how success will be measured
how stakeholders will be informed
```

---

# Recommended Roadmap Flow

```mermaid
sequenceDiagram
    participant Source as Customer/Support/Analytics/Security/Revenue
    participant Intake as Feedback Intake
    participant Product as Product Ops
    participant Eng as Engineering
    participant Risk as Security/Ops/Trust
    participant Roadmap as Roadmap Review
    participant Comms as Communication

    Source->>Intake: Submit feedback/signal
    Intake->>Product: Classify and deduplicate
    Product->>Product: Score evidence and impact
    Product->>Risk: Review risk/trust/security impact
    Product->>Eng: Estimate effort/dependencies
    Product->>Roadmap: Present prioritized candidate
    Roadmap-->>Comms: Decision and communication guidance
```

---

# Production-Ready Checklist

- [ ] Feedback source is captured.
- [ ] Feedback category is assigned.
- [ ] Evidence quality is scored.
- [ ] Customer impact is scored.
- [ ] Business impact is scored.
- [ ] Risk/trust impact is scored.
- [ ] Effort/dependencies are reviewed.
- [ ] Decision owner is assigned.
- [ ] Roadmap/backlog state is updated.
- [ ] Communication plan exists where needed.
- [ ] Decision record is created for material decisions.

---

# Acceptance Criteria

- [ ] Feedback is not lost.
- [ ] Roadmap decisions are evidence-backed.
- [ ] Security and reliability work can be prioritized.
- [ ] Backlog stays actionable.
- [ ] Stakeholders understand decisions.
- [ ] AI coding assistants can apply this safely.

---

# Anti-patterns

Avoid:

- Roadmap by loudest voice.
- Sales-only prioritization.
- Engineering-only prioritization.
- Security/reliability always deferred.
- Feedback with no taxonomy.
- Backlog items with no owner.
- Decisions not documented.
- Overpromising roadmap dates.
- Ignoring support themes.
- Roadmap changing weekly without evidence.

---

# Related Documents

- ../PART-01-Product-Operations-Foundation/README.md
- ../PART-03-Support-Operations-and-Knowledge-Loop/README.md
- ../PART-06-Analytics-and-Product-Insights/README.md
- ../../BOOK-05-Engineering-Execution-Plan/
- ../../BOOK-06-Security-Governance-and-Compliance/
- ../../BOOK-07-Operations-Observability-and-Reliability/

---

# Navigation

**Previous:** `78-Risk-and-Trust-Prioritization.md`

**Next:** `80-Product-Decision-Records.md`

---

# Roadmap Cadence

Recommended cadence:

```text
weekly triage
biweekly prioritization review
monthly roadmap review
quarterly strategy planning
post-incident roadmap review
post-experiment roadmap review
launch/hardening roadmap review
```

---

# Planning Horizons

Use:

```text
now: current sprint/cycle
next: next cycle/month
later: future quarter
discovery: needs research
watchlist: monitor evidence
not planned: intentionally rejected/deferred
```

---

# Change Control

Roadmap changes should record:

```text
what changed
why it changed
who approved
what was displaced
customer/stakeholder impact
communication required
```

---

# Cadence Rule

Roadmap changes should be allowed, but not invisible.
