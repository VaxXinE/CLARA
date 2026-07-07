---
book: "Book VII — Operations, Observability & Reliability"
part: "PART-03 — Logging and Metrics"
chapter: "32"
title: "Queue and Worker Metrics"
version: "1.0.0"
status: "official"
owner: "CLARA Operations Team"
last_updated: "2026-07-07"
classification: "logging-metrics"
previous: "31-Database-and-Storage-Metrics.md"
next: "33-AI-Logging-and-Metrics.md"
project: "CLARA"
---

# Queue and Worker Metrics

> *"Defines metrics for background jobs, queue depth, processing latency, retries, dead-letter queues, worker failures, and scheduled tasks."*

---

# Purpose

Defines metrics for background jobs, queue depth, processing latency, retries, dead-letter queues, worker failures, and scheduled tasks.

---

# Operational Problem

Async failures are easy to miss because they do not always fail the original request.

---

# Operational Decision

## Decision

CLARA queue and worker metrics should make async workflow health visible before delays become customer-impacting incidents.

## Status

Accepted.

---

# Logging and Metrics Rule

Every critical CLARA capability should define:

```text
events to log
metrics to emit
correlation fields
safe context fields
dashboard usage
alert usage
retention expectation
owner
```

Telemetry is production data and must be treated with security and privacy discipline.

---

# Recommended Telemetry Flow

```mermaid
sequenceDiagram
    participant Service as CLARA Service
    participant Logger as Structured Logger
    participant Metrics as Metrics Client
    participant Collector as Telemetry Collector
    participant Store as Observability Store
    participant Owner as Service Owner

    Service->>Logger: Emit structured safe event
    Service->>Metrics: Emit metric with bounded labels
    Logger->>Collector: Send logs
    Metrics->>Collector: Send metrics
    Collector->>Store: Normalize, redact, store
    Owner->>Store: Investigate dashboards/alerts/incidents
```

---

# Production-Ready Checklist

- [ ] Structured logging format is used.
- [ ] Correlation/request IDs are included.
- [ ] Log level is appropriate.
- [ ] Sensitive data is redacted or excluded.
- [ ] Metric names follow convention.
- [ ] Metric labels are low-cardinality.
- [ ] User-impact metrics are defined where relevant.
- [ ] Dashboard/alert usage is clear.
- [ ] Owner is assigned.
- [ ] Retention/access expectation is clear.

---

# Acceptance Criteria

- [ ] Logging rules are clear.
- [ ] Metrics rules are clear.
- [ ] Naming and labels are consistent.
- [ ] Security/privacy requirements are clear.
- [ ] Operational owners can use the telemetry.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Raw unstructured production logs.
- Logging request/response bodies by default.
- Logging secrets, tokens, passwords, API keys, or OAuth credentials.
- Using user IDs, emails, or dynamic text as high-cardinality metric labels.
- Metrics with no unit.
- Alerts built from noisy/debug logs.
- Business metrics disconnected from technical metrics.
- AI telemetry that stores full prompts/outputs without justification.
- Integration telemetry that cannot trace event lifecycle.

---

# Related Documents

- ../PART-02-Observability-Strategy/README.md
- ../PART-01-Operations-Foundation/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/PART-07-Audit-Evidence-and-Compliance-Readiness/76-Audit-Log-Governance.md
- ../../BOOK-06-Security-Governance-and-Compliance/PART-05-AI-Governance-and-Model-Risk/58-AI-Audit-Evidence-and-Traceability.md
- ../../BOOK-06-Security-Governance-and-Compliance/PART-06-Integration-and-Third-Party-Governance/70-Integration-Monitoring-Evidence-and-Health-Governance.md

---

# Navigation

**Previous:** `31-Database-and-Storage-Metrics.md`

**Next:** `33-AI-Logging-and-Metrics.md`

---

# Required Queue/Worker Metrics

Track:

```text
queue_depth
queue_oldest_message_age_ms
queue_job_started_total
queue_job_completed_total
queue_job_failed_total
queue_job_retry_total
queue_job_dead_lettered_total
queue_job_duration_ms
worker_heartbeat
worker_crash_total
```

---

# Queue Labels

Use:

```text
queue_name
job_type
result
retryable
environment
```

Avoid high-cardinality job IDs as labels.

---

# Async Workflow Rule

Every important async workflow should expose:

```text
enqueued
started
completed
failed
retried
dead-lettered
latency
age/backlog
```
