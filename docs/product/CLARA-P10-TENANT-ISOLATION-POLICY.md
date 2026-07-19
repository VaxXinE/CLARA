---
project: "CLARA"
artifact: "P10 Tenant Isolation Policy"
status: "draft"
owner: "CLARA Product, Engineering, Security, and Operations"
classification: "security-policy"
---

# CLARA P10 Tenant Isolation Policy

## Policy

Tenant isolation means organization and workspace boundaries are enforced by
the backend. Backend AuthContext is the source of truth for organization,
workspace, user, and role.

## Required Behavior

- Reads are workspace-scoped.
- Writes are workspace-scoped.
- Client-supplied workspaceId is never authority.
- Cross-workspace access is denied with safe error behavior.
- Audit events include organization and workspace scope.
- Dashboard role/workspace display is UX only.
- Extension surfaces cannot read tenant isolation internals or compliance
  evidence.

## Non-Goals

This policy does not add SSO, MFA, billing, data export, report export,
customer-level drilldown, CRM mutation, task creation, outbound send, or real
AI provider integration.
