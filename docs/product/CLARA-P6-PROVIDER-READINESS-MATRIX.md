# CLARA P6 Provider Readiness Matrix

Provider Readiness Matrix for production provider/channel hardening.

| Channel | Current status | Production readiness level | Provider type | Supported mode | Unsupported mode | Allowed data | Disallowed data | Auth/credential boundary | Inbound boundary | Outbound boundary | Audit requirement | Observability requirement | Next hardening PR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Gmail / Email | production foundation exists | production-hardening-required | official API | OAuth-backed Gmail API boundary, simulated local/test send | token leakage, raw payload storage, frontend secrets | scoped message metadata, normalized text, safe headers | access tokens, refresh tokens, Authorization header, raw Gmail payload, raw attachment bytes | encrypted token vault and server-only access token provider | bounded list/get/sync only | explicit human/operator send only | audit OAuth, sync, send, failure | health, sync status, safe reason codes | P6-PR-02 |
| Webchat | foundation exists | production-hardening-required | first-party web channel | public widget inbound by server-resolved channel account, simulated reply/status | raw payload logging, client-supplied tenant scope | validated message text, contact metadata, page metadata | cookies, raw request payload, IP persistence, provider raw errors | channel account public key resolves scope server-side | inbound route exists and needs hardening | explicit human reply only | audit inbound/outbound/failure | request metrics, delivery status | P6-PR-03 |
| WhatsApp | official inbound plus simulated outbound exists | production-hardening-required | planned official API only | official webhook inbound, simulated/test outbound, user-assisted extension snapshot | scraping blocked, session cookie blocked, browser automation blocked, QR/session hijacking blocked | official webhook text metadata, safe delivery records | WhatsApp Web cookies, browser session tokens, raw provider payloads, media bytes | official provider secrets server-side only | signed webhook boundary only | real send not production-ready | audit webhook/send attempt/failure | webhook health and retry status | P6-PR-03 |
| Instagram | decision-only metadata | planned-official-api-only | official API only | none yet; extension bridge snapshot is separate user-assisted convenience | scraping blocked, session cookie blocked, browser automation blocked | future official API metadata only | provider cookies, session tokens, raw DOM, raw HTML | no production credential boundary yet | not implemented | not implemented | required before launch | required before launch | future P6/P7 |
| TikTok | decision-only metadata | planned-official-api-only | official API only | none yet; extension bridge snapshot is separate user-assisted convenience | scraping blocked, session cookie blocked, browser automation blocked | future official API metadata only | provider cookies, session tokens, raw DOM, raw HTML | no production credential boundary yet | not implemented | not implemented | required before launch | required before launch | future P6/P7 |
| Browser Extension Bridge | operator-assisted bridge exists | user-assisted-extension-only | extension convenience layer | active visible chat, user-assisted snapshot only | official provider replacement, background crawling, auto-send | bounded visible text snapshot | cookies, session tokens, provider tokens, raw DOM, raw HTML | CLARA auth only; no provider credential storage | active visible chat only | no outbound provider send | audit safe snapshot metadata | sync status only | future extension packaging |
| ChatGPT Companion | preview/copy/open helper exists | user-assisted-extension-only | user tool helper | preview/copy/open/manual only | auto-submit, token capture, raw provider payload | bounded safe context text | ChatGPT cookies, tokens, raw DOM, raw HTML | no ChatGPT credential storage | not provider inbound | no customer send | none until productized | operator action visibility | future product decision |

## Production-Ready Definition

A channel is production-ready only when:

- official API only policy is satisfied where a third-party provider is used;
- credentials live server-side or in an approved secret store;
- backend authorization source of truth is enforced;
- workspace scope comes from backend AuthContext or server-resolved channel
  account mapping;
- inbound verification, idempotency, and replay protection exist where needed;
- outbound send is explicit human/operator action unless separately approved;
- audit and observability cover success, failure, and skipped outcomes;
- raw provider payloads, provider tokens, cookies, raw DOM, and raw HTML are not
  logged, stored, or returned.
