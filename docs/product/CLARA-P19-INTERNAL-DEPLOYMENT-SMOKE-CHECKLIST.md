# CLARA P19 Internal Deployment Smoke Checklist

Health/ready smoke checks exist:

- `GET /health` returns safe 200.
- `GET /ready` returns safe 200.
- Protected CRM endpoint without auth returns safe 401.
- Provider-authenticated user without membership returns safe 403.
- Missing/inactive membership fails closed.
- Dashboard provider mode must not show demo role switcher.
- Dashboard provider mode must not send mock headers.

Smoke output must not include secrets, tokens, auth headers, raw provider
payloads, raw HTML, raw AI prompts, or payment data.

