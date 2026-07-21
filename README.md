# Clara

> "A great platform is built not only with code, but with shared understanding."

---

# Purpose

Clara is an AI-native Business Operating System designed to unify business operations, customer relationships, communication, knowledge, workflow automation, artificial intelligence, platform services, security, integrations, analytics, operations, and continuous product improvement.

This repository is the official engineering library and future implementation workspace for Clara.

It contains the documentation, architecture, standards, templates, governance, implementation references, security rules, operations model, and product operations playbooks used to design, build, operate, and evolve Clara.

---

# Repository Status

```text
Status: P1-P11 complete; local product slice runnable
Current focus: documentation refresh before P12
Next focus: P12 Beta / GA Release Readiness
```

Current MVP implementation:

```text
services/api: runnable local API with mock auth, workspace scope, seeded demo data, conversation/customer/activity read APIs, mock AI draft, and simulated reply send
apps/dashboard: runnable local React dashboard for the conversation workspace flow
production-oriented Docker build baseline now exists for services/api and apps/dashboard
multi-channel registry/account foundation now exposes safe read-only Gmail metadata, Webchat inbound/reply visibility, WhatsApp official inbound plus simulated outbound boundary, and decision-only Instagram/TikTok metadata
P4.5 extension bridge contract is documented for future operator-visible active conversation sync
P4.5 extension snapshot intake is implemented for authenticated WhatsApp, Instagram, and TikTok extension bridge snapshots
apps/extension now contains the local TypeScript auto-sync engine for visible active-conversation snapshots
apps/extension now contains ChatGPT Companion safe context preview/copy/open helpers without ChatGPT token storage or auto-submit
P4.5 Extension Bridge final regression/runbook coverage is now documented for operator-assisted active-conversation workflows
P5 production auth foundation is now documented as the next fail-closed provider-mode contract before real login/workspace UX
P5 dashboard provider login flow now fails closed without a real provider session and keeps demo mock mode local-only
P5 workspace membership bootstrap now gates provider-authenticated users through backend CLARA membership before product data loads
P5 user/role management readiness now exposes owner-only read APIs and a read-only dashboard panel for future access control without invite/update/delete mutations
P5 runtime config doctor and production smoke scripts now validate dangerous production config without deploying or printing secrets
P5 final security audit now closes the production auth/security foundation with final API, dashboard, extension, runbook, incident response, go-live checklist, and committed validator coverage
P5.1 now positions CLARA v2 as the production-ready upgrade of project_Clara and documents the legacy UI audit, route map, role/navigation map, design system contract, and UI migration security rules
P5.1 Workspace Shell Upgrade now gives the dashboard a dark/gold operator shell with left sidebar, topbar, grouped navigation, and mobile menu behavior
P5.1 final UI regression, accessibility, security, and QA signoff coverage now closes the UI upgrade track
P6 Provider Readiness Matrix and Official Channel Policy now define production-hardening status for Gmail, Webchat, WhatsApp, Instagram, TikTok, Browser Extension Bridge, and ChatGPT Companion before further provider work
P6 Gmail credential boundary and channel health now expose safe workspace-scoped provider readiness without tokens, secrets, Authorization headers, raw provider payloads, or credential mutation UI
P6 webhook/outbox hardening now defines fail-closed webhook verification, workspace-scoped dedup/replay, bounded outbound retry, idempotency, and dead_letter behavior before real provider expansion
P6 final observability, audit trail, production provider runbook, go-live checklist, and P7 handoff now close the production provider/channel hardening phase
P7 AI Assistant / Automation Layer is now started with docs and tests for assistant scope, safety, data access, prompt injection, human approval, audit policy, and implementation roadmap
P7 AI Context Builder and Prompt Contract now add pure backend context minimization, untrusted customer content separation, budget enforcement, and prompt contract tests without real AI provider calls
P7 AI Follow-up Recommendation now adds recommendation-only mock-provider guidance with human approval, no auto-send, no automatic task creation, and no automatic scheduler
P7 AI Conversation Summary and AI Customer Note Suggestion now add review-only/suggestion-only mock-provider assistance with human approval, no automatic customer note write, and no CRM/customer mutation
P7 Final AI Assistant Audit now closes the assistant layer with final regression tests, runbooks, incident response, go-live checklist, no real LLM provider, no AI SDK, no auto-send, and a P8 CRM & Workflow Intelligence handoff
P8 CRM & Workflow Intelligence is now started with CRM Mutation Policy, Workflow Intelligence Policy, Backend AuthContext, workspace-scoped access, human approval, audit log, no autonomous CRM mutation, no auto-write customer note, no auto-create task, and P9 Analytics / Reporting / KPI deferral
P8 Customer Profile Intelligence now adds a read-only customer intelligence API and dashboard panel with workspace-scoped Backend AuthContext, no CRM mutation, no task creation, no owner/status/lifecycle update, and no token/raw provider payload exposure
P8 Reviewable CRM Action Proposal now adds a proposal-only, review-only API and dashboard display contract with mutationExecuted=false, workspace-scoped Backend AuthContext, no CRM mutation, no auto-create task, no auto-write customer note, no owner assignment mutation, no lifecycle/status mutation, no raw provider payload, no raw webhook payload, no access token, no refresh token, and no cookies
P8 Task / Follow-up Workflow Proposal now adds a proposal-only, review-only task follow-up API and dashboard display contract with taskCreated=false, actionExecuted=false, workspace-scoped Backend AuthContext, no CRM mutation, no task creation, no auto-create task, no outbound send, no scheduler, no raw provider payload, no raw webhook payload, no access token, no refresh token, and no cookies
P8 Owner Assignment Readiness now adds a read-only owner handoff readiness API and dashboard display contract with ownerAssigned=false, actionExecuted=false, workspace-scoped Backend AuthContext, no owner assignment mutation, no CRM mutation, no task creation, no lifecycle/status update, no raw provider payload, no raw webhook payload, no access token, no refresh token, and no cookies
P8 Lifecycle / Status Update Readiness now adds a readiness-only, review-only lifecycle/status API and dashboard display contract with lifecycleUpdated=false, statusUpdated=false, actionExecuted=false, workspace-scoped Backend AuthContext, no CRM mutation, no lifecycle mutation, no status mutation, no auto-change lifecycle/status, no task creation, no outbound send, no scheduler, no raw provider payload, no raw webhook payload, no access token, no refresh token, and no cookies
P8 CRM Activity Audit Hardening now adds audit-only safe metadata and redaction coverage for P8 intelligence/readiness/proposal flows with Backend AuthContext, workspace-scoped audit writes, mutationExecuted=false, actionExecuted=false, reviewOnly=true, no CRM mutation, no lifecycle mutation, no status mutation, no owner assignment mutation, no task creation, no outbound send, no raw provider payload, no raw webhook payload, no access token, no refresh token, and no cookies
P8 complete after P8-PR-09 with Final CRM & Workflow Intelligence Audit, production runbook, security checklist, operator QA checklist, final API/dashboard/extension regression coverage, no CRM mutation, no task creation, no owner assignment mutation, no lifecycle mutation, no status mutation, no outbound send, no real AI provider, and a P9 Analytics / Reporting / KPI handoff
P9 Analytics / Reporting / KPI now starts with P9-PR-01 Analytics & Reporting Scope + KPI Policy, Backend AuthContext, workspace-scoped metrics, aggregate-first output, no raw provider payload, no raw webhook payload, no raw customer messages, no raw audit metadata, no tokens/cookies/auth headers/secrets, no CRM mutation, no task creation, no outbound send, no scheduled aggregation jobs, no report export, and no real AI provider
P9-PR-02 now adds the Analytics Read Model and Metric Foundation with authenticated readiness and metric catalog endpoints, a safe metric registry, dashboard foundation visibility, extension boundary regression, Backend AuthContext workspace scope, aggregate-first contracts, no raw customer messages, no raw provider payload, no raw webhook payload, no access token, no refresh token, no cookies, no CRM mutation, no task creation, no outbound send, no scheduled aggregation, no report export, and no real AI provider
P9-PR-03 now adds the Core Operational Metrics Pack with Conversation Volume Metrics, Response Time / SLA, Channel Performance Metrics, authenticated analytics overview, dashboard read-only visibility, extension boundary regression, Backend AuthContext workspace scope, aggregate-first output, no raw customer messages, no raw provider payload, no raw webhook payload, no access token, no refresh token, no cookies, no CRM mutation, no task creation, no outbound send, no report export, no customer-level drilldown, and no real AI provider
P9-PR-04 now adds CRM Workflow Metrics and KPI Dashboard Cards with authenticated analytics endpoints, dashboard read-only cards, extension boundary regression, Backend AuthContext workspace scope, aggregate-first output, no raw customer messages, no raw provider payload, no raw webhook payload, no raw audit metadata, no access token, no refresh token, no cookies, no CRM mutation, no task creation, no outbound send, no report export, no customer-level drilldown, and no real AI provider
P9 COMPLETE after P9-PR-06 with Final P9 Audit, Production Runbook, Security Checklist, Operator QA Checklist, regression acceptance coverage, and validator coverage
P10 Enterprise Hardening / Compliance now starts with compliance readiness, not certification, Backend AuthContext, workspace-scoped tenant isolation, least privilege, data classification, audit readiness, retention readiness, incident response readiness, no raw customer messages, no raw provider payload, no raw webhook payload, no raw audit metadata, no access token, no refresh token, no cookies, no CRM mutation, no outbound send, and no real AI provider
P10-PR-03 adds Audit Retention, Data Classification, Redaction Hardening, Sensitive Field Classifier, and safe audit metadata readiness. It is compliance readiness, not certification. Backend AuthContext remains required, client workspaceId is never authority, output is workspace-scoped, and the work adds no permission mutation, no role mutation, no CRM mutation, no outbound send, no deletion automation, no legal hold automation, no report export, and no real AI provider.
P10-PR-04 adds Admin Security Controls, Session Policy, and Compliance Dashboard readiness. It is compliance readiness, not certification. Backend AuthContext remains required, client workspaceId is never authority, output is workspace-scoped, frontend role guard is UX-only, and the work adds no permission mutation, no role mutation, no session revocation, no force logout, no SSO implementation, no MFA implementation, no CRM mutation, no outbound send, no evidence export, and no real AI provider.
P10-PR-05 adds Backup / Restore, Incident Response, Evidence Readiness, and Operational Resilience readiness. It is compliance readiness, not certification. Backend AuthContext remains required, client workspaceId is never authority, output is workspace-scoped, and the work adds no backup execution, no restore execution, no data deletion automation, no legal hold automation, no evidence export, no evidence download, no CRM mutation, no outbound send, no report generation, and no real AI provider.
P10 COMPLETE after P10-PR-06 with Final P10 Enterprise Hardening / Compliance audit, production runbook, security checklist, compliance readiness evidence summary, operator/admin QA checklist, regression acceptance checklist, validator coverage, and P11 Scale / Reliability / Billing handoff. P10 remains compliance readiness, not certification, and adds no automation, export/download, mutation, outbound send, or real AI provider.
P11 Scale / Reliability / Billing starts with P11-PR-01 scope, SLO readiness, reliability baseline, capacity/performance target, usage metering readiness, billing readiness boundary, dashboard readiness visibility, extension boundary regression, and validator coverage. P11-PR-01 is readiness not launch: no payment provider integration, no charging customers, no invoice creation, no subscription mutation, no quota enforcement, no CRM mutation, no outbound send, and no real AI provider.
P11-PR-02 adds Queue / Job Reliability, Retry, Idempotency, Dead Letter, and safe failure classification readiness with a workspace-scoped read-only endpoint and dashboard visibility. It is readiness not launch: no worker execution, no job execution, no job enqueue, no retry execution, no replay, no purge, no raw job payload, no raw customer messages, no raw provider payload, no raw webhook payload, no access token, no refresh token, no cookies, no payment provider integration, no charging customers, and no subscription mutation.
P11-PR-03 adds Rate Limit, Quota, and Usage Metering readiness with a workspace-scoped read-only endpoint and dashboard visibility. It is readiness not billing launch: no quota enforcement, no payment provider integration, no charging customers, no invoice creation, no subscription mutation, no plan mutation, no entitlement mutation, no raw usage events, no raw customer messages, no raw provider payload, no raw webhook payload, no access token, no refresh token, no cookies, no CRM mutation, no outbound send, and no real AI provider.
P11-PR-04 adds Observability, SLO Dashboard, Alert Readiness, Error Budget, and safe telemetry summary coverage with a workspace-scoped read-only endpoint and dashboard visibility. It is readiness not SLA launch: no alert execution, no notification send, no vendor provider integration, no raw telemetry, no raw logs, no raw traces, no raw metric events, no raw customer messages, no raw provider payload, no raw webhook payload, no access token, no refresh token, no cookies, no payment provider integration, no charging customers, and no subscription mutation.
P11-PR-05 adds Billing Readiness, Plan Entitlement, Plan Catalog, Subscription Lifecycle, Payment Provider Boundary, and safe billing metadata summary coverage with a workspace-scoped read-only endpoint and dashboard visibility. It is readiness not billing launch: no payment provider integration, no charging customers, no invoice creation, no checkout session, no subscription mutation, no plan mutation, no entitlement mutation, no quota enforcement, no raw usage events, no raw customer messages, no raw provider payload, no raw webhook payload, no access token, no refresh token, no cookies, no CRM mutation, no outbound send, and no real AI provider.
P11-PR-06 adds Performance / Load Test / Capacity readiness with safe benchmark scenarios, capacity planning, and a workspace-scoped read-only endpoint plus dashboard visibility. It is readiness not execution: no heavy load test in normal validation, no production target by default, no external provider call, no payment provider integration, no charging customers, no invoice creation, no subscription mutation, no raw telemetry, no raw logs, no raw traces, no raw metric events, no raw customer messages, no raw provider payload, no raw webhook payload, no access token, no refresh token, no cookies, no CRM mutation, no outbound send, and no real AI provider.
P11 complete after P11-PR-07 closes Final P11 Scale / Reliability / Billing with audit, production runbook, reliability checklist, billing-readiness checklist, performance/capacity checklist, security regression checklist, operator/admin QA checklist, P12 Beta / GA Release Readiness handoff notes, and final validator coverage. It is readiness not billing launch: Backend AuthContext remains authoritative, frontend role guard is UX-only, client workspaceId is never authority, all output is workspace-scoped and aggregate-first, no payment provider integration, no charging customers, no invoice creation, no subscription mutation, no quota enforcement, no heavy load test in normal validation, no production target by default, no raw telemetry, no raw logs, no raw traces, no raw metric events, no raw usage events, no raw payment data, no raw customer messages, no raw provider payload, no raw webhook payload, no access token, no refresh token, no cookies, no CRM mutation, no outbound send, and no real AI provider. P12 is release readiness, not feature expansion, and CLARA is not GA-ready yet.
```

