# CLARA P14 Internal User Role Plan

## Purpose

This plan defines the first internal beta user roles. internal user roles are
defined so CLARA can be used by the internal team without relying on frontend
role spoofing or informal access rules.

## Role Model

| Role | Internal Beta Responsibility | Guardrail |
| --- | --- | --- |
| Owner | Workspace owner, final access decision, security checklist signoff | Backend AuthContext only. |
| Admin | Operator/admin preparation, member readiness review, runbook execution | No self-escalation path. |
| Agent | CRM workflow execution, customer follow-up, conversation handling | No admin-only user management mutation. |
| Viewer | Read-only review and QA observation | No mutation or provider connection control. |

## Authority Rules

- Backend AuthContext is authoritative.
- Frontend role checks are UX-only.
- Client-supplied role, organization_id, workspace_id, or user_id must not be
  trusted.
- Workspace membership must be server-resolved.
- Owner/admin access must be based on backend membership and policy only.

## Internal Beta Access Process

1. Owner identifies internal beta participants.
2. Admin confirms workspace membership and role assignment through existing
   safe backend readiness paths.
3. Agent and viewer users receive only the minimum access needed for CRM QA.
4. Operator records known limitations and feedback without collecting raw
   secrets, tokens, provider payloads, or unnecessary sensitive data.

## Deferred Role Work

This PR does not add invite, create, update, delete, role mutation,
entitlement, subscription, billing, or public onboarding behavior. Those require
separate design, implementation, tests, and security review.
