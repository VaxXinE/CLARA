# services/api/

CLARA API service.

## Status

```text
PR-10 Security and QA Hardening
```

This service currently provides runtime foundation, database schema/migrations, mock auth, read-only conversation/customer/activity APIs, AI draft creation, and simulated reply send for local/test flows.

Use this together with `apps/dashboard` for the full local MVP flow.

For a production-like local PostgreSQL runtime, use `infra/local/docker-compose.yml`.

Current auth baseline:

```text
AUTH_MODE=mock for local/demo/test
AUTH_MODE=provider for production-auth validation and fail-closed smoke checks
backend remains the source of truth for authorization
```

## Current Endpoints

```text
GET /health
GET /ready
GET /api/v1/health
GET /api/v1/ready
GET /api/v1/me
GET /api/v1/conversations
GET /api/v1/conversations/:conversation_id
GET /api/v1/customers/:customer_id
GET /api/v1/conversations/:conversation_id/activity
POST /api/v1/conversations/:conversation_id/ai-draft
POST /api/v1/conversations/:conversation_id/reply
```

## Local Setup

```bash
cd infra/local
docker compose up -d

cd ../../services/api
npm install
cp .env.example .env
npm run db:check
npm run db:ready
npm run db:migrate
npm run db:seed
npm run dev
```

Open:

```text
http://127.0.0.1:3000/health
```

## Commands

```bash
npm run dev
npm run typecheck
npm run test
npm run build
npm start
npm run db:check
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio
npm run db:ready
npm audit --omit=dev --audit-level=high
```

Docker validation:

```bash
docker build -f services/api/Dockerfile -t clara-api:local .
docker compose -f docker-compose.prod.example.yml config
```

## Environment Variables

| Name                     |                                 Required | Default                                          | Description                                                |
| ------------------------ | ---------------------------------------: | ------------------------------------------------ | ---------------------------------------------------------- |
| `NODE_ENV`               |                                       No | `development`                                    | Runtime environment                                        |
| `APP_NAME`               |                                       No | `clara-api`                                      | Service name                                               |
| `HOST`                   |                                       No | `127.0.0.1`                                      | Bind host                                                  |
| `PORT`                   |                                       No | `3000`                                           | Bind port                                                  |
| `LOG_LEVEL`              |                                       No | `info`                                           | Logger level                                               |
| `RATE_LIMIT_ENABLED`     |                                       No | `true`                                           | Enables in-memory API rate limiting                        |
| `RATE_LIMIT_MAX`         |                                       No | `120`                                            | Default request cap per window                             |
| `RATE_LIMIT_WINDOW_MS`   |                                       No | `60000`                                          | Shared window size for in-memory rate limiting             |
| `AI_DRAFT_RATE_LIMIT_MAX`|                                       No | `20`                                             | Stricter per-identity cap for `POST /ai-draft`             |
| `REPLY_SEND_RATE_LIMIT_MAX`|                                     No | `30`                                             | Stricter per-identity cap for `POST /reply`                |
| `REQUEST_BODY_LIMIT_BYTES`|                                      No | `1048576`                                        | Global Fastify request body limit in bytes                 |
| `EMAIL_CHANNEL_MODE`      |                                       No | `disabled`                                       | Email channel skeleton mode: `disabled` or `simulated`     |
| `AUTH_MODE`              |                                       No | `mock`                                           | Auth mode: `mock` or `provider`                            |
| `AUTH_PROVIDER`          |                       Provider mode only | none                                             | Provider selection: `supabase` or `better-auth`            |
| `SUPABASE_AUTH_JWKS_URL` |    Production + `AUTH_PROVIDER=supabase` | none                                             | Supabase JWKS URL for future provider token verification   |
| `SUPABASE_AUTH_ISSUER`   |    Production + `AUTH_PROVIDER=supabase` | none                                             | Supabase issuer URL for future provider token verification |
| `BETTER_AUTH_BASE_URL`   | Production + `AUTH_PROVIDER=better-auth` | none                                             | Better Auth base URL for future provider verification      |
| `DATABASE_URL`           | Required in production and DB scripts     | none                                             | PostgreSQL connection string for runtime, migrate, seed, and studio |
| `MOCK_AUTH_ENABLED`      |                                       No | `true` outside production, `false` in production | Enables local/dev/test mock auth                           |
| `CORS_ORIGIN`            | Required in production                    | empty                                            | Explicit allowed frontend origin list; `*` is rejected in production |

## Auth Modes

Supported auth modes:

```text
mock
provider
```

Current baseline behavior:

