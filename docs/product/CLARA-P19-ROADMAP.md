---
project: "CLARA"
artifact: "P19 Roadmap"
status: "current"
owner: "CLARA Product and Engineering"
classification: "roadmap"
---

# P19 Roadmap

P19 activates the real internal CRM runtime gate after P18 controlled runtime
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

Real Workspace/User/Role Bootstrap + Internal Team Access is current.

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

Real CRM Data Entry + Customer Workflow Runtime is next.

Next phase requires separate explicit approval.
