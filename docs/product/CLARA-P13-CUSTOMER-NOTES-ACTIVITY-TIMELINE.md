---
project: "CLARA"
artifact: "P13 Customer Notes + Activity Timeline"
status: "active"
owner: "CLARA Product and Engineering"
classification: "product-spec"
---

# CLARA P13 Customer Notes + Activity Timeline

P13-PR-01 is complete. P13-PR-02 is complete. P13-PR-03 is current. Internal CRM
usage is the focus. billing/payment is deferred. CLARA is not production
deployed yet. CLARA is not public GA launched yet.

For validation and operating clarity: internal CRM usage is the focus.

## Scope

Notes/timeline are workspace-scoped internal CRM features. Internal operators
can open a customer, add an internal note, read note history, and read a safe
customer activity timeline.

For the p13 operator checklist, notes/timeline are workspace-scoped internal CRM features.

The timeline includes safe internal CRM event types:

- `customer.created`
- `customer.updated`
- `customer.note.created`

Timeline must not expose raw provider/audit/secrets. It returns safe titles,
summaries, actor references, timestamps, and customer identifiers scoped by the
backend AuthContext.

## Guardrails

Backend AuthContext is the authority for organization and workspace scope.
Client-supplied `organization_id`, `workspace_id`, or role values are rejected
or ignored safely and must not authorize note or timeline access.

Viewers can read notes and timeline entries. Note creation requires backend
customer update permission. Note bodies are validated server-side; empty and
too-long values are rejected.

Audit for note creation stores safe metadata only: customer id, note id, and
body length. It must not store the full note body, raw provider payload, tokens,
cookies, authorization headers, API keys, client secrets, raw audit metadata, or
raw HTML.

## Deferred

This PR does not add billing, payment, checkout, invoices, subscriptions, quota
enforcement, real AI provider calls, autonomous AI actions, real outbound
provider sends, deployment automation, support tool integrations, or browser
extension CRM mutation powers.
