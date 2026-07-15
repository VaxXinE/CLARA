# CLARA P8 Customer Profile Intelligence Read Model

## Status

P8-PR-02 adds a read-only customer profile intelligence read model.

It is safe operational visibility only. It does not add CRM mutation, task
creation, owner assignment, lifecycle/status update, customer note write,
AI auto-send, autonomous workflow, analytics, or real AI provider behavior.

## API

```text
GET /api/v1/customers/:customerId/intelligence
```

The route requires authentication and derives organization/workspace from
Backend AuthContext only. Client-provided `organization_id`, `workspace_id`,
or `role` is not authorization authority.

Cross-workspace customer access returns safe not found behavior.

## Response

The response includes only allowlisted read-only fields:

```text
customerId
workspaceId
generatedAt
profileHealth
activitySignals
relationshipSignals
followUpSignals
safety
```

Safety fields are always:

```text
readOnly=true
mutationAllowed=false
requiresHumanApprovalForMutation=true
```

## Dashboard

The dashboard displays a Customer Intelligence profile signal panel with:

```text
profile health
conversation activity
lifecycle/status suggestions
follow-up recommendation
read-only safety label
```

The panel is read-only. It has no Apply, Save, Create Task, Assign Owner,
Change Status, Update Lifecycle, resend, or automation button.

## Security

The read model must not expose or render:

```text
access token
refresh token
Authorization header
cookies
client secret
provider API key
raw provider payload
raw webhook payload
raw Gmail payload
raw DOM
raw HTML
raw prompt
```

The dashboard must not use `dangerouslySetInnerHTML`.

## Extension Boundary

The browser extension remains manual capture/sync only. Customer profile
intelligence is not computed in the extension and the extension does not gain
CRM mutation capability.
