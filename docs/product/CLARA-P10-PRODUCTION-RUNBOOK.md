---
project: "CLARA"
artifact: "P10 Production Runbook"
status: "final"
owner: "CLARA Product, Engineering, Security, and Operations"
classification: "production-runbook"
---

# CLARA P10 Production Runbook

## Purpose

This runbook closes Final P10 Enterprise Hardening / Compliance readiness. It is
for operator validation only; it is not certification.

## Local Validation

```bash
bash scripts/validate-p10-final-enterprise-hardening-compliance-audit-runbook.sh
```

The validator runs API, dashboard, extension, repo structure, production
runtime config, Docker compose config, and runtime source safety checks.

## Production Config Checklist

- `NODE_ENV=production`.
- `AUTH_MODE=provider`.
- `MOCK_AUTH_ENABLED=false`.
- `DATABASE_URL` comes from platform secrets.
- `CORS_ORIGIN` is explicit.
- Debug logging is disabled.
- No `.env`, private keys, tokens, cookies, API keys, or provider secrets are
  committed.

## Runtime Config Doctor

Run before deployment:

```bash
bash scripts/validate-production-runtime-config.sh
```

Failures are release blockers.

## Dashboard QA

- Enterprise panels load as read-only.
- Compliance copy says compliance readiness, not certification.
- There are no Export, Download, Execute, Apply, Revoke Session, Force Logout,
  Enable SSO, Enable MFA, Change Role, Grant Permission, Send Message, Create
  Task, Assign Owner, Update Status, Write Note, or unsafe HTML controls.

## Extension Boundary QA

- Extension remains active-conversation-only and manual-assisted.
- Extension does not request enterprise/compliance internals.
- Extension does not read tokens, cookies, raw DOM, raw HTML, raw provider
  payload, raw webhook payload, raw evidence, or raw prompts.

## Incident Readiness Workflow

1. Open incident response readiness.
2. Confirm safe checklist status and reason codes.
3. Use external incident process for real escalation.
4. Do not trigger notification, escalation, or automation from CLARA P10.

## Backup / Restore Readiness Workflow

1. Open backup / restore readiness.
2. Confirm readiness summary and documented gaps.
3. Use managed database/platform tooling for real backup and restore.
4. Do not execute backup or restore through CLARA P10.

## Evidence Readiness Workflow

1. Open evidence readiness.
2. Confirm safe evidence summary only.
3. Use approved external evidence collection process for formal audits.
4. Do not export or download evidence through CLARA P10.

## Rollback Guidance

- Roll back application image/config with the deployment platform.
- Do not roll back database migrations without review.
- Preserve audit logs and incident notes.
- If sensitive output is suspected, disable enterprise readiness routes at the
  edge and request security review.

## Release Readiness Checklist

- P10 validator passes.
- Security review requested.
- Production config doctor passes.
- No secrets or build artifacts are tracked.
- P10 docs link to P11 handoff.
