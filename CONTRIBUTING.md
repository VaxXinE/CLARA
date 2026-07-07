# Contributing to ATHENA

> "Contributions should improve Athena without weakening its architecture, security, or maintainability."

---

# Contribution Types

You may contribute:

- Documentation.
- Architecture decisions.
- Diagrams.
- Templates.
- Examples.
- Implementation code.
- Tests.
- Security improvements.
- Operational playbooks.

---

# Before You Start

Read:

```text
README.md
AGENTS.md
docs/README.md
docs/BOOK-03-Implementation-Architecture/README.md
```

For documentation work, also read:

```text
docs/standards/
docs/templates/
```

---

# Branch Naming

Use clear branch names:

```text
docs/book-iii-repository-alignment
feature/customer-crm
fix/webhook-signature-validation
security/token-redaction
chore/dependency-update
```

---

# Pull Request Requirements

Every PR should include:

- Clear purpose.
- Scope.
- Related docs/tickets.
- Risk level.
- Tests or review checklist.
- Security impact if relevant.
- Rollback notes if relevant.

---

# Security Requirements

Never commit:

- Secrets.
- Passwords.
- API keys.
- OAuth tokens.
- Production credentials.
- Sensitive customer data.
- Unredacted personal data.

---

# AI-Generated Contributions

AI-generated content is allowed, but it must be reviewed as untrusted.

Check:

- Architecture alignment.
- Security controls.
- Tenant isolation.
- Tests.
- Documentation links.
- No fake references.
- No hard-coded secrets.

---

# Review

A reviewer may block a PR if it:

- Violates architecture boundaries.
- Weakens security.
- Bypasses tenant isolation.
- Adds undocumented long-term decisions.
- Lacks tests for critical behavior.
- Adds sensitive data.