Start here for local usage:

```text
docs/product/CLARA-DOCUMENTATION-INDEX.md
docs/product/CLARA-FINAL-ROADMAP.md
docs/product/CLARA-VALIDATION-BASELINE.md
docs/product/CLARA-SECURITY-BOUNDARY-SUMMARY.md
docs/product/CLARA-P12-HANDOFF-FROM-P11.md
docs/product/CLARA-P12-IMPLEMENTATION-ROADMAP.md
services/api/README.md
apps/dashboard/README.md
docs/product/CLARA-P2-DEPLOYMENT-CONFIG-RUNBOOK.md
docs/product/CLARA-P2-STAGING-SMOKE-RUNBOOK.md
docs/product/CLARA-P2-RELEASE-CHECKLIST.md
docs/product/CLARA-P3-FINAL-SECURITY-REGRESSION-RUNBOOK.md
docs/product/CLARA-P4-MULTICHANNEL-FOUNDATION-SPEC.md
docs/product/CLARA-P4-WHATSAPP-OFFICIAL-WEBHOOK-INBOUND-SPEC.md
docs/product/CLARA-P4-WHATSAPP-OUTBOUND-ROUTING-SPEC.md
docs/product/CLARA-P4-SOCIAL-DM-PROVIDER-DECISION-SPEC.md
docs/product/CLARA-P4-MULTICHANNEL-AUDIT-PRIVACY-HARDENING-SPEC.md
docs/product/CLARA-P4-FINAL-REGRESSION-RUNBOOK.md
docs/product/CLARA-P45-EXTENSION-BRIDGE-CONTRACT-SPEC.md
docs/product/CLARA-P45-EXTENSION-BRIDGE-SECURITY-SPEC.md
docs/product/CLARA-P45-CHATGPT-COMPANION-SPEC.md
docs/product/CLARA-P45-EXTENSION-SNAPSHOT-INTAKE-SPEC.md
docs/product/CLARA-P45-EXTENSION-AUTO-SYNC-ENGINE-SPEC.md
docs/product/CLARA-P45-CHATGPT-COMPANION-SAFE-CONTEXT-SPEC.md
docs/product/CLARA-P45-FINAL-REGRESSION-RUNBOOK.md
docs/product/CLARA-P45-EXTENSION-BRIDGE-FINAL-SECURITY-CHECKLIST.md
docs/product/CLARA-P45-EXTENSION-BRIDGE-OPERATOR-RUNBOOK.md
docs/product/CLARA-P5-PRODUCTION-AUTH-FOUNDATION-SPEC.md
docs/product/CLARA-P5-DASHBOARD-PROVIDER-AUTH-UX-SPEC.md
docs/product/CLARA-P5-WORKSPACE-MEMBERSHIP-BOOTSTRAP-SPEC.md
docs/product/CLARA-P5-USER-ROLE-MANAGEMENT-READINESS-SPEC.md
docs/product/CLARA-P5-RUNTIME-CONFIG-DOCTOR-SPEC.md
docs/product/CLARA-P5-PRODUCTION-DEPLOYMENT-SMOKE-RUNBOOK.md
docs/product/CLARA-P5-FINAL-SECURITY-AUDIT.md
docs/product/CLARA-P5-PRODUCTION-AUTH-RUNBOOK.md
docs/product/CLARA-P5-INCIDENT-RESPONSE-RUNBOOK.md
docs/product/CLARA-P5-GO-LIVE-CHECKLIST.md
docs/product/CLARA-P51-LEGACY-UI-UPGRADE-POSITIONING.md
docs/product/CLARA-P51-LEGACY-UI-AUDIT.md
docs/product/CLARA-P51-DESIGN-SYSTEM-CONTRACT.md
docs/product/CLARA-P51-ROUTE-MIGRATION-MAP.md
docs/product/CLARA-P51-ROLE-NAVIGATION-MIGRATION-MAP.md
docs/product/CLARA-P51-UI-MIGRATION-SECURITY-RULES.md
docs/product/CLARA-P51-DASHBOARD-SHELL-ACCEPTANCE-CRITERIA.md
docs/product/CLARA-P51-FINAL-UI-REGRESSION-RUNBOOK.md
docs/product/CLARA-P51-FINAL-ACCESSIBILITY-CHECKLIST.md
docs/product/CLARA-P51-FINAL-SECURITY-CHECKLIST.md
docs/product/CLARA-P51-FINAL-QA-SIGNOFF.md
docs/product/CLARA-P6-PROVIDER-HARDENING-PLAN.md
docs/product/CLARA-P6-PROVIDER-READINESS-MATRIX.md
docs/product/CLARA-P6-OFFICIAL-CHANNEL-POLICY.md
docs/product/CLARA-P6-EXTENSION-BRIDGE-BOUNDARY.md
docs/product/CLARA-P6-GMAIL-CREDENTIAL-BOUNDARY-SPEC.md
docs/product/CLARA-P6-CHANNEL-HEALTH-SPEC.md
docs/product/CLARA-P6-CHANNEL-HEALTH-RUNBOOK.md
docs/product/CLARA-P6-WEBHOOK-HARDENING-SPEC.md
docs/product/CLARA-P6-OUTBOX-RETRY-IDEMPOTENCY-SPEC.md
docs/product/CLARA-P6-WEBHOOK-OUTBOX-RUNBOOK.md
docs/product/CLARA-P6-OBSERVABILITY-SPEC.md
docs/product/CLARA-P6-AUDIT-TRAIL-SPEC.md
docs/product/CLARA-P6-FINAL-SECURITY-AUDIT.md
docs/product/CLARA-P6-PRODUCTION-PROVIDER-RUNBOOK.md
docs/product/CLARA-P6-GO-LIVE-CHECKLIST.md
docs/product/CLARA-P6-TO-P7-HANDOFF.md
docs/product/CLARA-P7-AI-ASSISTANT-SCOPE.md
docs/product/CLARA-P7-AI-SAFETY-POLICY.md
docs/product/CLARA-P7-AI-DATA-ACCESS-POLICY.md
docs/product/CLARA-P7-PROMPT-INJECTION-POLICY.md
docs/product/CLARA-P7-HUMAN-APPROVAL-POLICY.md
docs/product/CLARA-P7-AI-AUDIT-POLICY.md
docs/product/CLARA-P7-IMPLEMENTATION-ROADMAP.md
docs/product/CLARA-P7-AI-CONTEXT-BUILDER-SPEC.md
docs/product/CLARA-P7-AI-PROMPT-CONTRACT.md
docs/product/CLARA-P7-AI-CONTEXT-SECURITY-RUNBOOK.md
docs/product/CLARA-P7-AI-FOLLOW-UP-RECOMMENDATION-SPEC.md
docs/product/CLARA-P7-AI-FOLLOW-UP-RECOMMENDATION-SECURITY-RUNBOOK.md
docs/product/CLARA-P7-AI-CONVERSATION-SUMMARY-SPEC.md
docs/product/CLARA-P7-AI-CUSTOMER-NOTE-SUGGESTION-SPEC.md
docs/product/CLARA-P7-AI-SUMMARY-NOTES-SECURITY-RUNBOOK.md
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-README-RUNBOOK/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-DEMO-SCRIPT/
docs/product/CLARA-P3-EMAIL-PROVIDER-INTEGRATION-DECISION.md
docs/product/CLARA-P8-FINAL-CRM-WORKFLOW-INTELLIGENCE-AUDIT.md
docs/product/CLARA-P8-PRODUCTION-RUNBOOK.md
docs/product/CLARA-P8-SECURITY-CHECKLIST.md
docs/product/CLARA-P8-OPERATOR-QA-CHECKLIST.md
docs/product/CLARA-P9-ANALYTICS-REPORTING-KPI-SCOPE-POLICY.md
docs/product/CLARA-P9-ANALYTICS-READ-MODEL-METRIC-FOUNDATION-SPEC.md
docs/product/CLARA-P9-CORE-OPERATIONAL-METRICS-PACK-SPEC.md
docs/product/CLARA-P9-IMPLEMENTATION-ROADMAP.md
docs/product/CLARA-P10-IMPLEMENTATION-ROADMAP.md
docs/product/CLARA-P10-ENTERPRISE-HARDENING-COMPLIANCE-SCOPE-POLICY.md
docs/product/CLARA-P10-COMPLIANCE-READINESS-BASELINE.md
docs/product/CLARA-P10-DATA-CLASSIFICATION-POLICY.md
docs/product/CLARA-P10-TENANT-ISOLATION-POLICY.md
docs/product/CLARA-P10-AUDIT-RETENTION-DATA-CLASSIFICATION-REDACTION-HARDENING-SPEC.md
docs/product/CLARA-P10-BACKUP-RESTORE-INCIDENT-RESPONSE-EVIDENCE-READINESS-SPEC.md
docs/product/CLARA-P10-FINAL-ENTERPRISE-HARDENING-COMPLIANCE-AUDIT.md
docs/product/CLARA-P10-PRODUCTION-RUNBOOK.md
docs/product/CLARA-P10-SECURITY-CHECKLIST.md
docs/product/CLARA-P10-COMPLIANCE-READINESS-EVIDENCE-SUMMARY.md
docs/product/CLARA-P10-OPERATOR-ADMIN-QA-CHECKLIST.md
docs/product/CLARA-P10-REGRESSION-ACCEPTANCE-CHECKLIST.md
docs/product/CLARA-P10-P11-HANDOFF-NOTES.md
docs/product/CLARA-P11-SCALE-RELIABILITY-BILLING-SCOPE-SLO-POLICY.md
docs/product/CLARA-P11-IMPLEMENTATION-ROADMAP.md
docs/product/CLARA-P11-SLO-RELIABILITY-BASELINE.md
docs/product/CLARA-P11-USAGE-METERING-BILLING-READINESS-POLICY.md
docs/product/CLARA-P11-QUEUE-JOB-RETRY-IDEMPOTENCY-HARDENING-SPEC.md
docs/product/CLARA-P11-QUEUE-JOB-RELIABILITY-RUNBOOK.md
docs/product/CLARA-P11-RATE-LIMIT-QUOTA-USAGE-METERING-READINESS-SPEC.md
docs/product/CLARA-P11-RATE-LIMIT-QUOTA-RUNBOOK.md
docs/product/CLARA-P11-OBSERVABILITY-SLO-DASHBOARD-ALERT-READINESS-SPEC.md
docs/product/CLARA-P11-OBSERVABILITY-ALERT-RUNBOOK.md
docs/product/CLARA-P11-BILLING-READINESS-PLAN-ENTITLEMENT-POLICY.md
docs/product/CLARA-P11-BILLING-ENTITLEMENT-RUNBOOK.md
docs/product/CLARA-P11-PERFORMANCE-CAPACITY-READINESS-SPEC.md
docs/product/CLARA-P11-PERFORMANCE-LOAD-TEST-CAPACITY-RUNBOOK.md
docs/product/CLARA-P11-LOAD-TEST-SCENARIOS.md
docs/product/CLARA-P11-CAPACITY-PLANNING-BASELINE.md
docs/product/CLARA-P11-FINAL-SCALE-RELIABILITY-BILLING-AUDIT.md
docs/product/CLARA-P11-PRODUCTION-RUNBOOK.md
docs/product/CLARA-P11-RELIABILITY-CHECKLIST.md
docs/product/CLARA-P11-BILLING-READINESS-CHECKLIST.md
docs/product/CLARA-P11-PERFORMANCE-CAPACITY-CHECKLIST.md
docs/product/CLARA-P11-SECURITY-REGRESSION-CHECKLIST.md
docs/product/CLARA-P11-OPERATOR-ADMIN-QA-CHECKLIST.md
docs/product/CLARA-P11-P12-HANDOFF-NOTES.md
```

