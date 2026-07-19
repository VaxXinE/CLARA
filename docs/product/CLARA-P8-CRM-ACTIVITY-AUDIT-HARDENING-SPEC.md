---
project: "CLARA"
artifact: "P8 CRM Activity Audit Hardening Spec"
status: "draft"
owner: "CLARA Product, Engineering, Security, and AI"
classification: "product-spec"
---

# CRM Activity Audit Hardening

P8-PR-08 adds audit-only coverage for P8 CRM intelligence, readiness, and
proposal flows. Audit writes are allowed, but customer business state must not
change.

## Purpose

The audit layer records which read-only or proposal-only CRM surfaces were
viewed or reviewed. It supports incident investigation and future final P8
audit without adding CRM execution.

## Audit Event Contract

Each audit event is workspace-scoped and built from Backend AuthContext.

Safe shape:

- `eventType`
- `workspaceId`
- `actorUserId`
- `customerId`
- `source`
- `outcome`
- `riskLevel`
- `policyVersion`
- `correlationId`
- `safeMetadata`
- `createdAt`

## Allowed Event Types

- `p8_customer_profile_intelligence_viewed`
- `p8_customer_timeline_intelligence_viewed`
- `p8_customer_action_proposal_reviewed`
- `p8_customer_follow_up_proposal_reviewed`
- `p8_owner_assignment_readiness_viewed`
- `p8_lifecycle_status_readiness_viewed`
- `p8_crm_readiness_policy_blocked`
- `p8_crm_readiness_cross_workspace_blocked`
- `p8_crm_readiness_sensitive_payload_redacted`

## Safe Metadata Allowlist

- `proposalType`
- `readinessLevel`
- `recommendedAction`
- `blockedReason`
- `redactionApplied`
- `mutationExecuted=false`
- `actionExecuted=false`
- `reviewOnly=true`

## Redaction

Unknown metadata keys are dropped. Sensitive-looking keys are redacted before
audit persistence. Audit metadata must never include raw request bodies, raw
provider payload, raw webhook payload, access token, refresh token, cookies,
Authorization headers, API keys, secrets, raw DOM, raw HTML, or raw prompts.

## Workspace Boundary

Backend AuthContext is the authority for organization and workspace. Client
workspace hints are not accepted as audit authority. Cross-workspace CRM access
must remain denied by the underlying P8 customer lookup before audit events are
created.

## Non-Goals

- no CRM mutation
- no lifecycle mutation
- no status mutation
- no owner assignment mutation
- no task creation
- no customer note write
- no outbound send
- no scheduler execution
- no autonomous workflow execution
- no real AI provider
- no AI SDK dependency
- no analytics/KPI dashboard

## Incident Investigation Notes

Use audit events to confirm what P8 read-only/proposal-only surface an operator
viewed, which customer was involved, and whether redaction or policy blocking
was applied. Do not use these events as proof that any CRM action executed.

## Final P8 Handoff

Final P8 audit should verify the CRM activity audit event catalog, redaction,
workspace-scoped writes, no customer mutation, and no sensitive payload storage
before any future CRM write workflow is introduced.
