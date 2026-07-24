---
project: "CLARA"
artifact: "CLARA Documentation Index"
status: "active"
owner: "CLARA Product and Engineering"
classification: "documentation-index"
---

# CLARA Documentation Index

## Status

P1-P14 complete. DOCS-REFRESH-BEFORE-P12, UI-POLISH-BEFORE-P12,
PRE-P12-INTERACTION-ACTIVATION, P12 Beta / GA Release Readiness, and P13
Internal CRM Product Activation are complete. P14 Internal Beta Rollout
Preparation is complete. P14-PR-01 is complete. P14-PR-02 is complete.
P14-PR-03 is complete. P14-PR-04 is complete. P14-PR-05 is complete.
P14-PR-06 is complete.

P15 Controlled Internal Beta Execution is complete. P15-PR-01 is complete.
P15-PR-02 is complete. P15-PR-03 is complete. P15-PR-04 is complete. P16
Extension-Assisted Channel Ingestion Hardening is complete. P16-PR-01 is complete.
P16-PR-02 is complete. P16-PR-03 is complete. P16-PR-04 is complete.
P17 Real AI Analysis Activation is complete for controlled internal use. P17-PR-01 is complete.
P17-PR-02 is complete.
P17-PR-03 is complete.
P17-PR-04 is complete.
P17-PR-01 prepares AI provider runtime configuration.
P17-PR-02 builds AI-ready context but does not execute real AI provider calls.
P17-PR-03 activates controlled backend real AI analysis for extension-assisted AI-ready context.
P18 Controlled Internal Runtime Trial + Operational Readiness is current.
P18-PR-01 is current.
P18 validates controlled internal runtime behavior only.
P18 is not public SaaS launch.
P18 is not production deployment.
P18 does not activate billing/payment.
P18 does not activate official WA/IG/TikTok APIs.
P18 does not enable outbound auto-send.
AI analysis remains backend/server-side.
AI provider secrets remain server-only.
Extension must not call AI providers directly.
Post-P17 internal handoff confirms the completed pipeline: extension snapshot ->
sanitization/redaction -> workspace/operator attribution -> backend
ingestion/dedup -> AI-ready context -> controlled backend real AI analysis ->
safe persistence -> dashboard review UI.
AI-ready context must come only from sanitized/redacted extension snapshots. PII
redaction is required before future AI provider calls. Raw prompts must not be
persisted. Raw customer messages must not be persisted as AI prompts. Raw AI
provider payloads and responses must not be persisted. Customer text is
untrusted input and must be separated from system/developer instructions.
Prompt-injection boundaries are required. AI context size budgets are required.
AI provider secrets are server-only. AI provider secrets must not be exposed to
dashboard or extension. Extension must not call AI providers directly.
extension-assisted ingestion is internal/controlled/user-assisted.
extension-assisted ingestion captures only active chat opened by an authorized
operator. extension-assisted ingestion requires operator awareness/consent.
extension-assisted ingestion is not official WA/IG/TikTok API activation.
official WA/IG/TikTok APIs remain not activated. extension-assisted ingestion is
not public SaaS launch. extension-assisted ingestion is not production
deployment claim unless separately executed. billing/payment is deferred.
provider/AI/outbound
activation remains controlled. no outbound auto-send is activated. no external
support tool integration is activated. AuthContext and workspace membership
remain source of truth. client-supplied workspaceId is not authoritative.
snapshot sanitization and redaction are required before storage and future AI
analysis. snapshot attribution binds to authenticated operator and resolved
workspace. cross-workspace spoofing must be rejected.
evidence/logs/docs/runbooks must not include secrets/tokens/cookies/auth
headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw
prompts/payment data. User acceptance session is
internal-only. user acceptance session is internal-only. UAT issue capture is
manual/local/repo-safe unless separately approved. UAT is not public SaaS
launch. UAT is not production deployment claim unless separately executed.
Runtime smoke execution is internal-only. runtime smoke
execution is internal-only. Runtime smoke execution is not public SaaS launch.
runtime smoke execution is not public SaaS launch. Runtime smoke execution is
not production deployment claim unless separately executed. runtime smoke
execution is not production deployment claim unless separately executed.
Controlled internal beta execution is internal-only. controlled internal beta is
internal-only. Controlled internal beta is not public SaaS launch. controlled
internal beta is not public SaaS launch. Controlled internal beta is not
production deployment claim unless separately executed. controlled internal beta
is not production deployment claim unless separately executed. billing/payment
is deferred. provider/AI/outbound activation remains controlled.
Feedback/support remains manual/local/repo-safe unless separately approved.
feedback/support remains manual/local/repo-safe unless separately approved. No
external support tool integration is activated. no external support tool
integration is activated. AuthContext and workspace membership remain source of
truth. client-supplied workspaceId is not authoritative.
Secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw
HTML/raw DOM/raw prompts/payment data must not be included in evidence,
feedback, logs, docs, or runbooks. secrets/tokens/cookies/auth headers/raw
provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data
must not be included in evidence, feedback, logs, docs, or runbooks. Known
limitations must be reviewed before broader rollout.

