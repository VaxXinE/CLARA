---
book: "Book V — Engineering Execution Plan"
section: "Master Index"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan-index"
project: "CLARA"
---

# BOOK-05 Security and Quality Gate Map

This file maps security and quality gates across CLARA implementation.

---

# Universal Gates

Every feature must pass:

```text
Product alignment
Backend authorization
Tenant/workspace isolation
Input validation
Safe output rendering
Tests
Docs update
Code review
Security review if high-risk
CI checks
```

---

# Gate Matrix

| Area | Required Gates |
|---|---|
| Auth | Session/token safety, login throttling, auth tests |
| RBAC | Backend permission checks, denied cases, role audit |
| Tenant Isolation | Cross-org/workspace tests, scoped queries |
| Customer CRM | PII handling, scoped search, audit sensitive updates |
| Inbox | Internal/customer-visible separation, reply audit |
| Ticketing | Status/assignment validation, activity/audit |
| Knowledge | Draft/published visibility, AI eligibility |
| AI | Context permissions, prompt injection tests, human review |
| Integrations | Signature/API key validation, idempotency, retry/failure logs |
| Admin/Billing | Elevated permission checks, audit, confirmation |
| Workflow | Risk classification, approval gates, idempotency |
| Database | Migration tests, constraints, backup awareness |
| Frontend | Safe rendering, permission-aware UX, error states |
| DevOps | CI pass, smoke test, rollback path |
| Production | Monitoring, backup/restore, runbooks, known limitations |

---

# High-Risk Review Triggers

Require security review when changing:

```text
authentication
authorization
organization/workspace scoping
AI context or prompt policy
webhook/integration handling
credential/secrets handling
admin/security/billing settings
data exports
workflow automation actions
database migrations with destructive impact
```

---

# Merge Blocking Rules

A PR should not merge if:

```text
CI fails
Required tests are missing
Authorization behavior is untested
Cross-scope behavior is untested for scoped data
Secrets are committed
Docs are stale for changed behavior
Security review is required but missing
```