---

# Repository Structure

```text
Clara/
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
├── AGENTS.md
├── CODEOWNERS
├── docs/
│   ├── README.md
│   ├── CLARA-MASTER-DOCUMENTATION-INDEX/
│   ├── CLARA-DOCS-INGESTION-PLAN.md
│   ├── standards/
│   ├── templates/
│   ├── glossary/
│   ├── adr/
│   ├── diagrams/
│   ├── assets/
│   ├── references/
│   ├── onboarding/
│   ├── playbooks/
│   ├── examples/
│   ├── operations/
│   ├── security/
│   ├── ai/
│   ├── product/
│   ├── engineering/
│   ├── BOOK-01-The-Foundation/
│   ├── BOOK-02-Master-Blueprint/
│   ├── BOOK-03-Implementation-Architecture/
│   ├── BOOK-04-Product-Domain-Specification/
│   ├── BOOK-05-Engineering-Execution-Plan/
│   ├── BOOK-06-Security-Governance-and-Compliance/
│   ├── BOOK-07-Operations-Observability-and-Reliability/
│   ├── BOOK-08-Implementation-Delivery-and-Production-Launch/
│   └── BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/
└── .github/
    ├── pull_request_template.md
    └── workflows/
```

---

# Documentation Books

## Book I — The Foundation

