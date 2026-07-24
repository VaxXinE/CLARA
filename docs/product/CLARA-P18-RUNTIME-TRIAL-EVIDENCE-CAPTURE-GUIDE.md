# CLARA P18 Runtime Trial Evidence Capture Guide

P18-PR-02 is current.
Evidence capture proves controlled internal runtime behavior only.

## Safe Evidence To Capture

- Date, workspace label, operator role, and sanitized scenario name.
- Safe counts: snapshots attempted, snapshots accepted, deduped snapshots, AI analyses requested, AI analyses persisted.
- Safe status: pass/fail, reason code, timestamp, and checklist item reference.
- Redacted screenshots of dashboard review UI if no customer-sensitive content is visible.
- Links to sanitized issue entries using the known issue capture template.

## Forbidden Evidence

Runtime evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data.

Do not capture browser localStorage/sessionStorage secrets, hidden conversations, full page dumps, raw extension payloads, raw AI provider responses, provider credentials, or unofficial scraping credentials.

## Boundary Rules

- AI analysis remains backend/server-side.
- AI provider secrets remain server-only.
- Extension must not call AI providers directly.
- AuthContext and workspace membership remain source of truth.
- Client-supplied workspaceId is not authoritative.
- P18 is not public SaaS launch and not production deployment.
- Billing/payment remains deferred.
- Official WA/IG/TikTok APIs remain not activated.
- Outbound auto-send remains disabled.
