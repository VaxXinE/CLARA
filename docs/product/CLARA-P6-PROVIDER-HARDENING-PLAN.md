# CLARA P6 Provider Hardening Plan

P6 starts after the P5 production auth/security foundation is complete.

## Goal

Make every provider/channel production boundary explicit before adding more
real provider behavior.

## PR Plan

| PR       | Scope                                                 |
| -------- | ----------------------------------------------------- |
| P6-PR-01 | Provider Readiness Matrix and Official Channel Policy |
| P6-PR-02 | Gmail Credential Boundary and Channel Health          |
| P6-PR-03 | Webhook, Outbox, Retry, and Idempotency Hardening     |
| P6-PR-04 | Observability, Audit Trail, and Final P6 Runbook      |

## Rules

- Production provider integrations must use official API only or an explicitly
  approved first-party channel.
- Scraping blocked.
- Session cookie blocked.
- Browser automation blocked as a production provider strategy.
- Backend authorization source of truth remains mandatory.
- Workspace scope must come from backend AuthContext.
- Provider tokens, cookies, raw provider payloads, raw DOM, and raw HTML must
  not be exposed to frontend or extension code.

## Non-Goals

- No real WhatsApp Cloud API implementation in P6-PR-01.
- No real Instagram DM implementation in P6-PR-01.
- No real TikTok DM implementation in P6-PR-01.
- No browser automation provider.
- No AI auto-send.
