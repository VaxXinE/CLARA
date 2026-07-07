---
book: "Book VI — Security, Governance & Compliance"
part: "BOOK-06-MASTER-INDEX"
title: "BOOK-06-POLICY-MAP"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "book-master-index"
project: "CLARA"
---

# BOOK-06-POLICY-MAP

> *"Policies define what must be true. Controls and evidence prove whether it is true."*

---

# Core Policy Set

| Policy | Primary Source | Core Enforcement Area |
|---|---|---|
| Access Control Policy | Part 02 Chapter 14 | RBAC, scope, admin access, access review |
| Data Protection and Privacy Policy | Part 02 Chapter 15 | classification, minimization, retention, exports |
| Secure Development Policy | Part 02 Chapter 16 | SDLC gates, review, tests, dependency review |
| Secrets Management Policy | Part 02 Chapter 17 | credentials, API keys, secret storage, rotation |
| Logging Audit and Evidence Policy | Part 02 Chapter 18 | logs, audit events, evidence retention |
| AI Usage and Governance Policy | Part 02 Chapter 19 | AI Gateway, prompt/context/review/eval/audit |
| Integration and Third Party Security Policy | Part 02 Chapter 20 | webhooks, providers, credentials, data sharing |
| Incident Response Policy | Part 02 Chapter 21 | declaration, severity, containment, postmortem |
| Vulnerability and Patch Management Policy | Part 02 Chapter 22 | vuln intake, triage, remediation, closure |
| Policy Exception and Risk Acceptance Process | Part 02 Chapter 23 | exceptions, approvals, expiry, compensating controls |

---

# Policy to Governance Mapping

```mermaid
flowchart LR
    AccessPolicy[Access Control Policy] --> AccessGov[Part 03 Access Governance]
    DataPolicy[Data Protection Policy] --> DataGov[Part 04 Data Governance]
    AIPolicy[AI Governance Policy] --> AIGov[Part 05 AI Governance]
    IntegrationPolicy[Integration Policy] --> ThirdPartyGov[Part 06 Third Party Governance]
    LoggingPolicy[Logging/Audit Policy] --> EvidenceGov[Part 07 Evidence Readiness]
    IncidentPolicy[Incident Response Policy] --> IncidentGov[Part 08 Incident Governance]
    SDLCPolicy[Secure Development Policy] --> SDLCGov[Part 09 Secure SDLC]
    RiskPolicy[Risk Acceptance Process] --> RiskGov[Part 10 Risk Mapping]
```

---

# Policy Lifecycle

```text
draft
review
approve
publish
communicate
implement controls
collect evidence
review
update
retire/supersede
```

---

# Policy Anti-Pattern

```text
policy without owner
policy without control mapping
policy without evidence
policy without exception process
policy without review cadence
```
