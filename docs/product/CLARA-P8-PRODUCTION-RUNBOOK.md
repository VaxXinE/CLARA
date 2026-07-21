---
project: "CLARA"
artifact: "P8 Production Runbook"
status: "final"
owner: "CLARA Operations and Engineering"
classification: "operations-runbook"
---

# CLARA P8 Production Runbook

## Local Validation

```bash
bash scripts/validate-p8-final-crm-workflow-audit-runbook.sh
```

For targeted checks:

```bash
cd services/api
npm run typecheck
npm run test
npm run build

cd ../../apps/dashboard
npm run typecheck
npm run test
npm run build

cd ../extension
npm run typecheck
npm run test
npm run build
```

## Production Config Expectations

- API must run with production auth guardrails enabled.
- P8 must continue to use Backend AuthContext.
- P8 must remain workspace-scoped.
- No P8 runtime requires real AI provider keys.
- P8 has no outbound send or scheduler execution path.

## Auth / Workspace Troubleshooting

If a P8 route returns 401, verify provider auth and session validation.

If a P8 route returns 403, verify role membership. Frontend role labels are UX
only and are not authorization truth.

If a P8 route returns 404, verify the customer exists in the same organization
and workspace. Cross-workspace lookup must stay hidden behind safe not-found
behavior.

## Audit Troubleshooting

P8 audit writes are audit-only. Audit failures should be investigated through
correlation IDs and safe structured logs. Do not inspect or print tokens,
cookies, raw provider payload, raw webhook payload, raw DOM, raw HTML, or raw
prompts.

## Customer Intelligence Troubleshooting

Profile and timeline intelligence are deterministic read models. If output
looks stale, check seeded/demo data, database repository mode, and workspace
scope before changing business logic.

## Proposal / Readiness Troubleshooting

Action proposal, follow-up proposal, owner assignment readiness, and
lifecycle/status readiness are review-only/readiness-only. They should return
mutationExecuted=false and actionExecuted=false.

## Extension Boundary Troubleshooting

The extension may sync active conversation snapshots, but it must not execute
CRM actions, create tasks, write notes, assign owners, update lifecycle/status,
send outbound messages, or read/write CRM audit internals directly.

## Incident Response

1. Capture correlation ID and safe route name.
2. Confirm whether auth, workspace scope, or redaction failed.
3. Disable or roll back the affected deployment if P8 exposes sensitive data or
   mutation controls.
4. Preserve audit evidence without copying secrets or customer raw payloads.
5. Request security review before re-enabling changed behavior.

## Rollback Notes

Rollback application code first. Database rollback should be reviewed separately
because P8 audit logs may contain production evidence that should not be
destroyed casually.

## Escalation Notes

Escalate immediately if any P8 surface exposes access token, refresh token,
cookies, Authorization header, raw provider payload, raw webhook payload, raw
DOM, raw HTML, raw prompt, API key/secret, or performs CRM/customer mutation.
