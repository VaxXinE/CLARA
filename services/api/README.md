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
P5 production auth foundation now documents provider-mode, workspace membership, owner bootstrap, and dashboard contract boundaries
```

Current Gmail provider baseline:

```text
OAuth connect + callback completion exist
real token exchange exists behind a safe boundary
token refresh boundary exists for internal/server-side use only
connection health check exists for provider-management checks
inbound Gmail message fetch boundary exists for safe list/get operations only
inbound Gmail sync orchestrator exists for bounded manual sync summaries and optional normalized-envelope persistence
inbound Gmail sync state/cursor persistence now exists per scoped provider account
internal Gmail inbound sync job boundary now exists for trusted server-side callers only
internal Gmail inbound sync scheduler skeleton, runtime boundary, app lifecycle hook, operator status/manual tick routes, and safe operator audit trace now exist as disabled-by-default services only
final Gmail inbound hardening regressions now cover token/header/raw payload redaction, attachment byte stripping, safe summaries, and no AI draft/outbound send side effects
internal Gmail outbound send client/service boundary now exists with simulated local/test client only
Gmail outbound send route now exists as an authenticated, non-viewer, explicit human/operator action that persists safe outbound delivery records
Gmail outbound delivery status route returns scoped read-only delivery metadata for dashboard/operator visibility
Gmail outbound send and Gmail reply send write safe audit events when audit logging is wired
Gmail reply send integration now exists when ReplyService is explicitly wired with Gmail outbound send and the conversation source is email/Gmail
P3 final Gmail security regression runbook now documents inbound, scheduler, outbound, OAuth/token, audit/logging, and dashboard safety checks
internal Gmail inbound smoke harness exists for offline verification when explicitly wired
no externally scheduled background worker, background refresh scheduler, dashboard Gmail send UI, or real Gmail outbound send yet
```

Current multi-channel foundation:

```text
generic channel capabilities and channel account read APIs now exist
Gmail, Webchat inbound/reply, and WhatsApp official inbound plus simulated outbound are marked available
Instagram and TikTok are decision-only planned metadata and require official API/compliance review before implementation
P6 Provider Readiness Matrix clarifies that Gmail/Webchat/WhatsApp still require production hardening before production provider use
P6 Official Channel Policy blocks scraping, session-cookie reuse, browser automation, QR/session hijacking, and unofficial provider clients as production strategies
P6 Gmail credential boundary keeps access tokens, refresh tokens, client secrets, Authorization headers, and raw provider payloads behind backend-only boundaries
P6 channel health exposes read-only workspace-scoped connected/disconnected/degraded/auth_required/rate_limited statuses for operator visibility
P6 webhook/outbox hardening defines fail-closed webhook verification, workspace-scoped dedup/replay, bounded Retry, Idempotency, no raw provider payload handling, no double-send, and `dead_letter` lifecycle behavior
P6 final observability and audit trail policies define safe provider/channel diagnostics, audit taxonomy, runbook, go-live checklist, and P7 handoff without adding a metrics product
P7 AI assistant safety policy is documentation/test-only for now: no real AI provider calls, no auto-send, no autonomous provider action, and no secret/raw payload access
P7 AI context builder and prompt contract are pure backend logic only: workspace-scoped, backend AuthContext-derived, minimized, untrusted customer content-labeled, and provider-token/raw-payload-free
P7 AI Follow-up Recommendation is recommendation-only: mock provider only, requiresHumanApproval=true, no auto-send, no automatic task creation, no automatic scheduler, and no CRM/customer mutation
P7 AI Conversation Summary and AI Customer Note Suggestion are review-only/suggestion-only: mock provider only, requiresHumanApproval=true, actionStatus=suggestion_only for notes, no auto-write, no automatic customer note write, and no CRM/customer mutation from AI summary/note
channel account reads are scoped by backend AuthContext and never trust client-provided organization_id or workspace_id
responses never include provider secrets, tokens, Authorization headers, raw provider payloads, or raw provider errors
multi-channel audit metadata is allowlisted and must not include message bodies, cookies, Authorization headers, tokens, secrets, raw provider payloads, or raw provider errors
```

Webchat inbound baseline:

```text
POST /api/v1/webchat/inbound/messages accepts public widget messages with a non-secret channel_public_key
organization_id and workspace_id are resolved from the channel account server-side
message text, email, page URL, and metadata are validated and sanitized
raw request payloads, cookies, Authorization headers, IP addresses, tokens, and provider secrets are not persisted
webchat inbound materializes safe customer, conversation, message, activity, and webchat inbound records
webchat reply can use the simulated Webchat outbound boundary when POST /reply targets a Webchat conversation
webchat outbound delivery status is exposed through a scoped read-only API for dashboard visibility
no webchat public widget frontend, repeat-delivery controls, real provider call, or AI draft generation exists in this PR
```

WhatsApp official inbound baseline:

```text
GET /api/v1/whatsapp/webhook verifies the provider challenge with the configured verify token
POST /api/v1/whatsapp/webhook accepts signed text message callbacks only
organization_id and workspace_id are resolved from the server-side WhatsApp channel account mapping
provider message ids are idempotent inside organization/workspace scope
raw provider payloads, access tokens, refresh tokens, Authorization headers, cookies, client secrets, and provider raw errors are not returned
WhatsApp conversations can use the simulated WhatsApp outbound boundary when POST /reply targets a WhatsApp conversation
WhatsApp outbound delivery records persist safe scoped metadata only
this boundary does not implement real WhatsApp network send, templates, media download/storage, contact sync, groups, interactive messages, delivery queue, scheduler-triggered sends, or AI auto-send
production WhatsApp work must use the official provider path; scraping, QR hijacking, session-cookie reuse, and unofficial WhatsApp Web clients are rejected
```

Social DM decision baseline:

```text
Instagram and TikTok remain planned metadata only
future Social DM support must use official provider APIs and compliance review
scraping, browser automation, session-cookie reuse, QR hijacking, credential capture, and unofficial clients are rejected
no Instagram/TikTok inbound webhook, outbound send, dashboard UI, token storage, or provider network call exists
```

P4.5 extension bridge contract baseline:

```text
provider is extension, official_api is false, and send_mode is manual_assisted
planned contract routes are POST /api/v1/extension/:channel/snapshots, /reply-suggestions, and /manual-send-confirmations
supported bridge channels are WhatsApp, Instagram, and TikTok
auto-sync is limited to the user-visible active conversation and must dedupe by snapshot_hash
the bridge must not crawl inbox lists, crawl background conversations, capture provider credentials, store browser session material, persist raw DOM/HTML, or auto-send replies
ChatGPT Companion is user-triggered, previewable, bounded, and does not store ChatGPT session material in the CLARA backend
implemented route: POST /api/v1/extension/:channel/snapshots
snapshot intake requires CLARA auth, blocks viewer, derives tenant scope from AuthContext, persists safe normalized snapshots/messages, materializes extension_bridge conversations, and audits safe metadata
apps/extension now provides a local TypeScript active-conversation auto-sync engine that posts safe snapshots to the intake route
apps/extension now provides ChatGPT Companion safe context preview/copy/open helpers entirely on the extension side
P4.5 final regression/runbook coverage now documents operator-assisted usage, rollback, and security boundaries
no packaged browser extension artifact, reply suggestion endpoint, manual-send confirmation endpoint, provider network call, ChatGPT auto-submit, or auto-send exists yet
```

Gmail inbound fetch boundary notes:

```text
safe list/get only, no persistence orchestration yet
headers are allowlisted and attachment body bytes are stripped
raw Gmail format is not returned in this build
```

Gmail inbound sync notes:

```text
manual orchestration only
bounded fetch + safe summary only
optional persist_normalized mode persists sanitized Gmail inbound envelopes only
optional materialize_conversation mode reuses the existing inbound email persistence path to create scoped customer/conversation/message/activity records
sync state now stores only safe counters, timestamps, last_history_id, and optional last_page_token per scoped provider account
manual sync route now rejects workspace/org spoofing body fields, validates page_token safely, and returns safe sync_state metadata
inbound sync scheduler runtime can periodically call tickOnce only when explicitly wired by trusted server-side lifecycle code
scheduler operator status route returns safe runtime state/config only and never returns token material or raw Gmail payloads
manual scheduler tick route runs one bounded tick through the runtime boundary and does not start the background interval
scheduler operator routes write safe audit metadata when audit logging is wired
final hardening runbook: `docs/product/CLARA-P3-GMAIL-INBOUND-FINAL-HARDENING-SPEC.md`
final P3 security runbook: `docs/product/CLARA-P3-FINAL-SECURITY-REGRESSION-RUNBOOK.md`
does not create AI drafts or outbound replies
```

Gmail inbound smoke notes:

```text
internal/test-only route pattern
uses mocked Gmail data only
forces normalized persistence + conversation materialization
does not call real Google/Gmail network endpoints
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
GET /api/v1/channels/capabilities
GET /api/v1/channels/accounts
GET /api/v1/channels/health
GET /api/v1/channels/accounts/:channelAccountId
GET /api/v1/channels/accounts/:channelAccountId/health
GET /api/v1/workspace/members
GET /api/v1/workspace/roles/readiness
POST /api/v1/webchat/inbound/messages
GET /api/v1/integrations/webchat/outbound/deliveries/:deliveryId
GET /api/v1/whatsapp/webhook
POST /api/v1/whatsapp/webhook
POST /api/v1/integrations/gmail/oauth/connect
GET /api/v1/integrations/gmail/oauth/callback
GET /api/v1/integrations/gmail/accounts/:providerAccountId/health
GET /api/v1/integrations/gmail/scheduler/status
POST /api/v1/integrations/gmail/scheduler/tick
POST /api/v1/integrations/gmail/accounts/:providerAccountId/sync
POST /api/v1/integrations/gmail/accounts/:providerAccountId/inbound-smoke
POST /api/v1/integrations/gmail/outbound/send
GET /api/v1/integrations/gmail/outbound/deliveries/:deliveryId
POST /api/v1/extension/:channel/snapshots
POST /api/v1/ai/conversation-summaries
POST /api/v1/ai/customer-note-suggestions
```

Workspace user/role readiness:

```text
GET /api/v1/workspace/members
owner only; returns safe workspace member metadata from AuthContext scope

