---
book: "Book V — Engineering Execution Plan"
section: "Master Index"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan-index"
project: "CLARA"
---

# BOOK-05 AI and Integration Governance Map

This file maps governance controls for CLARA AI and integrations.

---

# AI Governance Summary

CLARA AI must follow:

```text
AI Gateway only
No direct provider calls from UI/product modules
AI feature permission
Underlying resource permission
Scoped context assembly
Published/eligible knowledge only by default
Prompt template versioning
Human review for customer-visible output
Audit metadata
Feedback/evaluation
Rate limit and cost control
Fallback behavior
```

---

# AI Risk Map

| Risk | Control |
|---|---|
| Cross-workspace context leak | Context builder permission and scope checks |
| Prompt injection | Separate trusted instructions from untrusted content |
| Unsafe customer reply | Human review before send |
| Hallucinated answer | RAG with eligible knowledge and review |
| Hidden prompt exposure | Never return hidden prompts to UI |
| Cost spike | Usage counters, quotas, rate limits |
| Quality regression | Evaluation scenarios and prompt versioning |

---

# Integration Governance Summary

CLARA integrations must follow:

```text
Integration Gateway only
Provider adapter pattern
No raw provider payload trusted directly
Signature/API key validation
Schema validation
Idempotency
Credential metadata only
Secret references
Retry/dead-letter strategy
Health/status visibility
Audit for sensitive connector actions
```

---

# Integration Risk Map

| Risk | Control |
|---|---|
| Fake webhook | Signature/API key validation |
| Duplicate message | External reference + idempotency key |
| Credential leak | Secret manager/reference pattern |
| Provider outage | Retry/dead-letter and health status |
| Malformed payload | Schema validation |
| Cross-workspace mapping | Scoped connector/account mapping |
| SSRF outbound webhook | URL allow/block validation |

---

# Shared Governance Rule

AI and integrations must never bypass:

```text
authentication
authorization
organization scope
workspace scope
audit
rate limits
safe logging
```
