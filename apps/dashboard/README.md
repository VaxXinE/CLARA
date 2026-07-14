# apps/dashboard/

CLARA Dashboard conversation workspace built with Vite, React, and TypeScript.

## Status

```text
PR-10 Security and QA Hardening
```

## Features

```text
top bar with current user/workspace
demo role switcher for local mock auth
conversation inbox with search and status filter
conversation detail and message thread
conversation source badge for email/Gmail/channel labels
customer profile sidebar
activity timeline
read-only Gmail scheduler status visibility
read-only channel/provider health visibility for Gmail, Webchat, WhatsApp, Instagram, and TikTok
read-only Gmail outbound delivery status visibility after a send response includes an outbound delivery id
read-only Webchat outbound delivery status visibility after a Webchat reply send response includes an outbound delivery id
read-only user/role management readiness panel for owner sessions
AI draft generation
explicit human reply send
viewer read-only UX
loading, empty, and error states
P5.1 Workspace Shell Upgrade adds the dark/gold shell, left sidebar, grouped navigation, topbar, and role-aware navigation labels
P5.1 final UI regression, accessibility, security, and QA signoff coverage closes the UI upgrade track
```

## Local Setup

Start the backend first:

```bash
cd services/api
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Then start the dashboard:

```bash
cd apps/dashboard
npm install
cp .env.example .env.local
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

Expected local flow:

```text
dashboard calls the local API at VITE_API_BASE_URL
demo mode adds mock auth headers for owner/agent/viewer
provider mode attaches Authorization: Bearer <access_token> only when a real provider session exists
backend remains the source of truth for permissions
```

Auth smoke-test reference:

```text
docs/product/CLARA-P2-AUTH-SMOKE-TEST-RUNBOOK.md
docs/product/CLARA-P5-DASHBOARD-PROVIDER-AUTH-UX-SPEC.md
docs/product/CLARA-P51-DESIGN-SYSTEM-CONTRACT.md
docs/product/CLARA-P51-ROUTE-MIGRATION-MAP.md
docs/product/CLARA-P51-UI-MIGRATION-SECURITY-RULES.md
```

## Environment

| Name                     |                 Required | Default                 | Description                                                 |
| ------------------------ | -----------------------: | ----------------------- | ----------------------------------------------------------- |
| `VITE_API_BASE_URL`      |                       No | `http://127.0.0.1:3000` | CLARA API base URL                                          |
| `VITE_AUTH_MODE`         |                       No | `demo`                  | Dashboard auth mode: `demo` or `provider`                   |
| `VITE_SUPABASE_URL`      | Required in provider mode | none                    | Supabase project URL for browser session handling           |
| `VITE_SUPABASE_ANON_KEY` | Required in provider mode | none                    | Supabase anon key only. Never use a service role key here.  |

Deployment config runbook:

```text
docs/product/CLARA-P2-DEPLOYMENT-CONFIG-RUNBOOK.md
docs/product/CLARA-P2-STAGING-SMOKE-RUNBOOK.md
docs/product/CLARA-P2-RELEASE-CHECKLIST.md
```

## Demo Roles

The local role switcher maps to backend mock auth headers and demo seed users:

```text
Owner  -> usr_demo_owner
Agent  -> usr_demo_agent
Viewer -> usr_demo_viewer
```

Role behavior:

```text
owner  -> can read, generate AI draft, and send reply
agent  -> can read, generate AI draft, and send reply
viewer -> read-only; AI draft and send controls are not enabled
```

User/role management readiness:

```text
owner  -> dashboard can read safe member/readiness metadata from backend
agent  -> no role-management readiness request from dashboard
viewer -> no role-management readiness request from dashboard
```

Invite user, update role, remove member, workspace switch, and public
self-escalation controls are intentionally disabled/not implemented. Backend
authorization remains the source of truth.

Provider mode behavior:

```text
provider session shell renders a login form when no session exists
dashboard does not load conversation data until a provider session exists
dashboard now waits for GET /api/v1/me membership resolution before loading product data
provider-authenticated users without active workspace membership see a safe blocked state with sign out
frontend only sends provider access_token as a bearer token
frontend never invents a bearer token when no session exists
sign out is delegated to the provider auth client abstraction
misconfigured provider auth fails closed instead of falling back to demo mode
backend still decides role, organization, and workspace from authenticated context
workspace switcher and invite management are later work
```

