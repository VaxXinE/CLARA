# apps/AGENTS.md

Instructions for AI coding assistants working inside `apps/`.

---

## Required Reading

Before editing frontend code, read:

```text
AGENTS.md
SECURITY.md
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-UX-UI-SPEC/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TEST-PLAN/
```

---

## Rules

- Do not call AI providers directly from frontend.
- Do not call database directly from frontend.
- Do not store secrets in frontend code.
- Do not rely on frontend checks for final authorization.
- Render user/customer content safely.
- Do not use raw HTML rendering unless explicitly sanitized and reviewed.
- AI draft must be visibly labeled as draft.
- Send action must require explicit user click.
- Viewer role must not be able to draft/send from UI.

---

## Output Expectation

When changing UI, include:

```text
loading state
empty state
error state
permission state
basic test or manual QA note
```
