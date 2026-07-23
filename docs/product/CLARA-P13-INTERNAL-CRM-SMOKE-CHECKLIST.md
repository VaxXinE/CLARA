# CLARA P13 Internal CRM Smoke Checklist

## Required Smoke

- [ ] Customer list loads.
- [ ] Customer create works.
- [ ] Customer update works.
- [ ] Customer note create works.
- [ ] Customer timeline shows note.
- [ ] Customer lifecycle status update works.
- [ ] Customer owner assignment works.
- [ ] Follow-up task create works.
- [ ] Follow-up task update/complete works if supported by the current UI.
- [ ] Conversation list loads.
- [ ] Conversation can link to customer.
- [ ] Customer detail shows linked conversations.
- [ ] Conversation detail shows linked customer.
- [ ] Internal dashboard analytics reflects CRM data.
- [ ] Viewer/read-only mode blocks mutations.
- [ ] Cross-workspace access is blocked.
- [ ] Audit/timeline safe metadata is preserved.
- [ ] Billing/payment remains deferred.
- [ ] No provider/AI/outbound side effect occurs.
- [ ] Extension boundary remains non-mutating for CRM state except existing safe snapshot bridge behavior.

## Scope

Internal CRM E2E QA uses local/dev-safe simulated flows only. No real external
provider credentials are required for this PR.
