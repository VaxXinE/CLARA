---
title: CLARA P5 Production Deployment Smoke Runbook
status: implemented
phase: P5
updated: 2026-07-14
---

# CLARA P5 Production Deployment Smoke Runbook

## Purpose

This runbook gives operators a safe pre-deployment smoke sequence. It does not
deploy anything, require real provider secrets, or call external provider APIs.

## Preflight

```bash
bash scripts/validate-production-runtime-config.sh
```

Expected result:

```text
API runtime config doctor passes focused guardrail tests
dashboard runtime config doctor passes focused guardrail tests
docker-compose.prod.example.yml is valid
```

## Local Production-Like Smoke

```bash
bash scripts/production-smoke-check.sh
```

The script runs:

```text
repository structure validation
runtime config doctor checks
API typecheck/build/production audit
dashboard typecheck/build/production audit
extension typecheck/build when apps/extension exists
docker compose production config validation
```

## Manual Runtime Checks

After starting a production-like deployment, verify:

```text
GET /health -> 200
GET /ready -> 200
GET /api/v1/me without auth -> safe 401
dashboard root loads from the configured dashboard origin
```

## Security Checklist

Before production-like use:

```text
NODE_ENV=production
AUTH_MODE=provider
MOCK_AUTH_ENABLED=false
DATABASE_URL configured from platform secrets
CORS_ORIGIN explicit, never *
LOG_LEVEL info/warn/error/fatal only
dashboard VITE_AUTH_MODE=provider
dashboard uses only public Supabase URL and anon key
no Supabase service role key in frontend config
no .env, .env.local, .env.production, private key, token, or cookie committed
```

## Known Limits

```text
no real deployment pipeline
no cloud provider integration
no production secret manager integration in repo
no invite, role mutation, or workspace switcher
```
