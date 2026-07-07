---
book: "Book VII — Operations, Observability & Reliability"
part: "PART-11 — Operational Security"
chapter: "126"
title: "Runtime Hardening"
version: "1.0.0"
status: "official"
owner: "CLARA Operations Team"
last_updated: "2026-07-07"
classification: "operational-security"
previous: "125-Secure-Deployment-Operations.md"
next: "127-Security-Monitoring-and-Detection-Operations.md"
project: "CLARA"
---

# Runtime Hardening

> *"Defines runtime hardening expectations for application processes, containers, hosts, network boundaries, configuration, dependency execution, and secure defaults."*

---

# Purpose

Defines runtime hardening expectations for application processes, containers, hosts, network boundaries, configuration, dependency execution, and secure defaults.

---

# Security Operations Problem

Runtime misconfiguration can turn small vulnerabilities into production compromise.

---

# Security Operations Decision

## Decision

CLARA runtime systems should run with minimal privileges, restricted attack surface, hardened configuration, and observable security posture.

## Status

Accepted.

---

# Operational Security Rule

Every production security-sensitive operation must be governed as:

```text
Action -> Owner -> Authorization -> Execution -> Audit Evidence -> Monitoring -> Review -> Improvement
```

A production operation is not secure if the team cannot answer:

```text
who is allowed to do it
why access is needed
what approval is required
how action is logged
how misuse is detected
how rollback/containment works
how evidence is retained
how access is reviewed
```

---

# Recommended Security Operations Flow

```mermaid
sequenceDiagram
    participant User as Operator/Engineer
    participant IAM as Access Control
    participant Prod as Production System
    participant Monitor as Security Monitoring
    participant Evidence as Evidence Repository
    participant Review as Security Ops Review

    User->>IAM: Requests/uses approved access
    IAM->>Prod: Grants scoped action
    Prod->>Monitor: Emits security-relevant events
    Monitor->>Evidence: Records alerts/logs/actions
    Review->>Evidence: Reviews control operation
    Review-->>IAM: Updates access/control if needed
```

---

# Production-Ready Checklist

- [ ] Owner is assigned.
- [ ] Required access is defined.
- [ ] Least privilege is applied.
- [ ] Approval path is defined for privileged actions.
- [ ] Audit evidence is captured.
- [ ] Monitoring/detection exists where relevant.
- [ ] Secrets are protected.
- [ ] Runtime configuration is secure.
- [ ] Incident containment path exists.
- [ ] Review cadence is defined.

---

# Acceptance Criteria

- [ ] Security-sensitive operation is clear.
- [ ] Access and approval are clear.
- [ ] Audit evidence is clear.
- [ ] Monitoring and detection expectations are clear.
- [ ] Incident coordination is clear.
- [ ] Review cadence is clear.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Shared production accounts.
- Permanent broad admin access.
- Hard-coded secrets.
- Secrets in logs, tickets, docs, or screenshots.
- Deployment from untrusted machines.
- Production debug mode enabled.
- Unreviewed pipeline changes.
- Security alerts with no owner.
- Vulnerability tickets with no due date.
- Destroying evidence during incident response.

---

# Related Documents

- ../PART-10-SLOs-SLIs-and-Error-Budgets/README.md
- ../PART-04-Alerting-and-Incident-Operations/README.md
- ../PART-07-Backup-Restore-and-Disaster-Recovery/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/PART-02-Security-Policies-and-Standards/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/PART-03-Identity-and-Access-Governance/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/PART-08-Incident-Response-and-Business-Continuity-Governance/README.md

---

# Navigation

**Previous:** `125-Secure-Deployment-Operations.md`

**Next:** `127-Security-Monitoring-and-Detection-Operations.md`

---

# Runtime Hardening Areas

Harden:

```text
application config
container/runtime permissions
host permissions
network exposure
TLS settings
debug endpoints
admin endpoints
file permissions
dependency execution
logging behavior
rate limits
resource limits
```

---

# Runtime Security Checklist

- [ ] Debug mode disabled.
- [ ] Admin endpoints protected.
- [ ] TLS enforced where applicable.
- [ ] Minimal runtime permissions.
- [ ] Environment variables scoped.
- [ ] Secrets loaded from secret manager.
- [ ] Resource limits configured.
- [ ] Unused ports/services disabled.
- [ ] Security headers configured where applicable.
- [ ] Logs exclude sensitive content.

---

# Hardening Rule

Production should fail closed where practical.
