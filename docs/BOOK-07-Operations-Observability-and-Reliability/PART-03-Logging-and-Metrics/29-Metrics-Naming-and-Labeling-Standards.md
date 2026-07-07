---
book: "Book VII — Operations, Observability & Reliability"
part: "PART-03 — Logging and Metrics"
chapter: "29"
title: "Metrics Naming and Labeling Standards"
version: "1.0.0"
status: "official"
owner: "CLARA Operations Team"
last_updated: "2026-07-07"
classification: "logging-metrics"
previous: "28-Log-Event-Taxonomy.md"
next: "30-API-and-Backend-Metrics.md"
project: "CLARA"
---

# Metrics Naming and Labeling Standards

> *"Defines metric naming, units, labels/tags, cardinality rules, aggregation strategy, and dashboard compatibility."*

---

# Purpose

Defines metric naming, units, labels/tags, cardinality rules, aggregation strategy, and dashboard compatibility.

---

# Operational Problem

Bad metric naming and high-cardinality labels can break observability systems and make dashboards expensive or useless.

---

# Operational Decision

## Decision

CLARA metrics should use predictable names and low-cardinality labels that support dashboards, alerts, SLOs, and investigations.

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

**Previous:** `28-Log-Event-Taxonomy.md`

**Next:** `30-API-and-Backend-Metrics.md`

---

# Metric Naming Standard

Use snake_case names with unit suffix where useful:

```text
http_request_duration_ms
http_requests_total
api_errors_total
db_query_duration_ms
queue_depth
queue_job_duration_ms
ai_request_duration_ms
integration_webhook_events_total
workflow_reply_send_success_total
```

---

# Label Rules

Good labels:

```text
service
environment
route_template
method
status_class
provider
connector_type
queue_name
job_type
result
```

Avoid labels with:

```text
email
raw user input
full URL with query params
conversation_id
ticket_id
request_id
high-cardinality dynamic text
```

---

# Cardinality Rule

Labels should group behavior, not uniquely identify every event.
