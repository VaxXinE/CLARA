# services/ai-gateway/AGENTS.md

Instructions for AI gateway work.

---

## Required Reading

```text
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/06-AI-DRAFT-DESIGN.md
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/07-AI-DRAFT-ENDPOINTS.md
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/07-AI-SAFETY-AND-PROMPT-INJECTION-CHECKLIST.md
```

---

## Rules

- Do not expose hidden prompts.
- Do not log raw prompts by default.
- Do not include secrets in AI context.
- Treat customer messages as untrusted input.
- Support mock provider for local/CI.
- Map provider failures to safe errors.
- Do not call send adapter from AI gateway.
