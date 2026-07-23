---
project: "CLARA"
artifact: "CLARA Documentation Index"
status: "active"
owner: "CLARA Product and Engineering"
classification: "documentation-index"
---

# CLARA Documentation Index

## Status

P1-P13 complete. DOCS-REFRESH-BEFORE-P12, UI-POLISH-BEFORE-P12,
PRE-P12-INTERACTION-ACTIVATION, P12 Beta / GA Release Readiness, and P13
Internal CRM Product Activation are complete.

P14 is current. P14 prepares CLARA for controlled internal team usage. P14-PR-01
is complete. P14-PR-02 is complete. P14-PR-03 is complete. P14-PR-04 is
complete. P14-PR-05 is complete. P14-PR-06 is current. P14 internal beta
rollout preparation is complete only after this PR validates. Internal beta
go-live is controlled internal usage only. Internal beta is not public SaaS
launch. Internal beta is not production deployment claim unless separately
executed. Internal usage feedback loop is for internal beta rollout. Feedback
triage is manual/local/repo-safe unless separately
approved. Feedback must not include secrets/tokens/cookies/auth headers/raw
provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data.
Feedback should minimize customer-sensitive data. Known limitations must be
reviewed before broader rollout. Known issues workflow is internal beta only. no
external support tool integration is activated. Internal
access QA is complete for internal beta rollout.
Owner/admin/operator/viewer access boundaries are reviewed. Viewer/read-only
mutation blocking is required. Operator CRM access is scoped. Admin/owner
elevated actions require workspace membership and proper role. Internal data
import remains workspace-scoped and safe. owner/admin/operator/viewer roles are
defined. internal use first is the rollout rule. billing/payment is deferred and
public SaaS launch is deferred. production deployment requires separate
explicit action. Provider/AI/outbound activation remains controlled. Backend
AuthContext and workspace membership remain source of truth. Client supplied
workspaceId is not authoritative. Client-supplied workspaceId is not
authoritative. Secrets/tokens/cookies/raw provider payload/raw webhook
payload/raw HTML/payment data must not be imported or exposed. internal user
roles are defined, internal data policy exists, and security checklist exists
before internal beta rollout continues.

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