Defines why Clara exists.

Path:

```text
docs/BOOK-01-The-Foundation/
```

## Book II — Master Blueprint

Defines what Clara will build.

Path:

```text
docs/BOOK-02-Master-Blueprint/
```

## Book III — Implementation Architecture

Defines how Clara should be implemented.

Path:

```text
docs/BOOK-03-Implementation-Architecture/
```

## Book IV — Product Domain Specification

Defines Clara product/domain behavior and product specification.

Path:

```text
docs/BOOK-04-Product-Domain-Specification/
```

## Book V — Engineering Execution Plan

Defines implementation planning, engineering execution, backlog, and delivery sequencing.

Path:

```text
docs/BOOK-05-Engineering-Execution-Plan/
```

## Book VI — Security, Governance & Compliance

Defines secure-by-design controls, governance, privacy, compliance, risk, and trust evidence.

Path:

```text
docs/BOOK-06-Security-Governance-and-Compliance/
```

## Book VII — Operations, Observability & Reliability

Defines production operations, observability, incident response, reliability, SLOs, backup/restore, and runbooks.

Path:

```text
docs/BOOK-07-Operations-Observability-and-Reliability/
```

## Book VIII — Implementation, Delivery & Production Launch

Defines implementation standards, repository structure, CI/CD, launch, hardening, and production delivery.

