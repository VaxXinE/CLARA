# AGENTS.md — Clara Repository Instructions

You are working inside Clara.

Clara is a production-oriented AI-native Business Operating System. Follow architecture, security, testing, documentation, operations, and product operations rules strictly.

---

# Required Reading Before Editing

Always read:

```text
README.md
SECURITY.md
docs/README.md
docs/CLARA-MASTER-DOCUMENTATION-INDEX/CLARA-MASTER-INDEX.md
docs/CLARA-MASTER-DOCUMENTATION-INDEX/CLARA-CODING-REFERENCE-MAP.md
```

Then read the relevant Book I–IX documentation for the task.

---

# Documentation Routing

```text
Foundation / vision        -> BOOK-01-The-Foundation
Platform blueprint         -> BOOK-02-Master-Blueprint
Implementation architecture -> BOOK-03-Implementation-Architecture
Product/domain spec        -> BOOK-04-Product-Domain-Specification
Engineering execution      -> BOOK-05-Engineering-Execution-Plan
Security/compliance        -> BOOK-06-Security-Governance-and-Compliance
Operations/reliability     -> BOOK-07-Operations-Observability-and-Reliability
Implementation/launch      -> BOOK-08-Implementation-Delivery-and-Production-Launch
Product ops/growth         -> BOOK-09-Product-Operations-Growth-and-Continuous-Improvement
```

---

# Core Rules

- Preserve architecture boundaries.
- Keep business logic out of controllers and UI widgets.
- Put business rules in domain/application layers.
- Enforce authentication and authorization server-side.
- Enforce Organization and Workspace tenant scope.
- Validate all external input.
- Do not hard-code secrets.
- Do not log secrets, tokens, cookies, credentials, customer data, or sensitive data.
- Treat AI output as untrusted.
- Treat external provider payloads as untrusted.
- Add or update tests for every behavior change.
- Update docs when architecture, contracts, product behavior, or operations change.

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
- Add AI actions without guardrails and rollback.
- Add analytics events containing raw sensitive data.
- Add billing/entitlement behavior without server-side enforcement.

---

# Required Output For Feature Work

When implementing a feature, include:

- Code.
- Tests.
- Permission checks.
- Tenant isolation checks.
- Error handling.
- Observability where relevant.
- Security impact notes.
- Documentation update when needed.

---

# Documentation Rules

- Follow `docs/standards/`.
- Use `docs/templates/`.
- Link related Book I–IX documents.
- Add ADR when the decision has long-term architecture consequences.
- Never include real secrets or customer data in docs.

---

# Security Review Rule

If a change touches authentication, authorization, tenant isolation, secrets, encryption, AI tool execution, external integrations, webhooks, customer data, production access, billing, or admin capability, request security review.
