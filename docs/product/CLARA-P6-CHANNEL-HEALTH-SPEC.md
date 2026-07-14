# CLARA P6 Channel Health Spec

## Purpose

Channel Health gives operators safe read-only visibility into provider readiness across Gmail, Webchat, WhatsApp, Instagram, and TikTok.

## Endpoint

```text
GET /api/v1/channels/health
```

## Access

- Requires authentication.
- Viewer, agent, and owner may read safe channel health because it is read-only.
- backend AuthContext is the authorization source of truth.
- The route is workspace-scoped and ignores or rejects client-supplied organization/workspace authority.

## Safe DTO

```text
channel
provider
status
readinessLevel
workspaceId
accountId
safeSummary
safeReasonCode
lastCheckedAt
nextRecommendedAction
```

Allowed statuses:

```text
connected
disconnected
degraded
auth_required
rate_limited
error
simulated_only
unsupported
```

## Security

Responses must not include access token, refresh token, Authorization header, client secret, raw provider payload, raw Gmail payload, raw provider error, raw DOM, raw HTML, cookies, or provider session data.

## Scope Limits

This PR does not add credential mutation UI, OAuth connect UI, real Instagram/TikTok provider integration, scraping, browser automation, webhook/outbox/retry/idempotency changes, AI draft generation, CRM mutations, analytics, or billing.
