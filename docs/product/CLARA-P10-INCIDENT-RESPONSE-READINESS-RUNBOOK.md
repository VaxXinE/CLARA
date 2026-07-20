---
project: "CLARA"
artifact: "P10 Incident Response Readiness Runbook"
status: "draft"
owner: "CLARA Security and Operations"
classification: "security-runbook"
---

# CLARA P10 Incident Response Readiness Runbook

## Severity Model

- `sev1`: active breach, data exposure, or production outage.
- `sev2`: serious production security or reliability degradation.
- `sev3`: contained issue with limited production impact.
- `sev4`: low-risk finding or readiness improvement.

## Triage Checklist

- Confirm the alert source and affected workspace scope.
- Preserve safe evidence summary.
- Assign an incident owner.
- Avoid logging raw customer messages, raw provider payload, raw webhook
  payload, raw audit metadata, tokens, cookies, auth headers, API keys, or
  secrets.

## Containment Checklist

- Prefer reversible containment first.
- Review tenant isolation before broad action.
- Do not execute legal hold automation from CLARA in this PR.
- Do not execute data deletion automation from CLARA in this PR.

## Communication Checklist

- Use approved internal incident channels.
- Share safe summaries only.
- Do not send provider tokens, raw evidence, or customer message bodies.

## Evidence Preservation Checklist

- Preserve correlation IDs, timestamps, operator notes, and safe audit event
  identifiers.
- Do not expose raw evidence through the dashboard or extension.

## Post-Incident Review

- Record cause, impact, containment, corrective actions, and follow-up owner.
- Link only safe evidence summary.

P10-PR-05 does not create incidents, execute escalation, send notifications,
run legal hold automation, or delete data.
