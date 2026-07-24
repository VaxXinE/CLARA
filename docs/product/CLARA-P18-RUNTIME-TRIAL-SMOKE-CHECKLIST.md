# CLARA P18 Runtime Trial Smoke Checklist

P18-PR-01 is complete.
P18-PR-02 is current.
P18 validates controlled internal runtime behavior only.

## Required Smoke Path

- Auth/session readiness: operator has an authenticated session and backend AuthContext resolves the user.
- Workspace membership boundary: backend workspace membership is active; client-supplied workspaceId is not authoritative.
- Extension active-chat capture boundary: capture is user-assisted, active-chat only, visible text only, and no hidden conversation/background crawl/mass scrape occurs.
- Snapshot sanitization/redaction: secrets/tokens/cookies/auth headers/API keys/localStorage/sessionStorage secrets/raw DOM/raw HTML/payment data are absent before ingestion.
- Backend ingestion/dedup: snapshot hash/idempotency prevents duplicate materialization.
- AI-ready context: context is sanitized, redacted, bounded, and separates untrusted customer text from instructions.
- Controlled backend AI analysis: AI analysis remains backend/server-side and uses server-only provider secrets.
- Safe analysis persistence: no raw prompts, raw customer messages as prompts, raw provider payloads, raw AI responses, or raw webhook payloads are persisted.
- Dashboard review UI: operator can review safe AI output; extension must not call AI providers directly.
- No auto-send: outbound auto-send remains disabled.
- No secret exposure: runtime evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data.

## Non-Launch Guardrails

- P18 is not public SaaS launch.
- P18 is not production deployment.
- Billing/payment remains deferred.
- Official WA/IG/TikTok APIs remain not activated.
- Extension-assisted ingestion remains internal/controlled/user-assisted.
- AuthContext and workspace membership remain source of truth.
- Stop criteria and manual rollback guidance must be reviewed before broader rollout.
