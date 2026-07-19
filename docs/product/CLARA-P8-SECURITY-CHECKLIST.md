---
project: "CLARA"
artifact: "P8 Security Checklist"
status: "final"
owner: "CLARA Security and Engineering"
classification: "security-checklist"
---

# CLARA P8 Security Checklist

## Auth

- P8 routes require authentication.
- Backend AuthContext is the source of truth.
- Frontend role labels are UX only.

## Authorization

- Role checks are enforced server-side.
- Client-supplied workspaceId is never authority.
- Cross-workspace access returns safe denial/not-found behavior.

## Workspace Boundary

- Reads are workspace-scoped.
- Audit writes are workspace-scoped.
- No route trusts organization/workspace from query/body/header as authority.

## Input Validation

- Proposal/readiness inputs are validated.
- Unsafe intent is blocked before execution.
- Unknown metadata is dropped or rejected.

## Output Encoding

- Dashboard uses React safe rendering.
- Dashboard does not use `dangerouslySetInnerHTML`.
- No raw DOM or raw HTML is rendered.

## Audit Redaction

- P8 audit metadata is allowlisted.
- Audit metadata is sanitized before write.
- Audit events are audit-only.

## Secret and Payload Exposure

- no access token
- no refresh token
- no cookies
- no auth headers
- no API keys/secrets
- no raw provider payload
- no raw webhook payload
- no raw prompt

## No Mutation

- no CRM mutation
- no customer profile mutation
- no customer note write
- no task creation
- no task scheduling
- no owner assignment mutation
- no lifecycle mutation
- no status mutation
- no outbound send
- no auto-send
- no autonomous workflow execution
- no hidden execution path
- no bypass human approval path

## AI Provider Boundary

- no real AI provider
- no AI SDK import
- no AI provider API key requirement

## Extension Boundary

- Extension cannot execute CRM workflow.
- Extension cannot receive CRM mutation capability.
- Extension cannot read/write CRM audit internals directly.

## Closure

P8-PR-09 is the p8 production readiness gate before P9 Analytics / Reporting /
KPI.

