---
project: "CLARA"
artifact: "P8 Security Runbook"
status: "draft"
owner: "CLARA Security, Engineering, Product, and Operations"
classification: "security-runbook"
---

# CLARA P8 Security Runbook

## Unauthorized CRM Mutation

1. Disable the affected CRM mutation route or feature flag.
2. Capture correlation_id and audit log entries.
3. Confirm Backend AuthContext, role permission, and workspace-scoped checks.
4. Verify no client-supplied workspaceId, organization_id, workspace_id, role,
   or user_id was trusted.
5. Roll back the release if authorization cannot be confirmed.

## Cross-Workspace CRM Access

Treat suspected cross-workspace CRM mutation as a high-severity incident. Check
tenant scope queries, audit log scope, and safe 404 behavior. Do not reveal
whether another workspace resource exists.

## Suspected AI-Driven CRM Mutation

P7 complete means AI remains suggestion-only. If an AI path appears to mutate
CRM data, disable the path and verify no autonomous CRM mutation, no
auto-write customer note, no auto-create task, and no auto-assign owner path
exists.

Security check: no autonomous CRM mutation, no auto-write customer note, no
auto-create task, and no auto-assign owner.

## Customer Data Exposure

Audit CRM workflow logs and UI responses for raw prompt, tokens, cookies,
secrets, raw provider payload, raw webhook payload, raw DOM, raw HTML, and
customer message bodies. Remove unsafe output and rotate affected secrets if
exposure is suspected.

## Rollback And Escalation

Rollback CRM mutation code first, preserve audit evidence, notify security
reviewers, and document the final reason_code. P8 is not production-ready until
the incident has a regression test.
