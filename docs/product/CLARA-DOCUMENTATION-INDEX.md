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
current, and P12-PR-01 Beta / GA Scope + Release Criteria is current work.

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

## Historical Docs

Historical PR specs remain for traceability. They may describe earlier phase
intent and should not override active docs above.
