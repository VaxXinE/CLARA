# CLARA P8-PR-06 Owner Assignment Readiness Spec

## Purpose

P8-PR-06 adds a deterministic, read-only owner assignment readiness contract.
It helps operators review whether a customer should have an owner handoff later.

## Readiness-only Contract

- Backend AuthContext is the source of truth.
- Customer access is workspace-scoped.
- `ownerAssigned=false` is always returned.
- `actionExecuted=false` is always returned.
- Human approval is required before any future owner assignment mutation.
- There is no customer mutation, task creation, note write, lifecycle update, or status update in this PR.

## Input Sources

The service uses the scoped customer record and optional safe review context.
Client-supplied organization or workspace values are never authority.

## Output Fields

The API returns `customerId`, `workspaceId`, `generatedAt`, `readiness`,
`currentOwnership`, `suggestedAssignment`, `risk`, and `safety`.

## Recommended Roles

- `sales`
- `support`
- `admin_review`
- `owner_review`
- `unknown`

## Blocked Roles And Actions

Unsafe input is blocked before any future workflow review. Blocked input includes
requests for token/cookie material, raw provider payload, raw webhook payload,
raw DOM, raw HTML, raw prompt data, approval bypass, immediate execution, task
creation, note writing, lifecycle/status mutation, or owner changes without
human approval.

## Human Approval Requirement

Every response is review-only and requires human approval for any later
mutation. This PR does not add mutation UI or backend write behavior.

## Permission Handoff

The response exposes the future required permission for operator review. It does
not grant permission and does not execute the owner assignment.

## Security Boundaries

No response includes access tokens, refresh tokens, cookies, Authorization
headers, API keys, secrets, raw provider payloads, raw webhook payloads, raw DOM,
raw HTML, or raw prompts.

## Non-goals

This PR does not assign owners, update customer records, create tasks, save
customer notes, update customer status/lifecycle, add analytics/KPI dashboards,
or integrate a real AI provider.

## Future PR Handoff

A later approval/execution PR may add owner assignment mutation only with
Backend AuthContext authorization, workspace scope, explicit human approval,
role permission checks, audit logging, and rollback guidance.