Markdown inventory for this refresh was generated with:

```bash
find . -name '*.md' \
  -not -path './node_modules/*' \
  -not -path './*/node_modules/*' \
  -not -path './dist/*' \
  -not -path './*/dist/*' \
  -not -path './build/*' \
  -not -path './*/build/*' \
  -not -path './coverage/*' \
  -not -path './*/coverage/*' \
  -not -path './.git/*'
```

## Roadmap / Product

| Document                                                                  | Purpose                                                           |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `README.md`                                                               | Root orientation, local commands, phase status, and active links. |
| `docs/product/CLARA-FINAL-ROADMAP.md`                                     | Active P1-P15 roadmap source.                                     |
| `docs/product/CLARA-P15-CONTROLLED-INTERNAL-BETA-ROADMAP.md`              | Active P15 controlled internal beta roadmap.                      |
| `docs/product/CLARA-P15-CONTROLLED-INTERNAL-BETA-EXECUTION-SCOPE.md`      | P15 controlled internal beta execution scope.                     |
| `docs/product/CLARA-P15-INTERNAL-RUNTIME-SMOKE-EXECUTION-RUNBOOK.md`      | P15 internal runtime smoke execution runbook.                     |
| `docs/product/CLARA-P15-INTERNAL-RUNTIME-EVIDENCE-LOG-TEMPLATE.md`        | P15 internal runtime evidence log template.                       |
| `docs/product/CLARA-P15-API-SMOKE-EXECUTION-CHECKLIST.md`                 | P15 API smoke execution checklist.                                |
| `docs/product/CLARA-P15-DASHBOARD-SMOKE-EXECUTION-CHECKLIST.md`           | P15 Dashboard smoke execution checklist.                          |
| `docs/product/CLARA-P15-EXTENSION-SMOKE-EXECUTION-CHECKLIST.md`           | P15 Extension smoke execution checklist.                          |
| `docs/product/CLARA-P15-EVIDENCE-PRIVACY-BOUNDARY.md`                     | P15 evidence privacy boundary.                                    |
| `docs/product/CLARA-P15-EVIDENCE-RETENTION-HANDLING-POLICY.md`            | P15 evidence retention/manual handling policy.                    |
| `docs/product/CLARA-P15-INTERNAL-UAT-SESSION-PLAN.md`                     | P15 internal UAT session plan.                                    |
| `docs/product/CLARA-P15-INTERNAL-UAT-OPERATOR-SCRIPT.md`                  | P15 operator UAT script.                                          |
| `docs/product/CLARA-P15-INTERNAL-UAT-ADMIN-SCRIPT.md`                     | P15 admin UAT script.                                             |
| `docs/product/CLARA-P15-INTERNAL-UAT-VIEWER-SCRIPT.md`                    | P15 viewer/read-only UAT script.                                  |
| `docs/product/CLARA-P15-INTERNAL-UAT-ACCEPTANCE-CRITERIA.md`              | P15 UAT acceptance criteria.                                      |
| `docs/product/CLARA-P15-INTERNAL-UAT-ISSUE-CAPTURE-TEMPLATE.md`           | P15 UAT issue capture template.                                   |
| `docs/product/CLARA-P15-INTERNAL-UAT-USABILITY-FEEDBACK-TEMPLATE.md`      | P15 UAT usability feedback template.                              |
| `docs/product/CLARA-P15-INTERNAL-UAT-SEVERITY-PRIORITY-RULES.md`          | P15 UAT severity/priority rules.                                  |
| `docs/product/CLARA-P15-INTERNAL-UAT-EVIDENCE-SAFETY-RULES.md`            | P15 UAT evidence safety rules.                                    |
| `docs/product/CLARA-P15-INTERNAL-BETA-BUGFIX-TRIAGE-POLICY.md`            | P15 bugfix triage policy.                                         |
| `docs/product/CLARA-P15-INTERNAL-BETA-BUGFIX-TRIAGE-BATCH-1-CHECKLIST.md` | P15 bugfix triage batch 1 checklist.                              |
| `docs/product/CLARA-P15-INTERNAL-BETA-STABILIZATION-REVIEW.md`            | P15 stabilization review.                                         |
| `docs/product/CLARA-P15-INTERNAL-BETA-KNOWN-ISSUE-DISPOSITION.md`         | P15 known issue disposition.                                      |
| `docs/product/CLARA-P15-INTERNAL-BETA-RISK-ACCEPTANCE-REGISTER.md`        | P15 risk acceptance register.                                     |
| `docs/product/CLARA-P15-FINAL-INTERNAL-BETA-EXECUTION-HANDOFF.md`         | P15 final execution handoff.                                      |
| `docs/product/CLARA-P15-CLOSURE-SUMMARY.md`                               | P15 closure summary.                                              |
| `docs/product/CLARA-P16-EXTENSION-ASSISTED-INGESTION-TRANSITION-PLAN.md`  | P16 extension-assisted ingestion transition plan.                 |
| `docs/product/CLARA-P16-P17-COMPRESSED-ROADMAP.md`                        | P16/P17 compressed roadmap.                                       |
| `docs/product/CLARA-P17-EXTENSION-SNAPSHOT-AI-CONTEXT-BUILDER.md`         | P17 extension snapshot AI-ready context builder contract.         |
| `docs/product/CLARA-P17-EXTENSION-SNAPSHOT-PII-REDACTION-PIPELINE.md`      | P17 extension snapshot PII redaction pipeline.                    |
| `docs/product/CLARA-P17-AI-CONTEXT-BUDGET-POLICY.md`                      | P17 AI context budget policy.                                     |
| `docs/product/CLARA-P17-PROMPT-INJECTION-BOUNDARY-POLICY.md`              | P17 prompt-injection boundary policy.                             |
| `docs/product/CLARA-P17-AI-CONTEXT-AUDIT-PRIVACY-POLICY.md`               | P17 AI context audit privacy policy.                              |
| `docs/product/CLARA-P17-AI-READY-CONTEXT-CONTRACT.md`                     | P17 AI-ready context contract.                                    |
| `docs/product/CLARA-P17-REAL-AI-ANALYSIS-OUTPUT-CONTRACT.md`              | P17 real AI analysis safe output contract.                        |
| `docs/product/CLARA-P17-REAL-AI-ANALYSIS-RUNTIME-POLICY.md`               | P17 real AI analysis runtime guardrails.                          |
| `docs/product/CLARA-P17-AI-ANALYSIS-PERSISTENCE-SAFETY.md`                | P17 AI analysis persistence safety.                               |
| `docs/product/CLARA-P17-AI-ANALYSIS-DASHBOARD-REVIEW-UI.md`               | P17 AI analysis dashboard review UI.                              |
| `docs/product/CLARA-P17-AI-ANALYSIS-AUDIT-PRIVACY-POLICY.md`              | P17 AI analysis audit privacy policy.                             |
| `docs/product/CLARA-P17-AI-ANALYSIS-FAIL-CLOSED-RUNBOOK.md`               | P17 AI analysis fail-closed runbook.                              |
| `docs/product/CLARA-P16-EXTENSION-ASSISTED-CHANNEL-SCOPE.md`              | P16 extension-assisted channel scope.                             |
| `docs/product/CLARA-P16-EXTENSION-ASSISTED-OPERATOR-CONSENT-POLICY.md`    | P16 operator consent policy.                                      |
| `docs/product/CLARA-P16-EXTENSION-ASSISTED-ALLOWED-CAPTURE-POLICY.md`     | P16 allowed capture policy.                                       |
| `docs/product/CLARA-P16-EXTENSION-ASSISTED-DISALLOWED-CAPTURE-POLICY.md`  | P16 disallowed capture policy.                                    |
| `docs/product/CLARA-P16-EXTENSION-PERMISSION-BOUNDARY.md`                 | P16 extension permission boundary.                                |
| `docs/product/CLARA-P16-EXTENSION-ASSISTED-THREAT-MODEL.md`               | P16 extension-assisted threat model.                              |
| `docs/product/CLARA-P16-EXTENSION-ASSISTED-ABUSE-CASE-REGISTER.md`        | P16 abuse case register.                                          |
| `docs/product/CLARA-P16-EXTENSION-ASSISTED-PRIVACY-DATA-MINIMIZATION-POLICY.md` | P16 privacy and data minimization policy.                 |
| `docs/product/CLARA-P16-EXTENSION-ASSISTED-AUDIT-EVIDENCE-POLICY.md`      | P16 audit and evidence policy.                                    |
| `docs/product/CLARA-P16-EXTENSION-ASSISTED-SECURITY-CHECKLIST.md`         | P16 security checklist.                                           |
| `docs/product/CLARA-P16-OFFICIAL-PROVIDER-API-NON-ACTIVATION-POLICY.md`   | P16 official provider API non-activation policy.                  |
| `docs/product/CLARA-P16-EXTENSION-ASSISTED-INGESTION-ROADMAP.md`          | P16 extension-assisted ingestion roadmap.                         |
| `docs/product/CLARA-P16-SNAPSHOT-SANITIZATION-PIPELINE.md`                | P16 snapshot sanitization pipeline.                               |
| `docs/product/CLARA-P16-SNAPSHOT-REDACTION-PIPELINE.md`                   | P16 snapshot redaction pipeline.                                  |
| `docs/product/CLARA-P16-WORKSPACE-ATTRIBUTION-POLICY.md`                  | P16 workspace attribution policy.                                 |
| `docs/product/CLARA-P16-OPERATOR-ATTRIBUTION-POLICY.md`                   | P16 operator attribution policy.                                  |
| `docs/product/CLARA-P16-CLIENT-WORKSPACE-ID-NON-AUTHORITY-POLICY.md`      | P16 client workspace id non-authority policy.                     |
| `docs/product/CLARA-P16-CROSS-WORKSPACE-SPOOFING-REGRESSION-POLICY.md`    | P16 cross-workspace spoofing regression policy.                   |
| `docs/product/CLARA-P16-SNAPSHOT-EVIDENCE-PRIVACY-POLICY.md`              | P16 snapshot evidence privacy policy.                             |
| `docs/product/CLARA-P16-SANITIZATION-REDACTION-SECURITY-CHECKLIST.md`     | P16 sanitization and redaction security checklist.                |
| `docs/product/CLARA-P15-INTERNAL-BETA-OPERATING-RULES.md`                 | P15 internal beta operating rules.                                |
| `docs/product/CLARA-P15-INTERNAL-BETA-PARTICIPANT-RULES.md`               | P15 internal beta participant rules.                              |
| `docs/product/CLARA-P15-INTERNAL-BETA-EVIDENCE-LOG-POLICY.md`             | P15 evidence log policy.                                          |
| `docs/product/CLARA-P15-INTERNAL-BETA-ISSUE-CAPTURE-POLICY.md`            | P15 issue capture policy.                                         |
| `docs/product/CLARA-P15-INTERNAL-BETA-ESCALATION-RULES.md`                | P15 escalation rules.                                             |
| `docs/product/CLARA-P15-INTERNAL-BETA-OPERATING-CHECKLIST.md`             | P15 daily/weekly operating checklist.                             |
| `docs/product/CLARA-P14-INTERNAL-BETA-ROADMAP.md`                         | Active P14 internal beta roadmap.                                 |
| `docs/product/CLARA-P14-INTERNAL-BETA-ROLLOUT-SCOPE.md`                   | P14 internal beta rollout scope.                                  |
| `docs/product/CLARA-P14-INTERNAL-ENVIRONMENT-PLAN.md`                     | P14 internal environment plan.                                    |
| `docs/product/CLARA-P14-INTERNAL-USER-ROLE-PLAN.md`                       | P14 internal user role plan.                                      |
| `docs/product/CLARA-P14-INTERNAL-DATA-POLICY.md`                          | P14 internal data policy.                                         |
| `docs/product/CLARA-P14-INTERNAL-SECURITY-CHECKLIST.md`                   | P14 internal security checklist.                                  |
| `docs/product/CLARA-P14-INTERNAL-USER-BOOTSTRAP-ROLE-SETUP.md`            | P14 internal user bootstrap and role setup.                       |
| `docs/product/CLARA-P14-INTERNAL-ROLE-PERMISSION-MATRIX.md`               | P14 internal role permission matrix.                              |
| `docs/product/CLARA-P14-INTERNAL-USER-ONBOARDING-CHECKLIST.md`            | P14 internal user onboarding checklist.                           |
| `docs/product/CLARA-P14-INTERNAL-OWNER-ADMIN-RUNBOOK.md`                  | P14 internal owner/admin runbook.                                 |
| `docs/product/CLARA-P14-INTERNAL-DATA-SEEDING-IMPORT-WORKFLOW.md`         | P14 internal data seeding/import workflow.                        |
| `docs/product/CLARA-P14-INTERNAL-DATA-IMPORT-FORMAT.md`                   | P14 internal customer import format.                              |
| `docs/product/CLARA-P14-INTERNAL-DATA-VALIDATION-POLICY.md`               | P14 internal data import validation policy.                       |
| `docs/product/CLARA-P14-INTERNAL-DATA-ROLLBACK-CLEANUP-RUNBOOK.md`        | P14 internal data rollback and cleanup runbook.                   |
| `docs/product/CLARA-P14-INTERNAL-ACCESS-QA-CHECKLIST.md`                  | P14 internal access QA checklist.                                 |
| `docs/product/CLARA-P14-INTERNAL-SECURITY-REVIEW.md`                      | P14 internal security review.                                     |
| `docs/product/CLARA-P14-INTERNAL-ROLE-ACCESS-REVIEW.md`                   | P14 role access review.                                           |
| `docs/product/CLARA-P14-WORKSPACE-ISOLATION-QA.md`                        | P14 workspace isolation QA.                                       |
| `docs/product/CLARA-P14-INTERNAL-DATA-IMPORT-SECURITY-REVIEW.md`          | P14 internal data import security review.                         |
| `docs/product/CLARA-P14-INTERNAL-USAGE-FEEDBACK-LOOP.md`                  | P14 internal usage feedback loop.                                 |
| `docs/product/CLARA-P14-INTERNAL-FEEDBACK-TRIAGE-RUNBOOK.md`              | P14 internal feedback triage runbook.                             |
| `docs/product/CLARA-P14-INTERNAL-FEEDBACK-SEVERITY-POLICY.md`             | P14 internal feedback severity policy.                            |
| `docs/product/CLARA-P14-INTERNAL-BUG-REPORT-TEMPLATE.md`                  | P14 internal bug report template.                                 |
| `docs/product/CLARA-P14-INTERNAL-USABILITY-FEEDBACK-TEMPLATE.md`          | P14 internal usability feedback template.                         |
| `docs/product/CLARA-P14-INTERNAL-FEEDBACK-PRIVACY-BOUNDARY.md`            | P14 feedback privacy boundary.                                    |
| `docs/product/CLARA-P14-INTERNAL-KNOWN-ISSUES-WORKFLOW.md`                | P14 internal known issues workflow.                               |
| `docs/product/CLARA-P14-FINAL-INTERNAL-BETA-GO-LIVE-RUNBOOK.md`           | P14 final internal beta go-live runbook.                          |
| `docs/product/CLARA-P14-INTERNAL-BETA-GO-NO-GO-CHECKLIST.md`              | P14 internal beta go/no-go checklist.                             |
| `docs/product/CLARA-P14-INTERNAL-BETA-OPERATOR-HANDOFF.md`                | P14 internal beta operator handoff.                               |
| `docs/product/CLARA-P14-INTERNAL-BETA-ADMIN-HANDOFF.md`                   | P14 internal beta admin handoff.                                  |
| `docs/product/CLARA-P14-INTERNAL-BETA-SUPPORT-HANDOFF.md`                 | P14 support/feedback handoff.                                     |
| `docs/product/CLARA-P14-INTERNAL-BETA-ROLLBACK-HANDOFF.md`                | P14 rollback/manual recovery handoff.                             |
| `docs/product/CLARA-P14-INTERNAL-BETA-KNOWN-LIMITATIONS-REVIEW.md`        | P14 known limitations review.                                     |
| `docs/product/CLARA-P14-INTERNAL-BETA-FINAL-SECURITY-REVIEW.md`           | P14 final security review.                                        |
| `docs/product/CLARA-P14-INTERNAL-BETA-FINAL-HANDOFF-SUMMARY.md`           | P14 final handoff summary.                                        |
| `docs/product/CLARA-P13-INTERNAL-CRM-ACTIVATION-ROADMAP.md`               | Active P13 internal CRM roadmap.                                  |
| `docs/product/CLARA-P13-CUSTOMER-CRUD-ACTIVATION.md`                      | P13 customer CRUD activation contract.                            |
| `docs/product/CLARA-P13-CUSTOMER-NOTES-ACTIVITY-TIMELINE.md`              | P13 customer notes and safe activity timeline contract.           |
| `docs/product/CLARA-P13-CUSTOMER-LIFECYCLE-OWNER-ASSIGNMENT.md`           | P13 customer lifecycle status and owner assignment contract.      |
| `docs/product/CLARA-P13-FOLLOW-UP-TASK-WORKFLOW.md`                       | P13 follow-up task workflow contract.                             |
| `docs/product/CLARA-P13-CONVERSATION-CUSTOMER-LINKING.md`                 | P13 conversation-to-customer linking contract.                    |
| `docs/product/CLARA-P13-INTERNAL-DASHBOARD-ANALYTICS-WIRING.md`           | P13 internal dashboard analytics wiring contract.                 |
| `docs/product/CLARA-P13-INTERNAL-CRM-E2E-QA-RUNBOOK.md`                   | Final P13 internal CRM E2E QA runbook.                            |
| `docs/product/CLARA-P13-INTERNAL-CRM-HANDOFF-SUMMARY.md`                  | Final P13 internal CRM handoff summary.                           |
| `docs/product/CLARA-P13-BILLING-DEFERRED-POLICY.md`                       | P13 billing/payment deferred policy.                              |
| `docs/product/CLARA-MVP-GAP-REVIEW.md`                                    | Product gap and phase progress review.                            |
| `docs/product/CLARA-PHASE-CLOSURE-SUMMARY.md`                             | P1-P11 closure summary.                                           |

