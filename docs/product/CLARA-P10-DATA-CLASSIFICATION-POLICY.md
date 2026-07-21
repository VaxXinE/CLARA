---
project: "CLARA"
artifact: "P10 Data Classification Policy"
status: "draft"
owner: "CLARA Product, Engineering, Security, and Operations"
classification: "security-policy"
---

# CLARA P10 Data Classification Policy

## Data Classes

| Class        | Meaning                          | Example                                                                                               |
| ------------ | -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Public       | Safe to publish                  | public documentation                                                                                  |
| Internal     | CLARA operational data           | workspace metadata, analytics aggregates                                                              |
| Confidential | Business/customer metadata       | user profile metadata, customer profile data                                                          |
| Restricted   | Sensitive business/security data | customer message content, provider payloads, webhook payloads, audit logs, AI prompt/context material |
| Secret       | Credential material              | tokens, cookies, auth headers, API keys, secrets                                                      |

## Handling Rules

- Public data can be published after normal review.
- Internal data stays inside authenticated CLARA surfaces.
- Confidential data must be workspace-scoped.
- Restricted data must be minimized, redacted, and audit-protected.
- Secret data must never be logged, rendered, returned, or stored outside the
  approved secret boundary.

## P10 Readiness Requirement

P10 Enterprise Hardening / Compliance uses classification to decide redaction,
audit metadata allowlists, retention readiness, and incident response handling.

P10-PR-03 adds runtime compliance readiness for Data Classification and
Redaction Hardening. Backend AuthContext remains required, client workspaceId
is never authority, output stays workspace-scoped, and readiness surfaces
contain safe audit metadata only: no raw customer messages, no raw provider
payload, no raw webhook payload, no raw audit metadata, no access token, no
refresh token, no cookies, and no secrets.
