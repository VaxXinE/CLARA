---
project: "CLARA"
artifact: "P5.1 Final Accessibility Checklist"
status: "draft"
owner: "CLARA Product and Engineering"
classification: "accessibility-checklist"
---

# CLARA P5.1 Final Accessibility Checklist

## Landmarks

- Sidebar uses an `aside` landmark.
- Topbar uses a `banner` landmark.
- Workspace content uses a `main` landmark.
- Workspace navigation has an accessible navigation label.

## Keyboard And Focus

- Mobile navigation toggle is a real button.
- Mobile navigation toggle exposes `aria-expanded`.
- Planned route items and placeholder controls are disabled instead of clickable fake actions.
- Buttons have accessible names.

## Readable States

- Planned, disabled, read-only, draft, and status states are written as visible text.
- Status is not communicated by color only.
- Error and empty states render as text, not raw provider payloads.

## Responsive Baseline

- Sidebar can collapse behind the mobile menu.
- Workspace cards remain readable in single-column mobile layout.
- Placeholder panels remain read-only on all screen sizes.
