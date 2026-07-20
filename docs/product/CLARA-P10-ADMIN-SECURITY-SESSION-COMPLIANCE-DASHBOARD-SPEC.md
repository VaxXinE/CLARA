---
project: "CLARA"
artifact: "P10 Admin Security Controls + Session Policy + Compliance Dashboard Spec"
status: "draft"
owner: "CLARA Product, Engineering, Security, and Operations"
classification: "security-readiness"
---

# CLARA P10-PR-04 Admin Security Controls + Session Policy + Compliance Dashboard

## Purpose

P10-PR-04 adds read-only Admin Security Controls, Session Policy, and
Compliance Dashboard readiness surfaces for P10 Enterprise Hardening /
Compliance. This is compliance readiness, not certification.

## Scope

- `GET /api/v1/enterprise/admin-security-controls/readiness`
- `GET /api/v1/enterprise/session-policy/readiness`
- `GET /api/v1/enterprise/compliance-dashboard`
- Dashboard panels that render safe readiness summaries only.
- Extension boundary regression proving no admin/session/compliance internals
  are exposed to extension runtime.

## Non-Goals

- no SSO implementation
- no MFA implementation
- no session revocation
- no force logout
- no permission mutation
- no role mutation
- no CRM mutation
- no outbound send
- no real AI provider
- no evidence export

## Output Contracts

All endpoints require auth and use Backend AuthContext as the source of truth.
The response is workspace-scoped, deterministic, and read-only. The client
workspaceId is never authority.

Admin Security Controls include least privilege, backend authorization,
privileged action audit readiness, and frontend role guard is UX-only.

Session Policy includes secure cookie, token storage boundary, timeout,
rotation, and revocation readiness. It does not revoke sessions or force logout
users.

Compliance Dashboard includes safe category summaries only. It does not export
evidence and does not claim certification.

## Safe Evidence Summary Policy

Readiness output must contain no raw customer messages, no raw provider
payload, no raw webhook payload, no raw audit metadata, no access token, no
refresh token, no cookies, no auth headers, no API keys, no secrets, no raw
DOM, no raw HTML, and no raw prompts.

## Dashboard Behavior

Dashboard panels render plain text readiness only. They do not show raw
permission internals, tokens, cookies, auth headers, provider payload,
webhook payload, raw audit metadata, customer messages, or evidence export
controls.

## Extension Boundary

The extension remains scoped to active conversation assistance. It does not
access Admin Security Controls, Session Policy, Compliance Dashboard,
cross-workspace enterprise data, raw evidence, tokens, cookies, auth headers,
provider payload, webhook payload, raw audit metadata, raw DOM, raw HTML, raw
prompts, API keys, or secrets.

## P10 Compact Roadmap Handoff

P10-PR-04 leaves backup / restore, incident response, evidence readiness, and
final P10 audit/runbook to P10-PR-05 and P10-PR-06.
