# CLARA P19 Customer Workflow Operator Guide

Customer create/update/notes/activity/lifecycle/owner/conversation-linking are
real workspace-scoped CRM workflows.

Allowed for owner/agent when policy permits:

- Create customer.
- Update safe customer fields.
- Add customer note.
- Review activity timeline.
- Update lifecycle/status.
- Assign owner to active workspace member.

Viewer is read-only. Backend AuthContext/workspace membership is source of
truth. client-supplied workspaceId is not authoritative. Missing/inactive
membership fails closed.

