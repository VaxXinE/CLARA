# AGENTS.md — Clara Repository Instructions

You are working inside Clara.

Clara is a production-oriented AI-native Business Operating System. Follow architecture, security, testing, and documentation rules strictly.

---

# Required Reading

Before editing code or documentation, read:

```text
docs/README.md
docs/BOOK-01-The-Foundation/README.md
docs/BOOK-02-Master-Blueprint/README.md
docs/BOOK-03-Implementation-Architecture/README.md
```

Then read the relevant Book III Part for the task.

---

# Core Rules

- Preserve architecture boundaries.
- Keep business logic out of controllers and UI widgets.
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

---

# Forbidden Patterns

Do not:

- Call AI providers directly from product modules.
- Call third-party providers directly from product modules.
- Query tenant data without tenant scope.
- Use frontend checks as final authorization.
- Store secrets in source code.
- Add production debug bypasses.
- Skip tests for security-sensitive changes.
- Invent undocumented architecture.

---

# Required Output For Feature Work

When implementing a feature, include:

- Code.
- Tests.
- Permission checks.
- Tenant isolation checks.
- Error handling.
- Observability where relevant.
- Documentation update when needed.

---

# Documentation Rules

- Follow `docs/standards/`.
- Use `docs/templates/`.
- Link related Book I, Book II, or Book III documents.
- Add ADR when the decision has long-term architecture consequences.
- Never include real secrets or customer data in docs.

---

# Security Review Rule

If a change touches authentication, authorization, tenant isolation, secrets, encryption, AI tool execution, external integrations, or production access, request security review.
