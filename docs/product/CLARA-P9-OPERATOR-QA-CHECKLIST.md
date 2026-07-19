---
project: "CLARA"
artifact: "P9 Operator QA Checklist"
status: "final"
owner: "CLARA Product Operations"
classification: "operator-qa-checklist"
---

# CLARA P9 Operator QA Checklist

## Dashboard Checks

- [ ] Analytics dashboard loads for an authenticated workspace user.
- [ ] KPI cards render.
- [ ] Core Operational Metrics render.
- [ ] CRM Workflow Metrics render.
- [ ] Reporting Filters panel is visible.
- [ ] Analytics Audit Privacy panel is visible.
- [ ] Filters work for allowed time window, channel, and category.
- [ ] Unauthorized operator filter is denied.
- [ ] No raw messages are shown.
- [ ] No raw provider payload is shown.
- [ ] No raw webhook payload is shown.
- [ ] No raw audit metadata is shown.
- [ ] No access token is shown.
- [ ] No refresh token is shown.
- [ ] No cookies or auth headers are shown.
- [ ] No export/download/drilldown exists.
- [ ] No CRM mutation control exists.
- [ ] No task creation control exists.
- [ ] No outbound send control exists.

## API Smoke Checks

- [ ] Unauthenticated analytics request returns safe 401.
- [ ] Unknown filter returns safe 400.
- [ ] Cross-workspace filter attempt returns safe 400.
- [ ] Agent/viewer operator filter attempt returns safe 403.
- [ ] Owner operator filter works where allowed.

## Extension Checks

- [ ] Extension remains active-conversation/manual-assisted only.
- [ ] Extension cannot access analytics internals.
- [ ] Extension cannot request report export.
- [ ] Extension cannot request customer-level drilldown.

## Signoff

P9 COMPLETE after this checklist and the validator pass. Next phase is P10
Enterprise Hardening / Compliance.
