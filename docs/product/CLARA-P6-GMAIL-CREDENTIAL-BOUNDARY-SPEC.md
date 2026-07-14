# CLARA P6 Gmail Credential Boundary Spec

## Purpose

Gmail credentials remain backend-only. CLARA may show provider readiness, but it must never expose Gmail OAuth secrets, access tokens, refresh tokens, Authorization headers, raw provider payloads, raw provider errors, cookies, or client secrets to API callers or the dashboard.

## Boundary

- Backend AuthContext is the source of organization, workspace, user, and role.
- Workspace-scoped routes must not trust `organization_id`, `workspace_id`, or role values from query, body, or headers.
- Gmail credential material stays inside the token vault and provider-client boundaries.
- Dashboard receives only safe health DTOs: provider, channel, connected/degraded/auth_required/rate_limited status, safeReasonCode, safe summary, timestamps, and next recommended action.
- Credential mutation UI is not implemented in this PR.

## Forbidden Output

The API and dashboard must not return or render:

- access token
- refresh token
- Authorization header
- client secret
- raw provider payload
- raw Gmail payload
- raw provider error body
- provider cookies or browser session material

## Production Rule

Official API required. Scraping, browser automation, QR/session hijacking, session-cookie reuse, and unofficial provider clients remain blocked production strategies.
