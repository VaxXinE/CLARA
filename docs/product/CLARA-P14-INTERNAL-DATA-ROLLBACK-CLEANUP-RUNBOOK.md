# CLARA P14 Internal Data Rollback / Cleanup Runbook

## Status

P14-PR-01 is complete. P14-PR-02 is complete. P14-PR-03 is current.

Internal data seeding/import is for internal beta rollout. Only approved
internal CRM data may be imported.

## Manual Cleanup

1. Pause further internal imports for the affected workspace.
2. Identify imported records by safe customer ids, timestamps, and audit
   metadata.
3. Confirm the workspace using backend AuthContext and workspace membership.
4. Remove or correct records through approved internal CRM paths.
5. Record what was changed and why.
6. Rerun validation before resuming internal imports.

## Rollback Limits

This PR does not add automatic rollback, production rollback automation, backup
execution, restore execution, background jobs, queue execution, or heavy ETL.

## Safety Checklist

- Import is workspace-scoped.
- Client-supplied workspaceId is not authoritative.
- Secrets/tokens/cookies/auth headers/raw provider payloads/raw webhook
  payloads/raw HTML/payment data must not be imported.
- Billing/payment is deferred.
- Public SaaS launch is deferred.
- Production deployment requires separate explicit action.
- Provider/AI/outbound activation remains controlled.
