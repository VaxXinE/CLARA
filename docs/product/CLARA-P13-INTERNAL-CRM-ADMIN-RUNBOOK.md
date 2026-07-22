# CLARA P13 Internal CRM Admin Runbook

## Admin Focus

P13 internal CRM activation is complete only after this PR validates. Admins
verify access, workspace isolation, safe metadata, and deferred commercial
scope before handoff.

## Admin Checklist

- Confirm owner/agent permissions are backend-enforced.
- Confirm viewer/read-only mode blocks CRM mutations.
- Confirm active workspace membership is required for owner assignment.
- Confirm client-supplied organization_id, workspace_id, and role are rejected
  or ignored as authority.
- Confirm audit/timeline metadata does not expose raw provider/audit/secrets.
- Confirm internal CRM analytics are safe aggregated workspace-scoped metrics.
- Confirm billing/payment is deferred and public SaaS launch is deferred.
- Confirm no real external provider credentials are required for this PR.

## Incident Notes

If workspace leakage, unsafe metadata, or unauthorized mutation is found, stop
the internal CRM rollout, preserve logs by correlation ID, and revert the
affected PR before continuing QA.
