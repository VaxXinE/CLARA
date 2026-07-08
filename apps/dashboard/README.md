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
customer profile sidebar
activity timeline
AI draft generation
explicit human reply send
viewer read-only UX
loading, empty, and error states
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
backend remains the source of truth for permissions
```

## Environment

| Name | Required | Default | Description |
|---|---:|---|---|
| `VITE_API_BASE_URL` | No | `http://127.0.0.1:3000` | CLARA API base URL |
| `VITE_DEMO_MODE` | No | `true` | Enables local role switcher and mock auth headers |

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

## Commands

```bash
npm run dev
npm run typecheck
npm run build
npm run test
npm audit --omit=dev --audit-level=high
```

## Security Notes

- Do not put API keys or secrets in frontend env.
- Backend authorization remains the source of truth.
- Mock auth in the dashboard is for local/demo only.
- Customer/user-generated content is rendered as plain text only.
- AI drafts are visibly labeled as drafts and require human review.
- Send action always requires explicit human click.
- Viewer role does not see enabled AI draft or send controls.
- API errors are rendered as plain text only and should never expose raw provider payloads.

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

## Known Limitations

```text
demo role switcher is for local/mock auth only
mock AI draft provider only
simulated reply send provider only
no real WhatsApp/Instagram/TikTok/email integration yet
no frontend secrets or provider API keys should exist in this app
```
