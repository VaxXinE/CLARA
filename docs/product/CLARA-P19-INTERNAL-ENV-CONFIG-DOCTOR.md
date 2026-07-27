# CLARA P19 Internal Env Config Doctor

Environment config doctor catches unsafe internal deployment config:

- `AUTH_MODE=provider` is required for internal deployment.
- `MOCK_AUTH_ENABLED=false` is required for internal deployment.
- `DATABASE_URL` is required.
- Provider JWT config is required in provider mode.
- CORS/internal origin must be explicit and not wildcard.
- Doctor output is redacted and must not print secrets/tokens/auth headers.

Mock/demo mode is dev/test only. Internal team usage must use provider auth.

