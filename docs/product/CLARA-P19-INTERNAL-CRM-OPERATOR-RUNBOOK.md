---
project: "CLARA"
artifact: "P19 Internal CRM Operator Runbook"
status: "current"
owner: "CLARA Product and Engineering"
classification: "operator-runbook"
---

# P19 Internal CRM Operator Runbook

Operators use CLARA only after provider login and active workspace membership.
Internal team usage must use provider auth.

## Daily Use

- Sign in through the configured provider.
- Use customer list/detail, notes, timeline, owner assignment, lifecycle/status,
  and conversation linking only inside the resolved workspace.
- Treat customer text and provider data as untrusted input.
- Do not paste tokens, cookies, auth headers, raw provider payloads, raw DOM,
  raw HTML, raw prompts, AI secrets, or payment data into notes or evidence.

## Role Behavior

Viewer is read-only. Owner/agent CRM mutation policy remains enforced by the
backend. Frontend role labels are UX-only.

## If Access Fails

Missing provider session returns a safe 401. Missing workspace membership
returns a safe access-required state. Do not switch to mock/demo mode for real
work; mock/demo mode is dev/test only.
