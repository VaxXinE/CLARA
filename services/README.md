# services/

Backend services live here.

---

## Purpose

This directory contains server-side services and service boundaries.

Expected future services:

```text
services/api/
services/ai-gateway/
services/integration-gateway/
```

---

## Allowed

```text
API services
application services
auth/authz enforcement
database access through repositories
AI gateway boundary
integration adapter boundary
server-side validation
safe logging
```

---

## Not Allowed

```text
frontend UI
hard-coded secrets
mock auth in production
cross-workspace ID-only queries
AI auto-send
```

---

## Security Rule

Backend is the source of truth for authentication, authorization, tenant scope, and high-impact actions.
