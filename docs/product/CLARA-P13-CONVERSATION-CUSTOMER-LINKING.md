---
project: "CLARA"
artifact: "P13 Conversation-to-Customer Linking"
status: "active"
owner: "CLARA Product and Engineering"
classification: "product-spec"
---

# CLARA P13 Conversation-to-Customer Linking

## Status

P13-PR-01 is complete. P13-PR-02 is complete. P13-PR-03 is complete.
P13-PR-04 is complete. P13-PR-05 is current.

Internal CRM usage is the focus. billing/payment is deferred. CLARA is not
production deployed yet. CLARA is not public GA launched yet.

## Scope

P13-PR-05 connects conversations and customer records for internal CRM
operators. A conversation can be linked to an existing customer, unlinked when
the operator has permission, and listed from the customer workspace.

Conversation-to-customer linking is workspace-scoped. Backend AuthContext is
the authority for organization and workspace scope. Client-supplied
organization_id, workspace_id, user_id, or role is not authorization truth.

Linking is explicit user-approved internal CRM action. This PR does not
auto-create or auto-merge customers.

This PR does not auto-create or auto-merge customers.

## API Behavior

- `PUT /api/v1/conversations/:conversation_id/customer` links an existing
  conversation to an existing customer in the authenticated workspace.
- `DELETE /api/v1/conversations/:conversation_id/customer` unlinks the customer
  from the scoped conversation.
- `GET /api/v1/customers/:customer_id/conversations` returns safe linked
  conversation summaries for the authenticated workspace.

All endpoints require authentication. Link and unlink require write permission;
viewer sessions remain read-only.

## Dashboard Behavior

The conversation workspace shows whether the active conversation is linked or
unlinked. Operators can select an existing customer to link, unlink if allowed,
and open the linked customer. Customer detail shows linked conversations and
supports opening a conversation from the customer workspace.

Unsupported actions are disabled with visible copy instead of fake dead
buttons.

## Audit And Timeline

Link and unlink emit safe audit actions:

- `conversation.customer.linked`
- `conversation.customer.unlinked`

Audit metadata is allowlisted to resource identifiers only, such as
conversation_id, customer_id, and previous_customer_id. Timeline/audit must not
expose raw provider/audit/secrets/message bodies.

## Non-Goals

This PR does not activate real provider/payment/AI/outbound behavior. It does
not add billing, payment, subscriptions, invoices, checkout, quota enforcement,
real AI provider calls, autonomous AI action, outbound provider sends, external
support integrations, notification sends, customer auto-creation, or customer
auto-merge.
