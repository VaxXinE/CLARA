---
project: "CLARA"
artifact: "P9 Regression Acceptance Checklist"
status: "final"
owner: "CLARA Engineering, QA, Security, and Operations"
classification: "qa-checklist"
---

# CLARA P9 Regression Acceptance Checklist

## API Regression

- [ ] `p9-final-analytics-reporting-audit.test.ts` passes.
- [ ] `p9-final-analytics-auth-workspace-boundary.test.ts` passes.
- [ ] `p9-final-analytics-privacy-redaction.test.ts` passes.
- [ ] `p9-final-analytics-no-mutation-regression.test.ts` passes.
- [ ] `p9-final-analytics-no-export-drilldown-regression.test.ts` passes.

## Dashboard Regression

- [ ] `p9-final-analytics-dashboard-security.test.tsx` passes.
- [ ] `p9-final-analytics-dashboard-ui-regression.test.tsx` passes.
- [ ] `p9-final-analytics-dashboard-accessibility.test.tsx` passes.

## Extension Regression

- [ ] `p9-final-analytics-extension-boundary-regression.test.ts` passes.
- [ ] `p9-final-analytics-extension-security-regression.test.ts` passes.

## Final Acceptance

- [ ] Backend AuthContext remains source of truth.
- [ ] Analytics remains workspace-scoped.
- [ ] Analytics remains aggregate-first.
- [ ] Dashboard has no export/download/raw drilldown UI.
- [ ] Extension cannot access analytics internals.
- [ ] no raw customer messages
- [ ] no raw provider payload
- [ ] no raw webhook payload
- [ ] no raw audit metadata
- [ ] no access token
- [ ] no refresh token
- [ ] no cookies
- [ ] no CRM mutation
- [ ] no task creation
- [ ] no outbound send
- [ ] no report export
- [ ] no customer-level drilldown
- [ ] P9 COMPLETE after P9-PR-06 merge
- [ ] P10 Enterprise Hardening / Compliance handoff is documented
