---
project: "CLARA"
artifact: "P5 Production Auth Foundation Spec"
status: "draft"
owner: "CLARA Engineering"
classification: "product-spec"
---

# CLARA P5 Production Auth Foundation Spec

P5 starts the production auth boundary. Local mock auth stays useful for demos, but production must fail closed unless provider auth and workspace membership resolution are configured.

## Required Production Mode

- `NODE_ENV=production`
- `AUTH_MODE=provider`
- `MOCK_AUTH_ENABLED=false`
- `AUTH_PROVIDER=supabase` until another provider is explicitly implemented
- `DATABASE_URL` from platform secrets, never from committed files
- `CORS_ORIGIN` set to explicit dashboard origins, never `*`
- `LOG_LEVEL=info` or `warn`

Supabase provider mode requires:

- `SUPABASE_AUTH_JWKS_URL`
- `SUPABASE_AUTH_ISSUER`

Better Auth remains a placeholder until a later PR implements verification.

## Runtime Contract

- Missing, malformed, invalid, expired, or wrong-issuer bearer tokens return safe `401`.
- Mock headers are ignored in provider mode.
- A valid provider identity is not enough to authorize product data.
- Provider identity must resolve to an internal CLARA user.
- The internal user must have an active workspace membership.
- Backend AuthContext derives `organization_id`, `workspace_id`, and role.
- Client-provided tenant or role fields are never authorization authority.

## Security Boundaries

- Dashboard never decides final authorization.
- Frontend never receives service role keys.
- Provider access tokens are not logged.
- Provider access tokens are not persisted by the dashboard.
- Cross-workspace access continues to return safe not-found behavior.
- Production debug, trace, and silent logs are rejected.

## Non-Goals

- No full login UI in this PR.
- No workspace switcher in this PR.
- No invite system in this PR.
- No real WhatsApp, Instagram, TikTok, or Gmail dashboard OAuth UI in this PR.
