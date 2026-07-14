---
project: "CLARA"
artifact: "P5.1 UI Migration Security Rules"
status: "draft"
owner: "CLARA Security and Engineering"
classification: "security-rules"
---

# CLARA P5.1 UI Migration Security Rules

These rules apply to every future legacy UI migration PR.

## Required Rules

- Frontend role-aware navigation is UX only.
- Backend authorization is the source of truth.
- Do not trust client-provided `organization_id` or `workspace_id`.
- Do not expose frontend service role key material.
- Do not render user-generated content as HTML.
- Do not use `dangerouslySetInnerHTML`.
- Do not display raw provider payload data.
- Do not display provider cookie/token values.
- Do not put an OpenAI API key in frontend code or environment.
- AI drafts must stay visibly drafts and require human action.
- Send actions must remain explicit human send action clicks.
- Viewer/read-only role must not see enabled write controls.
- Provider mode must not invent bearer tokens.
- Demo/mock mode remains local only.

## Rejected Inputs

Legacy screenshots, DOM, logs, transcripts, and provider payload examples must be sanitized before they are used in docs or tests.
