---
title: CLARA P5 Runtime Config Doctor
status: implemented
phase: P5
updated: 2026-07-14
---

# CLARA P5 Runtime Config Doctor

## Scope

P5-PR-05 adds safe runtime configuration doctors for the API and dashboard.
They are deployment-readiness checks only. They do not deploy CLARA, call
providers, load real secrets, or weaken existing production auth guardrails.

## API Doctor

Entry points:

```text
services/api/src/config/runtime-config-doctor.ts
services/api/src/config/runtime-config-doctor-cli.ts
```

The API doctor returns:

```text
status: pass | warn | fail
checks: safe named checks with safe messages only
```

Production failures include:

```text
AUTH_MODE=mock
MOCK_AUTH_ENABLED=true
AUTH_MODE=provider without AUTH_PROVIDER
Supabase provider without issuer/JWKS
missing DATABASE_URL
wildcard or missing CORS_ORIGIN
LOG_LEVEL=debug|trace|silent
```

Local/demo mock mode remains allowed outside production.

## Dashboard Doctor

Entry point:

```text
apps/dashboard/src/config/dashboard-runtime-config-doctor.ts
```

The dashboard doctor validates public frontend config only:

```text
VITE_AUTH_MODE=demo is allowed locally
VITE_AUTH_MODE=provider requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
service-role-like frontend config fails closed
```

The dashboard must never use or require a Supabase service role key.

## Redaction

Doctor output must not print:

```text
tokens
cookies
database URLs
provider raw payloads
Authorization headers
client secrets
service role keys
```

The doctor reports only safe check names and safe human-readable messages.

## Validation

```bash
bash scripts/validate-production-runtime-config.sh
```

This command runs focused API/dashboard config doctor tests and validates the
production-like Docker Compose file.
