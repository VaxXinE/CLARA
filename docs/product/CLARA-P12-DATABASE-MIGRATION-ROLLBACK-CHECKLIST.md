---
project: "CLARA"
artifact: "P12 Database Migration Rollback Checklist"
status: "active"
owner: "CLARA Engineering"
classification: "database-readiness"
---

# CLARA P12 Database Migration / Rollback Checklist

P12-PR-01 is complete. P12-PR-02 is complete. P12-PR-03 is current.

CLARA is not GA yet. CLARA is not production deployed yet.

The deployment checklist is a readiness gate, not deployment execution.

No real provider/payment/AI/outbound activation happens in this PR.

## Required Checks

- Migration list is reviewed against the release candidate branch/SHA.
- Backup readiness is confirmed before migration cutover.
- Migration dry-run or deterministic local validation is captured.
- Rollback/forward-fix decision is written before deployment.
- Workspace-scoped data access remains intact after migration.
- No data exposure risk, raw provider payload persistence, raw webhook payload persistence, or token persistence is introduced.
- Failed migration, unknown schema state, or missing rollback/forward-fix plan is no-go.
