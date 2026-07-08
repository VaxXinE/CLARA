# apps/dashboard/

CLARA Dashboard conversation workspace built with Vite, React, and TypeScript.

## Status

```text
PR-09 Frontend Conversation Workspace
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

## Commands

```bash
npm run dev
npm run typecheck
npm run build
npm run test
```

## Security Notes

- Do not put API keys or secrets in frontend env.
- Backend authorization remains the source of truth.
- Customer/user-generated content is rendered as plain text only.
- AI drafts are visibly labeled as drafts and require human review.
- Send action always requires explicit human click.
- Viewer role does not see enabled AI draft or send controls.
