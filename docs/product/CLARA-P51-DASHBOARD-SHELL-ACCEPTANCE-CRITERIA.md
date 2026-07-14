---
project: "CLARA"
artifact: "P5.1 Dashboard Shell Acceptance Criteria"
status: "draft"
owner: "CLARA Product and Engineering"
classification: "acceptance-criteria"
---

# CLARA P5.1 Dashboard Shell Acceptance Criteria

Future shell PRs must pass these criteria before replacing the current simple dashboard workspace.

## Product Criteria

- Premium dark workspace shell with gold accent.
- Left sidebar with grouped navigation.
- Topbar with account and workspace context.
- Responsive mobile sidebar.
- Card-based workspace surfaces.
- Source/channel badges remain visible.
- Operator-first conversation workflow remains usable.
- Role-aware navigation labels are clear for owner, agent, and viewer.

## Security Criteria

- Backend authorization remains the source of truth.
- Viewer cannot access enabled write controls.
- No `dangerouslySetInnerHTML`.
- No frontend service role key material.
- No provider token/cookie display.
- No raw provider payload display.
- AI draft and send flows remain explicit human actions.

## Non-Goals

- No new routes in the contract PR.
- No FontAwesome dependency yet.
- No Tailwind dependency yet.
- No copied legacy backend/auth/provider behavior.