GET /api/v1/workspace/roles/readiness
owner only; returns read-only readiness policy and disabled planned controls

No invite, role update, delete, workspace switch, or public self-escalation API
exists yet. Agent/viewer requests are rejected safely, and organization_id /
workspace_id from request input is not trusted.
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
npm run db:bootstrap-owner
npm run db:studio
npm run db:ready
npm audit --omit=dev --audit-level=high
```

Production config doctor:

```bash
node --import tsx src/config/runtime-config-doctor-cli.ts
```

Repo-level production smoke:

```bash
bash scripts/validate-production-runtime-config.sh
bash scripts/production-smoke-check.sh
```

Docker validation:

```bash
docker build -f services/api/Dockerfile -t clara-api:local .
docker compose -f docker-compose.prod.example.yml config
```

## Environment Variables

| Name                                                    |                                 Required | Default                                          | Description                                                                                  |
| ------------------------------------------------------- | ---------------------------------------: | ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `NODE_ENV`                                              |                                       No | `development`                                    | Runtime environment                                                                          |
| `APP_NAME`                                              |                                       No | `clara-api`                                      | Service name                                                                                 |
| `HOST`                                                  |                                       No | `127.0.0.1`                                      | Bind host                                                                                    |
| `PORT`                                                  |                                       No | `3000`                                           | Bind port                                                                                    |
| `LOG_LEVEL`                                             |                                       No | `info`                                           | Logger level                                                                                 |
| `RATE_LIMIT_ENABLED`                                    |                                       No | `true`                                           | Enables in-memory API rate limiting                                                          |
| `RATE_LIMIT_MAX`                                        |                                       No | `120`                                            | Default request cap per window                                                               |
| `RATE_LIMIT_WINDOW_MS`                                  |                                       No | `60000`                                          | Shared window size for in-memory rate limiting                                               |
| `AI_DRAFT_RATE_LIMIT_MAX`                               |                                       No | `20`                                             | Stricter per-identity cap for `POST /ai-draft`                                               |
| `REPLY_SEND_RATE_LIMIT_MAX`                             |                                       No | `30`                                             | Stricter per-identity cap for `POST /reply`                                                  |
| `REQUEST_BODY_LIMIT_BYTES`                              |                                       No | `1048576`                                        | Global Fastify request body limit in bytes                                                   |
| `EMAIL_CHANNEL_MODE`                                    |                                       No | `disabled`                                       | Email channel skeleton mode: `disabled` or `simulated`                                       |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN`                         |             WhatsApp webhook verify only | none                                             | Local/platform-provided verify token for WhatsApp webhook challenge validation               |
| `WHATSAPP_WEBHOOK_APP_SECRET`                           |            WhatsApp inbound webhook only | none                                             | WhatsApp app secret used for webhook signature validation; keep in secret manager            |
| `GMAIL_PROVIDER_ENABLED`                                |                                       No | `false`                                          | Enables the Gmail provider auth boundary skeleton only                                       |
| `GMAIL_TOKEN_VAULT_MODE`                                |                                       No | `mock`                                           | Gmail token vault mode: `mock` or future `encrypted`                                         |
| `GMAIL_OAUTH_CLIENT_ID`                                 |                                       No | none                                             | Placeholder client id boundary for future Gmail OAuth                                        |
| `GMAIL_OAUTH_CLIENT_SECRET`                             |                 Real token exchange only | none                                             | Gmail OAuth client secret boundary for real token exchange; keep in secret manager only      |
| `GMAIL_OAUTH_REDIRECT_URI`                              |                                       No | none                                             | Optional default Gmail OAuth redirect URI                                                    |
| `GMAIL_OAUTH_REDIRECT_URI_ALLOWLIST`                    |                                       No | `GMAIL_OAUTH_REDIRECT_URI` if set                | Comma-separated exact Gmail OAuth redirect URI allowlist                                     |
| `GMAIL_OAUTH_ALLOWED_SCOPES`                            |                                       No | `gmail.readonly,gmail.send`                      | Comma-separated Gmail OAuth scope allowlist aliases                                          |
| `GMAIL_OAUTH_TOKEN_EXCHANGE_MODE`                       |                                       No | `disabled`                                       | Gmail OAuth token exchange boundary mode: `disabled`, `simulated`, or `real`                 |
| `GMAIL_OAUTH_TOKEN_REFRESH_MODE`                        |                                       No | `disabled`                                       | Gmail OAuth token refresh boundary mode: `disabled`, `simulated`, or `real`                  |
| `GMAIL_OAUTH_TOKEN_ENDPOINT`                            |                                       No | `https://oauth2.googleapis.com/token`            | Reserved public token endpoint config for future real Gmail token exchange                   |
| `GMAIL_OAUTH_TOKEN_EXCHANGE_TIMEOUT_MS`                 |                                       No | `10000`                                          | Timeout in milliseconds for real Gmail OAuth token exchange HTTP requests                    |
| `GMAIL_OAUTH_TOKEN_REFRESH_TIMEOUT_MS`                  |                                       No | `10000`                                          | Timeout in milliseconds for real Gmail OAuth token refresh HTTP requests                     |
| `GMAIL_API_MODE`                                        |                                       No | `disabled`                                       | Gmail API client boundary mode: `disabled`, `mocked`, or `real`                              |
| `GMAIL_API_BASE_URL`                                    |                 Real Gmail API mode only | none                                             | Explicit Gmail API base URL for real Gmail API HTTP calls                                    |
| `GMAIL_API_TIMEOUT_MS`                                  |                                       No | `10000`                                          | Timeout in milliseconds for Gmail API HTTP requests                                          |
| `GMAIL_INBOUND_SYNC_SCHEDULER_ENABLED`                  |                                       No | `false`                                          | Enables the internal Gmail inbound sync scheduler runtime only when explicitly started       |
| `GMAIL_INBOUND_SYNC_SCHEDULER_INTERVAL_MS`              |                                       No | `300000`                                         | Scheduler runtime interval; runtime clamps to a safe minimum                                 |
| `GMAIL_INBOUND_SYNC_SCHEDULER_MAX_ACCOUNTS_PER_TICK`    |                                       No | `10`                                             | Maximum Gmail provider accounts checked per scheduler tick; clamped by runtime               |
| `GMAIL_INBOUND_SYNC_SCHEDULER_MAX_MESSAGES_PER_ACCOUNT` |                                       No | `25`                                             | Maximum Gmail messages fetched per account per scheduler tick; clamped by sync boundary      |
| `TOKEN_VAULT_ENCRYPTION_KEY_BASE64`                     |                Encrypted vault mode only | none                                             | Base64-encoded 32-byte AES-256-GCM key for encrypted Gmail token vault persistence           |
| `TOKEN_VAULT_ENCRYPTION_KEY_VERSION`                    |                                       No | `v1`                                             | Key version recorded with encrypted Gmail token vault rows                                   |
| `GMAIL_TOKEN_ENCRYPTION_KEY`                            |                                       No | none                                             | Legacy fallback env name for local compatibility; prefer `TOKEN_VAULT_ENCRYPTION_KEY_BASE64` |
| `AUTH_MODE`                                             |                                       No | `mock`                                           | Auth mode: `mock` or `provider`                                                              |
| `AUTH_PROVIDER`                                         |                       Provider mode only | none                                             | Provider selection: `supabase` or `better-auth`                                              |
| `SUPABASE_AUTH_JWKS_URL`                                |    Production + `AUTH_PROVIDER=supabase` | none                                             | Supabase JWKS URL for future provider token verification                                     |
| `SUPABASE_AUTH_ISSUER`                                  |    Production + `AUTH_PROVIDER=supabase` | none                                             | Supabase issuer URL for future provider token verification                                   |
| `BETTER_AUTH_BASE_URL`                                  | Production + `AUTH_PROVIDER=better-auth` | none                                             | Better Auth base URL for future provider verification                                        |
| `DATABASE_URL`                                          |    Required in production and DB scripts | none                                             | PostgreSQL connection string for runtime, migrate, seed, and studio                          |
| `MOCK_AUTH_ENABLED`                                     |                                       No | `true` outside production, `false` in production | Enables local/dev/test mock auth                                                             |
| `CORS_ORIGIN`                                           |                   Required in production | empty                                            | Explicit allowed frontend origin list; `*` is rejected in production                         |

