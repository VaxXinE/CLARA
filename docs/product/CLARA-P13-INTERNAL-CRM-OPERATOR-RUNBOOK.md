# CLARA P13 Internal CRM Operator Runbook

## Purpose

This runbook is for internal operators using CLARA as a workspace-scoped CRM.
P13-PR-07 is current and closes the internal CRM usability milestone after
validation.

## Operator Permissions

- Owner and agent can create/update customers, notes, lifecycle status, owner
  assignment, follow-up tasks, and conversation links when backend permissions
  allow it.
- Viewer is read-only and must not mutate CRM state.
- Frontend role behavior is UX-only; backend AuthContext remains source of
  truth.

## Daily Use

1. Open dashboard.
2. Review customer list and active conversations.
3. Create or update customers using safe business data only.
4. Add notes without secrets, passwords, tokens, raw provider payloads, raw
   webhook payloads, raw prompts, or payment data.
5. Use lifecycle status and owner assignment to track responsibility.
6. Use follow-up tasks for internal next steps.
7. Link conversations to customers only after operator review.
8. Check internal CRM dashboard analytics for aggregate workspace health.

## Boundaries

Billing/payment remains deferred. Public SaaS launch is deferred. CLARA is not
production deployed yet unless separately deployed by operators. CLARA is not
public GA launched yet. Provider/AI/outbound behavior remains controlled by
existing safe boundaries.