## Architecture / Security

| Document                                                              | Purpose                                  |
| --------------------------------------------------------------------- | ---------------------------------------- |
| `SECURITY.md`                                                         | Repository security policy.              |
| `docs/product/CLARA-SECURITY-BOUNDARY-SUMMARY.md`                     | Active P5-P11 security boundary summary. |
| `docs/CLARA-MASTER-DOCUMENTATION-INDEX/CLARA-CODING-REFERENCE-MAP.md` | Coding documentation routing.            |

## API / Backend

| Document                                    | Purpose                                                     |
| ------------------------------------------- | ----------------------------------------------------------- |
| `services/api/README.md`                    | API capabilities, commands, config, and backend guardrails. |
| `docs/product/CLARA-VALIDATION-BASELINE.md` | Latest validated test/build baseline.                       |

## Dashboard

| Document                   | Purpose                                                      |
| -------------------------- | ------------------------------------------------------------ |
| `apps/dashboard/README.md` | Dashboard capabilities, commands, and safe rendering policy. |

## Extension

| Document                   | Purpose                                                           |
| -------------------------- | ----------------------------------------------------------------- |
| `apps/extension/README.md` | Extension boundary, commands, and release-readiness expectations. |

## Phase Runbooks

| Document                                       | Purpose                       |
| ---------------------------------------------- | ----------------------------- |
| `docs/product/CLARA-RUNBOOK-INDEX.md`          | Active runbook entry points.  |
| `docs/product/CLARA-P11-PRODUCTION-RUNBOOK.md` | Final P11 operations runbook. |

