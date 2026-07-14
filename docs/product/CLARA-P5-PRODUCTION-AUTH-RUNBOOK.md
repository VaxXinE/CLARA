# CLARA P5 Production Auth Runbook

## Local And Demo Mode

Use mock auth only for local/demo/test. Never enable mock auth in production.

```text
AUTH_MODE=mock
MOCK_AUTH_ENABLED=true
```

## Production API Mode

Production must fail closed unless provider auth is configured.

Required API settings:

```text
NODE_ENV=production
AUTH_MODE=provider
AUTH_PROVIDER=supabase
MOCK_AUTH_ENABLED=false
SUPABASE_AUTH_JWKS_URL=<set in secret manager or platform env>
SUPABASE_AUTH_ISSUER=<set in secret manager or platform env>
DATABASE_URL=<set in secret manager or platform env>
CORS_ORIGIN=<explicit dashboard origin>
RATE_LIMIT_ENABLED=true
LOG_LEVEL=info
```

Do not commit `.env` files or production secrets.

## Dashboard Provider Mode

Required dashboard public settings:

```text
VITE_AUTH_MODE=provider
VITE_API_BASE_URL=<public API URL>
VITE_SUPABASE_URL=<public Supabase URL>
VITE_SUPABASE_ANON_KEY=<public anon key only>
```

Never put a Supabase service-role key in frontend config.

## Owner Bootstrap

1. Authenticate through the provider.
2. Ensure the provider subject maps to a CLARA user.
3. Ensure that user has one active workspace membership.
4. Ensure the owner role is stored server-side in CLARA membership data.
5. Verify `/api/v1/me` returns backend-derived organization, workspace, and
   role.

## Troubleshooting

- Provider session exists but dashboard shows workspace access required: create
  or repair the CLARA membership record.
- `/api/v1/me` returns 401: provider token is missing, invalid, or rejected.
- `/api/v1/me` returns 403: provider identity is known but lacks valid active
  workspace membership.
- `/ready` fails: check database connectivity and production config.

## Checks

```bash
curl -i "$CLARA_API_BASE_URL/health"
curl -i "$CLARA_API_BASE_URL/ready"
bash scripts/validate-production-runtime-config.sh
bash scripts/validate-p5-final-security-audit.sh
```
