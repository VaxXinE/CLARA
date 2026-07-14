---
project: "CLARA"
artifact: "P5.1 Final Security Checklist"
status: "draft"
owner: "CLARA Security and Engineering"
classification: "security-checklist"
---

# CLARA P5.1 Final Security Checklist

## Required Guardrails

- Backend authorization remains the source of truth.
- Frontend role-aware navigation is UX only.
- Viewer/read-only users do not get enabled write controls.
- AI drafts remain visibly drafts and require human review.
- Reply send remains an explicit human click.

## Forbidden UI Exposure

- No frontend secrets.
- No service role key.
- No provider access token or refresh token display.
- No cookies or Authorization header display.
- No raw provider payload display.
- No raw provider error body display.
- No `dangerouslySetInnerHTML`.

## Placeholder Boundaries

These remain non-mutating placeholders after P5.1:

- Follow-up and action center.
- Notifications and alert center.
- Approvals and chat review.
- Manager insights.
- Knowledge.
- KPI.
- Access control and administration.

Real mutation flows require backend authorization, audit, tests, and security review in later PRs.