Path:

```text
docs/BOOK-08-Implementation-Delivery-and-Production-Launch/
```

## Book IX — Product Operations, Growth & Continuous Improvement

Defines post-launch product operations, customer success, support loop, growth, monetization, analytics, roadmap, continuous trust, reliability, AI quality, business cadence, and handover.

Path:

```text
docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/
```

---

# Master Documentation Index

Start here:

```text
docs/CLARA-MASTER-DOCUMENTATION-INDEX/README.md
docs/CLARA-MASTER-DOCUMENTATION-INDEX/CLARA-MASTER-INDEX.md
```

---

# Recommended Reading Path

## New Contributor

```text
1. README.md
2. docs/README.md
3. docs/CLARA-MASTER-DOCUMENTATION-INDEX/CLARA-MASTER-INDEX.md
4. docs/BOOK-01-The-Foundation/README.md
5. docs/standards/README.md
6. docs/templates/README.md
```

## Engineer

```text
1. AGENTS.md
2. SECURITY.md
3. docs/CLARA-MASTER-DOCUMENTATION-INDEX/CLARA-CODING-REFERENCE-MAP.md
4. Relevant Book I–IX docs
5. Relevant module README when implementation folders exist
```

## Security Reviewer

```text
1. SECURITY.md
2. docs/security/README.md
3. docs/BOOK-06-Security-Governance-and-Compliance/
4. docs/BOOK-08-Implementation-Delivery-and-Production-Launch/
5. docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/PART-08-Continuous-Security-and-Compliance-Operations/
```

