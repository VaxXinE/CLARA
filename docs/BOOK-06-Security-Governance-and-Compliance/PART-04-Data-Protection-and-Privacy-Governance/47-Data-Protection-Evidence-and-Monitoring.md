---
book: "Book VI — Security, Governance & Compliance"
part: "PART-04 — Data Protection and Privacy Governance"
chapter: "47"
title: "Data Protection Evidence and Monitoring"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "data-protection-privacy-governance"
previous: "46-Privacy-Review-and-DPIA-Lite-Process.md"
next: "48-Part-04-Summary.md"
project: "CLARA"
---

# Data Protection Evidence and Monitoring

> *"Defines evidence and monitoring requirements for data protection controls, exports, access reviews, retention jobs, AI context use, and privacy incidents."*

---

# Purpose

Defines evidence and monitoring requirements for data protection controls, exports, access reviews, retention jobs, AI context use, and privacy incidents.

---

# Governance Problem

Data protection claims are hard to prove without evidence and monitoring.

---

# Governance Decision

## Decision

CLARA should preserve evidence that data controls are working through logs, audit events, tests, reviews, retention reports, and incident records.

## Status

Accepted.

---

# Data Governance Rule

Every important CLARA data category must be governed as:

```text
Data Category -> Classification -> Owner -> Purpose -> Access Scope -> Retention -> Evidence
```

No sensitive data flow should exist without:

```text
owner
classification
legal/business purpose
access boundary
retention rule
export rule
audit/evidence source
```

---

# Recommended Governance Flow

```mermaid
sequenceDiagram
    participant Feature as Feature Owner
    participant Data as Data Owner
    participant Privacy as Privacy/Security Review
    participant Eng as Engineering
    participant Evidence as Evidence Store

    Feature->>Data: Proposes data collection/processing
    Data->>Privacy: Reviews classification, purpose, and risk
    Privacy-->>Feature: Approve, require mitigation, or reject
    Feature->>Eng: Implements scoped controls
    Eng->>Evidence: Records tests, audit events, retention/export evidence
```

---

# Secure-by-Design Checklist

- [ ] Data category is identified.
- [ ] Classification is assigned.
- [ ] Owner is assigned.
- [ ] Processing purpose is documented.
- [ ] Organization/workspace scope is defined.
- [ ] Access controls are defined.
- [ ] Retention/deletion behavior is defined.
- [ ] Export behavior is defined.
- [ ] AI/integration usage is reviewed if relevant.
- [ ] Evidence source is defined.
- [ ] Privacy risk is documented.

---

# Acceptance Criteria

- [ ] Governance process is clear.
- [ ] Data owner is clear.
- [ ] Data classification is clear.
- [ ] Access and retention expectations are clear.
- [ ] Export and AI usage expectations are clear where relevant.
- [ ] Evidence requirements are clear.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Collecting data without purpose.
- Keeping customer data forever by default.
- Using production customer data in development.
- Treating internal notes as normal customer-visible text.
- Sending full conversation history to AI by default.
- Exporting data without audit.
- Storing raw attachments without access control.
- Logging raw customer content unnecessarily.
- Leaving data ownership undefined.

---

# Related Documents

- ../PART-02-Security-Policies-and-Standards/15-Data-Protection-and-Privacy-Policy.md
- ../PART-03-Identity-and-Access-Governance/README.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-05-Database-and-Migration-Plan/README.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-06-AI-Implementation-Plan/README.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-08-Security-Implementation-Plan/README.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-AI-GOVERNANCE-MAP.md

---

# Navigation

**Previous:** `46-Privacy-Review-and-DPIA-Lite-Process.md`

**Next:** `48-Part-04-Summary.md`

---

# Evidence Sources

Data protection evidence may include:

```text
data inventory
classification records
access review records
RBAC tests
cross-scope tests
export audit logs
retention job logs
deletion request records
AI context tests
integration sharing review
incident reports
privacy review checklist
```

---

# Monitoring Signals

Monitor:

```text
large exports
repeated export attempts
failed access attempts to sensitive data
unusual attachment download patterns
AI context safety blocks
retention job failures
cross-workspace denied access
data deletion errors
```

---

# Evidence Rule

Evidence should be timestamped, owner-linked, and reviewable during audit or incident investigation.