Gmail refresh boundary notes:

```text
refresh uses only workspace-scoped provider account + encrypted token vault lookups
raw access_token and refresh_token never leave the vault/client boundary
simulated refresh mode is blocked in production
real refresh mode requires GMAIL_OAUTH_CLIENT_ID, GMAIL_OAUTH_CLIENT_SECRET, and GMAIL_OAUTH_TOKEN_ENDPOINT
```

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

Owner bootstrap:

```bash
BOOTSTRAP_ORGANIZATION_ID=org_prod \
BOOTSTRAP_ORGANIZATION_NAME="CLARA Production" \
BOOTSTRAP_WORKSPACE_ID=wks_prod \
BOOTSTRAP_WORKSPACE_NAME="Default Workspace" \
BOOTSTRAP_OWNER_PROVIDER_SUBJECT=provider-subject-from-auth-provider \
BOOTSTRAP_OWNER_EMAIL=owner@example.test \
BOOTSTRAP_OWNER_DISPLAY_NAME="Workspace Owner" \
npm run db:bootstrap-owner
```

The bootstrap command is explicit and audited. It creates or links the first
workspace owner only when there is no conflicting active owner. There is no
public self-assign owner endpoint, and provider tokens/cookies/raw provider
payloads are never stored.

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
simulated outbound email reply results can now be persisted as safe delivery records
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
docs/product/CLARA-P3-EMAIL-REPLY-ADAPTER-SPEC.md
docs/product/CLARA-P3-EMAIL-OUTBOUND-DELIVERY-SPEC.md
docs/product/CLARA-P3-EMAIL-E2E-INTERNAL-SMOKE-SPEC.md
docs/product/CLARA-P3-EMAIL-PROVIDER-INTEGRATION-DECISION.md
docs/product/CLARA-P3-EMAIL-PROVIDER-RISK-MATRIX.md
docs/product/CLARA-P3-GMAIL-AUTH-BOUNDARY-SPEC.md
docs/product/CLARA-P3-GMAIL-PROVIDER-ACCOUNT-PERSISTENCE-SPEC.md
docs/product/CLARA-P3-GMAIL-ENCRYPTED-TOKEN-VAULT-SPEC.md
docs/product/CLARA-P3-GMAIL-OAUTH-STATE-PKCE-SPEC.md
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