## AI Coding Assistant

```text
1. AGENTS.md
2. docs/AGENTS.md
3. docs/CLARA-MASTER-DOCUMENTATION-INDEX/CLARA-CODING-REFERENCE-MAP.md
4. Relevant Book I–IX docs
5. Relevant implementation docs when codebase exists
```

---

# Core Rules

- Documentation is architecture.
- If it is not documented, it cannot be consistently built.
- Security is part of implementation, not a final review step.
- AI-generated code must be reviewed as untrusted contribution.
- Tenant isolation must be preserved in every implementation path.
- Production readiness requires evidence, not optimism.
- Product operations continue after launch.

---

# Security Notice

Do not commit:

- API keys.
- Passwords.
- Tokens.
- Private credentials.
- Production secrets.
- Customer data.
- Unredacted personal data.
- Sensitive screenshots.

See:

```text
SECURITY.md
docs/security/README.md
docs/BOOK-06-Security-Governance-and-Compliance/
```

---

# Current Milestones

```text
✅ Book I — The Foundation
✅ Documentation Standards
✅ Official Template Library
✅ Global Glossary
✅ Book II — Master Blueprint
✅ Book III — Implementation Architecture
✅ Book IV — Product Domain Specification
✅ Book V — Engineering Execution Plan
⏳ Book VI — Security, Governance & Compliance
⏳ Book VII — Operations, Observability & Reliability
⏳ Book VIII — Implementation, Delivery & Production Launch
⏳ Book IX — Product Operations, Growth & Continuous Improvement
⏳ CLARA Master Documentation Index
⏳ Repository implementation foundation
```

