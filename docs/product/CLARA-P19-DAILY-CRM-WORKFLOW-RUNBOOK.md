# CLARA P19 Daily CRM Workflow Runbook

Daily internal CRM flow:

1. Sign in through provider auth.
2. Confirm workspace access is active.
3. Review conversations and customers.
4. Create/update customer records only when needed.
5. Add concise customer notes/activity.
6. Update lifecycle/status when operator policy allows it.
7. Assign owner only to a valid workspace member.
8. Link conversation-to-customer explicitly.
9. Report issues through the internal escalation workflow.

Customer create/update/notes/activity/lifecycle/owner/conversation-linking are
real workspace-scoped CRM workflows. Owner/agent CRM mutation policy remains
enforced. Viewer is read-only.

Mock/demo mode is dev/test only. Internal team usage must use provider auth.

