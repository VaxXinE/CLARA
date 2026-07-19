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
P6 final observability remains documentation/policy only; dashboard does not expose provider tokens, raw payloads, or analytics charts
P7 AI assistant safety scope is documentation/policy only; dashboard does not add AI automation UI or auto-send behavior
P7 AI Follow-up Recommendation adds a read-only recommendation-only panel. It shows requiresHumanApproval and does not add send, task, schedule, or reminder automation.
P7 AI Conversation Summary and AI Customer Note Suggestion add review-only/suggestion-only panels. They show requiresHumanApproval and do not auto-write customer notes or mutate CRM/customer records.
P8 CRM & Workflow Intelligence starts as workflow readiness policy only. Dashboard must not add autonomous CRM mutation, auto-write customer note, auto-create task, auto-assign owner, unsafe HTML rendering, or client-side workspace authority.
P8 Customer Profile Intelligence adds a read-only customer profile signals panel backed by the API read model. It does not add Apply, Save, Create Task, Assign Owner, Change Status, Update Lifecycle, raw HTML rendering, token display, or provider raw payload display.
P8 Owner Assignment Readiness adds a read-only customer owner assignment panel backed by the API readiness model. It does not add Execute, Apply, Save, Assign Owner, Change Owner, Create Task, Schedule Task, Send Message, Change Status, Update Lifecycle, Write Note, raw HTML rendering, token display, or provider raw payload display.
P8 Lifecycle / Status Update Readiness adds a read-only lifecycle/status panel backed by the API readiness model. It does not add Execute, Apply, Save, Change Status, Update Lifecycle, Create Task, Schedule Task, Send Message, Write Note, raw HTML rendering, token display, or provider raw payload display.
P8 CRM Activity Audit Hardening adds an audit-only readiness panel for P8 CRM coverage. It shows compliance/readiness visibility only and does not add Execute, Apply, Save, Create Task, Assign Owner, Update Status, Update Lifecycle, Send Message, Write Note, analytics/KPI charts, raw audit payload display, token display, or provider raw payload display.

P8-PR-09 closes dashboard CRM workflow coverage with final UI, security, and
accessibility regression tests. P8 complete keeps panels read-only,
review-only, readiness-only, or audit-only and does not add CRM mutation, task
creation, owner assignment mutation, lifecycle mutation, status mutation,
outbound send, real AI provider calls, raw provider payload display, raw
webhook payload display, access token display, refresh token display, cookies,
or unsafe HTML rendering. P9 Analytics / Reporting / KPI is the next phase.
P8 dashboard guardrails: no autonomous CRM mutation, no auto-write customer note, no auto-create task, no auto-assign owner.
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

| Name                     |                  Required | Default                 | Description                                                |
| ------------------------ | ------------------------: | ----------------------- | ---------------------------------------------------------- |
| `VITE_API_BASE_URL`      |                        No | `http://127.0.0.1:3000` | CLARA API base URL                                         |
| `VITE_AUTH_MODE`         |                        No | `demo`                  | Dashboard auth mode: `demo` or `provider`                  |
| `VITE_SUPABASE_URL`      | Required in provider mode | none                    | Supabase project URL for browser session handling          |
| `VITE_SUPABASE_ANON_KEY` | Required in provider mode | none                    | Supabase anon key only. Never use a service role key here. |

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

## AI Reply Suggestion

The dashboard can request `POST /api/v1/ai/reply-suggestions` and display a
preview in the composer. The panel is suggestion-only:

```text
requiresHumanApproval=true
no auto-send
no provider send
no token display
no raw provider payload
no raw DOM
no raw HTML
```

Validation:

```bash
cd apps/dashboard
npm run test -- AiReplySuggestionPanel client
```

## AI Draft Review

The dashboard can display AI Draft Review status and provide human-only
review controls:

```text
edit draft text
approve draft
reject draft
no auto-send
approval does not equal send
no token display
no raw provider payload display
no raw DOM or raw HTML rendering
```

The send button is disabled for an AI draft review until the backend marks the
review as `approved`. Frontend checks are UX only; backend authorization and
workspace scope remain the source of truth.

## AI Automation Guardrails

The dashboard includes a read-only P7 guardrail readiness panel. It can request
an evaluation-only decision from the API, but it does not add execution controls,
automatic scheduler controls, automatic task creation, automatic customer note
write, or auto-send behavior.

The panel must not render access token, refresh token, cookies, Authorization
headers, raw provider payload, raw webhook payload, raw DOM, or raw HTML.

## P7 Final AI Assistant Audit

