---
book: "Book VII — Operations, Observability & Reliability"
part: "PART-05 — Reliability Engineering"
chapter: "55"
title: "Idempotency and Consistency"
version: "1.0.0"
status: "official"
owner: "CLARA Operations Team"
last_updated: "2026-07-07"
classification: "reliability-engineering"
previous: "54-Timeouts-Retries-and-Circuit-Breakers.md"
next: "56-Dependency-Reliability.md"
project: "CLARA"
---

# Idempotency and Consistency

> *"Defines idempotency, duplicate handling, consistency boundaries, replay safety, and safe mutation patterns for CLARA workflows."*

---

# Purpose

Defines idempotency, duplicate handling, consistency boundaries, replay safety, and safe mutation patterns for CLARA workflows.

---

# Reliability Problem

Retries and webhooks become dangerous when repeated actions create duplicate messages, duplicated tickets, or inconsistent records.

---

# Reliability Decision

## Decision

CLARA operations that may retry, replay, or receive duplicate external events should be idempotent and consistency-aware.

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

**Previous:** `54-Timeouts-Retries-and-Circuit-Breakers.md`

**Next:** `56-Dependency-Reliability.md`

---

# Idempotency Use Cases

Require idempotency for:

```text
webhook event processing
outbound message send
ticket creation from external event
payment/billing callbacks where applicable
background jobs
retryable writes
import/export jobs
AI workflow actions that mutate records
```

---

# Idempotency Record

Track:

```text
idempotency_key
operation_type
actor/provider
scope
request_hash where useful
result
created_at
expires_at
```

---

# Consistency Rule

Design workflows to handle:

```text
duplicate events
out-of-order events
partial success
retry after timeout
worker restart
transaction failure
```

---

# Mutation Rule

Never retry a mutation blindly unless it is idempotent or safely compensating.
