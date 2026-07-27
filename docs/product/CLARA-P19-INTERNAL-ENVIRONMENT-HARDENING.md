# CLARA P19 Internal Environment Hardening

Internal team usage must use provider auth. API internal runtime requires:

```text
NODE_ENV=production
AUTH_MODE=provider
AUTH_PROVIDER=supabase
MOCK_AUTH_ENABLED=false
INTERNAL_CRM_RUNTIME_ENABLED=true
DATABASE_URL=<secret-managed-postgres-url>
SUPABASE_AUTH_JWKS_URL=<provider-jwks-url>
SUPABASE_AUTH_ISSUER=<provider-issuer>
CORS_ORIGIN=<explicit-internal-dashboard-origin>
RATE_LIMIT_ENABLED=true
LOG_LEVEL=info
```

Dashboard internal runtime requires:

```text
VITE_AUTH_MODE=provider
VITE_API_BASE_URL=<internal-api-origin>
VITE_SUPABASE_URL=<public-supabase-url>
VITE_SUPABASE_ANON_KEY=<public-anon-key>
```

Do not put provider secrets, service role keys, AI provider keys, tokens,
cookies, Authorization headers, raw provider payloads, or payment data in repo
config. CORS/internal origin must be explicit and not wildcard.

