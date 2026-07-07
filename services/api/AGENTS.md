# services/api/AGENTS.md

Instructions for AI coding assistants working inside `services/api/`.

## Required Reading

Before editing this service, read:

```text
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TEST-PLAN/
```

## Current Scope

This service is currently in:

```text
PR-02 API Bootstrap
```

Allowed changes:

```text
health endpoint
ready endpoint
config validation
logger
correlation ID
safe error handler
test setup
build setup
```

Not allowed yet:

```text
database access
authentication implementation
authorization implementation
conversation API
customer API
AI draft API
reply send API
real provider integration
```

## Security Rules

- Never commit secrets.
- Never expose stack traces in production.
- Never log authorization headers, cookies, API keys, tokens, or hidden prompts.
- Validate all environment variables.
- Return safe error envelopes.
- Add tests for new runtime behavior.

## Response Envelope Direction

Future API errors should use:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Safe human-readable message.",
    "correlation_id": "request-id"
  }
}
```
