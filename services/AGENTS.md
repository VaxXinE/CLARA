# services/AGENTS.md

Instructions for AI coding assistants working inside `services/`.

---

## Required Reading

Before editing backend service code, read:

```text
AGENTS.md
SECURITY.md
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-DATABASE-MIGRATION-SPEC/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TEST-PLAN/
```

---

## Non-Negotiable Rules

- Authenticate before loading business data.
- Authorize server-side before action execution.
- Scope business queries by `organization_id` and `workspace_id`.
- Never query customer/conversation/message/draft/activity by ID alone.
- Validate all external input.
- Return safe errors.
- Do not expose stack traces, provider raw errors, or secrets.
- Do not log tokens, cookies, API keys, hidden prompts, or full sensitive messages by default.
- AI draft endpoint must never send a reply.
- Viewer cannot generate AI draft.
- Viewer cannot send reply.

---

## Test Requirement

Every high-risk change needs tests:

```text
auth test
authorization negative test
tenant isolation test
validation test
safe error test
```