```text
mock mode keeps the current local/demo/test flow working
provider mode is fail-closed and does not accept arbitrary bearer tokens
Supabase provider mode now verifies JWT signature and issuer through JWKS before creating trusted identity
Better Auth provider mode remains a safe placeholder and is not implemented yet
trusted provider identity must map to a CLARA user + exactly one active workspace membership before AuthContext is created
```

Provider-mode middleware behavior today:

```text
Authorization: Bearer <token> is required before provider verification is attempted
missing Authorization header returns safe 401
malformed Authorization header returns safe 401
invalid, expired, or wrong-issuer Supabase JWT returns safe 401
valid Supabase JWT only becomes app auth after CLARA membership lookup succeeds
mock auth headers are ignored when AUTH_MODE=provider
```

Auth smoke-test reference:

```text
docs/product/CLARA-P2-AUTH-SMOKE-TEST-RUNBOOK.md
```

Production guardrails:

```text
AUTH_MODE=mock is blocked in production
MOCK_AUTH_ENABLED=true is blocked in production
production with AUTH_MODE=provider requires provider selection
production with AUTH_PROVIDER=supabase requires SUPABASE_AUTH_JWKS_URL and SUPABASE_AUTH_ISSUER
production with AUTH_PROVIDER=better-auth requires BETTER_AUTH_BASE_URL
production requires DATABASE_URL
production requires explicit CORS_ORIGIN and rejects CORS_ORIGIN=*
production requires RATE_LIMIT_ENABLED=true
production rejects LOG_LEVEL=debug, trace, or silent
```

Deployment config runbook:

```text
docs/product/CLARA-P2-DEPLOYMENT-CONFIG-RUNBOOK.md
docs/product/CLARA-P2-STAGING-SMOKE-RUNBOOK.md
docs/product/CLARA-P2-RELEASE-CHECKLIST.md
```

## Database Setup

Example local PostgreSQL URL:

```text
postgresql://clara_user:clara_password_dev_only@127.0.0.1:5432/clara_api_dev
```

Typical flow:

```bash
cd infra/local
docker compose up -d

cd ../../services/api
npm install
cp .env.example .env
npm run db:check
npm run db:ready
npm run db:migrate
npm run db:seed
npm run dev
```

Optional migration authoring workflow:

```bash
npm run db:generate
```

Optional real database validation:

```bash
cd infra/local
docker compose up -d

cd ../../services/api
npm run db:ready
npm run db:migrate
npm run db:seed
```

This is optional for local integration checks only. Automated tests still use fixture-safe repositories by default and do not require a running PostgreSQL instance.

Conversation repository runtime selection:

```text
no DATABASE_URL in non-production -> fixture-backed conversation repository for local/demo/test safety
DATABASE_URL present -> PostgreSQL-backed conversation repository for conversation list/detail reads
production without DATABASE_URL -> startup fails closed instead of falling back to fixtures
```

Customer repository runtime selection:

```text
no DATABASE_URL in non-production -> fixture-backed customer repository for local/demo/test safety
DATABASE_URL present -> PostgreSQL-backed customer repository for scoped customer detail reads
production without DATABASE_URL -> startup fails closed instead of falling back to fixture customer data
```

Activity repository runtime selection:

```text
no DATABASE_URL in non-production -> fixture-backed activity repository for local/demo/test safety
DATABASE_URL present -> PostgreSQL-backed activity repository for scoped activity timeline reads
production without DATABASE_URL -> startup fails closed instead of falling back to fixture activity data
```

AI draft persistence runtime selection:

```text
no DATABASE_URL in non-production -> fixture-backed AI draft persistence for local/demo/test safety
DATABASE_URL present -> PostgreSQL-backed AI draft persistence for scoped reply_drafts, ai_draft_events, and activity_events writes
production without DATABASE_URL -> startup fails closed instead of falling back to fixture AI draft persistence
```

Reply persistence runtime selection:

```text
no DATABASE_URL in non-production -> fixture-backed reply persistence for local/demo/test safety
DATABASE_URL present -> PostgreSQL-backed reply persistence for scoped outbound messages, reply_draft status updates, and activity_events writes
production without DATABASE_URL -> startup fails closed instead of falling back to fixture reply persistence
```

Audit log runtime selection:

```text
no DATABASE_URL in non-production -> fixture-backed audit log persistence for local/demo/test safety
DATABASE_URL present -> PostgreSQL-backed audit log persistence for scoped audit_logs writes
production without DATABASE_URL -> startup fails closed instead of falling back to fixture-backed business and audit persistence
```

## Email Channel Skeleton

Current email channel baseline:

```text
no public email webhook or inbound email API is exposed yet
EMAIL_CHANNEL_MODE=disabled keeps the skeleton inactive by default
EMAIL_CHANNEL_MODE=simulated enables only local/dev/test normalization flows
simulated adapter normalizes inbound email metadata into a CLARA internal message shape
raw HTML is not rendered or stored for UI use in this skeleton
attachments are reduced to attachments_present only and are not downloaded or processed
allowlisted headers only: message-id, in-reply-to, references, reply-to
```

