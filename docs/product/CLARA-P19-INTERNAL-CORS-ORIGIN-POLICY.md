# CLARA P19 Internal CORS Origin Policy

CORS/internal origin must be explicit and not wildcard.

Allowed:

```text
CORS_ORIGIN=https://clara-dashboard.internal.example
```

Rejected:

```text
CORS_ORIGIN=*
CORS_ORIGIN=
```

The API must not use client-supplied workspaceId as authority. Backend
AuthContext/workspace membership is source of truth for workspace access.

