---
book: "Book VI — Security, Governance & Compliance"
part: "PART-06 — Integration and Third Party Governance"
chapter: "63"
title: "Integration Risk Classification"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "integration-third-party-governance"
previous: "62-Third-Party-Inventory-and-Ownership.md"
next: "64-Provider-Onboarding-and-Security-Review.md"
project: "CLARA"
---

# Integration Risk Classification

> *"Defines how CLARA classifies integration and third-party risk based on data sensitivity, credential type, provider capability, customer impact, and operational dependency."*

---

# Purpose

Defines how CLARA classifies integration and third-party risk based on data sensitivity, credential type, provider capability, customer impact, and operational dependency.

---

# Governance Problem

A low-risk notification webhook is not the same as an integration that can read customer messages, send replies, or mutate business records.

---

# Governance Decision

## Decision

Every CLARA integration should be risk-classified before onboarding and before production release.

## Status

Accepted.

---

# Integration Governance Rule

Every CLARA integration or third-party dependency must be governed as:

```text
Provider -> Purpose -> Owner -> Risk Level -> Data Shared -> Credential Model -> Controls -> Monitoring -> Exit Plan
```

No integration should ship without:

```text
inventory record
owner
risk classification
authentication/credential model
data sharing review
validation/idempotency plan
monitoring and evidence
incident path
offboarding plan
```

---

# Recommended Governance Flow

```mermaid
sequenceDiagram
    participant Owner as Integration Owner
    participant Sec as Security/Privacy Review
    participant Eng as Engineering
    participant Provider as Third Party Provider
    participant Ops as Operations
    participant Evidence as Evidence Store

    Owner->>Sec: Proposes provider/connector
    Sec-->>Owner: Risk classification and required controls
    Owner->>Eng: Implements governed adapter and controls
    Eng->>Provider: Connects through approved credential model
    Provider-->>Eng: Sends/receives events/data
    Eng->>Ops: Emits health, logs, retries, failures
    Ops->>Evidence: Records review and operational evidence
```

---

# Secure-by-Design Checklist

- [ ] Third-party owner is assigned.
- [ ] Provider purpose is documented.
- [ ] Risk level is assigned.
- [ ] Data shared/received is documented.
- [ ] Credential model is secure.
- [ ] Webhook/API authentication exists where applicable.
- [ ] Payload validation exists.
- [ ] Idempotency is defined.
- [ ] Retry/failure handling is defined.
- [ ] Monitoring and health checks exist.
- [ ] Offboarding/revocation path exists.
- [ ] Risk acceptance is documented where needed.

---

# Acceptance Criteria

- [ ] Governance scope is clear.
- [ ] Third-party inventory fields are clear.
- [ ] Risk classification is clear.
- [ ] Credential and data sharing rules are clear.
- [ ] Monitoring and incident expectations are clear.
- [ ] Offboarding and exceptions are clear.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Adding provider integrations without owner.
- Storing raw provider secrets in normal database columns.
- Trusting webhook payloads without validation.
- Ignoring duplicate events.
- Logging full provider payloads by default.
- Sharing unnecessary customer data.
- No provider outage fallback.
- No connector removal process.
- No risk acceptance for weak provider controls.
- Direct product module calls to provider APIs outside Integration Gateway.

---

# Related Documents

- ../PART-02-Security-Policies-and-Standards/20-Integration-and-Third-Party-Security-Policy.md
- ../PART-04-Data-Protection-and-Privacy-Governance/67-Data-Sharing-and-Processing-Governance.md
- ../PART-05-AI-Governance-and-Model-Risk/56-Model-Provider-and-Third-Party-AI-Risk.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-07-Integration-Implementation-Plan/README.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-08-Security-Implementation-Plan/141-Integration-Security-Controls.md

---

# Navigation

**Previous:** `62-Third-Party-Inventory-and-Ownership.md`

**Next:** `64-Provider-Onboarding-and-Security-Review.md`

---

# Integration Risk Levels

| Risk | Description | Examples |
|---|---|---|
| Low | No sensitive data, low operational impact | status page webhook |
| Medium | Limited customer/business data or non-critical automation | analytics sync |
| High | Customer messages, CRM data, credentials, external actions | WhatsApp/email channel |
| Critical | Can send customer communication, mutate records, or access restricted data at scale | auto-send provider, privileged admin connector |

---

# Risk Factors

Increase risk when integration:

```text
uses customer messages
uses internal notes
can send replies
can create/update records
can export data
uses long-lived credentials
has broad OAuth scopes
is customer-facing
is required for critical workflow
```

---

# Risk Rule

High/Critical integrations require security review, monitoring, and explicit rollback/disable plan.
