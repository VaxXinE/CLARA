---
book: "Book VII — Operations, Observability & Reliability"
part: "BOOK-07 Master Index"
title: "BOOK-07 Operational Security Map"
version: "1.0.0"
status: "official"
owner: "CLARA Operations Team"
last_updated: "2026-07-07"
classification: "book-07-master-index"
project: "CLARA"
---

# BOOK-07 Operational Security Map

> *"Operational security protects the control plane of production."*

---

# Purpose

This document maps operational security across production access, secrets, deployments, runtime hardening, monitoring, vulnerability operations, incidents, evidence, and review cadence.

---

# Operational Security Flow

```mermaid
flowchart TD
    Access[Production Access] --> IAM[Least Privilege / Approval]
    IAM --> Privileged[Privileged Actions]
    Privileged --> Audit[Audit Evidence]
    Secrets[Secrets and Credentials] --> SecretMgr[Secret Manager]
    SecretMgr --> Rotation[Rotation / Revocation]
    Deploy[Deployment Pipeline] --> SecureRelease[Secure Deployment Controls]
    Runtime[Runtime Systems] --> Hardening[Runtime Hardening]
    Monitoring[Security Monitoring] --> Detection[Detections and Alerts]
    Detection --> SecIncident[Security Incident Coordination]
    Vuln[Vulnerability Findings] --> Patch[Patch and Verify]
    Audit --> Review[Security Ops Review]
    Rotation --> Review
    SecureRelease --> Review
    Hardening --> Review
    SecIncident --> Review
    Patch --> Review
```

---

# Core Operational Security Controls

```text
least privilege production access
no shared accounts
break-glass process
service account ownership
secret manager usage
secret rotation and revocation
secure CI/CD
environment separation
runtime hardening
security monitoring
vulnerability remediation
security incident coordination
operational audit evidence
review cadence
```

---

# High-Risk Operations

Require strong controls for:

```text
database console access
manual data mutation
secret access or rotation
backup/restore operation
production shell access
deployment approval
feature flag emergency override
customer data export
security incident containment
dead-letter replay with side effects
```

---

# Evidence Requirements

Track:

```text
access reviews
privileged action logs
break-glass usage
secret rotations
deployment approvals
vulnerability remediation
security detections
incident timelines
runtime hardening reviews
patch verification
```

---

# Security Rule

Do not make operations easier by making production access broader.
