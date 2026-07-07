---
book: "Book III — Implementation Architecture"
appendix: "H"
title: "AGENTS Codex Instructions"
version: "1.0.0"
status: "official"
owner: "Clara Developer Experience Team"
last_updated: "2026-07-07"
classification: "ai-coding-instructions"
---

# APPENDIX H — AGENTS / Codex Instructions

> *"AI assistants are powerful contributors, but Clara architecture remains the source of truth."*

---

# Purpose

This document provides copy-paste-ready instructions for `AGENTS.md` and module-specific AI coding assistant guidance.

Use it for:

- Codex.
- Cursor.
- Claude Code.
- Gemini CLI.
- Any AI coding assistant working inside Clara repo.

---

# Root AGENTS.md Template

```markdown
# AGENTS.md — Clara Repository Instructions

You are working inside Clara.

Clara is a production-oriented software platform. Follow architecture and security rules strictly.

## Required Reading

Before editing code, read:

- docs/BOOK-01-Clara-Foundation/README.md
- docs/BOOK-02-Master-Blueprint/README.md
- docs/BOOK-03-Implementation-Architecture/README.md
- The relevant Book III Part for the task
- The relevant module README

## Core Rules

- Preserve architecture boundaries.
- Keep controllers thin.
- Keep UI widgets focused on presentation.
- Put business rules in domain/application layers.
- Enforce authentication and authorization server-side.
- Enforce Organization and Workspace tenant scope.
- Validate all external input.
- Do not hard-code secrets.
- Do not log secrets, tokens, or sensitive data.
- Treat AI output as untrusted.
- Treat external provider payloads as untrusted.
- Add or update tests for every behavior change.
- Update docs when architecture or contracts change.

## Forbidden Patterns

Do not:

- Call AI providers directly from product modules.
- Call third-party providers directly from product modules.
- Query tenant data without tenant scope.
- Use frontend checks as final authorization.
- Store secrets in source code.
- Add production debug bypasses.
- Skip tests for security-sensitive changes.
- Invent undocumented architecture.

## Required Output For Feature Work

When implementing a feature, include:

- Code
- Tests
- Permission checks
- Tenant isolation checks
- Error handling
- Observability where relevant
- Documentation update when needed
```

---

# Backend AGENTS.md Template

```markdown
# backend/AGENTS.md

## Backend Rules

- Follow Clean Architecture.
- Use domain entities/value objects for business rules.
- Use use cases for application workflows.
- Use repositories through interfaces/ports.
- Validate DTOs at API boundaries.
- Enforce authorization in use cases.
- Enforce tenant scope in repositories and queries.
- Emit domain events for important state changes.
- Add audit logs for sensitive actions.
- Add unit and integration tests.

## Security Requirements

- No unscoped query.
- No hard-coded secret.
- No raw provider call from product module.
- No AI provider call outside AI Gateway.
- No sensitive data in logs.
```

---

# Frontend AGENTS.md Template

```markdown
# frontend/AGENTS.md

## Frontend Rules

- Keep UI components presentation-focused.
- Keep business logic in controllers/services.
- Use typed API clients.
- Handle loading, empty, error, and permission states.
- Do not store secrets in frontend.
- Do not treat frontend permission gates as final security.
- Encode/sanitize rendered user content.
- Add widget/state tests for meaningful behavior.

## Security Requirements

- Never expose privileged tokens.
- Never bypass backend authorization.
- Never trust local state for protected access.
```

---

# AI Feature Prompt Template

```text
You are implementing an Clara AI feature.

Read:
- Book III Part 03 AI Architecture
- Book III Part 07 Security Implementation
- Book III Part 08 Testing & Quality Architecture
- Related product module docs

Rules:
- Use AI Gateway.
- Do not call model provider directly.
- Scope context by permission and tenant.
- Validate tool arguments.
- Authorize tool execution.
- Add AI evaluation or regression tests.
- Audit sensitive AI/tool actions.
```

---

# Integration Feature Prompt Template

```text
You are implementing an Clara integration.

Read:
- Book III Part 05 Integration Architecture
- Book III Part 07 Security Implementation
- Book III Part 08 Testing & Quality Architecture

Rules:
- Use connector adapter.
- Do not call provider directly from product module.
- Store credentials in vault.
- Verify webhook signatures.
- Add idempotency.
- Add retry policy with backoff.
- Add telemetry.
- Add contract tests.
```

---

# Navigation

**Back:** README.md
