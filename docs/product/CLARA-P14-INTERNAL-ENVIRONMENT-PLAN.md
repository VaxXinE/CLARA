# CLARA P14 Internal Environment Plan

## Purpose

This plan defines how CLARA should be run for internal beta preparation without
claiming production deployment. internal use first is the environment rule.

## Environment Levels

| Environment | Purpose | Required Guardrail |
| --- | --- | --- |
| Local | Developer validation and demo-safe CRM workflow | Mock/demo config only; no real secrets required. |
| Development | Shared internal engineering validation | Explicit environment variables; no production data. |
| Staging-like | Internal operator smoke testing | Provider/AI/outbound activation remains controlled. |
| Production | Future public or real-business runtime | production deployment requires separate explicit action. |

## Local / Development

Local/dev mode may use seeded demo data and safe simulated boundaries. It must
not require real provider credentials, real payment credentials, or production
secrets.

Expected defaults:

- Billing deferred.
- Public launch deferred.
- Provider/AI/outbound activation remains controlled.
- Backend AuthContext remains the source of truth.
- Client-supplied organization, workspace, user, or role values are not
  authorization truth.

## Staging-Like Internal Beta

Staging-like internal beta can validate the production configuration shape, but
it is still not a production deployment. It must use platform-managed
environment configuration or a secret manager for sensitive values.

Before staging-like use:

- Confirm explicit API and dashboard URLs.
- Confirm mock/demo auth is not enabled in production-like config.
- Confirm CORS origins are explicit.
- Confirm rate limits and request body limits are enabled.
- Confirm no real provider/AI/outbound behavior is activated unless a separate
  approved PR and operator decision enables it.

## Production Boundary

Production deployment requires separate explicit action. P14 documentation does
not deploy services, create infrastructure, configure DNS/TLS, enable billing,
or invite public users.

Production-like use must fail closed if required configuration is missing or
unsafe. No `.env` file with real values, provider token, payment credential, or
service role credential may be committed.

## Operator Preparation

Internal operators should prepare:

- Access list for internal beta participants.
- Workspace ownership and admin responsibility.
- Known limitation review.
- Security checklist signoff.
- Rollback/disable steps for provider, AI, outbound, and integration features.
