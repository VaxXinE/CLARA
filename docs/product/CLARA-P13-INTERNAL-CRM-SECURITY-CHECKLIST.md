# CLARA P13 Internal CRM Security Checklist

## Security Requirements

- Backend AuthContext remains source of truth.
- Workspace isolation is verified.
- Viewer/read-only mode must not mutate CRM state.
- Admin/operator permissions are documented.
- Notes/messages must not contain secrets.
- Timeline/audit metadata must stay allowlisted and safe.
- Client-supplied workspaceId, organization_id, workspace_id, role, or user id
  must not be authority.
- No raw customer messages are exposed outside intended CRM views.
- No raw provider payloads, raw webhook payloads, raw audit metadata, tokens,
  cookies, auth headers, API keys, secrets, raw DOM, raw HTML, raw prompts, or
  payment data are rendered.
- No `dangerouslySetInnerHTML` is used for CRM content.

## Deferred Scope

Billing/payment is deferred. Public SaaS launch is deferred. No real
provider/payment/AI/outbound behavior is activated. No real external provider
credentials are required for this PR.
