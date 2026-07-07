# services/api/

CLARA API service.

## Status

```text
PR-02 API Bootstrap
```

This service currently provides runtime foundation only.

## Current Endpoints

```text
GET /health
GET /ready
GET /api/v1/health
GET /api/v1/ready
```

## Local Setup

```bash
cd services/api
npm install
cp .env.example .env
npm run dev
```

Open:

```text
http://127.0.0.1:3000/health
```

## Commands

```bash
npm run dev
npm run typecheck
npm run test
npm run build
npm start
```

## Environment Variables

| Name | Required | Default | Description |
|---|---:|---|---|
| `NODE_ENV` | No | `development` | Runtime environment |
| `APP_NAME` | No | `clara-api` | Service name |
| `HOST` | No | `127.0.0.1` | Bind host |
| `PORT` | No | `3000` | Bind port |
| `LOG_LEVEL` | No | `info` | Logger level |
| `CORS_ORIGIN` | No | empty | Reserved for future CORS setup |

## Security Notes

- Do not commit `.env`.
- Do not log secrets.
- Do not expose stack traces in production.
- All future product endpoints must authenticate.
- All future business queries must include tenant/workspace scope.
- AI provider calls must not be added directly here without AI gateway boundary decision.

## Next PR

```text
PR-03 Auth/Authz/Workspace Scope
```
