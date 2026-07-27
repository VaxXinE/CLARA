---
project: "CLARA"
artifact: "P19 Roadmap"
status: "current"
owner: "CLARA Product and Engineering"
classification: "roadmap"
---

# P19 Roadmap

P19 completed the real internal CRM runtime gate after P18 controlled runtime
trial completion.

## P19-PR-01

Real Internal CRM Runtime Activation + Mock/Demo Usage Removal Gate is complete.

Acceptance:

- Internal team usage must use provider auth.
- Mock/demo mode is dev/test only.
- Demo role switcher is not used in provider mode.
- Backend AuthContext/workspace membership is source of truth.
- client-supplied workspaceId is not authoritative.
- Viewer is read-only.
- Owner/agent CRM mutation policy remains enforced.
- CLARA is not public GA launch.
- Billing/payment remains deferred.
- Official WA/IG/TikTok APIs remain not activated.
- Outbound auto-send remains disabled.

## P19-PR-02

Real Workspace/User/Role Bootstrap + Internal Team Access is complete.

P19-PR-02 is complete.

Acceptance:

- Internal team usage must use provider auth.
- Mock/demo mode is dev/test only.
- First owner bootstrap is required for real internal usage.
- Bootstrap creates or links organization, workspace, owner user, and active owner workspace membership.
- Real workspace membership is required.
- Backend AuthContext/workspace membership is source of truth.
- client-supplied workspaceId is not authoritative.
- Missing/inactive membership fails closed.
- Viewer is read-only.
- Owner/agent CRM mutation policy remains enforced.
- CLARA is not public GA launch.
- CLARA is not production deployment.
- Billing/payment remains deferred.
- Official WA/IG/TikTok APIs remain not activated.
- Outbound auto-send remains disabled.

## P19-PR-03

Real CRM Data Entry + Customer Workflow Runtime is complete.

P19-PR-03 is complete.

Acceptance:

- Internal team usage must use provider auth.
- Mock/demo mode is dev/test only.
- Customer create/update is for real internal CRM usage.
- Customer notes/activity are real workspace-scoped CRM workflows.
- Lifecycle/status and owner assignment are role-aware CRM workflows.
- Conversation-to-customer linking is explicit and workspace-scoped.
- Backend AuthContext/workspace membership is source of truth.
- client-supplied workspaceId is not authoritative.
- Missing/inactive membership fails closed.
- Viewer is read-only.
- Owner/agent CRM mutation policy remains enforced.
- CLARA is not public GA launch.
- CLARA is not production deployment.
- Billing/payment remains deferred.
- Official WA/IG/TikTok APIs remain not activated.
- Outbound auto-send remains disabled.

## P19-PR-04

Internal CRM Deployment Runtime + Environment Hardening is complete.

P19-PR-04 is complete.

Acceptance:

- Internal team usage must use provider auth.
- Mock/demo mode is dev/test only.
- Internal deployment requires real workspace membership.
- Backend AuthContext/workspace membership is source of truth.
- client-supplied workspaceId is not authoritative.
- Missing/inactive membership fails closed.
- Dashboard provider mode must not show demo role switcher.
- Dashboard provider mode must not send mock headers.
- CORS/internal origin must be explicit and not wildcard.
- Env examples must not contain real secrets.
- Health/ready smoke checks exist.
- Database migrate/bootstrap runbook exists.
- Restart/rollback guidance exists.
- CLARA is not public GA launch.
- CLARA is not public SaaS launch.
- Billing/payment remains deferred.
- Official WA/IG/TikTok APIs remain not activated.
- Outbound auto-send remains disabled.

## P19-PR-05

Internal CRM Operator Onboarding + Production-like Usage Handoff is complete.

P19-PR-05 is complete.

P19 is complete.

Post-P19 handoff summary exists. P19 completed real internal CRM runtime
activation, provider auth internal runtime gate, mock/demo usage removal gate
for operators, real workspace/user/role bootstrap, internal team access, real
customer data entry workflow, customer create/update, customer notes/activity
timeline, lifecycle/status workflow, owner assignment, conversation-to-customer
linking, internal deployment runtime hardening, environment hardening,
operator/admin/viewer onboarding, and production-like internal usage handoff.
Any next phase requires separate explicit product approval.

Acceptance:

- Internal team usage must use provider auth.
- Mock/demo mode is dev/test only.
- Real workspace membership is required.
- Backend AuthContext/workspace membership is source of truth.
- client-supplied workspaceId is not authoritative.
- Missing/inactive membership fails closed.
- Viewer is read-only.
- Owner/agent CRM mutation policy remains enforced.
- Customer create/update/notes/activity/lifecycle/owner/conversation-linking are real workspace-scoped CRM workflows.
- Internal deployment usage smoke checklist exists.
- Issue reporting and escalation workflow exists.
- Operator security do/don't guide exists.
- No raw secrets/tokens/auth headers/raw provider payloads/raw prompts/raw DOM/raw HTML/payment data in docs.
- CLARA is not public GA launch.
- CLARA is not public SaaS launch.
- Billing/payment remains deferred.
- Official WA/IG/TikTok APIs remain not activated.
- Outbound auto-send remains disabled.

Next phase requires separate explicit approval.
