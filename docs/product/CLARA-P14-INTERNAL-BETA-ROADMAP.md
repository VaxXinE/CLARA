# CLARA P14 Internal Beta Roadmap

## Status

P13 Internal CRM Product Activation is complete. P14 is current. P14 prepares
CLARA for controlled internal team usage. P14-PR-01 is complete. P14-PR-02 is
complete. P14-PR-03 is current. Internal data seeding/import is for internal
beta rollout. Only approved internal CRM data may be imported. internal use
first, billing deferred, public launch deferred, and production deployment
requires separate explicit action remain the core rollout constraints.

## P14 Sequence

| PR | Scope | Status |
| --- | --- | --- |
| P14-PR-01 | Internal Beta Rollout Scope + Environment Plan | complete |
| P14-PR-02 | Internal User Bootstrap + Role Setup | complete |
| P14-PR-03 | Internal Data Seeding / Import Workflow | current |

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

## Non-Goals

P14-PR-03 does not implement billing, payment SDKs, public launch, production
deployment automation, real provider activation, real AI activation, real
outbound activation, secrets, credentials, invite mutation, role mutation,
membership deletion, import endpoint, dashboard upload, background job, queue
execution, heavy ETL, raw provider payload import, raw webhook payload import,
raw HTML rendering, or auth/workspace isolation changes. Backend AuthContext and
workspace membership remain source of truth. Client supplied workspaceId is not
authoritative. Provider/AI/outbound activation remains controlled.

## Handoff Criteria

P14 can move beyond P14-PR-01 only after:

- Internal user roles are defined and accepted.
- Internal data policy exists and is reviewed.
- Security checklist exists and is reviewed.
- Environment plan confirms production deployment requires separate explicit
  action.
- Provider/AI/outbound activation remains controlled.
- Validation prints `CLARA P14-PR-03 VALIDATION PASSED`.
