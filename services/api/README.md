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
AUTH_MODE=provider reserved for production auth integration baseline
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

## Environment Variables

| Name                |                     Required | Default                                          | Description                                          |
| ------------------- | ---------------------------: | ------------------------------------------------ | ---------------------------------------------------- |
| `NODE_ENV`          |                           No | `development`                                    | Runtime environment                                  |
| `APP_NAME`          |                           No | `clara-api`                                      | Service name                                         |
| `HOST`              |                           No | `127.0.0.1`                                      | Bind host                                            |
| `PORT`              |                           No | `3000`                                           | Bind port                                            |
| `LOG_LEVEL`         |                           No | `info`                                           | Logger level                                         |
| `AUTH_MODE`         |                           No | `mock`                                           | Auth mode: `mock` or `provider`                      |
| `AUTH_PROVIDER`     |         Provider mode only | none                                             | Provider selection: `supabase` or `better-auth`     |
| `SUPABASE_AUTH_JWKS_URL` | Production + `AUTH_PROVIDER=supabase` | none | Supabase JWKS URL for future provider token verification |
| `SUPABASE_AUTH_ISSUER` | Production + `AUTH_PROVIDER=supabase` | none | Supabase issuer URL for future provider token verification |
| `BETTER_AUTH_BASE_URL` | Production + `AUTH_PROVIDER=better-auth` | none | Better Auth base URL for future provider verification |
| `DATABASE_URL`      | Required for DB scripts only | none                                             | PostgreSQL connection string for migrate/seed/studio |
| `MOCK_AUTH_ENABLED` |                           No | `true` outside production, `false` in production | Enables local/dev/test mock auth                     |
| `CORS_ORIGIN`       |                           No | empty                                            | Reserved for future CORS setup                       |

## Auth Modes

Supported auth modes:

```text
mock
provider
```

Current baseline behavior:

```text
mock mode keeps the current local/demo/test flow working
provider mode is a fail-closed baseline and does not accept arbitrary bearer tokens
provider verification is not implemented yet
```

Production guardrails:

```text
AUTH_MODE=mock is blocked in production
MOCK_AUTH_ENABLED=true is blocked in production
production with AUTH_MODE=provider requires provider selection
production with AUTH_PROVIDER=supabase requires SUPABASE_AUTH_JWKS_URL and SUPABASE_AUTH_ISSUER
production with AUTH_PROVIDER=better-auth requires BETTER_AUTH_BASE_URL
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

Provider mode is a safe placeholder for production auth integration work. It fails closed until real provider verification is implemented.

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
