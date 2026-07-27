---
project: "CLARA"
artifact: "P19 First Owner Workspace Bootstrap Runbook"
status: "current"
owner: "CLARA Product and Engineering"
classification: "runbook"
---

# P19 First Owner Workspace Bootstrap Runbook

Use this once per internal workspace before inviting operators to use CLARA as a
real CRM.

## Inputs

Collect only identifiers:

- organization id and name
- workspace id and name
- owner provider subject
- owner email
- owner display name

Do not collect access tokens, refresh tokens, cookies, auth headers, provider
raw payloads, AI secrets, or payment data.

## Steps

1. Configure API provider auth and database env outside the repo.
2. Set `INTERNAL_CRM_RUNTIME_ENABLED=true`, `AUTH_MODE=provider`, and
   `MOCK_AUTH_ENABLED=false`.
3. Run `npm run db:migrate`.
4. Run `npm run db:bootstrap-owner` with bootstrap identifiers from secure
   operator input.
5. Sign in through the provider and verify `/api/v1/me` returns the owner role
   from backend membership.
6. Confirm dashboard `VITE_AUTH_MODE=provider` shows no demo role switcher.

Backend AuthContext/workspace membership is source of truth. client-supplied
workspaceId is not authoritative.
