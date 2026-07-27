# CLARA P19 Internal Dashboard Deployment Runbook

Dashboard internal runtime uses provider auth only:

```sh
cd apps/dashboard
npm install
npm run typecheck
npm run test
npm run build
```

`VITE_API_BASE_URL` must point to the internal API URL. `VITE_AUTH_MODE` must be
`provider`. The dashboard only receives public `VITE_*` values.

Dashboard provider mode must not show demo role switcher. Dashboard provider
mode must not send mock headers. Do not expose Supabase service role keys,
provider secrets, AI provider secrets, access tokens, refresh tokens,
Authorization headers, or raw provider payloads in frontend config.

