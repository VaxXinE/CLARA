# CLARA P19 Internal API Deployment Runbook

Internal team usage must use provider auth. Mock/demo mode is dev/test only.

API deployment commands:

```sh
cd services/api
npm install
npm run typecheck
npm run test
npm run build
npm run start
```

Smoke commands after start:

```sh
curl -fsS "$CLARA_API_BASE_URL/health"
curl -fsS "$CLARA_API_BASE_URL/ready"
curl -i "$CLARA_API_BASE_URL/api/v1/customers"
```

The unauthenticated protected endpoint should return safe 401. Internal
deployment requires real workspace membership. Missing/inactive membership fails
closed. Backend AuthContext/workspace membership is source of truth.
client-supplied workspaceId is not authoritative.

