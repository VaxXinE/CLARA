---
project: "CLARA"
artifact: "CLARA Final Roadmap"
status: "active"
owner: "CLARA Product and Engineering"
classification: "roadmap"
---

# CLARA Final Roadmap

## Status

P1 through P13 are complete. DOCS-REFRESH-BEFORE-P12,
UI-POLISH-BEFORE-P12, PRE-P12-INTERACTION-ACTIVATION,
P12 Beta / GA Release Readiness, and P13 Internal CRM Product Activation are
complete.

P14 is current. P14 prepares CLARA for controlled internal team usage after the
internal CRM workflow became usable in local/dev-safe mode. P14-PR-01 Internal
Beta Rollout Scope + Environment Plan is current. internal use first is the
rollout rule. billing deferred and public launch deferred remain explicit
boundaries. production deployment requires separate explicit action and is not
claimed by this documentation update. Provider/AI/outbound activation remains
controlled. internal user roles are defined, internal data policy exists, and
security checklist exists before broader internal team usage.

CLARA is not production deployed yet. CLARA is not public GA launched yet.

## Phase Status

| Phase | Scope                                   | Status   |
| ----- | --------------------------------------- | -------- |
| P1    | Core Foundation / MVP Base              | complete |
| P2    | Product Workflow / CRM Operator Base    | complete |
| P3    | Gmail / Email Integration               | complete |
| P4    | Multi-channel Foundation                | complete |
| P4.5  | Extension Bridge                        | complete |
| P5    | Production Auth / Security              | complete |
| P6    | Production Provider / Channel Hardening | complete |
| P7    | AI Assistant / Automation Layer         | complete |
| P8    | CRM & Workflow Intelligence             | complete |
| P9    | Analytics / Reporting / KPI             | complete |
| P10   | Enterprise Hardening / Compliance       | complete |
| P11   | Scale / Reliability / Billing           | complete |
| P12   | Beta / GA Release Readiness             | complete |
| P13   | Internal CRM Product Activation         | complete |
| P14   | Internal Beta Rollout Preparation       | current  |

## P12 Compact Roadmap

- P12-PR-01 Beta / GA Scope + Release Criteria. Complete.
- P12-PR-02 Release Candidate Validation + Smoke Test Matrix. Complete.
- P12-PR-03 Production Deployment Checklist + Rollback Drill. Complete.
- P12-PR-04 Beta Feedback / Support / Known Issues Workflow. Complete.
- P12-PR-05 Final GA Audit / Runbook. Complete.

## P13 Compact Roadmap

- P13-PR-01 Customer CRUD Activation. Complete.
- P13-PR-02 Customer Notes + Activity Timeline. Complete.
- P13-PR-03 Lifecycle Status + Owner Assignment. Complete.
- P13-PR-04 Follow-up Task Workflow. Complete.
- P13-PR-05 Conversation-to-Customer Linking. Complete.
- P13-PR-06 Internal Dashboard Analytics Wiring. Complete.
- P13-PR-07 Internal CRM End-to-End QA + Runbook. Complete.

## P14 Compact Roadmap

- P14-PR-01 Internal Beta Rollout Scope + Environment Plan. Current.

## Non-Launch Guardrails

P12 is release readiness, not feature expansion. Beta and GA are different
gates. Release Candidate is a validation gate, not a launch. The deployment
checklist is a readiness gate, not deployment execution. Rollback drill is not
automatic production rollback. CLARA is not GA-ready yet. CLARA is not
production deployed yet. Billing remains readiness-only until explicitly
launched. Production provider, payment, outbound, and AI actions must remain
guarded.
Beta feedback workflow is controlled and privacy-safe. Known issues must be
reviewed before GA. Feedback/support must not collect raw sensitive data.

Security boundaries remain: AuthContext is authoritative, frontend role guard
is UX-only, client workspaceId is never authority, access is workspace-scoped,
and active docs must not include no raw customer messages, no raw provider
payload, no raw webhook payload, no raw usage events, no raw payment data, no
raw telemetry, no access token, no refresh token, no cookies, no payment
provider integration, no charging customers, no invoice creation, no quota
enforcement, and no real AI provider.
P12 completion means release readiness complete. P12 completion does not mean
production deployed. P12 completion does not mean public GA launch happened.
Production deployment requires separate explicit approval and execution.
Provider/payment/AI/outbound activation remains restricted unless future
approved work enables it. Readiness-only/review-only/simulated/demo-safe
boundaries remain intact. P14 is internal beta preparation, not billing launch,
not public launch, and not production deployment.
