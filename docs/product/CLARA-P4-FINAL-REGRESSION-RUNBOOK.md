---
project: "CLARA"
artifact: "P4 Final Regression Runbook"
status: "implemented"
classification: "security-runbook"
last_updated: "2026-07-13"
---

# CLARA P4 Final Regression Runbook

This p4 runbook closes the multi-channel foundation phase.

## Scope Summary

Implemented:

- Gmail remains the most complete channel foundation.
- Webchat inbound and simulated human-triggered reply visibility exist.
- WhatsApp official inbound and simulated human-triggered outbound routing exist.
- Instagram and TikTok are decision-only planned metadata.
- Multi-channel audit metadata policy is allowlisted.

Not implemented:

- Real Instagram/TikTok integration.
- Real WhatsApp outbound provider send.
- Dashboard Social DM UI.
- Queue/replay delivery system.
- Scheduler-triggered outbound send.
- AI auto-send.

## Security Regression Checklist

- Channel capability responses expose no token, secret, raw provider config, raw provider payload, or raw provider error.
- Viewer cannot mutate sends.
- Cross-workspace access returns safe not-found behavior.
- Request body/query `organization_id` and `workspace_id` are not authorization truth.
- Audit metadata excludes message bodies, cookies, Authorization headers, tokens, secrets, raw provider payloads, and raw provider errors.
- Dashboard status panels render text safely and do not use `dangerouslySetInnerHTML`.

## Social DM Checklist

- Instagram and TikTok remain `planned`.
- No route sends or receives Instagram/TikTok DMs.
- Official API and compliance review are required before implementation.
- Scraping, browser automation, session-cookie reuse, QR hijacking, credential capture, and unofficial clients remain rejected.

## Validation

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
