---
project: "CLARA"
artifact: "P4.5 Final Regression Runbook"
status: "implemented"
owner: "CLARA Engineering"
classification: "runbook"
---

# CLARA P4.5 Final Regression Runbook

This p4.5 final regression runbook closes the Extension Bridge Auto-Sync and ChatGPT Companion slice.
The chatgpt companion remains a manual preview/copy/open helper, not an automation path.

## Scope

P4.5 is complete when:

- backend snapshot intake requires CLARA auth;
- extension snapshots are always `provider: extension` and `official_api: false`;
- supported extension channels are `whatsapp`, `instagram`, and `tiktok`;
- auto-sync is visible and limited to the active conversation;
- unchanged snapshots are deduplicated by `snapshot_hash` with debounce/throttle behavior;
- ChatGPT Companion context preview/copy/open is user-triggered only;
- no provider cookies, ChatGPT cookies, tokens, raw DOM, raw HTML, raw provider payload, inbox crawler, background crawler, or auto-send path exists.

## Validation

```bash
cd services/api
npm run typecheck
npm run test -- extension-snapshot-route.test.ts p45-final-security-regression.test.ts p4-final-security-regression.test.ts
npm run build
npm audit --omit=dev --audit-level=high

cd ../../apps/extension
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd ../..
bash scripts/validate-repo-structure.sh
bash -n scripts/staging-smoke.sh
docker compose -f docker-compose.prod.example.yml config
```

## Rollback

Rollback is code-only:

- disable or remove the extension package from the release branch;
- keep backend snapshot intake out of operator workflow if the extension package is not shipped;
- do not delete already persisted safe extension snapshots without a data-retention decision.

## Operator Notes

The extension bridge is operator-assisted. Official provider APIs remain preferred for production automation.
