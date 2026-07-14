---
project: "CLARA"
artifact: "P5.1 Final UI Regression Runbook"
status: "draft"
owner: "CLARA Product and Engineering"
classification: "qa-runbook"
---

# CLARA P5.1 Final UI Regression Runbook

This runbook closes the P5.1 dashboard UI upgrade track.

## P5.1 Track Summary

- P5.1-PR-01 positioned CLARA v2 as the production-ready upgrade of `project_Clara`.
- P5.1-PR-02 added the premium dark/gold workspace shell.
- P5.1-PR-03 added role-aware navigation and route map coverage.
- P5.1-PR-04 upgraded the conversation operator workspace.
- P5.1-PR-05 added CRM and customer intelligence skeleton panels.
- P5.1-PR-06 added action, insight, knowledge, KPI, and administration placeholders.
- P5.1-PR-07 adds final UI regression, accessibility, and security audit coverage.

## Expected UI Areas

- Sidebar and grouped workspace navigation.
- Topbar with auth and workspace context.
- Conversation queue.
- Active conversation thread.
- Customer profile and activity timeline.
- Reply composer with explicit human send action.
- Gmail scheduler and outbound status read-only visibility.
- CRM, customer intelligence, action center, insight, knowledge, KPI, and admin placeholders.

## Local Validation

```bash
cd apps/dashboard
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high
```

From repo root:

```bash
bash scripts/validate-repo-structure.sh
```

## Acceptance Gate

- All dashboard tests pass.
- Existing API and extension regressions remain green.
- Planned placeholders do not expose enabled mutation controls.
- Viewer/read-only role does not get AI draft or send controls.
- Backend authorization remains the source of truth.
