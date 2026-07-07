---
book: "Book III — Implementation Architecture"
title: "Book III Implementation Guide"
version: "1.0.0"
status: "official"
owner: "Athena Architecture Team"
last_updated: "2026-07-07"
classification: "implementation-architecture"
---

# BOOK III — Implementation Guide

> *"Use this guide before turning architecture into code."*

---

# Standard Development Flow

For any new Athena feature:

```text
1. Identify product module.
2. Read relevant Product Implementation chapter.
3. Read relevant Backend or Frontend chapter.
4. Read Security Implementation chapter.
5. Read Data/AI/Integration chapter if feature touches those areas.
6. Define permissions.
7. Define data ownership.
8. Define API contract.
9. Implement use case.
10. Add tests.
11. Add observability.
12. Add docs.
13. Pass quality gates.
```

---

# Minimum Feature Checklist

Every production feature should include:

- Purpose.
- User flow.
- API contract.
- Permission design.
- Data model.
- Use case.
- Validation.
- Error handling.
- Audit rule if sensitive.
- Tests.
- Logging/metrics where relevant.
- Documentation.
- Rollback or disable strategy.

---

# Minimum Security Checklist

- Authentication enforced.
- Authorization server-side.
- Tenant scope enforced.
- Input validated.
- Output safe.
- Secrets not hard-coded.
- Sensitive data minimized.
- Audit logs included for sensitive action.
- AI/external outputs treated as untrusted.
- Tests cover denied access.

---

# Minimum Testing Checklist

- Unit test.
- Integration test where boundary exists.
- Contract test for API/event if public or cross-module.
- Security test for permission and tenant isolation.
- E2E test for critical user journey.
- Regression test for discovered bugs.

---

# Minimum Operations Checklist

- Service owner.
- Dashboard.
- Alert for critical path.
- Runbook.
- Rollback plan.
- Production verification step.

---

# AI Assistant Prompt Template

```text
You are working on Athena.

Before coding, use these references:
- docs/BOOK-03-Implementation-Architecture/README.md
- docs/BOOK-03-Implementation-Architecture/PART-XX-.../README.md
- relevant product module README
- AGENTS.md

Rules:
- Preserve architecture boundaries.
- Keep business logic out of controllers/widgets.
- Enforce authorization server-side.
- Enforce tenant scope.
- Validate input.
- Do not hard-code secrets.
- Add tests.
- Update docs if architecture changes.
```

---

# Navigation

**Back:** `./README.md`
