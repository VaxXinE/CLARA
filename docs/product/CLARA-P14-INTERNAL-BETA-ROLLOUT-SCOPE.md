# CLARA P14 Internal Beta Rollout Scope

## Status

P13 Internal CRM Product Activation is complete. P14 starts the internal beta
rollout preparation track. CLARA is usable as an internal CRM workflow in
local/dev-safe mode, but CLARA is not production deployed yet and CLARA is not
public GA launched yet.

P14-PR-01 is an internal beta planning PR. internal use first is the rollout
rule. billing deferred and public launch deferred remain explicit product
boundaries. production deployment requires separate explicit action by the
operator team after environment, security, data, and user-role checks pass.

## In Scope

- Define internal beta rollout audience and workflow scope.
- Define local, development, staging-like, and future production environment
  expectations.
- Define internal user roles and operator/admin responsibilities.
- Define internal data handling policy for CRM, provider, AI, analytics, audit,
  and support data.
- Define security checklist exists as a required gate before internal team use.
- Define a compact P14 roadmap for internal beta readiness.
- Update roadmap and documentation index links.

## Out of Scope

- Billing remains deferred; this PR does not implement billing.
- Payment remains deferred; this PR does not add payment SDKs.
- Public launch deferred; this PR does not public launch CLARA.
- Production deployment requires separate explicit action; this PR does not
  deploy production automatically.
- Provider/AI/outbound activation remains controlled; this PR does not activate
  real provider, AI, or outbound behavior.
- This PR does not add secrets, real credentials, public SaaS onboarding, or
  workspace isolation changes.

## Internal Beta Definition

Internal beta means a controlled CLARA workspace used by trusted internal team
members to validate CRM workflow readiness. It is not public beta, not GA, not
customer billing, and not production deployment by itself.

For this rollout gate, internal user roles are defined before broader team
access is opened.

The first internal beta should validate:

- Workspace-scoped CRM navigation.
- Customer CRUD, notes, timeline, lifecycle, owner assignment, follow-up tasks,
  conversation linking, and safe internal analytics.
- Auth/workspace isolation behavior using backend AuthContext.
- Operator/admin readiness docs and security checklist signoff.
- Known limitation handling before external users are invited.

## Success Criteria

- Internal user roles are defined and mapped to responsibilities.
- Internal data policy exists and is reviewed before real team usage.
- Security checklist exists and is reviewed before production-like use.
- Environment plan states that production deployment requires separate explicit
  action.
- Provider/AI/outbound activation remains controlled and disabled unless a
  later approved PR enables it.
- No billing, payment, public launch, or real credentials are introduced.
