---
project: "CLARA"
artifact: "P5 Dashboard Provider Auth UX Spec"
status: "draft"
owner: "CLARA Frontend"
classification: "product-spec"
---

# CLARA P5 Dashboard Provider Auth UX Spec

The dashboard already has a provider session shell. P5 defines the production UX contract before adding full login and workspace selection.

## Modes

- `VITE_AUTH_MODE=demo` is local/demo only.
- `VITE_AUTH_MODE=provider` is required for production-like dashboard use.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are required in provider mode.
- Supabase service role keys must never appear in frontend config.

## Provider Mode Contract

- Show login/session shell when no provider session exists.
- Do not load product data until authenticated.
- Attach `Authorization: Bearer <access_token>` only when the provider SDK returns a real session token.
- Do not invent fake bearer tokens.
- Do not send frontend role, `organization_id`, or `workspace_id` as authorization truth.
- Render API errors as safe text only.

## Local Demo Contract

- Demo mode may send mock auth headers.
- Demo role switcher is UX-only and local-only.
- Backend mock auth must remain blocked in production.

## Future PRs

- Real login UI.
- Workspace selection for users with multiple active memberships.
- Logout/session expiry UX.
- Invite and owner bootstrap UX.
