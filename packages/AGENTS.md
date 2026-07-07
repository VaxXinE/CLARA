# packages/AGENTS.md

Instructions for AI coding assistants working inside `packages/`.

---

## Rules

- Keep shared code small and well-named.
- Avoid business logic that hides authorization decisions.
- Do not add secrets.
- Prefer explicit types and validation schemas.
- Shared validation must match API Spec.
- UI package must render untrusted content safely.
