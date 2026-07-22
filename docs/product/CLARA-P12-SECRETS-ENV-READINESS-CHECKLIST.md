---
project: "CLARA"
artifact: "P12 Secrets and Env Readiness Checklist"
status: "active"
owner: "CLARA Security and Engineering"
classification: "secrets-readiness"
---

# CLARA P12 Secrets / Env Readiness Checklist

P12-PR-01 is complete. P12-PR-02 is complete. P12-PR-03 is current.

CLARA is not GA yet. CLARA is not production deployed yet.

The deployment checklist is a readiness gate, not deployment execution.

No real provider/payment/AI/outbound activation happens in this PR.

## Required Checks

- No `.env`, `.env.local`, or `.env.production` file is committed.
- No access token, refresh token, cookie, Authorization header, API key, service role key, provider credential, private key, or production credential appears in source.
- Secrets/environment variables are supplied by platform config or a secret manager.
- Safe placeholder examples must not look like real credentials.
- Config evidence records only presence/status, never secret values.
- Logs and screenshots must not include tokens, cookies, auth headers, raw provider payload, raw webhook payload, raw customer messages, raw prompts, or raw telemetry.
