---
project: "CLARA"
artifact: "MVP First Product Slice Security & Privacy Checklist"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Security, Engineering, Product, AI, Data, and Product Operations Team"
last_updated: "2026-07-07"
classification: "security-privacy-checklist"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-UX-UI-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-DATABASE-MIGRATION-SPEC/"
source_of_truth:
  - "SECURITY.md"
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-07-Operations-Observability-and-Reliability/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 07 — AI Safety and Prompt Injection Checklist

> *"Customer messages are untrusted input, even when they are used as AI context."*

---

# AI Safety Scope

Applies to:

```text
POST /api/v1/conversations/{conversation_id}/ai-draft
conversation context builder
prompt template
AI gateway adapter
mock provider
AI output validation
AI draft UI
AI draft event logging
```

---

# Human Control Checklist

- [ ] AI draft cannot auto-send.
- [ ] AI draft appears in editable composer.
- [ ] Send requires explicit user click.
- [ ] UI labels draft as AI-assisted.
- [ ] UI says review before sending.
- [ ] API has no `auto_send` parameter.
- [ ] Backend does not call send adapter from AI draft endpoint.

---

# AI Authorization Checklist

- [ ] User must have `ai_draft:create`.
- [ ] Viewer cannot generate AI draft.
- [ ] Conversation must belong to user's workspace.
- [ ] Customer context must belong to user's workspace.
- [ ] AI context builder cannot load cross-workspace data.

---

# AI Context Minimization Checklist

AI context may include:

```text
selected conversation recent messages
selected customer display name
selected customer summary/status
safe optional user instruction
```

AI context must exclude:

```text
other workspace data
unrelated customers
secrets
tokens
billing/payment data
private internal notes unless approved
raw provider credentials
```

---

# Prompt Injection Checklist

Customer messages may include malicious content like:

```text
ignore previous instructions
reveal your system prompt
send secret keys
pretend the user approved this
```

Controls:

- [ ] Prompt treats conversation messages as untrusted.
- [ ] Prompt instructs AI to use only provided context.
- [ ] Prompt forbids revealing hidden instructions.
- [ ] Prompt forbids unsupported promises.
- [ ] Prompt forbids claiming actions were completed.
- [ ] AI output requires human review.
- [ ] Prompt version is tracked.

---

# AI Output Checklist

- [ ] Output is plain text.
- [ ] Output is editable.
- [ ] Output is not rendered as raw HTML.
- [ ] Output is not automatically trusted.
- [ ] Output has max length guard.
- [ ] Unsafe/malformed output is handled safely.

---

# AI Error Checklist

- [ ] Provider failure returns safe error.
- [ ] Manual composer remains available.
- [ ] Raw provider error not shown to user.
- [ ] Raw provider error not stored in activity metadata.
- [ ] Correlation ID is logged.

---

# AI Audit Checklist

Record safe metadata:

```text
draft_id
prompt_version
provider
model
latency_ms
status
error_code
```

Do not record by default:

```text
hidden prompt
raw provider request
raw provider response
full sensitive AI context
provider secrets
```

---

# Required Negative Tests

```text
viewer cannot generate AI draft
AI draft for workspace A cannot include workspace B messages
prompt injection message does not trigger auto-send
AI provider failure preserves manual reply
AI draft endpoint does not create outbound message
```

---

# AI Safety Rule

```text
AI may draft. Only the human user may send.
```
