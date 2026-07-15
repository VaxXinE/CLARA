---
project: "CLARA"
artifact: "P8 CRM Mutation Policy"
status: "draft"
owner: "CLARA Product, Engineering, Security, and AI"
classification: "security-policy"
---

# CLARA P8 CRM Mutation Policy

## Core Rule

Backend AuthContext is the source of truth. CRM access and CRM mutation must be
workspace-scoped and must never trust client-supplied workspaceId,
organization_id, workspace_id, role, or user_id as authority.

## Allowed Actions

- view customer profile
- view CRM timeline
- suggest customer status
- suggest follow-up task
- suggest owner assignment
- suggest pipeline/lifecycle change
- create reviewable CRM draft/action proposal
- show workflow readiness state

## Restricted Actions

These require authentication, role permission, human approval, and audit log
metadata:

- create task
- update task
- assign owner
- update customer status
- update lifecycle stage
- save customer note
- append CRM timeline event
- mark conversation/customer needs attention

## Blocked Actions

- cross-workspace CRM mutation
- client-supplied workspaceId as authority
- unauthenticated CRM mutation
- AI autonomous CRM mutation
- no autonomous CRM mutation
- no auto-write customer note
- no auto-create task
- no auto-assign owner without approval
- no auto-change pipeline/lifecycle without approval
- delete customer from AI/workflow suggestion
- billing/admin/user/role mutation
- provider connect/disconnect
- raw token/cookie/secret access
- raw provider payload exposure
- raw webhook payload exposure
- raw DOM/raw HTML exposure

## Audit Requirements

Persistent CRM mutations must write an audit log with allowlisted metadata only:

- organization_id
- workspace_id
- actor_user_id
- actor_role
- action
- resource_type
- resource_id
- reason_code
- proposal_id when available
- correlation_id

Audit metadata must not include raw prompt, access token, refresh token, cookie,
secret, raw provider payload, raw webhook payload, raw DOM, raw HTML, customer
message body, or unsafe provider error body.

## Role Requirements

Owner/admin roles may approve high-risk CRM workflow changes when policy allows.
Agent permissions are limited to allowed or explicitly delegated restricted
actions. Viewer remains read-only.
