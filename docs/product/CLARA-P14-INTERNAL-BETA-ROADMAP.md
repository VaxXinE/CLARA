# CLARA P14 Internal Beta Roadmap

## Status

P13 Internal CRM Product Activation is complete. P14 Internal Beta Rollout
Preparation is complete. P14 prepares
CLARA for controlled internal team usage. P14-PR-01 is complete. P14-PR-02 is
complete. P14-PR-03 is complete. P14-PR-04 is complete. P14-PR-05 is complete.
P14-PR-06 is complete. P15 Controlled Internal Beta Execution is current.
P15-PR-01 is current. Internal beta go-live is controlled internal usage
only. Internal beta is not public SaaS launch. Internal beta is not production
deployment claim unless separately executed. Internal usage feedback loop is for
internal beta rollout. Feedback triage is
manual/local/repo-safe unless separately approved. Feedback must not include
secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw
HTML/raw DOM/raw prompts/payment data. Feedback should minimize
customer-sensitive data. Known limitations must be reviewed before broader
rollout. Known issues workflow is internal beta only. no
external support tool integration is activated. Internal access QA is complete
for internal beta rollout. Owner/admin/operator/viewer access boundaries are
reviewed. Viewer/read-only mutation blocking is required. Operator CRM access is
scoped. Admin/owner elevated actions require workspace membership and proper
role. Internal data import remains workspace-scoped and safe. internal use
first, billing deferred, public launch deferred, and production deployment
requires separate explicit action remain the core rollout constraints.

## P14 Sequence

| PR | Scope | Status |
| --- | --- | --- |
| P14-PR-01 | Internal Beta Rollout Scope + Environment Plan | complete |
| P14-PR-02 | Internal User Bootstrap + Role Setup | complete |
| P14-PR-03 | Internal Data Seeding / Import Workflow | complete |
| P14-PR-04 | Internal Access QA + Security Review | complete |
| P14-PR-05 | Internal Usage Feedback Loop | complete |
| P14-PR-06 | Final Internal Beta Go-Live Runbook | complete |

## P14-PR-01 Deliverables

- Internal beta rollout scope.
- Internal environment plan.
- Internal user role plan.
- Internal data policy.
- Internal security checklist.
- P14 internal beta roadmap.
- Updated final roadmap and documentation index.
- Validator coverage for API, Dashboard, and Extension.

## P14-PR-02 Deliverables

- Internal owner bootstrap flow documented and verified.
- Admin/operator/viewer role setup documented.
- Internal role permission matrix exists.
- Internal onboarding checklist exists.
- Owner/admin runbook exists.
- Viewer/read-only behavior remains safe.
- Operator CRM access is clearly scoped.
- Admin security responsibilities are clearly scoped.
- Owner responsibility and recovery policy are clearly scoped.

## P14-PR-03 Deliverables

- Internal data seeding/import workflow exists.
- Safe internal customer import format exists.
- Import validation policy exists.
- Rollback/manual cleanup runbook exists.
- Import is workspace-scoped.
- AuthContext and workspace membership remain source of truth.
- Client-supplied workspaceId is not authoritative.
- Secrets/tokens/cookies/raw provider payload/raw webhook payload/raw HTML/payment
  data must not be imported.

## P14-PR-04 Deliverables

- Internal access QA checklist exists.
- Internal security review exists.
- Owner/admin/operator/viewer access boundaries are reviewed.
- Viewer/read-only mutation blocking is required.
- Operator CRM access is scoped.
- Admin/owner elevated actions require workspace membership and proper role.
- Workspace isolation QA exists.
- Internal data import security review exists.
- Secrets/tokens/cookies/raw provider payload/raw webhook payload/raw HTML/payment
  data must not be imported or exposed.

## P14-PR-05 Deliverables

- Internal usage feedback loop exists.
- Internal bug report template exists.
- Internal usability feedback template exists.
- Feedback triage runbook exists.
- Feedback severity/priority policy exists.
- Known issues workflow is internal beta only.
- Feedback privacy boundary exists.
- Feedback must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data.
- Feedback should minimize customer-sensitive data.
- no external support tool integration is activated.

## P14-PR-06 Deliverables

- Final internal beta go-live runbook exists.
- Internal beta go/no-go checklist exists.
- Operator, admin, support/feedback, rollback/manual recovery handoffs exist.
- Internal beta known limitations review exists.
- Final internal beta security review exists.
- Final handoff states internal beta preparation only.
- Internal beta is not public SaaS launch.
- Internal beta is not production deployment claim unless separately executed.
- billing/payment is deferred.
- provider/AI/outbound activation remains controlled.
- Feedback/support remains manual/local/repo-safe unless separately approved.

## Non-Goals

P14-PR-06 does not implement billing, payment SDKs, public launch, production
deployment automation, real provider activation, real AI activation, real
outbound activation, secrets, credentials, invite mutation, role mutation,
membership deletion, feedback submission endpoint, external support tool
integration, notification send, import endpoint, dashboard upload, background
job, queue execution, heavy ETL, raw provider payload import, raw webhook payload
import, raw HTML rendering, or auth/workspace isolation changes. Backend
AuthContext and workspace membership remain source of truth. Client supplied
workspaceId is not authoritative. Provider/AI/outbound activation remains
controlled.

## Handoff Criteria

P14 can close only after:

- Internal user roles are defined and accepted.
- Internal data policy exists and is reviewed.
- Security checklist exists and is reviewed.
- Environment plan confirms production deployment requires separate explicit
  action.
- Provider/AI/outbound activation remains controlled.
- Validation prints `CLARA P14-PR-06 VALIDATION PASSED`.
