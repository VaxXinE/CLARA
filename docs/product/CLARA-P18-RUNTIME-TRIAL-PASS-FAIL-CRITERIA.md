# CLARA P18 Runtime Trial Pass/Fail Criteria

P18-PR-02 is current.

## Pass Criteria

- Auth/session readiness passes with backend AuthContext.
- Workspace membership boundary passes and client-supplied workspaceId is not authoritative.
- Extension active-chat capture stays internal/controlled/user-assisted.
- Snapshot sanitization/redaction removes disallowed fields before persistence.
- Backend ingestion/dedup produces safe, workspace-scoped records.
- AI-ready context is sanitized, bounded, and instruction-separated.
- Controlled backend AI analysis completes or fails closed with safe reason codes.
- Safe analysis persistence excludes raw prompts, raw customer messages as prompts, raw provider payloads, and raw AI responses.
- Dashboard review UI renders safe output only.
- No outbound auto-send occurs.
- Evidence follows the evidence redaction and retention/disposal rules.

## Fail Criteria

- Any secret/token/cookie/auth header is captured, logged, persisted, or shown.
- Any raw provider payload, raw webhook payload, raw HTML, raw DOM, raw prompt, or raw customer message as prompt is captured as evidence.
- Extension calls AI providers directly.
- AI provider secrets become dashboard-readable or extension-readable.
- Workspace membership or AuthContext is bypassed.
- Client-supplied workspaceId becomes authoritative.
- Official WA/IG/TikTok APIs, billing/payment, production deployment automation, public launch behavior, or outbound auto-send is activated.
- Stop criteria trigger and manual rollback guidance is not followed.
