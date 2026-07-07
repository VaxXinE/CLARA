# apps/

Frontend applications live here.

---

## Purpose

This directory is for user-facing CLARA applications.

Expected future apps:

```text
apps/dashboard/
apps/web/
```

---

## Allowed

```text
dashboard UI
web app routes
frontend components
frontend state management
frontend tests close to app if selected
```

---

## Not Allowed

```text
backend business logic
database access
AI provider calls
secrets
server-side authorization as source of truth
```

---

## Security Rule

Frontend permission checks are UX helpers only.

Backend authorization remains mandatory.
