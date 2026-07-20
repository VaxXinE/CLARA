---
project: "CLARA"
artifact: "P10 Compliance Readiness Baseline"
status: "draft"
owner: "CLARA Product, Engineering, Security, and Operations"
classification: "security-policy"
---

# CLARA P10 Compliance Readiness Baseline

## Positioning

This document defines compliance readiness only. It is not certification and
must not be presented as SOC 2, ISO 27001, GDPR, HIPAA, or PCI certification.

## Baseline Categories

| Category | Readiness Evidence |
|---|---|
| Access control | Backend AuthContext, RBAC tests, least privilege review |
| Audit evidence | Safe audit events, correlation IDs, operator runbooks |
| Data protection | workspace-scoped access, data classification, redaction |
| Privacy | no raw customer messages, no raw provider payload, no raw webhook payload |
| Incident response | incident checklist, rollback notes, escalation owner |
| Retention | retention readiness and deletion readiness notes |
| Vendor boundary | provider payload minimization and secret handling |
| Operational readiness | production config guardrails and smoke validation |

## P10-PR-02 Readiness Evidence

P10-PR-02 adds runtime readiness evidence for tenant isolation and permission
audit boundaries:

- `GET /api/v1/enterprise/tenant-isolation/readiness`
- `GET /api/v1/enterprise/permission-audit/readiness`

Both endpoints are authenticated, workspace-scoped through Backend AuthContext,
read-only, least privilege aligned, and include no raw customer messages, no
raw provider payload, no raw webhook payload, no raw audit metadata, no access
token, no refresh token, no cookies, no auth headers, no API keys, and no
secrets.

## P10-PR-03 Readiness Evidence

P10-PR-03 adds compliance readiness evidence for Audit Retention, Data
Classification, Redaction Hardening, Sensitive Field Classifier, and safe audit
metadata:

- `GET /api/v1/enterprise/audit-retention/readiness`
- `GET /api/v1/enterprise/data-classification/readiness`
- `GET /api/v1/enterprise/redaction-hardening/readiness`

These endpoints are authenticated, workspace-scoped through Backend
AuthContext, read-only, and not certification. Client workspaceId is never
authority. They include no raw customer messages, no raw provider payload, no
raw webhook payload, no raw audit metadata, no access token, no refresh token,
no cookies, no auth headers, no permission mutation, no role mutation, no CRM
mutation, no outbound send, no real AI provider, no deletion automation, no
legal hold automation, and no report export.

## P10-PR-04 Readiness Evidence

P10-PR-04 adds compliance readiness evidence for Admin Security Controls,
Session Policy, and Compliance Dashboard:

- `GET /api/v1/enterprise/admin-security-controls/readiness`
- `GET /api/v1/enterprise/session-policy/readiness`
- `GET /api/v1/enterprise/compliance-dashboard`

These endpoints are authenticated, workspace-scoped through Backend
AuthContext, read-only, and not certification. Client workspaceId is never
authority. They enforce least privilege as a documented readiness boundary and
make clear frontend role guard is UX-only. They include no raw customer
messages, no raw provider payload, no raw webhook payload, no raw audit
metadata, no access token, no refresh token, no cookies, no auth headers, no
permission mutation, no role mutation, no session revocation, no force logout,
no SSO implementation, no MFA implementation, no CRM mutation, no outbound
send, no real AI provider, and no evidence export.

## Prohibited Claims

Do not claim CLARA is certified, compliant, audited, attested, or production
approved by an external standard until evidence and formal review exist.