| Document                                      | Purpose                                                           |
| --------------------------------------------- | ----------------------------------------------------------------- |
| `README.md`                                   | Root orientation, local commands, phase status, and active links. |
| `docs/product/CLARA-FINAL-ROADMAP.md`         | Active P1-P14 roadmap source.                                     |
| `docs/product/CLARA-P14-INTERNAL-BETA-ROADMAP.md` | Active P14 internal beta roadmap. |
| `docs/product/CLARA-P14-INTERNAL-BETA-ROLLOUT-SCOPE.md` | P14 internal beta rollout scope. |
| `docs/product/CLARA-P14-INTERNAL-ENVIRONMENT-PLAN.md` | P14 internal environment plan. |
| `docs/product/CLARA-P14-INTERNAL-USER-ROLE-PLAN.md` | P14 internal user role plan. |
| `docs/product/CLARA-P14-INTERNAL-DATA-POLICY.md` | P14 internal data policy. |
| `docs/product/CLARA-P14-INTERNAL-SECURITY-CHECKLIST.md` | P14 internal security checklist. |
| `docs/product/CLARA-P14-INTERNAL-USER-BOOTSTRAP-ROLE-SETUP.md` | P14 internal user bootstrap and role setup. |
| `docs/product/CLARA-P14-INTERNAL-ROLE-PERMISSION-MATRIX.md` | P14 internal role permission matrix. |
| `docs/product/CLARA-P14-INTERNAL-USER-ONBOARDING-CHECKLIST.md` | P14 internal user onboarding checklist. |
| `docs/product/CLARA-P14-INTERNAL-OWNER-ADMIN-RUNBOOK.md` | P14 internal owner/admin runbook. |
| `docs/product/CLARA-P14-INTERNAL-DATA-SEEDING-IMPORT-WORKFLOW.md` | P14 internal data seeding/import workflow. |
| `docs/product/CLARA-P14-INTERNAL-DATA-IMPORT-FORMAT.md` | P14 internal customer import format. |
| `docs/product/CLARA-P14-INTERNAL-DATA-VALIDATION-POLICY.md` | P14 internal data import validation policy. |
| `docs/product/CLARA-P14-INTERNAL-DATA-ROLLBACK-CLEANUP-RUNBOOK.md` | P14 internal data rollback and cleanup runbook. |
| `docs/product/CLARA-P14-INTERNAL-ACCESS-QA-CHECKLIST.md` | P14 internal access QA checklist. |
| `docs/product/CLARA-P14-INTERNAL-SECURITY-REVIEW.md` | P14 internal security review. |
| `docs/product/CLARA-P14-INTERNAL-ROLE-ACCESS-REVIEW.md` | P14 role access review. |
| `docs/product/CLARA-P14-WORKSPACE-ISOLATION-QA.md` | P14 workspace isolation QA. |
| `docs/product/CLARA-P14-INTERNAL-DATA-IMPORT-SECURITY-REVIEW.md` | P14 internal data import security review. |
| `docs/product/CLARA-P14-INTERNAL-USAGE-FEEDBACK-LOOP.md` | P14 internal usage feedback loop. |
| `docs/product/CLARA-P14-INTERNAL-FEEDBACK-TRIAGE-RUNBOOK.md` | P14 internal feedback triage runbook. |
| `docs/product/CLARA-P14-INTERNAL-FEEDBACK-SEVERITY-POLICY.md` | P14 internal feedback severity policy. |
| `docs/product/CLARA-P14-INTERNAL-BUG-REPORT-TEMPLATE.md` | P14 internal bug report template. |
| `docs/product/CLARA-P14-INTERNAL-USABILITY-FEEDBACK-TEMPLATE.md` | P14 internal usability feedback template. |
| `docs/product/CLARA-P14-INTERNAL-FEEDBACK-PRIVACY-BOUNDARY.md` | P14 feedback privacy boundary. |
| `docs/product/CLARA-P14-INTERNAL-KNOWN-ISSUES-WORKFLOW.md` | P14 internal known issues workflow. |
| `docs/product/CLARA-P14-FINAL-INTERNAL-BETA-GO-LIVE-RUNBOOK.md` | P14 final internal beta go-live runbook. |
| `docs/product/CLARA-P14-INTERNAL-BETA-GO-NO-GO-CHECKLIST.md` | P14 internal beta go/no-go checklist. |
| `docs/product/CLARA-P14-INTERNAL-BETA-OPERATOR-HANDOFF.md` | P14 internal beta operator handoff. |
| `docs/product/CLARA-P14-INTERNAL-BETA-ADMIN-HANDOFF.md` | P14 internal beta admin handoff. |
| `docs/product/CLARA-P14-INTERNAL-BETA-SUPPORT-HANDOFF.md` | P14 support/feedback handoff. |
| `docs/product/CLARA-P14-INTERNAL-BETA-ROLLBACK-HANDOFF.md` | P14 rollback/manual recovery handoff. |
| `docs/product/CLARA-P14-INTERNAL-BETA-KNOWN-LIMITATIONS-REVIEW.md` | P14 known limitations review. |
| `docs/product/CLARA-P14-INTERNAL-BETA-FINAL-SECURITY-REVIEW.md` | P14 final security review. |
| `docs/product/CLARA-P14-INTERNAL-BETA-FINAL-HANDOFF-SUMMARY.md` | P14 final handoff summary. |
| `docs/product/CLARA-P13-INTERNAL-CRM-ACTIVATION-ROADMAP.md` | Active P13 internal CRM roadmap. |
| `docs/product/CLARA-P13-CUSTOMER-CRUD-ACTIVATION.md` | P13 customer CRUD activation contract. |
| `docs/product/CLARA-P13-CUSTOMER-NOTES-ACTIVITY-TIMELINE.md` | P13 customer notes and safe activity timeline contract. |
| `docs/product/CLARA-P13-CUSTOMER-LIFECYCLE-OWNER-ASSIGNMENT.md` | P13 customer lifecycle status and owner assignment contract. |
| `docs/product/CLARA-P13-FOLLOW-UP-TASK-WORKFLOW.md` | P13 follow-up task workflow contract. |
| `docs/product/CLARA-P13-CONVERSATION-CUSTOMER-LINKING.md` | P13 conversation-to-customer linking contract. |
| `docs/product/CLARA-P13-INTERNAL-DASHBOARD-ANALYTICS-WIRING.md` | P13 internal dashboard analytics wiring contract. |
| `docs/product/CLARA-P13-INTERNAL-CRM-E2E-QA-RUNBOOK.md` | Final P13 internal CRM E2E QA runbook. |
| `docs/product/CLARA-P13-INTERNAL-CRM-HANDOFF-SUMMARY.md` | Final P13 internal CRM handoff summary. |
| `docs/product/CLARA-P13-BILLING-DEFERRED-POLICY.md` | P13 billing/payment deferred policy. |
| `docs/product/CLARA-MVP-GAP-REVIEW.md`        | Product gap and phase progress review.                            |
| `docs/product/CLARA-PHASE-CLOSURE-SUMMARY.md` | P1-P11 closure summary.                                           |

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

