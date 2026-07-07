---
book: "Book III — Implementation Architecture"
appendix: "F"
title: "Code Review Checklist"
version: "1.0.0"
status: "official"
owner: "Clara Architecture Team"
last_updated: "2026-07-07"
classification: "code-review-checklist"
---

# APPENDIX F — Code Review Checklist

> *"Code review is where architecture becomes discipline."*

---

# Purpose

Use this checklist when reviewing Clara pull requests, especially when code is generated with AI assistance.

---

# Review Summary

Ask first:

1. What problem does this PR solve?
2. What module owns this change?
3. What architecture docs are relevant?
4. What is the risk level?
5. What would happen if this code fails in production?

---

# Architecture Review

- [ ] Correct module owns the code.
- [ ] Domain logic is not in controllers.
- [ ] Domain logic is not in UI widgets.
- [ ] Use case/application layer coordinates workflow.
- [ ] Repository interfaces are respected.
- [ ] External provider calls go through connectors.
- [ ] AI provider calls go through AI Gateway.
- [ ] Cross-module dependency is intentional.
- [ ] New architecture decision has ADR if needed.

---

# Security Review

- [ ] Authentication is enforced where needed.
- [ ] Authorization is server-side.
- [ ] Tenant scope is enforced.
- [ ] Input validation exists.
- [ ] Output is safe and minimal.
- [ ] Sensitive data is not logged.
- [ ] Secrets are not hard-coded.
- [ ] Webhook signatures are verified where relevant.
- [ ] AI tool execution is authorized.
- [ ] Tests cover denied access.

---

# Data Review

- [ ] Data ownership is clear.
- [ ] Migration is safe.
- [ ] Indexes match query patterns.
- [ ] List queries are paginated.
- [ ] Cache keys are tenant-scoped.
- [ ] Search/vector filters are tenant-scoped.
- [ ] Audit data is append-only where required.
- [ ] PII handling is reviewed.

---

# Testing Review

- [ ] Tests cover happy path.
- [ ] Tests cover failure path.
- [ ] Tests cover authorization failure.
- [ ] Tests cover tenant isolation.
- [ ] Tests are deterministic.
- [ ] Tests do not use real secrets.
- [ ] Tests do not use production data.
- [ ] Snapshot tests are not brittle.
- [ ] CI quality gates pass.

---

# Operations Review

- [ ] Logs are useful and safe.
- [ ] Metrics exist for critical path.
- [ ] Traces/correlation IDs are preserved.
- [ ] Runbook is updated where needed.
- [ ] Alert/dashboard is updated where needed.
- [ ] Rollback plan exists for risky change.
- [ ] Feature flag exists where appropriate.

---

# AI-Generated Code Review

If AI generated or heavily assisted this PR:

- [ ] AI output was reviewed line by line.
- [ ] AI did not invent undocumented architecture.
- [ ] AI did not bypass security checks.
- [ ] AI did not hard-code secrets.
- [ ] AI did not introduce hidden dependency.
- [ ] AI-generated tests actually test behavior.
- [ ] AI-generated code matches project naming and structure.
- [ ] AI-generated code has no fake TODO pretending to be complete.

---

# Merge Decision

```text
[ ] Approve
[ ] Request changes
[ ] Block for security review
[ ] Block for architecture review
[ ] Block for production readiness
```

---

# Navigation

**Back:** README.md