Current email reply adapter skeleton:

```text
no public email send route is exposed
email reply adapter skeleton is separate from the existing core reply API flow
simulated email reply adapter is available for local/dev/test
safe send result returns provider_message_id, provider_thread_id when available, sent_at, status, and allowlisted metadata only
raw provider response payload, raw html, attachments, and full reply body are not stored in the adapter result
future Gmail API or SMTP adapters should plug into the same email reply adapter interface after provider trust and secret management are in place
```

Current provider integration decision spike:

```text
Gmail API is the recommended first real integration path for Gmail / Google Workspace users
IMAP + SMTP remains a later fallback path
SMTP-only remains an outbound-only future option
transactional provider API remains a later outbound-focused option
this repository does not contain real provider code, real OAuth flow, or real provider secrets
```

Current Gmail auth boundary skeleton:

```text
Gmail provider account service is internal-only and has no public HTTP route
mock in-memory Gmail token vault is test-only and must not be used in production
encrypted Gmail token vault persistence now exists for internal DB-backed storage only
encrypted token rows store ciphertext, iv, auth_tag, key_version, token_purpose, and allowlisted metadata only
TOKEN_VAULT_ENCRYPTION_KEY_BASE64 must be a valid base64-encoded 32-byte AES-256-GCM key and must never be committed
OAuth connect intent persistence now stores state_hash, nonce_hash, and encrypted PKCE verifier material only
redirect_uri must match an exact allowlisted value from GMAIL_OAUTH_REDIRECT_URI_ALLOWLIST
OAuth state consume is one-time only and fails closed for reused, expired, revoked, or cross-workspace state
provider account DTOs never expose access_token, refresh_token, or client_secret
no Google/Gmail network call is made in this skeleton
Gmail provider account persistence now stores only safe workspace-scoped metadata plus token_reference_id
raw access tokens, raw refresh tokens, OAuth client secrets, and raw provider payloads are never persisted
duplicate provider + email within the same organization/workspace scope is rejected
OAuth connect route skeleton now exists at POST /api/v1/integrations/gmail/oauth/connect for authenticated non-viewer users only
OAuth connect response returns authorization_url, provider, scopes, and expiry only; it never returns PKCE verifier, nonce, token, or client_secret
OAuth callback route now exists at GET /api/v1/integrations/gmail/oauth/callback and validates code/state with mode-based completion behavior
OAuth callback never persists or returns authorization code, raw state, nonce, PKCE verifier, access token, or refresh token
Gmail OAuth token exchange boundary now exists as an internal-only service and client abstraction
simulated Gmail OAuth token exchange is allowed for local/test only and is blocked in production
token exchange stores access_token and refresh_token only through the encrypted Gmail token vault boundary and never returns raw tokens
GMAIL_OAUTH_TOKEN_EXCHANGE_MODE=disabled keeps callback response at pending_token_exchange
GMAIL_OAUTH_TOKEN_EXCHANGE_MODE=simulated completes the provider connection internally and returns only a safe connected account DTO
GMAIL_OAUTH_TOKEN_EXCHANGE_MODE=real now enables a real Google token exchange client boundary with strict config validation, timeout, and sanitized provider errors
real token exchange still does not complete a full public Gmail connection flow in this build because Gmail profile resolution and Gmail API client work remain separate follow-up steps
production-like real mode requires GMAIL_OAUTH_CLIENT_ID, GMAIL_OAUTH_CLIENT_SECRET, redirect URI allowlist, encrypted token vault config, and safe timeout config
GMAIL_API_MODE=real now enables a real Gmail API HTTP client boundary that only accepts access tokens from the encrypted vault boundary
GMAIL_API_MODE=mocked is local/test only and is blocked in production
real Gmail API mode requires an explicit GMAIL_API_BASE_URL and returns sanitized provider errors without exposing bearer tokens
Gmail profile verification now uses GET /gmail/v1/users/me/profile through the Gmail API client boundary and updates only safe provider account metadata such as historyId and lastVerifiedAt
profile verification rejects cross-workspace access, email mismatch, missing access token, and sanitized provider failures without storing raw provider bodies
```

