---
project: "CLARA"
artifact: "P19 First Owner Bootstrap Runbook"
status: "current"
owner: "CLARA Product and Engineering"
classification: "runbook"
---

# P19 First Owner Bootstrap Runbook

P19-PR-01 is complete. P19-PR-02 is complete. P19-PR-03 is complete.

Use this runbook before an internal team uses CLARA as a real CRM.

## Required Environment

Set these outside the repository:

- `AUTH_MODE=provider`
- `MOCK_AUTH_ENABLED=false`
- `INTERNAL_CRM_RUNTIME_ENABLED=true`
- `DATABASE_URL`
- provider auth config for the selected provider
- `BOOTSTRAP_ORGANIZATION_ID`
- `BOOTSTRAP_ORGANIZATION_NAME`
- `BOOTSTRAP_WORKSPACE_ID`
- `BOOTSTRAP_WORKSPACE_NAME`
- `BOOTSTRAP_OWNER_PROVIDER_SUBJECT`
- `BOOTSTRAP_OWNER_EMAIL`
- `BOOTSTRAP_OWNER_DISPLAY_NAME`

These bootstrap values are identifiers only. Do not provide access tokens,
refresh tokens, cookies, auth headers, provider raw payloads, service role keys,
AI secrets, or payment data.

## Command

```bash
cd services/api
npm run db:migrate
npm run db:bootstrap-owner
```

The script returns only safe ids and status. It must not print secrets, tokens,
Authorization headers, raw provider payloads, or provider credential material.

## Verification

1. Sign in through provider auth as the owner.
2. Call `/api/v1/me`.
3. Confirm backend returns owner role, organization, and workspace.
4. Confirm dashboard `VITE_AUTH_MODE=provider` shows no demo role switcher.
5. Confirm provider mode does not send mock headers.

Backend AuthContext/workspace membership is source of truth. client-supplied
workspaceId is not authoritative. Missing/inactive membership fails closed.
