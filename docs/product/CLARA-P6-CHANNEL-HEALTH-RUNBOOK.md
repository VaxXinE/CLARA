# CLARA P6 Channel Health Runbook

## Local Smoke

1. Start the API in local mock/demo mode.
2. Start the dashboard.
3. Open the dashboard and confirm the Channel Health panel appears.
4. Call the API with mock auth:

```bash
curl -s http://127.0.0.1:3000/api/v1/channels/health \
  -H 'x-mock-user-id: usr_demo_owner' \
  -H 'x-mock-organization-id: org_demo' \
  -H 'x-mock-workspace-id: wks_demo_sales' \
  -H 'x-mock-role: owner'
```

## Expected Safe Response

- Gmail should show connected, auth_required, degraded, rate_limited, or another safe provider status.
- Webchat and WhatsApp may show simulated_only or connected depending on local seed data.
- Instagram and TikTok remain unsupported/planned until official API integration exists.
- `safeReasonCode` must be present and must not contain raw provider error details.

## Security Checklist

- p6 channel health production readiness gate: no raw provider payload, no access token, no refresh token, and official API required for production provider work.
- No access token.
- No refresh token.
- No Authorization header.
- No client secret.
- No raw provider payload.
- No raw Gmail payload.
- No provider cookie or browser session material.
- Backend AuthContext remains the source of workspace scope.
- Official API required for production channel work.

## Troubleshooting

- `401`: missing or invalid authentication.
- `403`: authenticated role lacks required read permission.
- `auth_required`: reconnect the provider account through the approved OAuth flow.
- `rate_limited`: wait and retry after provider rate pressure drops.
- `unsupported`: do not use scraping or unofficial clients; use only official APIs after approval.
