# services/api/

CLARA API service placeholder.

---

## Future Responsibility

This service will expose MVP APIs:

```text
GET /api/v1/me
GET /api/v1/conversations
GET /api/v1/conversations/{conversation_id}
GET /api/v1/customers/{customer_id}
POST /api/v1/conversations/{conversation_id}/ai-draft
POST /api/v1/conversations/{conversation_id}/reply
GET /api/v1/conversations/{conversation_id}/activity
```

---

## Current Status

```text
skeleton only
no runtime yet
```

---

## Next PR

```text
PR-02 API Bootstrap
```

Expected in PR-02:

```text
service package setup
health endpoint
config validation
safe error handler
correlation id middleware
structured logger
test setup
```

---

## Security Rule

All MVP API endpoints must require authenticated context unless explicitly documented as public health/readiness.
