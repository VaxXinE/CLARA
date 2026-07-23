# CLARA P14 Internal Data Import Format

## Status

P14-PR-01 is complete. P14-PR-02 is complete. P14-PR-03 is current.

Internal data seeding/import is for internal beta rollout. Only approved
internal CRM data may be imported.

## Customer Row Format

Use JSON or CSV mapped to these fields only:

| Field | Required | Notes |
| --- | --- | --- |
| displayName | yes | Customer display name. |
| contactIdentifier | no | Email, phone, or internal contact id. |
| source | no | Safe source label such as demo, email, webchat, whatsapp, or extension_bridge. |
| status | no | Safe CRM status such as new, active, follow_up, at_risk, resolved, archived, or blocked. |
| notesSummary | no | Short redacted internal note summary. |

## Forbidden Fields

Secrets/tokens/cookies/auth headers/raw provider payloads/raw webhook
payloads/raw HTML/payment data must not be imported.

Do not include:

- access tokens or refresh tokens
- cookies or Authorization headers
- API keys, passwords, client secrets, or service role credentials
- raw provider payloads
- raw webhook payloads
- raw DOM or raw HTML
- raw AI prompts
- payment, card, checkout, invoice, or billing data
- client workspaceId as authorization truth

## Scope Rule

Import is workspace-scoped. AuthContext and workspace membership remain source
of truth. Client-supplied workspaceId is not authoritative.