| Document                                           | Purpose                              |
| -------------------------------------------------- | ------------------------------------ |
| `docs/product/CLARA-RELEASE-READINESS-OVERVIEW.md` | P12 release readiness overview.      |
| `docs/product/CLARA-P12-IMPLEMENTATION-ROADMAP.md` | P12 compact roadmap.                 |
| `docs/product/CLARA-P12-HANDOFF-FROM-P11.md`       | Handoff from validated P11 baseline. |
| `docs/product/CLARA-P12-BETA-GA-SCOPE-RELEASE-CRITERIA.md` | Official Beta and GA scope gates. |
| `docs/product/CLARA-P12-BETA-ELIGIBILITY-CHECKLIST.md` | Beta eligibility checklist. |
| `docs/product/CLARA-P12-GA-RELEASE-CRITERIA.md` | GA release criteria. |
| `docs/product/CLARA-P12-RELEASE-CANDIDATE-READINESS-POLICY.md` | Release candidate readiness policy. |
| `docs/product/CLARA-P12-GO-NO-GO-CHECKLIST.md` | Go/no-go checklist. |
| `docs/product/CLARA-P12-LAUNCH-RISK-REGISTER.md` | Beta accepted risks and GA blockers. |
| `docs/product/CLARA-P12-KNOWN-LIMITATIONS.md` | P12 known limitations. |
| `docs/product/CLARA-P12-SUPPORT-FEEDBACK-READINESS-BOUNDARY.md` | Support and feedback boundary. |
| `docs/product/CLARA-P12-RELEASE-CANDIDATE-VALIDATION-MATRIX.md` | Release Candidate validation matrix. |
| `docs/product/CLARA-P12-SMOKE-TEST-MATRIX.md` | API, Dashboard, Extension, Auth, Workspace, Local Demo, Beta, Security, and Operational smoke matrix. |
| `docs/product/CLARA-P12-RC-VALIDATION-RUNBOOK.md` | Release Candidate validation runbook. |
| `docs/product/CLARA-P12-RC-EVIDENCE-CHECKLIST.md` | Release Candidate evidence checklist. |
| `docs/product/CLARA-P12-RC-PASS-FAIL-POLICY.md` | Release Candidate pass/fail policy. |
| `docs/product/CLARA-P12-LOCAL-DEMO-SMOKE-FLOW.md` | Local demo smoke flow. |
| `docs/product/CLARA-P12-BETA-SMOKE-FLOW.md` | Beta smoke flow. |
| `docs/product/CLARA-P12-SECURITY-SMOKE-CHECKLIST.md` | Security smoke checklist. |
| `docs/product/CLARA-P12-OPERATIONAL-SMOKE-CHECKLIST.md` | Operational smoke checklist. |
| `docs/product/CLARA-P12-PRODUCTION-DEPLOYMENT-CHECKLIST.md` | Production deployment readiness checklist. |
| `docs/product/CLARA-P12-ROLLBACK-DRILL-RUNBOOK.md` | Rollback drill runbook. |
| `docs/product/CLARA-P12-PRODUCTION-CONFIG-READINESS-CHECKLIST.md` | Production config readiness checklist. |
| `docs/product/CLARA-P12-SECRETS-ENV-READINESS-CHECKLIST.md` | Secrets/env readiness checklist. |
| `docs/product/CLARA-P12-DATABASE-MIGRATION-ROLLBACK-CHECKLIST.md` | Database migration and rollback checklist. |
| `docs/product/CLARA-P12-DNS-TLS-CORS-READINESS-CHECKLIST.md` | DNS, TLS, and CORS readiness checklist. |
| `docs/product/CLARA-P12-DEPLOYMENT-CUTOVER-GO-NO-GO-POLICY.md` | Deployment cutover go/no-go policy. |
| `docs/product/CLARA-P12-POST-DEPLOYMENT-SMOKE-CHECKLIST.md` | Post-deployment smoke checklist. |
| `docs/product/CLARA-P12-ROLLBACK-EVIDENCE-CHECKLIST.md` | Rollback evidence checklist. |
| `docs/product/CLARA-P12-BETA-FEEDBACK-WORKFLOW.md` | Beta feedback workflow. |
| `docs/product/CLARA-P12-BETA-FEEDBACK-PRIVACY-BOUNDARY.md` | Beta feedback privacy boundary. |
| `docs/product/CLARA-P12-SUPPORT-TRIAGE-RUNBOOK.md` | Support triage runbook. |
| `docs/product/CLARA-P12-BETA-SUPPORT-SLA-POLICY.md` | Beta support SLA policy. |
| `docs/product/CLARA-P12-KNOWN-ISSUES-WORKFLOW.md` | Known issues workflow. |
| `docs/product/CLARA-P12-BLOCKER-ISSUE-CLASSIFICATION.md` | Blocker issue classification. |
| `docs/product/CLARA-P12-BETA-INCIDENT-ESCALATION-POLICY.md` | Beta incident escalation policy. |
| `docs/product/CLARA-P12-USER-FEEDBACK-INTAKE-TEMPLATE.md` | User feedback intake template. |
| `docs/product/CLARA-P12-SUPPORT-EVIDENCE-CHECKLIST.md` | Support evidence checklist. |
| `docs/product/CLARA-P12-RELEASE-NOTES-BETA-CHANGELOG-POLICY.md` | Release notes and beta changelog policy. |
| `docs/product/CLARA-P12-GA-BLOCKER-REVIEW-CHECKLIST.md` | GA blocker review checklist. |
| `docs/product/CLARA-P12-FINAL-GA-AUDIT-RUNBOOK.md` | Final P12 GA audit runbook. |
| `docs/product/CLARA-P12-FINAL-RELEASE-READINESS-SUMMARY.md` | Final release readiness summary. |
| `docs/product/CLARA-P12-FINAL-GA-READINESS-CHECKLIST.md` | Final GA readiness checklist. |
| `docs/product/CLARA-P12-FINAL-SECURITY-BOUNDARY-REVIEW.md` | Final security boundary review. |
| `docs/product/CLARA-P12-FINAL-OPERATIONAL-READINESS-REVIEW.md` | Final operational readiness review. |
| `docs/product/CLARA-P12-FINAL-KNOWN-LIMITATIONS-REVIEW.md` | Final known limitations review. |
| `docs/product/CLARA-P12-FINAL-GO-NO-GO-DECISION-RECORD.md` | Final go/no-go decision record. |
| `docs/product/CLARA-P12-FINAL-OPERATOR-RUNBOOK.md` | Final release operator runbook. |
| `docs/product/CLARA-P12-FINAL-ADMIN-RUNBOOK.md` | Final admin runbook. |
| `docs/product/CLARA-P12-FINAL-SUPPORT-HANDOFF.md` | Final support handoff. |
| `docs/product/CLARA-P12-FINAL-ROLLBACK-INCIDENT-HANDOFF.md` | Final rollback and incident handoff. |
| `docs/product/CLARA-P12-FINAL-EVIDENCE-CHECKLIST.md` | Final evidence checklist. |
| `docs/product/CLARA-P12-POST-P12-HANDOFF.md` | Post-P12 handoff and remaining approval gates. |

## Historical Docs

Historical PR specs remain for traceability. They may describe earlier phase
intent and should not override active docs above.
