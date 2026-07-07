---
book: "Book III — Implementation Architecture"
appendix: "B"
title: "API Checklist"
version: "1.0.0"
status: "official"
owner: "Athena Architecture Team"
last_updated: "2026-07-07"
classification: "implementation-checklist"
---

# APPENDIX B — API Checklist

> *"An API is a trust boundary, not just a function call over HTTP."*

---

# Purpose

This checklist helps engineers design, implement, and review Athena APIs safely.

Use it for:

- REST endpoints.
- GraphQL resolvers.
- Webhooks.
- Internal service APIs.
- SDK-facing APIs.
- AI tool APIs.

---

# API Design Checklist

- [ ] API has a clear purpose.
- [ ] API belongs to the correct module.
- [ ] API path/resource naming is consistent.
- [ ] API version is defined.
- [ ] Request DTO is explicit.
- [ ] Response DTO is explicit.
- [ ] Error format is consistent.
- [ ] Pagination exists for list endpoints.
- [ ] Filtering and sorting are allowlisted.
- [ ] API does not expose internal domain objects directly.

---

# Security Checklist

- [ ] Authentication is required where needed.
- [ ] Authorization is enforced server-side.
- [ ] Organization scope is enforced.
- [ ] Workspace scope is enforced where applicable.
- [ ] Resource ownership is checked.
- [ ] Input is validated.
- [ ] Output is safe and minimal.
- [ ] Sensitive fields are redacted.
- [ ] Rate limit is considered.
- [ ] Audit log is recorded for sensitive actions.
- [ ] API does not trust client-provided tenant IDs blindly.

---

# Validation Checklist

- [ ] Body schema is validated.
- [ ] Query params are validated.
- [ ] Path params are validated.
- [ ] Header values are validated where relevant.
- [ ] File uploads validate MIME type, size, and extension.
- [ ] Unknown fields are rejected or ignored intentionally.
- [ ] IDs use expected format.
- [ ] Dates/timezones are normalized.
- [ ] Enum values are allowlisted.

---

# Error Handling Checklist

- [ ] 400 for invalid input.
- [ ] 401 for unauthenticated request.
- [ ] 403 for unauthorized request.
- [ ] 404 for missing inaccessible resource where appropriate.
- [ ] 409 for conflict.
- [ ] 422 for semantic validation error if used.
- [ ] 429 for rate limit.
- [ ] 500 only for unexpected server error.
- [ ] Error response does not leak stack trace.
- [ ] Error response includes correlation ID.

---

# Performance Checklist

- [ ] List endpoints are paginated.
- [ ] Maximum limit is enforced.
- [ ] Database query is indexed.
- [ ] N+1 query risk is checked.
- [ ] Large exports are async.
- [ ] Expensive operations use background jobs.
- [ ] Caching is considered but not used as source of truth.
- [ ] Timeout exists for external calls.
- [ ] API latency metric exists for critical endpoint.

---

# Observability Checklist

- [ ] Structured logs exist.
- [ ] Correlation ID is propagated.
- [ ] Request duration is measured.
- [ ] Error rate is measured.
- [ ] Critical actions have audit logs.
- [ ] External dependency calls are traced.
- [ ] Sensitive data is not logged.
- [ ] Dashboard exists for critical API.

---

# Testing Checklist

- [ ] Success case test.
- [ ] Validation failure test.
- [ ] Authentication failure test.
- [ ] Authorization failure test.
- [ ] Tenant isolation test.
- [ ] Not found test.
- [ ] Conflict test where relevant.
- [ ] Rate limit test where relevant.
- [ ] Contract test for public/cross-service API.
- [ ] E2E test for critical workflow.

---

# API Review Questions

Ask during review:

1. What module owns this API?
2. Who can call this API?
3. What resource does it affect?
4. How is tenant scope enforced?
5. What data can leak if this is wrong?
6. What happens on duplicate request?
7. Is this operation idempotent where needed?
8. Can this endpoint be abused?
9. What logs/metrics/audits exist?
10. How do we test denied access?

---

# AI Assistant Prompt

```text
Implement this Athena API using the API Checklist.

Rules:
- Use explicit DTO validation.
- Enforce authentication and authorization.
- Enforce Organization/Workspace scope.
- Return consistent errors.
- Add success, validation, authz, and tenant isolation tests.
- Do not expose domain entities directly.
```

---

# Navigation

**Back:** README.md