---

# Current Implementation Snapshot

P7 adds AI Reply Suggestion v1 as a suggestion-only, mock-provider workflow.
It uses the backend AuthContext, workspace-scoped data access, Prompt Contract,
and AI Context Builder. It does not add real AI providers, provider send,
autonomous provider actions, or auto-send.

P7 also adds AI Draft Review and Human Approval. AI-created draft content starts
as `suggested`, can be edited, approved, or rejected by an authorized human, and
approval does not equal send. Reply send remains a separate explicit human
action.

See:

```text
docs/product/CLARA-P7-AI-REPLY-SUGGESTION-SPEC.md
docs/product/CLARA-P7-AI-REPLY-SUGGESTION-SECURITY-RUNBOOK.md
docs/product/CLARA-P7-AI-DRAFT-REVIEW-HUMAN-APPROVAL-SPEC.md
docs/product/CLARA-P7-AI-DRAFT-REVIEW-SECURITY-RUNBOOK.md
docs/product/CLARA-P7-AI-AUTOMATION-GUARDRAILS-SPEC.md
docs/product/CLARA-P7-AI-AUTOMATION-ABUSE-TESTS.md
docs/product/CLARA-P7-AI-AUTOMATION-SECURITY-RUNBOOK.md
docs/product/CLARA-P7-FINAL-AI-ASSISTANT-AUDIT.md
docs/product/CLARA-P7-FINAL-AI-ASSISTANT-RUNBOOK.md
docs/product/CLARA-P7-AI-INCIDENT-RESPONSE-RUNBOOK.md
docs/product/CLARA-P7-AI-GO-LIVE-CHECKLIST.md
docs/product/CLARA-P7-AI-SECURITY-REVIEW.md
docs/product/CLARA-P8-CRM-WORKFLOW-INTELLIGENCE-SCOPE.md
docs/product/CLARA-P8-CRM-MUTATION-POLICY.md
docs/product/CLARA-P8-WORKFLOW-INTELLIGENCE-POLICY.md
docs/product/CLARA-P8-IMPLEMENTATION-ROADMAP.md
docs/product/CLARA-P8-SECURITY-RUNBOOK.md
docs/product/CLARA-P8-CUSTOMER-PROFILE-INTELLIGENCE-SPEC.md
docs/product/CLARA-P8-CUSTOMER-TIMELINE-INTELLIGENCE-SPEC.md
docs/product/CLARA-P8-REVIEWABLE-CRM-ACTION-PROPOSAL-SPEC.md
docs/product/CLARA-P8-LIFECYCLE-STATUS-UPDATE-READINESS-SPEC.md
docs/product/CLARA-P8-CRM-ACTIVITY-AUDIT-HARDENING-SPEC.md
```

