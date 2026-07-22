---
project: "CLARA"
artifact: "P12 Security Smoke Checklist"
status: "active"
owner: "CLARA Product and Security"
classification: "security-smoke-checklist"
---

# CLARA P12 Security Smoke Checklist

## Required Checks

- Auth/session boundary returns safe 401 for unauthenticated access.
- Workspace boundary remains server-authoritative.
- Client workspaceId is never authority.
- Viewer remains read-only.
- No token, cookie, Authorization header, API key, secret, raw customer message,
  raw provider payload, raw webhook payload, raw audit metadata, raw usage
  event, raw payment data, raw telemetry, raw DOM, raw HTML, or raw prompt is
  exposed.
- No `dangerouslySetInnerHTML`.
- No raw HTML rendering.
- No billing/payment/provider/AI/outbound side effects during smoke tests.

Any failure is a blocker fail unless explicitly documented as impossible to
reach in the current non-production environment.