Current email E2E internal smoke baseline:

```text
no public smoke endpoint is exposed
email e2e smoke service is internal-only and offline
the smoke flow covers simulated inbound load, normalization, inbound persistence, simulated outbound reply, and outbound delivery record persistence
viewer role is blocked from the smoke reply action through the same permission helper used by the API
the smoke harness must not call external providers or store raw provider payloads, tokens, or secrets
```

Gmail outbound route baseline:

```text
POST /api/v1/integrations/gmail/outbound/send requires authenticated owner/agent access
viewer role is blocked server-side
organization_id and workspace_id always come from AuthContext, not request body
request body is strict and rejects scope spoofing or unknown raw provider fields
send is an explicit human/operator API action only
the route stores a safe email_outbound_deliveries record when conversation_id is provided
delivery records store status, provider_message_id when available, and safe reason_code only
responses and persistence never include access_token, refresh_token, Authorization header, client_secret, raw Gmail payload, or provider raw error body
this build still uses the simulated Gmail outbound client only and does not call Google/Gmail network endpoints
the route does not create AI drafts, run inbound sync, or trigger automatic sending from AI output
route spec: `docs/product/CLARA-P3-GMAIL-OUTBOUND-PERSISTENCE-ROUTE-HARDENING-SPEC.md`
```

