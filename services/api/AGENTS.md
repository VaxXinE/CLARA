# services/api/AGENTS.md

Instructions for AI coding assistants working inside `services/api/`.

---

## Required Reading

```text
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-DATABASE-MIGRATION-SPEC/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TEST-PLAN/
```

---

## Endpoint Rules

- Match API Spec.
- Use standard response/error envelope.
- Include correlation id.
- Validate request params/query/body.
- Authenticate user.
- Enforce permission checks.
- Apply organization/workspace scope.
- Never expose hidden AI prompts.
- Never expose provider raw errors.

---

## MVP P0 Endpoints

```text
GET /api/v1/me
GET /api/v1/conversations
GET /api/v1/conversations/{conversation_id}
GET /api/v1/customers/{customer_id}
POST /api/v1/conversations/{conversation_id}/ai-draft
POST /api/v1/conversations/{conversation_id}/reply
GET /api/v1/conversations/{conversation_id}/activity
```
