# services/api/

CLARA API service.

## Status

```text
PR-10 Security and QA Hardening
```

This service currently provides runtime foundation, database schema/migrations, mock auth, read-only conversation/customer/activity APIs, AI draft creation, and simulated reply send for local/test flows.

## Current Endpoints

```text
GET /health
GET /ready
GET /api/v1/health
GET /api/v1/ready
GET /api/v1/me
GET /api/v1/conversations
GET /api/v1/conversations/:conversation_id
GET /api/v1/conversations/:conversation_id/activity
POST /api/v1/conversations/:conversation_id/ai-draft
POST /api/v1/conversations/:conversation_id/reply
GET /api/v1/customers/:customer_id
```

## Local Setup

```bash
cd services/api
npm install
cp .env.example .env
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
npm audit --omit=dev --audit-level=high
```

## Environment Variables

| Name | Required | Default | Description |
|---|---:|---|---|
| `NODE_ENV` | No | `development` | Runtime environment |
| `APP_NAME` | No | `clara-api` | Service name |
| `HOST` | No | `127.0.0.1` | Bind host |
| `PORT` | No | `3000` | Bind port |
| `LOG_LEVEL` | No | `info` | Logger level |
| `DATABASE_URL` | Required for DB scripts only | none | PostgreSQL connection string for migrate/seed/studio |
| `MOCK_AUTH_ENABLED` | No | `true` outside production, `false` in production | Enables local/dev/test mock auth |
| `CORS_ORIGIN` | No | empty | Reserved for future CORS setup |

## Database Setup

Example local PostgreSQL URL:

```text
postgresql://postgres:postgres@127.0.0.1:5432/clara_api_dev
```

Typical flow:

```bash
cd services/api
npm install
cp .env.example .env
npm run db:check
npm run db:migrate
npm run db:seed
npm run dev
```

Optional migration authoring workflow:

```bash
npm run db:generate
```

## Mock Auth Headers

For local/dev/test authenticated requests:

```text
x-mock-user-id
x-mock-organization-id
x-mock-workspace-id
x-mock-role         // owner | agent | viewer
```

## Security Notes

- Do not commit `.env`.
- Do not log secrets.
- Do not expose stack traces in production.
- All future product endpoints must authenticate.
- All future business queries must include tenant/workspace scope.
- `organization_id` and `workspace_id` must come from authenticated context, not request input.
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

## Known Limitations

```text
mock auth only
mock AI draft provider only
simulated reply send provider only
no real WhatsApp/Instagram/TikTok/email integration yet
```
