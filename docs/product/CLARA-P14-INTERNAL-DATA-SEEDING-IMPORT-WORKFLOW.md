# CLARA P14 Internal Data Seeding / Import Workflow

## Status

P14-PR-01 is complete. P14-PR-02 is complete. P14-PR-03 is current.

Internal data seeding/import is for internal beta rollout. Only approved
internal CRM data may be imported. Billing/payment is deferred. Public SaaS
launch is deferred. Production deployment requires separate explicit action.
Provider/AI/outbound activation remains controlled.

## Workflow

1. Owner or admin prepares an approved internal CRM import file using the safe
   import format.
2. Owner/admin confirms the data belongs to the target internal workspace.
3. Import validation checks allowlisted fields only.
4. Customer writes must use backend AuthContext and workspace membership as
   source of truth.
5. Client-supplied workspaceId is not authoritative and must be rejected or
   ignored.
6. Viewer/read-only users cannot import.
7. Operator imports are allowed only through an approved internal path that uses
   backend AuthContext; no browser upload UI is enabled in this PR.

## Safe Scope

Import is workspace-scoped. AuthContext and workspace membership remain source
of truth. Imported customer records may use:

- displayName
- contactIdentifier
- source
- status
- notesSummary

Secrets/tokens/cookies/raw provider payload/raw webhook payload/raw HTML/payment data must not be imported.
Auth headers must not be imported.

## Non-Goals

This workflow does not add billing, payment SDKs, public launch, production
deployment automation, provider activation, AI activation, outbound activation,
external storage, background jobs, queue execution, heavy ETL, raw payload
import, raw HTML rendering, or dashboard upload controls.
