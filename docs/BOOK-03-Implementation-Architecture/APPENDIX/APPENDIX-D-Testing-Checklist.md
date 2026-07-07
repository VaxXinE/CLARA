---
book: "Book III — Implementation Architecture"
appendix: "D"
title: "Testing Checklist"
version: "1.0.0"
status: "official"
owner: "Clara Quality Architecture Team"
last_updated: "2026-07-07"
classification: "quality-checklist"
---

# APPENDIX D — Testing Checklist

> *"Tests should protect trust, not just inflate coverage."*

---

# Purpose

This checklist helps Clara teams define required tests before merging production code.

---

# Unit Test Checklist

- [ ] Domain rules are tested.
- [ ] Value object validation is tested.
- [ ] Use case happy path is tested.
- [ ] Use case failure path is tested.
- [ ] Edge cases are tested.
- [ ] Tests are deterministic.
- [ ] Tests do not depend on external systems.
- [ ] Tests are fast enough for PR flow.

---

# Integration Test Checklist

- [ ] Repository behavior is tested.
- [ ] Database transaction behavior is tested.
- [ ] Migration behavior is tested where relevant.
- [ ] Queue/job behavior is tested.
- [ ] Cache behavior is tested.
- [ ] Object storage behavior is tested where relevant.
- [ ] External provider adapter is tested with fake/mocked provider.
- [ ] Test data is isolated.

---

# Contract Test Checklist

- [ ] Public API contract is tested.
- [ ] Cross-service API contract is tested.
- [ ] Event schema contract is tested.
- [ ] Webhook payload contract is tested.
- [ ] SDK contract is tested where relevant.
- [ ] Breaking changes are detected in CI.

---

# E2E Test Checklist

- [ ] Critical user journey is tested.
- [ ] Login/session path is tested.
- [ ] Main product flow is tested.
- [ ] Error state is tested.
- [ ] Permission-aware UI is tested where relevant.
- [ ] E2E test does not replace lower-level tests.
- [ ] Test avoids brittle timing assumptions.

---

# Security Test Checklist

- [ ] Unauthenticated request is denied.
- [ ] Unauthorized request is denied.
- [ ] Cross-tenant access is denied.
- [ ] Input validation abuse case is tested.
- [ ] Webhook signature failure is tested.
- [ ] AI tool authorization failure is tested.
- [ ] Sensitive output is not returned.
- [ ] Secrets are not logged.

---

# AI Evaluation Checklist

- [ ] Prompt behavior has evaluation dataset.
- [ ] RAG answer is checked for groundedness.
- [ ] Tool calling is checked for authorization.
- [ ] PII leakage is checked.
- [ ] Hallucination risk is checked.
- [ ] Model/provider changes run regression eval.
- [ ] Unsafe outputs are handled.

---

# Performance Test Checklist

- [ ] Critical API latency is tested.
- [ ] Database query performance is tested.
- [ ] Queue throughput is tested where relevant.
- [ ] AI latency and cost are measured.
- [ ] Large data operation is tested.
- [ ] Regression threshold exists.
- [ ] Performance tests run in appropriate pipeline.

---

# Release Test Checklist

- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] Contract tests pass.
- [ ] Security tests pass.
- [ ] Migration tests pass.
- [ ] AI evaluation passes where relevant.
- [ ] Smoke tests pass.
- [ ] Production verification plan exists.

---

# Bad Test Smells

Avoid tests that:

- Only test implementation details.
- Depend on execution order.
- Use real production data.
- Require real secrets.
- Are flaky and ignored.
- Only cover happy paths.
- Mock the actual risk being tested.
- Assert screenshots for unstable UI unnecessarily.

---

# AI Assistant Prompt

```text
Generate tests for this Clara feature.

Required:
- Happy path
- Validation failure
- Authorization failure
- Tenant isolation failure
- Relevant integration/contract test
- No production data
- No real secrets
- Deterministic fixtures
```

---

# Navigation

**Back:** README.md