## Validation / QA

| Document                                         | Purpose                   |
| ------------------------------------------------ | ------------------------- |
| `docs/product/CLARA-TESTING-VALIDATION-INDEX.md` | Test and validator index. |
| `scripts/validate-docs-refresh-before-p12.sh`    | Docs refresh validator.   |

## Release Readiness

| Document                                                          | Purpose                                                                                               |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `docs/product/CLARA-RELEASE-READINESS-OVERVIEW.md`                | P12 release readiness overview.                                                                       |
| `docs/product/CLARA-P12-IMPLEMENTATION-ROADMAP.md`                | P12 compact roadmap.                                                                                  |
| `docs/product/CLARA-P12-HANDOFF-FROM-P11.md`                      | Handoff from validated P11 baseline.                                                                  |
| `docs/product/CLARA-P12-BETA-GA-SCOPE-RELEASE-CRITERIA.md`        | Official Beta and GA scope gates.                                                                     |
| `docs/product/CLARA-P12-BETA-ELIGIBILITY-CHECKLIST.md`            | Beta eligibility checklist.                                                                           |
| `docs/product/CLARA-P12-GA-RELEASE-CRITERIA.md`                   | GA release criteria.                                                                                  |
| `docs/product/CLARA-P12-RELEASE-CANDIDATE-READINESS-POLICY.md`    | Release candidate readiness policy.                                                                   |
| `docs/product/CLARA-P12-GO-NO-GO-CHECKLIST.md`                    | Go/no-go checklist.                                                                                   |
| `docs/product/CLARA-P12-LAUNCH-RISK-REGISTER.md`                  | Beta accepted risks and GA blockers.                                                                  |
| `docs/product/CLARA-P12-KNOWN-LIMITATIONS.md`                     | P12 known limitations.                                                                                |
| `docs/product/CLARA-P12-SUPPORT-FEEDBACK-READINESS-BOUNDARY.md`   | Support and feedback boundary.                                                                        |
| `docs/product/CLARA-P12-RELEASE-CANDIDATE-VALIDATION-MATRIX.md`   | Release Candidate validation matrix.                                                                  |
| `docs/product/CLARA-P12-SMOKE-TEST-MATRIX.md`                     | API, Dashboard, Extension, Auth, Workspace, Local Demo, Beta, Security, and Operational smoke matrix. |
| `docs/product/CLARA-P12-RC-VALIDATION-RUNBOOK.md`                 | Release Candidate validation runbook.                                                                 |
| `docs/product/CLARA-P12-RC-EVIDENCE-CHECKLIST.md`                 | Release Candidate evidence checklist.                                                                 |
| `docs/product/CLARA-P12-RC-PASS-FAIL-POLICY.md`                   | Release Candidate pass/fail policy.                                                                   |
| `docs/product/CLARA-P12-LOCAL-DEMO-SMOKE-FLOW.md`                 | Local demo smoke flow.                                                                                |
| `docs/product/CLARA-P12-BETA-SMOKE-FLOW.md`                       | Beta smoke flow.                                                                                      |
| `docs/product/CLARA-P12-SECURITY-SMOKE-CHECKLIST.md`              | Security smoke checklist.                                                                             |
| `docs/product/CLARA-P12-OPERATIONAL-SMOKE-CHECKLIST.md`           | Operational smoke checklist.                                                                          |
| `docs/product/CLARA-P12-PRODUCTION-DEPLOYMENT-CHECKLIST.md`       | Production deployment readiness checklist.                                                            |
| `docs/product/CLARA-P12-ROLLBACK-DRILL-RUNBOOK.md`                | Rollback drill runbook.                                                                               |
| `docs/product/CLARA-P12-PRODUCTION-CONFIG-READINESS-CHECKLIST.md` | Production config readiness checklist.                                                                |
| `docs/product/CLARA-P12-SECRETS-ENV-READINESS-CHECKLIST.md`       | Secrets/env readiness checklist.                                                                      |
| `docs/product/CLARA-P12-DATABASE-MIGRATION-ROLLBACK-CHECKLIST.md` | Database migration and rollback checklist.                                                            |
| `docs/product/CLARA-P12-DNS-TLS-CORS-READINESS-CHECKLIST.md`      | DNS, TLS, and CORS readiness checklist.                                                               |
| `docs/product/CLARA-P12-DEPLOYMENT-CUTOVER-GO-NO-GO-POLICY.md`    | Deployment cutover go/no-go policy.                                                                   |
| `docs/product/CLARA-P12-POST-DEPLOYMENT-SMOKE-CHECKLIST.md`       | Post-deployment smoke checklist.                                                                      |
| `docs/product/CLARA-P12-ROLLBACK-EVIDENCE-CHECKLIST.md`           | Rollback evidence checklist.                                                                          |
| `docs/product/CLARA-P12-BETA-FEEDBACK-WORKFLOW.md`                | Beta feedback workflow.                                                                               |
| `docs/product/CLARA-P12-BETA-FEEDBACK-PRIVACY-BOUNDARY.md`        | Beta feedback privacy boundary.                                                                       |
| `docs/product/CLARA-P12-SUPPORT-TRIAGE-RUNBOOK.md`                | Support triage runbook.                                                                               |
| `docs/product/CLARA-P12-BETA-SUPPORT-SLA-POLICY.md`               | Beta support SLA policy.                                                                              |
| `docs/product/CLARA-P12-KNOWN-ISSUES-WORKFLOW.md`                 | Known issues workflow.                                                                                |
| `docs/product/CLARA-P12-BLOCKER-ISSUE-CLASSIFICATION.md`          | Blocker issue classification.                                                                         |
| `docs/product/CLARA-P12-BETA-INCIDENT-ESCALATION-POLICY.md`       | Beta incident escalation policy.                                                                      |
| `docs/product/CLARA-P12-USER-FEEDBACK-INTAKE-TEMPLATE.md`         | User feedback intake template.                                                                        |
| `docs/product/CLARA-P12-SUPPORT-EVIDENCE-CHECKLIST.md`            | Support evidence checklist.                                                                           |
| `docs/product/CLARA-P12-RELEASE-NOTES-BETA-CHANGELOG-POLICY.md`   | Release notes and beta changelog policy.                                                              |
| `docs/product/CLARA-P12-GA-BLOCKER-REVIEW-CHECKLIST.md`           | GA blocker review checklist.                                                                          |
| `docs/product/CLARA-P12-FINAL-GA-AUDIT-RUNBOOK.md`                | Final P12 GA audit runbook.                                                                           |
| `docs/product/CLARA-P12-FINAL-RELEASE-READINESS-SUMMARY.md`       | Final release readiness summary.                                                                      |
| `docs/product/CLARA-P12-FINAL-GA-READINESS-CHECKLIST.md`          | Final GA readiness checklist.                                                                         |
| `docs/product/CLARA-P12-FINAL-SECURITY-BOUNDARY-REVIEW.md`        | Final security boundary review.                                                                       |
| `docs/product/CLARA-P12-FINAL-OPERATIONAL-READINESS-REVIEW.md`    | Final operational readiness review.                                                                   |
| `docs/product/CLARA-P12-FINAL-KNOWN-LIMITATIONS-REVIEW.md`        | Final known limitations review.                                                                       |
| `docs/product/CLARA-P12-FINAL-GO-NO-GO-DECISION-RECORD.md`        | Final go/no-go decision record.                                                                       |
| `docs/product/CLARA-P12-FINAL-OPERATOR-RUNBOOK.md`                | Final release operator runbook.                                                                       |
| `docs/product/CLARA-P12-FINAL-ADMIN-RUNBOOK.md`                   | Final admin runbook.                                                                                  |
| `docs/product/CLARA-P12-FINAL-SUPPORT-HANDOFF.md`                 | Final support handoff.                                                                                |
| `docs/product/CLARA-P12-FINAL-ROLLBACK-INCIDENT-HANDOFF.md`       | Final rollback and incident handoff.                                                                  |
| `docs/product/CLARA-P12-FINAL-EVIDENCE-CHECKLIST.md`              | Final evidence checklist.                                                                             |
| `docs/product/CLARA-P12-POST-P12-HANDOFF.md`                      | Post-P12 handoff and remaining approval gates.                                                        |

