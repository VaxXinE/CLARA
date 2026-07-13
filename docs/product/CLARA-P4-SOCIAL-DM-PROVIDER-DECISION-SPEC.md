---
project: "CLARA"
artifact: "P4 Social DM Provider Decision Spec"
status: "implemented"
classification: "product-security-spec"
last_updated: "2026-07-13"
---

# CLARA P4 Social DM Provider Decision Spec

This p4 spec records the Instagram and TikTok decision for Phase 4 closure.

## Decision

Instagram and TikTok remain planned metadata only.

Future implementation must use official provider APIs, platform approval, and a security/compliance review before any production rollout.

## Provider Status

| Provider | Status | Production available | Notes |
| --- | --- | --- | --- |
| Instagram | planned | no | Official API required before implementation |
| TikTok | planned | no | Official API required before implementation |

## Rejected Strategies

The following are rejected for production:

- Scraping.
- Browser automation.
- Session-cookie reuse.
- QR hijacking.
- Unofficial client libraries.
- Credential capture.

## Non-Goals

- No Instagram or TikTok inbound webhook.
- No Instagram or TikTok outbound send.
- No dashboard Instagram or TikTok UI.
- No provider token storage.
- No real external provider network calls.
- No AI auto-send.

## Security Rules

- Do not commit provider secrets, access tokens, refresh tokens, API keys, cookies, or private keys.
- Do not store raw provider payloads or raw provider errors.
- Do not trust `organization_id` or `workspace_id` from request body/query.
- Keep all tenant/workspace resolution server-side.