Gmail reply send integration baseline:

```text
POST /api/v1/conversations/:conversation_id/reply still requires explicit authenticated human action
viewer remains blocked by the existing reply:send permission
organization_id and workspace_id come from AuthContext only
Gmail path is used only when ReplyService is explicitly configured with Gmail outbound send and conversation source is email/Gmail
Gmail path sends through the simulated Gmail outbound client in local/test and persists safe email_outbound_deliveries metadata
non-Gmail conversations continue using the existing simulated reply provider
AI draft endpoint still never sends a reply
inbound sync and scheduler do not trigger outbound send
internal E2E smoke is service-only and has no public route
spec: `docs/product/CLARA-P3-GMAIL-REPLY-SEND-E2E-SMOKE-SPEC.md`
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
P5 auth foundation reference: `docs/product/CLARA-P5-PRODUCTION-AUTH-FOUNDATION-SPEC.md`.

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
AI Reply Suggestion uses a mock provider only and returns suggestion-only output with requiresHumanApproval=true
reply send uses simulated providers only; Gmail-sourced conversations can use the simulated Gmail outbound boundary when explicitly wired
WhatsApp-sourced conversations can use the simulated WhatsApp outbound boundary through the existing explicit human reply endpoint
AI draft creates a draft row and activity but does not send any message
AI Reply Suggestion does not create a send action and does not auto-send
AI Draft Review requires explicit human approval and approval does not equal send
reply send requires an explicit human API request
```

## AI Draft Review

P7 AI Draft Review endpoints:

```text
POST /api/v1/ai/draft-reviews
GET /api/v1/ai/draft-reviews/:draftId
POST /api/v1/ai/draft-reviews/:draftId/edit
POST /api/v1/ai/draft-reviews/:draftId/approve
POST /api/v1/ai/draft-reviews/:draftId/reject
```

Draft review is workspace-scoped from backend AuthContext. The API rejects or
ignores client-supplied organization/workspace/role authority. Viewer is
read-only. Blocked, rejected, and expired drafts cannot be approved.

Responses and audit metadata must not include access token, refresh token,
cookies, Authorization header, raw provider payload, raw webhook payload, raw
DOM, raw HTML, or client secret.

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
- AI Reply Suggestion uses the Prompt Contract and AI Context Builder, treats untrusted customer content as untrusted, and never sends replies automatically.
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
npm run test -- ai-reply-suggestion
npm run build
npm audit --omit=dev --audit-level=high
```

From repo root:

```bash
bash scripts/validate-repo-structure.sh
bash scripts/validate-p5-final-security-audit.sh
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
production provider auth requires configured issuer/JWKS plus active CLARA workspace membership
```