Future integration direction:

```text
Gmail API, IMAP, or another provider adapter should verify provider trust first
provider-specific payloads should be normalized through the email channel adapter boundary
workspace assignment must still come from trusted backend logic, not from email payload fields
provider tokens, email auth headers, and raw HTML bodies must not be logged
```

Email channel design reference:

```text
docs/product/CLARA-P3-EMAIL-CHANNEL-ADAPTER-SPEC.md
docs/product/CLARA-P3-EMAIL-INBOUND-PERSISTENCE-SPEC.md
```

Current email inbound persistence baseline:

```text
no public email webhook is exposed yet
trusted server scope plus normalized inbound email can be persisted through the email inbound persistence service
customer reuse is scoped by organization_id + workspace_id + from_email
conversation reuse is scoped by organization_id + workspace_id + provider + provider_thread_id
idempotency is scoped by organization_id + workspace_id + provider + provider_message_id
raw provider payload, raw html, and attachments are not persisted
html-only emails are rejected in this baseline because CLARA does not render or store raw HTML
```

Current email ingestion harness baseline:

```text
no public ingestion route is exposed
email ingestion service can load a batch from a batch-capable adapter or accept an explicit message list
simulated email adapter is the local/dev/test harness implementation
batch summary returns attempted_count, persisted_count, duplicate_count, failed_count, and safe failures only
adapter batch loading failure aborts the run
per-item normalization or persistence failure is counted safely without aborting the rest of the batch
future worker or provider webhook should call the same internal ingestion service after provider trust is established
```

Audit log baseline:

```text
AI draft generation records ai_draft.generated
reply send flow records reply.send_attempted, reply.sent, and reply.failed
audit metadata is allowlisted and does not store full customer message bodies
bearer tokens, Authorization headers, and raw JWT payloads must never be stored in audit logs
audit writes are best-effort so business responses do not fail open or leak internals when audit persistence has an internal problem
```

Structured logging baseline:

```text
every request receives x-correlation-id and x-request-id
request completion logs include method, path, status_code, duration_ms, and correlation_id
authenticated requests also include organization_id, workspace_id, actor_user_id, and actor_role
error logs are structured and safe; they do not log Authorization headers, bearer tokens, cookies, raw JWT payloads, full customer messages, or full AI/reply text
Fastify default request logging is disabled so CLARA uses one centralized structured request log per request
```

Production deployment config baseline:

```text
NODE_ENV=production must run with provider auth only
DATABASE_URL must come from secret-managed deployment config and is never committed
CORS_ORIGIN must be an explicit dashboard origin list and must never be *
LOG_LEVEL should stay info or warn in production
rate limiting remains enabled in production by config guardrail
dashboard provider mode must use Supabase URL plus anon key only
frontend must never contain a Supabase service role key
```

Standard API error envelope:

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "Safe user-facing message",
    "correlation_id": "request-correlation-id"
  }
}
```

Current error-handling hardening:

```text
all handled API errors include correlation_id
400 validation/bad request, 401, 403, 404, 409, 413, 429, and 500 paths use the centralized error handler
production responses do not expose stack traces, database internals, provider internals, or raw validation engine internals
cross-workspace misses continue returning safe 404 envelopes
```

Rate limiting and request size baseline:

```text
all requests use an in-memory baseline rate limit by safe network fallback before auth context exists
failed unauthenticated requests are still rate limited
POST /api/v1/conversations/:conversation_id/ai-draft uses a stricter authenticated per-user/workspace limit
POST /api/v1/conversations/:conversation_id/reply uses a stricter authenticated per-user/workspace limit
request bodies larger than REQUEST_BODY_LIMIT_BYTES return a safe 413 envelope
rate limit responses return a safe 429 envelope without exposing internal counters or store details
```

## Docker Production Build

API Docker baseline:

```text
multi-stage build
TypeScript is compiled in a build stage
runtime image installs production dependencies only
runtime container runs as a non-root user
.env files, local secrets, and private keys are excluded from the Docker build context
```

Build locally:

```bash
docker build -f services/api/Dockerfile -t clara-api:local .
```

Run locally with explicit production-like env:

```bash
docker run --rm \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e APP_NAME=clara-api \
  -e HOST=0.0.0.0 \
  -e PORT=3000 \
  -e LOG_LEVEL=info \
  -e RATE_LIMIT_ENABLED=true \
  -e RATE_LIMIT_MAX=120 \
  -e RATE_LIMIT_WINDOW_MS=60000 \
  -e AI_DRAFT_RATE_LIMIT_MAX=20 \
  -e REPLY_SEND_RATE_LIMIT_MAX=30 \
  -e REQUEST_BODY_LIMIT_BYTES=1048576 \
  -e AUTH_MODE=provider \
  -e AUTH_PROVIDER=supabase \
  -e MOCK_AUTH_ENABLED=false \
  -e SUPABASE_AUTH_JWKS_URL=https://example.supabase.test/auth/v1/jwks \
  -e SUPABASE_AUTH_ISSUER=https://example.supabase.test/auth/v1 \
  -e DATABASE_URL=postgresql://clara_user:clara_password_dev_only@host.docker.internal:5432/clara_api_prod_like \
  -e CORS_ORIGIN=http://127.0.0.1:8080 \
  clara-api:local