P8-PR-03 adds Customer Timeline Intelligence as a read-only, review-only
workspace-scoped timeline. It uses Backend AuthContext, has no CRM mutation, no
auto-create task, no auto-write customer note, no raw provider payload, no raw
webhook payload, no access token, no refresh token, and no cookies in the
timeline contract.

---

# Final Principle

Clara is built through shared understanding first, then production code.

This repository preserves that understanding.

P9-PR-05 adds Reporting Filters and Analytics Audit Privacy Hardening. Existing
P9 analytics endpoints now accept safe aggregate filters for time window,
channel, category, and owner-gated operator scope. Responses include safe filter
and audit summaries only. They remain Backend AuthContext driven,
workspace-scoped, aggregate-first, read-only, and include no raw customer
messages, no raw provider payload, no raw webhook payload, no raw audit
metadata, no access token, no refresh token, no cookies, no CRM mutation, no
task creation, no outbound send, no report export, no customer-level drilldown,
and no real AI provider.

P9-PR-06 closes P9 with Final P9 Audit, Production Runbook, Security Checklist,
Operator QA Checklist, regression acceptance coverage, and validator coverage.
P9 COMPLETE after P9-PR-06 merge. Next phase: P10 Enterprise Hardening /
Compliance.

P10-PR-01 starts P10 Enterprise Hardening / Compliance with policy-first
compliance readiness, not certification. It defines enterprise hardening scope,
tenant isolation, least privilege, data classification, audit readiness,
retention readiness, incident response readiness, and evidence readiness. It
adds no SSO, MFA, billing, report export, data deletion jobs, backup
automation, provider integration, CRM mutation, task creation, outbound send,
or real AI provider.

P10-PR-02 adds read-only Tenant Isolation + Permission Audit Hardening
readiness. The API exposes authenticated, Backend AuthContext scoped readiness
endpoints, and the dashboard displays safe summaries only. It adds no SSO, MFA,
billing, report export, role mutation, no permission mutation, no CRM mutation,
task creation, outbound send, raw customer messages, raw provider payload, raw
webhook payload, raw audit metadata, access token, refresh token, cookies, auth
headers, API keys, secrets, or real AI provider.

P10-PR-03 adds read-only Audit Retention + Data Classification + Redaction
Hardening readiness. The API exposes authenticated enterprise readiness routes,
the dashboard renders safe compliance readiness panels, and extension
regression tests keep audit retention, data classification, redaction hardening,
raw compliance data, tokens, cookies, auth headers, raw provider payload, raw
webhook payload, raw audit metadata, and secrets out of extension scope.
