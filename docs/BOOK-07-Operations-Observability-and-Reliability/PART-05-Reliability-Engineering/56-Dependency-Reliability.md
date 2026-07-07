---
book: "Book VII — Operations, Observability & Reliability"
part: "PART-05 — Reliability Engineering"
chapter: "56"
title: "Dependency Reliability"
version: "1.0.0"
status: "official"
owner: "CLARA Operations Team"
last_updated: "2026-07-07"
classification: "reliability-engineering"
previous: "55-Idempotency-and-Consistency.md"
next: "57-Queue-and-Async-Reliability.md"
project: "CLARA"
---

# Dependency Reliability

> *"Defines how CLARA evaluates, monitors, isolates, and recovers from dependency failures across databases, caches, providers, storage, AI, and third-party services."*

---

# Purpose

Defines how CLARA evaluates, monitors, isolates, and recovers from dependency failures across databases, caches, providers, storage, AI, and third-party services.

---

# Reliability Problem

Production reliability is often limited by the weakest dependency.

---

# Reliability Decision

## Decision

CLARA should treat dependencies as unreliable by default and design isolation, monitoring, fallbacks, and recovery around them.

## Status

Accepted.

---

# Reliability Rule

Every critical CLARA workflow must be designed as:

```text
Critical Journey -> Dependencies -> Failure Modes -> Detection -> Degradation/Fallback -> Recovery -> Evidence -> Improvement
```

A workflow is not reliable if the team cannot answer:

```text
what can fail
how users are affected
how failure is detected
how failure is contained
how the system degrades
how recovery happens
how duplicate actions are prevented
how the lesson improves the system
```

---

# Recommended Reliability Flow

```mermaid
sequenceDiagram
    participant User as User Workflow
    participant App as CLARA Service
    participant Dep as Dependency
    participant Obs as Observability
    participant Ops as Operations
    participant Improve as Improvement Backlog

    User->>App: Performs critical action
    App->>Dep: Calls dependency with timeout/retry policy
    Dep-->>App: Success or failure
    App->>Obs: Emits health, latency, error, fallback signals
    Obs->>Ops: Alerts/reports user impact
    Ops->>Improve: Creates reliability improvement after incident/review
```

---

# Production-Ready Checklist

- [ ] Critical user journey is identified.
- [ ] Dependencies are listed.
- [ ] Failure modes are documented.
- [ ] Detection signals exist.
- [ ] Timeout/retry behavior is defined.
- [ ] Idempotency is defined where retries/replays are possible.
- [ ] Graceful degradation/fallback exists where practical.
- [ ] Runbook exists for known failures.
- [ ] Recovery validation is defined.
- [ ] Post-incident improvement path exists.

---

# Acceptance Criteria

- [ ] Reliability goal is clear.
- [ ] User-impact mapping is clear.
- [ ] Failure modes are clear.
- [ ] Mitigation and fallback are clear.
- [ ] Observability and alerting are clear.
- [ ] Security/privacy is not weakened by fallback.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Infinite retries.
- No timeout on provider calls.
- Retrying non-idempotent mutations.
- Taking down core workflows because optional feature fails.
- One dependency failure cascading across all services.
- Ignoring queue backlog until users complain.
- Manual recovery steps with no runbook.
- AI/provider failure blocking human workflow.
- Webhook duplicates creating duplicate customer messages.
- Reliability fixes without tests or observability.

---

# Related Documents

- ../PART-02-Observability-Strategy/README.md
- ../PART-03-Logging-and-Metrics/README.md
- ../PART-04-Alerting-and-Incident-Operations/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/PART-08-Incident-Response-and-Business-Continuity-Governance/README.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-10-DevOps-and-Release-Execution/README.md

---

# Navigation

**Previous:** `55-Idempotency-and-Consistency.md`

**Next:** `57-Queue-and-Async-Reliability.md`

---

# Dependency Categories

CLARA dependencies include:

```text
database
cache
queue/broker
object storage
AI provider
email/WhatsApp/social provider
auth/session provider
monitoring/logging provider
billing provider
CI/CD/deployment system
```

---

# Dependency Reliability Record

```markdown
## Dependency

Name:
Purpose:
Criticality:
Owner:
Failure impact:
Timeout:
Retry:
Fallback:
Monitoring:
Runbook:
SLA/SLO expectation:
```

---

# Isolation Strategies

Use:

```text
timeouts
bulkheads
queue buffering
circuit breakers
rate limiting
fallback mode
feature flags
provider health checks
```