```

Production-like local compose example:

```text
docker-compose.prod.example.yml
```

This compose file is for local smoke validation only. Real production should use managed secrets and deployment-specific configuration.

## Mock Auth Headers

For local/dev/test authenticated requests:

```text
x-mock-user-id
x-mock-organization-id
x-mock-workspace-id
x-mock-role         // owner | agent | viewer
```

Demo roles:

```text
owner  -> full read/write in demo scope
agent  -> read conversations/customers/activity + generate AI draft + send reply
viewer -> read-only; cannot generate AI draft or send reply
```

Mock auth is for local/demo/test only and must not be treated as a production auth solution.

Provider mode is now the production-auth foundation path:

```text
Supabase JWT verification is implemented through JWKS + issuer validation
Better Auth remains fail-closed until explicitly implemented
active CLARA workspace membership is still required after provider identity verification
```

Workspace membership lookup foundation now exists for the future provider path:

```text
trusted provider identity -> CLARA user lookup by provider_subject
CLARA user -> active workspace membership lookup
membership role -> server-side permissions
missing user, inactive membership, unsupported role, or ambiguous membership fails closed
```

Supabase verification skeleton:

```text
jose library verifies JWT signature against configured JWKS
issuer is verified against SUPABASE_AUTH_ISSUER
provider identity uses sub as the trusted subject
email is read only as optional profile metadata
organization_id, workspace_id, and role still come only from CLARA backend lookup
```

Provider-mode smoke validation:

```bash
cd services/api
npm run test -- --run tests/require-auth.test.ts tests/auth-production-guardrails.test.ts
```

## Provider Behavior

Current MVP provider behavior:

```text
AI draft uses a mock provider only
reply send uses a simulated provider only
AI draft creates a draft row and activity but does not send any message
reply send requires an explicit human API request
```

Not implemented yet:

```text
real WhatsApp/Instagram/TikTok/email delivery
real AI provider integration
production auth provider
background delivery workers
```

## Security Notes

- Do not commit `.env`.
- Do not log secrets.
- Do not log auth tokens.
- Do not expose stack traces in production.
- All future product endpoints must authenticate.
- All future business queries must include tenant/workspace scope.
- `organization_id` and `workspace_id` must come from authenticated context, not request input.
- Frontend role or tenant values must never be trusted as final authorization input.
- Provider-mode requests without a session token must fail closed with safe `401` responses.
- Verified provider identity without an active CLARA membership must fail closed with safe `403` responses.
- Every tenant-owned business table includes `organization_id` and every workspace-owned business table includes `workspace_id`.
- Future repository/query methods must never read business records by ID alone.
- `viewer` is read-only and cannot create AI drafts or send replies.
- Demo seed data is fake only and uses `.test` or clearly dummy identifiers.
- Conversation, customer, and activity read APIs are server-side scoped by authenticated organization/workspace only.
- AI draft creation stores editable drafts only and never sends replies automatically.
- Reply send is explicit human-triggered API input only; AI draft endpoint does not send messages.
- AI draft responses do not expose hidden prompts or raw provider payloads.
- Provider failures return safe error envelopes and must not leak raw upstream errors or stack traces.
- AI provider calls must not be added directly here without AI gateway boundary decision.

## Local Validation

```bash
cd services/api
npx --yes prettier "src/**/*.ts" "tests/**/*.ts" --write
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high
```

From repo root:

```bash
bash scripts/validate-repo-structure.sh
```

Together with the dashboard:

```bash
cd infra/local && docker compose up -d
cd services/api && npm run db:ready && npm run db:migrate && npm run db:seed && npm run dev
cd apps/dashboard && npm install && cp .env.example .env.local && npm run dev
```

## Known Limitations

```text
mock auth only
mock AI draft provider only
simulated reply send provider only
no real WhatsApp/Instagram/TikTok/email integration yet
provider auth verification not implemented yet
```
