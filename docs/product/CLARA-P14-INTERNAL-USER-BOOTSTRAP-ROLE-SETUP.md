# CLARA P14 Internal User Bootstrap + Role Setup

## Status

P14-PR-01 is complete. P14-PR-02 is current. Internal user setup is for
internal beta rollout, not public onboarding, not billing launch, and not
production deployment.

## Bootstrap Flow

The first internal workspace must have one owner. The owner bootstrap flow uses
backend-controlled organization, workspace, provider subject, email, display
name, and correlation ID inputs. The result creates or reuses a safe owner user
and an active owner workspace membership.

Owner bootstrap is not a public self-service escalation path. A second
different owner bootstrap for the same active workspace must fail closed unless
the existing backend policy explicitly allows recovery.

## Role Setup

owner/admin/operator/viewer roles are defined for internal beta:

- Owner: accountable for workspace access, recovery, and security checklist
  signoff.
- Admin: prepares internal access, reviews member readiness, and follows the
  owner/admin runbook.
- Operator: uses CRM workflows inside assigned workspace scope.
- Viewer: read-only QA/review role with no mutation authority.

Backend AuthContext and workspace membership remain source of truth. Client
supplied workspaceId is not authoritative. Frontend role checks are UX-only.

## Non-Goals

billing/payment is deferred. public SaaS launch is deferred. production
deployment requires separate explicit action. Provider/AI/outbound activation
remains controlled. This PR does not add payment SDKs, real provider
credentials, real AI calls, outbound auto-send, invite mutation, role mutation,
or membership deletion.
