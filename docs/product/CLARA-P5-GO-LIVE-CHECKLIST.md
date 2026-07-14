# CLARA P5 Go-Live Checklist

Use this before any production-like P5 auth/security rollout.

## Configuration

- No `.env`, `.env.local`, or `.env.production` files are committed.
- API runs with `NODE_ENV=production`.
- API uses `AUTH_MODE=provider`.
- API has `MOCK_AUTH_ENABLED=false`.
- Provider issuer and JWKS config are set through platform environment.
- `DATABASE_URL` is set through platform environment.
- `CORS_ORIGIN` is explicit and non-wildcard.
- `LOG_LEVEL` is `info`, `warn`, `error`, or `fatal`.
- Dashboard uses only public `VITE_*` values.
- Dashboard does not include a provider service-role key.

## Validation

- GitHub Actions are green.
- `bash scripts/validate-production-runtime-config.sh` passes.
- `bash scripts/production-smoke-check.sh` syntax check passes.
- `bash scripts/validate-p5-final-security-audit.sh` passes.
- `/health` returns 200.
- `/ready` returns expected healthy status.
- Unauthenticated protected endpoints return safe 401.

## Manual Auth Smoke

- Provider login reaches dashboard shell only after `/api/v1/me` succeeds.
- Provider login without CLARA membership shows workspace access required.
- Owner can read user/role readiness.
- Agent/viewer cannot read owner-only member data.
- No invite, role update, or delete user behavior is available.

## Security Signoff

- No Authorization header, provider token, cookie, raw provider payload, or
  client secret is rendered in UI.
- Extension remains active-conversation scoped and manual-assisted.
- Owner bootstrap changes are audited.
- Incident response owner is assigned before go-live.
