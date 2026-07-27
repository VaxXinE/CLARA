---
project: "CLARA"
artifact: "P19 Provider Auth Internal Runtime"
status: "current"
owner: "CLARA Product and Engineering"
classification: "auth-runtime"
---

# P19 Provider Auth Internal Runtime

Provider auth is the only approved path for real internal CRM usage.

## API Env

```text
INTERNAL_CRM_RUNTIME_ENABLED=true
AUTH_MODE=provider
AUTH_PROVIDER=supabase
MOCK_AUTH_ENABLED=false
DATABASE_URL=<secret-managed postgres URL>
SUPABASE_AUTH_JWKS_URL=<provider JWKS URL>
SUPABASE_AUTH_ISSUER=<provider issuer>
CORS_ORIGIN=<explicit dashboard origin>
```

Provider mode fails closed when auth is missing, invalid, or not mapped to an
active workspace membership.

## Dashboard Env

```text
VITE_AUTH_MODE=provider
VITE_API_BASE_URL=<API origin>
VITE_SUPABASE_URL=<public Supabase URL>
VITE_SUPABASE_ANON_KEY=<public anon key only>
```

Never put privileged provider keys or AI provider secrets in dashboard config.
Demo role switcher is not used in provider mode.

## Authorization

Backend AuthContext/workspace membership is source of truth.
client-supplied workspaceId is not authoritative. Viewer is read-only.
Owner/agent CRM mutation policy remains enforced.