## P17 Final Extension-Assisted AI

| Document                                                                 | Purpose                                            |
| ------------------------------------------------------------------------ | -------------------------------------------------- |
| `docs/product/CLARA-P17-FINAL-AI-RUNTIME-QA-CHECKLIST.md`                | Final P17 runtime QA checklist.                    |
| `docs/product/CLARA-P17-FINAL-AI-SECURITY-CHECKLIST.md`                  | Final P17 AI security checklist.                   |
| `docs/product/CLARA-P17-FINAL-AI-OPERATOR-RUNBOOK.md`                    | Operator runbook for controlled internal QA.       |
| `docs/product/CLARA-P17-FINAL-AI-ADMIN-RUNBOOK.md`                       | Admin runbook for final P17 readiness.             |
| `docs/product/CLARA-P17-FINAL-AI-EVIDENCE-TEMPLATE.md`                   | Privacy-safe evidence template.                    |
| `docs/product/CLARA-P17-FINAL-AI-KNOWN-LIMITATIONS.md`                   | Final P17 known limitations.                       |
| `docs/product/CLARA-P17-FINAL-AI-INCIDENT-ROLLBACK-GUIDANCE.md`          | Incident and rollback guidance.                    |
| `docs/product/CLARA-P17-FINAL-EXTENSION-ASSISTED-AI-SMOKE-RUNBOOK.md`    | Local/dev-safe extension-assisted AI smoke flow.   |
| `docs/product/CLARA-P17-CLOSURE-SUMMARY.md`                              | P17 closure summary and next-phase boundary.       |

