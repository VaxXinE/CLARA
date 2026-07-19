---
project: "CLARA"
artifact: "P9 Production Runbook"
status: "final"
owner: "CLARA Operations and Engineering"
classification: "operations-runbook"
---

# CLARA P9 Production Runbook

## Local Validation

```bash
bash scripts/validate-p9-final-analytics-reporting-audit-runbook.sh
```

Targeted validation:

```bash
cd services/api
npm run typecheck
npm run test
npm run build

cd ../../apps/dashboard
npm run typecheck
npm run test
npm run build

cd ../extension
npm run typecheck
npm run test
npm run build
```

## Production Readiness Validation

- Confirm production auth guardrails pass.
- Confirm analytics endpoints require auth.
- Confirm Backend AuthContext provides organization/workspace scope.
- Confirm no `.env`, private keys, or secrets are committed.
- Confirm dashboard runtime has no export/download/raw drilldown UI.
- Confirm extension runtime has no analytics internal access.

## Analytics Endpoint Smoke Checks

Use a valid authenticated session in production-like environments:

```text
GET /api/v1/analytics/readiness
GET /api/v1/analytics/metric-catalog
GET /api/v1/analytics/overview
GET /api/v1/analytics/conversations/volume
GET /api/v1/analytics/response-time-sla
GET /api/v1/analytics/channels/performance
GET /api/v1/analytics/crm-workflow
GET /api/v1/analytics/kpi-dashboard
```

Expected behavior:

- 401 without auth
- safe 400 for unknown filters
- safe 403 for unauthorized operator filters
- no raw customer messages
- no raw provider payload
- no raw webhook payload
- no raw audit metadata
- no access token
- no refresh token
- no cookies

## Dashboard QA Flow

1. Open the dashboard with a valid authenticated workspace user.
2. Verify Analytics Reporting Readiness and Metric Foundation panels.
3. Verify Core Operational Metrics.
4. Verify KPI Dashboard Cards.
5. Verify CRM Workflow Metrics.
6. Verify Reporting Filters.
7. Verify Analytics Audit Privacy.
8. Confirm there is no report export, no customer-level drilldown, no mutation
   control, and no unsafe HTML rendering.

## Extension Boundary QA Flow

Verify the extension remains active-conversation/manual-assisted only. It must
not request analytics dashboard data, metric catalog internals, reporting
filters, analytics audit internals, report export data, or customer-level
drilldown data.

## Troubleshooting

| Symptom | Check |
|---|---|
| 401 from analytics endpoint | Verify provider session and auth middleware. |
| 403 on operator filter | Verify role; operator filters are role-gated. |
| 400 on filter | Verify allowed `timeWindow`, `channel`, `category`, and filter keys. |
| Empty KPI cards | Verify seeded/demo data and workspace scope. |
| Dashboard panel missing | Verify API base URL, auth mode, and dashboard build. |

## Audit / Privacy Incident Checklist

1. Capture correlation ID and route name.
2. Stop sharing any response body that contains suspected sensitive data.
3. Check if raw payload, token, cookie, auth header, or raw audit metadata was
   exposed.
4. Roll back the affected deployment if sensitive data exposure is confirmed.
5. Preserve safe audit evidence.
6. Request security review before re-enabling changed analytics behavior.

## Rollback Notes

Rollback application code first. P9 does not add destructive data migrations or
scheduled aggregation jobs. If future phases add persisted analytics tables,
database rollback must be reviewed separately.

## Escalation Notes

Escalate immediately if P9 exposes raw customer messages, raw provider payload,
raw webhook payload, raw audit metadata, access token, refresh token, cookies,
auth headers, API keys/secrets, report export, customer-level drilldown, CRM
mutation, task creation, outbound send, scheduler execution, or real AI
provider calls.
