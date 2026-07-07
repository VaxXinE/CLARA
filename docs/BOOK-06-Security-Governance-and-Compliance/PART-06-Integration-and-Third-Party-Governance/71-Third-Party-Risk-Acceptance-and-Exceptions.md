---
book: "Book VI — Security, Governance & Compliance"
part: "PART-06 — Integration and Third Party Governance"
chapter: "71"
title: "Third Party Risk Acceptance and Exceptions"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "integration-third-party-governance"
previous: "70-Integration-Monitoring-Evidence-and-Health-Governance.md"
next: "72-Part-06-Summary.md"
project: "CLARA"
---

# Third Party Risk Acceptance and Exceptions

> *"Defines governance for accepting third-party risk, documenting provider limitations, temporary exceptions, compensating controls, and review dates."*

---

# Purpose

Defines governance for accepting third-party risk, documenting provider limitations, temporary exceptions, compensating controls, and review dates.

---

# Governance Problem

Informal vendor exceptions can turn into permanent weak points in CLARA's security posture.

---

# Governance Decision

## Decision

CLARA third-party risk acceptance must be explicit, owned, time-bound where possible, reviewed, and linked to compensating controls.

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

**Previous:** `70-Integration-Monitoring-Evidence-and-Health-Governance.md`

**Next:** `72-Part-06-Summary.md`

---

# Third-Party Risk Acceptance Template

```markdown
# Third Party Risk Acceptance

## Provider / Connector
Name.

## Risk
What risk is being accepted.

## Impact
What could happen.

## Compensating Controls
What reduces risk.

## Owner
Who owns follow-up.

## Approved By
Approver.

## Expiration / Review Date
When to revisit.

## Evidence
Links/checklists/logs.

## Status
Open / Accepted / Expired / Closed
```

---

# Exception Examples

```text
provider does not support webhook signature
provider has limited audit logs
provider requires broader OAuth scope than desired
provider lacks sandbox environment
temporary manual credential rotation
```

---

# Rule

High/Critical third-party risk acceptance must be explicit and reviewed.
