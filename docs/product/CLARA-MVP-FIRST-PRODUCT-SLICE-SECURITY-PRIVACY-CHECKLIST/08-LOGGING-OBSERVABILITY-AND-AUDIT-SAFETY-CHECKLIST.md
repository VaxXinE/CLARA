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


# 08 — Logging, Observability, and Audit Safety Checklist

> *"Logs should help incident response without becoming a second data breach."*

---

# Logging Checklist

Logs may include:

```text
timestamp
level
service
route
method
status_code
duration_ms
correlation_id
user_id where safe
workspace_id where safe
event name
safe error code
```

Logs must not include:

```text
password
API key
JWT
session cookie
OAuth token
provider credential
full raw message body by default
full raw draft body by default
hidden AI prompt
raw provider response
```

---

# Correlation ID Checklist

- [ ] Request accepts `X-Correlation-Id`.
- [ ] Server generates ID if missing.
- [ ] Response includes `X-Correlation-Id`.
- [ ] Error body includes correlation ID.
- [ ] Logs include correlation ID.
- [ ] Activity/event traces can be correlated where useful.

---

# Activity Event Checklist

Record:

```text
ai_draft_generated
ai_draft_failed
reply_sent
reply_failed
conversation_status_changed
```

Each event should include:

```text
organization_id
workspace_id
conversation_id
actor_user_id if available
event_type
safe summary
safe metadata
created_at
```

---

# Activity Metadata Safety

Allowed examples:

```json
{
  "draft_id": "draft_123",
  "prompt_version": "mvp_reply_draft_v1",
  "provider": "mock",
  "latency_ms": 250
}
```

Forbidden:

```text
API key
session token
raw hidden prompt
raw provider error
full customer message
full AI context
```

---

# Observability Metrics Checklist

Track:

```text
http_request_count
http_request_latency_ms
http_error_count
authorization_failure_count
ai_draft_count
ai_draft_latency_ms
ai_draft_failure_count
reply_send_count
reply_send_failure_count
```

---

# Error Logging Checklist

- [ ] Validation errors logged at safe level.
- [ ] Auth failures logged without credentials.
- [ ] Authorization failures logged safely.
- [ ] AI provider failures logged with safe error code.
- [ ] Send failures logged with safe error code.
- [ ] Internal errors logged server-side only.

---

# Alerting Direction

MVP can start without full alerting, but design should support alerts for:

```text
AI draft failure spike
reply send failure spike
authorization failure spike
500 error spike
```

---

# Logging Rule

```text
A log line should be useful for debugging without exposing customer secrets or private content.
```
