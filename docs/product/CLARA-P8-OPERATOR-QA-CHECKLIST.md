---
project: "CLARA"
artifact: "P8 Operator QA Checklist"
status: "final"
owner: "CLARA Product Operations"
classification: "qa-checklist"
---

# CLARA P8 Operator QA Checklist

## Positive Checks

- Customer profile intelligence renders as read-only.
- Customer timeline intelligence renders as read-only.
- Action proposal renders as review-only.
- Follow-up proposal renders as review-only.
- Owner assignment readiness renders as readiness-only.
- Lifecycle/status readiness renders as readiness-only.
- CRM activity audit readiness renders as audit-only.
- mutationExecuted=false is visible where action proposal metadata applies.
- actionExecuted=false is visible where proposal/readiness metadata applies.

## Negative Checks

- No Execute button.
- No Apply button.
- No Save button.
- No Create Task button.
- No Schedule Task button.
- No Assign Owner button.
- No Update Status button.
- No Update Lifecycle button.
- No Send Message button.
- No Write Note button.

## Security Checks

- no CRM mutation
- no task creation
- no owner assignment mutation
- no lifecycle mutation
- no status mutation
- no outbound send
- no real AI provider
- no raw provider payload
- no raw webhook payload
- no access token
- no refresh token
- no cookies

## Handoff

If operators ask for analytics, reporting, KPI, dashboards, or conversion
metrics, route that work to P9 Analytics / Reporting / KPI. P8 intentionally
does not implement analytics/KPI dashboards.
