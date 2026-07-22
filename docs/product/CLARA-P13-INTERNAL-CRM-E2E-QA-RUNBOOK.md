# CLARA P13 Internal CRM E2E QA Runbook

## Status

P13-PR-01 is complete. P13-PR-02 is complete. P13-PR-03 is complete.
P13-PR-04 is complete. P13-PR-05 is complete. P13-PR-06 is complete.
P13-PR-07 is current.

P13 internal CRM activation is complete only after this PR validates. internal CRM usage is the focus. CLARA is usable for internal CRM workflow after P13.
Billing/payment is deferred. billing/payment is deferred. Public SaaS launch is
deferred. public SaaS launch is deferred. CLARA is not production deployed yet
unless separately deployed by operators. CLARA is not public GA launched yet.

## Local QA Flow

Use local/dev-safe simulated flows only. No real external provider credentials
are required for this PR.

1. Start the API and dashboard in local demo mode.
2. Open the dashboard as owner or agent.
3. Confirm customer list loads.
4. Create a customer with non-sensitive test data.
5. Update the customer name or status.
6. Add a customer note that does not contain secrets.
7. Confirm customer activity timeline shows the note.
8. Change lifecycle status.
9. Assign an active workspace member as owner.
10. Create a follow-up task.
11. Complete the follow-up task if the UI exposes the status control.
12. Load conversations.
13. Link a conversation to the customer.
14. Confirm customer detail shows linked conversations.
15. Confirm conversation detail shows linked customer.
16. Open internal CRM dashboard analytics and confirm aggregate metrics render.
17. Switch to viewer and confirm mutation controls are blocked or read-only.
18. Confirm billing/payment remains deferred.
19. Confirm provider/AI/outbound behavior remains controlled by existing safe boundaries.

## Acceptance

- Backend AuthContext remains source of truth.
- Workspace isolation is verified by API tests.
- Viewer/read-only mode does not mutate CRM state.
- Audit/timeline output uses safe metadata only.
- no real provider/payment/AI/outbound behavior is activated.
- no real external provider credentials are required.
