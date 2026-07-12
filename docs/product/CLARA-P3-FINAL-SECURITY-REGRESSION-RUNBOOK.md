---
project: "CLARA"
artifact: "P3 Final Security Regression Runbook"
version: "1.0.0"
status: "implemented"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-12"
classification: "security-runbook"
related_documents:
  - "./CLARA-P3-GMAIL-INBOUND-FINAL-HARDENING-SPEC.md"
  - "./CLARA-P3-GMAIL-OUTBOUND-AUDIT-DASHBOARD-STATUS-SPEC.md"
  - "./CLARA-P3-GMAIL-SCHEDULER-OPERATOR-HARDENING-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Final Security Regression Runbook

## Phase 3 Scope Summary

Phase 3 closes the Gmail channel foundation:

- OAuth boundary, provider account metadata, encrypted token vault, and token refresh boundaries.
- Inbound fetch, normalization, materialization, sync state, manual sync, scheduler runtime, lifecycle, operator status, and manual tick.
- Dashboard read-only Gmail scheduler and outbound delivery visibility.
- Gmail outbound send boundary, safe delivery persistence, reply-send integration, audit logging, and internal smoke tests.

## Gmail Inbound Operational Checklist

- Confirm Gmail API mode is explicit and not accidentally enabled in production.
- Run manual sync with low bounds first.
- Verify sync responses include only safe counters, timestamps, `reason_code`, and scoped account ids.
- Confirm no raw Gmail payload, raw provider error body, attachment bytes, token material, AI draft, or outbound send is produced by inbound sync.

## Gmail Scheduler Operational Checklist

- Keep scheduler disabled by default.
- Use `GET /api/v1/integrations/gmail/scheduler/status` for safe status checks.
- Use `POST /api/v1/integrations/gmail/scheduler/tick` only for bounded operator smoke.
- Confirm viewer is blocked and owner/agent actions are audited.
- Confirm rate limits and running-tick guards remain enabled.

## Gmail Outbound / Reply Send Checklist

- Outbound send must be an explicit authenticated human/operator request.
- Reply send must be an explicit authenticated human/operator request.
- Viewer must remain blocked from mutation.
- Failed provider sends must map to safe `reason_code`, not raw provider errors.
- Outbound delivery records must store scoped metadata only.
- AI drafts must never auto-send.

## OAuth / Token Security Checklist

- Do not commit Gmail OAuth client secrets, access tokens, refresh tokens, provider API keys, or private keys.
- OAuth callback responses must not include authorization code, raw state, nonce, PKCE verifier, access token, refresh token, or client secret.
- Token exchange and refresh boundaries must store tokens only through the vault boundary and return safe metadata only.
- Production config must fail closed when token/provider config is incomplete.

## Audit / Logging Checklist

- Audit metadata may include only provider, status, safe reason code, conversation id, outbound delivery id, recipient count, and correlation id.
- Logs must redact Authorization headers, cookies, access tokens, refresh tokens, client secrets, raw provider payloads, and raw provider error bodies.
- Use correlation ids for incident investigation instead of dumping payloads.

## Dashboard Safety Checklist

- Dashboard Gmail scheduler and outbound delivery surfaces are read-only.
- No resend, retry, manual tick, OAuth management, or Gmail send UI exists in this phase.
- Dashboard must not render token material, raw provider payload, or raw provider errors.
- `dangerouslySetInnerHTML` remains forbidden.

## Staging Smoke Procedure

```bash
cd services/api
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd ../../apps/dashboard
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd ../..
bash scripts/validate-repo-structure.sh
bash -n scripts/staging-smoke.sh
docker compose -f docker-compose.prod.example.yml config
```

## Manual Tick Smoke Procedure

From an authenticated owner/agent operator session:

```bash
curl -sS -X POST "$CLARA_API_BASE_URL/api/v1/integrations/gmail/scheduler/tick" \
  -H "content-type: application/json" \
  -d '{"max_accounts_per_tick":1,"max_messages_per_account":1}'
```

Expected safe fields:

- `status`
- safe `reason_code`
- checked/scheduled/skipped/failed counts
- timestamps
- `correlation_id`

## Outbound Simulated Smoke Procedure

From an authenticated owner/agent operator session in local/test simulated mode:

```bash
curl -sS -X POST "$CLARA_API_BASE_URL/api/v1/integrations/gmail/outbound/send" \
  -H "content-type: application/json" \
  -d '{"provider_account_id":"gmail_account_demo","conversation_id":"conv_demo_budi_stock","to":["customer@example.test"],"body":"Human reviewed reply."}'
```

Expected safe fields:

- `provider=gmail`
- `status=simulated` or `failed`
- safe `reason_code`
- `outbound_delivery_id`
- `correlation_id`

## Incident Response Steps

1. Disable scheduler config and stop manual ticks.
2. Disable Gmail outbound route wiring if send safety is suspect.
3. Rotate any potentially exposed provider secrets through the secret manager.
4. Preserve safe audit logs and correlation ids.
5. Do not copy raw Gmail payloads or token values into tickets.
6. Roll back the API/dashboard image if safe response contracts regress.

## Rollback Steps

- Roll back application image first.
- Keep database rollback separate and reviewed because token/provider metadata tables may contain operational state.
- Disable Gmail scheduler before rolling back scheduler-related code.
- Re-run staging smoke after rollback.

## Production Readiness Checklist

- Real provider config comes from platform secrets, not repo files.
- Mock/demo auth is blocked in production.
- Scheduler is disabled unless intentionally enabled.
- Rate limits and request body limits are enabled.
- CORS origin is explicit.
- Logs are structured and redacted.
- Security review is complete for OAuth, token vault, inbound sync, outbound send, audit, and dashboard visibility.

## Known Non-Goals

- No SMTP or IMAP integration.
- No resend/retry button.
- No dashboard Gmail compose/send UI.
- No dashboard OAuth account management UI.
- No queue adapter, retry queue, distributed lock, or leader election.
- No attachment sending.
- No raw Gmail payload persistence.
- No token display.
- No AI auto-send.

## Post-P3 Handoff Notes

Next phase should focus on real provider operations only after security review:

- production OAuth rollout,
- provider account management UI,
- real Gmail send/fetch staging validation,
- queue/retry architecture,
- delivery reconciliation,
- observability and alerting,
- formal rollback drills.
