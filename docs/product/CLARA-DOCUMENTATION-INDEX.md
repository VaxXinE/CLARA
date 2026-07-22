---
project: "CLARA"
artifact: "CLARA Documentation Index"
status: "active"
owner: "CLARA Product and Engineering"
classification: "documentation-index"
---

# CLARA Documentation Index

## Status

P1-P11 complete. DOCS-REFRESH-BEFORE-P12, UI-POLISH-BEFORE-P12, and
PRE-P12-INTERACTION-ACTIVATION complete. P12 Beta / GA Release Readiness is
current. P12-PR-01 Beta / GA Scope + Release Criteria is complete,
P12-PR-02 Release Candidate Validation + Smoke Test Matrix is complete, and
P12-PR-03 Production Deployment Checklist + Rollback Drill is complete.
P12-PR-04 Beta Feedback / Support / Known Issues Workflow is complete.
P12-PR-05 Final GA Audit / Runbook is current work.

CLARA is not GA yet. CLARA is not production deployed yet.

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
| `docs/product/CLARA-FINAL-ROADMAP.md`         | Active P1-P12 roadmap source.                                     |
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