P5.1 UI direction:

```text
CLARA v2 is the production-ready upgrade of project_Clara.
The legacy repo is UX/product reference only.
The current shell preserves the operator-first dark/gold workspace, sidebar, topbar, grouped navigation, and role-aware labels.
P5.1-PR-03 adds the typed role-aware navigation model for owner, agent, viewer, and future sales/manager/head/superadmin compatibility.
Planned route entries are visible only where they fit the current role and do not perform full route navigation yet.
P5.1-PR-04 moves the authenticated conversation workspace into a dedicated presentational layout for queue, active conversation, customer context, composer, and status visibility.
P5.1-PR-05 adds safe CRM and Customer Intelligence skeleton panels using existing conversation/customer data only; no CRUD or new API calls.
P5.1-PR-06 adds safe Action Center, Insight, and Administration placeholder panels with disabled planned controls only.
P5.1-PR-07 adds final UI regression, accessibility, and security guardrail tests plus QA signoff docs.
Backend authorization remains the source of truth.
```

## Commands

```bash
npm run dev
npm run typecheck
npm run build
npm run test
npm audit --omit=dev --audit-level=high
```

Production config doctor:

```bash
cd ../..
bash scripts/validate-production-runtime-config.sh
bash scripts/validate-p5-final-security-audit.sh
```

Docker validation:

```bash
docker build -f apps/dashboard/Dockerfile -t clara-dashboard:local .
docker compose -f docker-compose.prod.example.yml config
```

## Security Notes

- Do not put API keys or secrets in frontend env.
- Never commit real Supabase URL or anon key.
- Never use a Supabase service role key in frontend.
- Production deployments must use `VITE_AUTH_MODE=provider`.
- `VITE_API_BASE_URL` must point to the intended deployed API environment.
- Backend authorization remains the source of truth.
- Mock auth in the dashboard is for local/demo only.
- Provider auth in the dashboard is a session shell only; backend still decides authorization.
- Provider mode must not load protected product data before a real provider session exists.
- Provider mode must not invent bearer tokens or send client-provided role/workspace authority.
- Customer/user-generated content is rendered as plain text only.
- AI drafts are visibly labeled as drafts and require human review.
- Send action always requires explicit human click.
- Viewer role does not see enabled AI draft or send controls.
- API errors are rendered as plain text only and should never expose unfiltered provider response bodies.

## Local Validation

```bash
cd apps/dashboard
npx --yes prettier "src/**/*.ts" "src/**/*.tsx" --write
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high
```

From repo root:

```bash
bash scripts/validate-repo-structure.sh
```

Focused auth smoke tests:

```bash
cd apps/dashboard
npm run test -- --run src/App.test.tsx src/auth/AuthProvider.test.tsx src/api/client.test.ts
```

## Known Limitations

```text
demo role switcher is for local/mock auth only
provider login UI depends on provider SDK session state; no workspace switcher UI yet
provider users without CLARA workspace membership are blocked before product data is loaded
mock AI draft provider only
simulated reply send provider only
provider mode still depends on backend membership resolution before any product data is allowed
no real WhatsApp/Instagram/TikTok/email integration yet
Gmail scheduler plus Gmail/Webchat outbound delivery status are read-only; no dashboard manual tick, resend, retry, send, or OAuth account management UI yet
no frontend secrets or provider API keys should exist in this app
```

## Docker Production Build

Dashboard Docker baseline:

```text
multi-stage build
Vite static assets are built in a Node build stage
runtime image uses unprivileged nginx on port 8080
only public VITE_* values are baked into the frontend image
.env files, local credentials, and private keys are excluded from the Docker build context
```

Build locally:

```bash
docker build -f apps/dashboard/Dockerfile -t clara-dashboard:local .
```

Optional provider-mode build args:

```bash
docker build \
  -f apps/dashboard/Dockerfile \
  -t clara-dashboard:local \
  --build-arg VITE_API_BASE_URL=https://api.example.com \
  --build-arg VITE_AUTH_MODE=provider \
  --build-arg VITE_SUPABASE_URL=https://example.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=public-anon-key-only \
  .
```

Run locally:

```bash
docker run --rm -p 8080:8080 clara-dashboard:local
```

Production-like local compose example:

```text
docker-compose.prod.example.yml
```

P5.1 upgrades the dashboard toward a premium dark/gold workspace shell inspired by project_Clara.