Dashboard final coverage confirms AI surfaces render as suggestion-only,
review-only, or evaluation-only, keep `requiresHumanApproval` visible where
needed, and do not add auto-send, automatic task creation, automatic scheduler,
automatic customer note write, unsafe HTML rendering, token display, cookie
display, raw provider payload display, raw webhook payload display, raw DOM
display, or raw HTML display.

## P8 CRM & Workflow Intelligence

Dashboard P8-PR-01 readiness is documentation/test-only. Future CRM workflow UI
may show proposals and workflow readiness, but persistent changes require
Backend AuthContext, workspace-scoped authorization, role permission, human
approval, and audit log coverage. P9 Analytics / Reporting / KPI remains later.

P8-PR-02 adds read-only customer profile intelligence visibility. The panel
shows profile health, activity, lifecycle/status suggestions, and follow-up
recommendation labels only.

P8-PR-03 adds read-only Customer Timeline Intelligence visibility. The panel
shows safe timeline events, key moments, recent signals, risk flags, and
follow-up hints from the Backend AuthContext workspace-scoped API. It is
review-only and does not add CRM mutation, auto-create task, auto-write
customer note, token display, cookies, raw provider payload, raw webhook
payload, raw DOM, raw HTML, or unsafe HTML rendering.

P8-PR-04 adds Reviewable CRM Action Proposal visibility. The panel is
proposal-only and review-only, displays `mutationExecuted=false`, and does not
add Execute, Apply, Save, Create Task, Assign Owner, Change Status, Update
Lifecycle, Write Note, hidden auto-submit, no CRM mutation, no auto-create
task, no auto-write customer note, no owner assignment mutation, no
lifecycle/status mutation, token display, cookies, raw provider payload, raw
webhook payload, raw DOM, raw HTML, or unsafe HTML rendering.

P8-PR-05 adds Task / Follow-up Workflow Proposal visibility. The panel is
proposal-only and review-only, displays `taskCreated=false` and
`actionExecuted=false`, and does not add Execute, Apply, Save, Create Task,
Schedule Task, Assign Owner, Change Status, Update Lifecycle, Send Message,
Write Note, hidden auto-submit, no CRM mutation, no task creation, no
auto-create task, no outbound send, no scheduler, token display, cookies, raw
provider payload, raw webhook payload, raw DOM, raw HTML, or unsafe HTML
rendering.

No autonomous CRM mutation, no auto-write customer note, no auto-create task,
no auto-assign owner, and no `dangerouslySetInnerHTML` are added in this PR.

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

P9-PR-01 adds an Analytics Reporting Readiness panel and tests only. It shows
allowed KPI categories and privacy rules, clearly labels KPI dashboards as not
implemented yet, and does not add charts, export, execute/apply controls, raw
payload rendering, token display, unsafe HTML rendering, or dashboard mutation.

P9-PR-02 adds an Analytics Read Model Foundation panel and API client methods
for `GET /api/v1/analytics/readiness` and
`GET /api/v1/analytics/metric-catalog`. The panel is read-only and shows Metric
Foundation readiness, allowed categories, metric catalog status, and safety
rules. It does not add charts, export/download controls, scheduled aggregation,
report export, CRM mutation, task creation, outbound send, raw customer
messages, raw provider payload, raw webhook payload, access token, refresh
token, cookies, or unsafe HTML rendering.

P9-PR-03 adds a read-only Core Operational Metrics Pack component and dashboard
API client support for `GET /api/v1/analytics/overview`,
`GET /api/v1/analytics/conversations/volume`,
`GET /api/v1/analytics/response-time-sla`, and
`GET /api/v1/analytics/channels/performance`. It displays Conversation Volume
Metrics, Response Time / SLA, and Channel Performance Metrics safely. It does
not add mutation controls, report export, customer-level drilldown, outbound
send, raw customer messages, raw provider payload, raw webhook payload, access
token, refresh token, cookies, or unsafe HTML rendering.

P9-PR-04 adds read-only KPI Dashboard Cards and CRM Workflow Metrics components
with API client support for `GET /api/v1/analytics/crm-workflow` and
`GET /api/v1/analytics/kpi-dashboard`. The dashboard displays aggregate-first,
workspace-scoped cards only. It does not add report export, customer-level
drilldown, CRM mutation, task creation, outbound send, raw customer messages,
raw provider payload, raw webhook payload, raw audit metadata, access token,
refresh token, cookies, or unsafe HTML rendering.

P9-PR-05 adds read-only Reporting Filters and Analytics Audit Privacy panels.
The dashboard displays safe aggregate filter and audit summaries from the API.
It does not add report export, customer-level drilldown, CRM mutation, task
creation, outbound send, raw customer messages, raw provider payload, raw
webhook payload, raw audit metadata, access token, refresh token, cookies, or
unsafe HTML rendering.
