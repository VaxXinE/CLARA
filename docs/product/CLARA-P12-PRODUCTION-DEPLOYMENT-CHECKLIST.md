---
project: "CLARA"
artifact: "P12 Production Deployment Checklist"
status: "active"
owner: "CLARA Product and Engineering"
classification: "deployment-readiness"
---

# CLARA P12 Production Deployment Checklist

P12-PR-01 is complete. P12-PR-02 is complete. P12-PR-03 is current.

CLARA is not GA yet.

CLARA is not production deployed yet.

The deployment checklist is a readiness gate, not deployment execution.

No real provider/payment/AI/outbound activation happens in this PR.

## Readiness Areas

| Area | Required check | Pass evidence |
| --- | --- | --- |
| API | API runtime config is reviewed for production-safe auth, database, CORS, logging, rate limit, and request size values. | config review row |
| Dashboard | Dashboard runtime config points to the approved API URL and provider mode only when provider config is ready. | build/config review |
| Extension | Extension runtime config remains manual-assisted and cannot deploy, rollback, auto-send, or crawl in background. | extension boundary test |
| Auth | Auth provider / JWKS / issuer values are set through secret/platform config, not source. | config evidence |
| Workspace | Workspace membership lookup remains backend-authoritative; client workspaceId is never authority. | auth/workspace tests |
| Database | Database migrations have forward plan, backup checkpoint, rollback/forward-fix decision, and dry-run evidence. | migration checklist |
| Backup | Backup readiness is reviewed before any production cutover. | backup readiness row |
| Secrets | Secret management is platform-owned; no `.env` or credentials are committed. | secret scan |
| CORS | CORS origin is explicit, no wildcard production origin. | config review |
| TLS | TLS/HTTPS certificate is valid before cutover. | TLS check |
| DNS | Domain/DNS target, TTL, and rollback target are documented. | DNS check |
| Logging/Redaction | Logs redact tokens, cookies, auth headers, raw payloads, raw prompts, and customer content. | redaction tests |
| Rate Limit | Rate limit and request size limits are enabled and documented. | config/test output |
| Provider readiness | Provider integrations remain readiness-gated unless explicitly approved. | provider checklist |
| Billing readiness | Billing readiness only; no payment provider integration, charging, invoice, checkout, subscription mutation, or quota enforcement. | billing guard test |
| AI review-only | AI surfaces remain review-only and do not call real AI providers or auto-send. | AI guard test |
| Analytics safe-summary | Analytics output stays aggregate-first and safe-summary only. | analytics tests |
| Extension boundary | Extension remains user-assisted and does not expose tokens, cookies, raw DOM, raw HTML, or provider payloads. | extension tests |

## Deployment Gate

Before beta deployment, complete local demo smoke, beta smoke, config readiness,
secret readiness, database migration readiness, and no-go review.

Before GA deployment, complete beta evidence review, support workflow readiness,
known limitations review, rollback drill evidence, and final GA audit.

Any blocker in the go/no-go policy stops the release candidate.
