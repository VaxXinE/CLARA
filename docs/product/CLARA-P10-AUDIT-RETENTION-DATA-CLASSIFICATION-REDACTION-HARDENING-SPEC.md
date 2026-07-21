---
project: "CLARA"
artifact: "P10 Audit Retention + Data Classification + Redaction Hardening Spec"
status: "draft"
owner: "CLARA Product, Engineering, Security, and Operations"
classification: "security-specification"
---

# CLARA P10 Audit Retention + Data Classification + Redaction Hardening Spec

## Purpose

P10-PR-03 adds compliance readiness visibility for Audit Retention, Data
Classification, Redaction Hardening, and the Sensitive Field Classifier. This
is P10 Enterprise Hardening / Compliance readiness, not certification.

## Scope

| Endpoint                                               | Behavior                                                                                       |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `GET /api/v1/enterprise/audit-retention/readiness`     | Audit Retention readiness and safe audit metadata policy summary.                              |
| `GET /api/v1/enterprise/data-classification/readiness` | Data Classification readiness for public, internal, confidential, restricted, and secret data. |
| `GET /api/v1/enterprise/redaction-hardening/readiness` | Redaction Hardening and Sensitive Field Classifier readiness.                                  |

All endpoints require Backend AuthContext. Client workspaceId is never
authority. Responses are workspace-scoped from server-side auth context.

## Non-Goals

P10-PR-03 adds no deletion automation, no legal hold automation, no retention
job execution, no report export, no evidence export, no permission mutation, no
role mutation, no CRM mutation, no customer note write, no task creation, no
owner assignment, no lifecycle/status mutation, no outbound send, no real AI
provider, and no customer-level drilldown.

## Output Contracts

Audit Retention readiness returns `workspaceId`, `generatedAt`, `phase: "p10"`,
retention readiness booleans, safe categories, and safety flags. Automation
fields such as deletion, legal hold, retention job, and export remain false.

Data Classification returns classifications, data class rules, handling rules,
dashboard safety, extension safety, and audit safety. It includes no raw
sensitive examples.

Redaction Hardening returns redaction requirements, classifier summaries, and
safety flags. It includes no raw before/after samples.

## Sensitive Field Classifier

The Sensitive Field Classifier blocks or redacts fields that look like tokens,
auth headers, cookies, API keys, secrets, raw provider payload, raw webhook
payload, raw audit metadata, customer message body, raw DOM, raw HTML, or raw
prompts.

## Safe Audit Metadata

Safe audit metadata means identifiers, reason_code, status, provider label,
resource id, and counts only. It allows no raw customer messages, no raw
provider payload, no raw webhook payload, no raw audit metadata, no access
token, no refresh token, no cookies, no auth headers, and no secrets.

## Dashboard Behavior

Dashboard panels show compliance readiness labels, not certification. They are
plain text read-only panels with no Export, Download, Execute, Apply, Delete
Data, Legal Hold, Run Retention Job, Create Task, Assign Owner, Update Status,
Send Message, Write Note, Change Role, or Grant Permission buttons.

## Extension Boundary

The extension must not access audit retention internals, data classification
internals, redaction hardening internals, raw compliance data, or
cross-workspace enterprise data. It must not capture tokens, cookies, auth
headers, provider payloads, webhook payloads, raw audit metadata, raw DOM, raw
HTML, raw prompts, API keys, or secrets.

## P10 Compact Roadmap Handoff

P10-PR-04 continues with Admin Security Controls + Session Policy + Compliance
Dashboard. P10-PR-05 covers Backup / Restore + Incident Response + Evidence
Readiness. P10-PR-06 closes with the Final P10 Audit / Runbook.

## Validation

```bash
bash scripts/validate-p10-audit-retention-data-classification-redaction.sh
```
