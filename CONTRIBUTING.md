# Contributing to Clara

> "Contributions should improve Clara without weakening its architecture, security, maintainability, or product trust."

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
- Product operations playbooks.

---

# Before You Start

Read:

```text
README.md
AGENTS.md
SECURITY.md
docs/README.md
docs/CLARA-MASTER-DOCUMENTATION-INDEX/CLARA-MASTER-INDEX.md
```

For documentation work, also read:

```text
docs/standards/
docs/templates/
docs/AGENTS.md
```

---

# Branch Naming

Use clear branch names:

```text
docs/master-index-ingestion
docs/book-ix-product-operations
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
- Documentation update if behavior changes.

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

# Documentation Requirements

Every official document should include:

```text
title
version
status
owner
last_updated
classification
```

Use Mermaid diagrams where useful.

Update navigation links when adding books/parts.

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
- No invented product decisions.

---

# Review

A reviewer may block a PR if it:

- Violates architecture boundaries.
- Weakens security.
- Bypasses tenant isolation.
- Adds undocumented long-term decisions.
- Lacks tests for critical behavior.
- Adds sensitive data.
- Creates product operations drift.
