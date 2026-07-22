---
project: "CLARA"
artifact: "P13 Follow-up Task Workflow"
status: "active"
owner: "CLARA Product and Engineering"
classification: "product-spec"
---

# CLARA P13 Follow-up Task Workflow

P13-PR-01 is complete. P13-PR-02 is complete. P13-PR-03 is complete.
P13-PR-04 is current. Internal CRM usage is the focus. internal CRM usage is
the focus. billing/payment is deferred. Billing/payment remains deferred. CLARA
is not production deployed yet. CLARA is not public GA launched yet.

## Scope

follow-up tasks are workspace-scoped internal CRM features. task assignee
requires valid workspace membership. Operators can create follow-up tasks for a
selected customer, assign active workspace members, set a safe due date, list
tasks, and update task status.

this PR does not auto-send external notifications. It does not call Gmail,
WhatsApp, Instagram, TikTok, Slack, Discord, webhook, email, or external support
providers. It does not create billing, payment, subscription, invoice, checkout,
or quota side effects.

## Security Contract

Backend AuthContext is the authority. Client-supplied organization_id,
workspace_id, role, or user_id is not authorization truth. Customer id is
verified inside the authenticated workspace before task mutation. Cross-workspace
customer/task/assignee access fails closed.

Timeline/audit must not expose raw provider/audit/secrets. Task audit metadata is
allowlisted to task id, customer id, status, assignee id, and due date.

## Status Values

- open
- in_progress
- completed
- cancelled