## P18 Controlled Internal Runtime Trial

| Document                                                                 | Purpose                                            |
| ------------------------------------------------------------------------ | -------------------------------------------------- |
| `docs/product/CLARA-P18-CONTROLLED-INTERNAL-RUNTIME-TRIAL-SCOPE.md`      | P18 controlled runtime trial scope.                |
| `docs/product/CLARA-P18-RUNTIME-TRIAL-PARTICIPANT-RULES.md`              | Participant rules for internal runtime trial.      |
| `docs/product/CLARA-P18-RUNTIME-TRIAL-ENVIRONMENT-BOUNDARY.md`           | Environment boundary and non-launch guardrails.    |
| `docs/product/CLARA-P18-RUNTIME-TRIAL-SUCCESS-METRICS.md`                | Trial success and failure metrics.                 |
| `docs/product/CLARA-P18-RUNTIME-TRIAL-EVIDENCE-PLAN.md`                  | Privacy-safe evidence plan.                        |
| `docs/product/CLARA-P18-RUNTIME-TRIAL-EVIDENCE-TEMPLATE.md`              | Runtime trial evidence template.                   |
| `docs/product/CLARA-P18-RUNTIME-TRIAL-PRIVACY-POLICY.md`                 | Evidence privacy policy.                           |
| `docs/product/CLARA-P18-RUNTIME-TRIAL-RISK-REGISTER.md`                  | Runtime trial risk register.                       |
| `docs/product/CLARA-P18-RUNTIME-TRIAL-STOP-CRITERIA.md`                  | Required stop criteria.                            |
| `docs/product/CLARA-P18-RUNTIME-TRIAL-MANUAL-ROLLBACK-GUIDANCE.md`       | Manual rollback guidance.                          |
| `docs/product/CLARA-P18-RUNTIME-TRIAL-OPERATOR-CHECKLIST.md`             | Operator trial checklist.                          |
| `docs/product/CLARA-P18-RUNTIME-TRIAL-ADMIN-CHECKLIST.md`                | Admin trial checklist.                             |
| `docs/product/CLARA-P18-RUNTIME-TRIAL-ROADMAP.md`                        | P18 roadmap and P18-PR-02 handoff.                 |

## Historical Docs

Historical PR specs remain for traceability. They may describe earlier phase
intent and should not override active docs above.
