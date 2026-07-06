# Athena Glossary Standard

> *"Shared language creates shared understanding."*

---

## Document Information

| Field | Value |
|------|-------|
| Document | Athena Glossary Standard |
| Version | 1.0.0 |
| Status | Official |
| Owner | Athena Core Team |
| Scope | Athena Engineering Library |
| Last Updated | 2026-07-06 |

---

# Purpose

This standard defines how glossaries are created, maintained, reviewed, and used across the Athena Engineering Library.

Athena is a large platform with many domains, services, AI concepts, data concepts, security terms, and product concepts.

Without a shared glossary, contributors may use different words for the same idea.

Different words create confusion.

Confusion creates inconsistent architecture.

The glossary exists to protect shared understanding.

---

# Scope

This standard applies to:

- Book-level glossaries.
- Global Athena glossary.
- Domain-specific glossaries.
- Architecture documents.
- Product documents.
- AI documents.
- Security documents.
- API specifications.
- Technical design documents.
- Contributor documentation.

---

# Core Principle

Use one official term for one official concept.

Do not introduce multiple names for the same thing unless the distinction is intentional and documented.

---

# Glossary Types

Athena supports three glossary levels.

## 1. Global Glossary

The global glossary defines terms used across the entire Athena Project.

Recommended location:

```text
docs/GLOSSARY.md
```

Examples:

- Organization
- Workspace
- Tenant
- User
- Role
- Permission
- Domain
- Service
- Event
- Workflow
- Audit Log
- AI Agent
- Context
- Knowledge
- Platform

---

## 2. Book Glossary

A book glossary defines terms specific to one book.

Recommended location:

```text
docs/BOOK-XX-Book-Name/GLOSSARY.md
```

Example:

```text
docs/BOOK-02-Master-Blueprint/GLOSSARY.md
```

Book glossaries may reference global glossary terms but should not redefine them inconsistently.

---

## 3. Domain Glossary

A domain glossary defines terms specific to a domain.

Recommended location:

```text
docs/BOOK-02-Master-Blueprint/PART-03-Business-Domains/glossary.md
```

Examples:

- Lead
- Deal
- Pipeline
- Ticket
- Conversation
- Invoice
- Inventory Item

---

# Glossary Entry Format

Each glossary entry should follow this structure:

```md
## Term

Short definition.

### Context

Where this term is used.

### Notes

Important clarification.

### Related Terms

- Related Term 1
- Related Term 2
```

For simple terms, only the definition is required.

---

# Minimal Entry Format

Use this for simple terms:

```md
## Workspace

An operational environment inside Athena where users, data, workflows, settings, and modules are organized.
```

---

# Full Entry Format

Use this for important or ambiguous terms:

```md
## Tenant

A logically isolated customer, organization, or environment using Athena.

### Context

Tenant boundaries are important for security, data isolation, billing, compliance, and access control.

### Notes

A tenant may contain one or more workspaces depending on product configuration.

### Related Terms

- Organization
- Workspace
- Tenant Isolation
```

---

# Definition Rules

Glossary definitions should be:

- Short.
- Clear.
- Specific.
- Stable.
- Business-aware.
- Technology-independent when possible.

Avoid definitions that depend on a specific implementation unless the term is implementation-specific.

---

# Good Definition

```md
## Audit Log

A trustworthy record of significant user, system, or automation actions within Athena.
```

---

# Poor Definition

```md
## Audit Log

A PostgreSQL table where logs are stored.
```

The poor definition is too implementation-specific for a global glossary.

---

# Term Naming Rules

Glossary terms should use Title Case.

## Correct

```md
## Organization

## Audit Log

## AI Agent

## Event Bus
```

## Incorrect

```md
## organization

## audit_log

## ai-agent

## eventbus
```

---

# Acronym Rules

Acronyms must be expanded on first definition.

Example:

```md
## ADR

Architecture Decision Record.

A document that records an important technical or architectural decision, including context, alternatives, trade-offs, and consequences.
```

Common acronyms may still be defined for clarity.

Examples:

- API
- AI
- IAM
- CRM
- SDK
- CLI
- ADR
- PRD
- TDD

---

# Synonym Policy

Avoid synonyms for official concepts.

If a synonym is common, document it as an alias.

Example:

```md
## Organization

The primary business entity using Athena.

### Aliases

- Company
- Account

### Notes

Use `Organization` in official Athena documentation.
Do not use `Company` or `Account` unless referring to external systems.
```

---

# Deprecated Terms

When replacing a term, keep the old term in the glossary and mark it deprecated.

Example:

```md
## Account

> **Deprecated**
>
> Use `Organization` instead.

Previously used to describe the primary business entity using Athena.
```

Do not silently remove commonly used old terms.

---

# Preferred Terms

Use these preferred terms across Athena.

| Preferred Term | Avoid |
|---------------|-------|
| Organization | Company, Account, Client |
| Workspace | Space, Environment |
| User | Member, Person |
| Role | User Type |
| Permission | Access Flag |
| Domain | Module Group |
| Service | Manager, Helper |
| Event | Signal, Trigger |
| Audit Log | History, Activity Log |
| Workflow | Process Flow |
| AI Agent | Bot |
| Context | Extra Data |
| Knowledge | Information |
| Platform | App Collection |

---

# When to Add a Term

Add a term to the glossary when:

- It appears in multiple documents.
- It has a specific Athena meaning.
- It may be misunderstood.
- It affects architecture.
- It affects security.
- It affects AI behavior.
- It affects product design.
- It affects data ownership.
- It affects implementation.

Do not add every ordinary word.

Glossaries should clarify important language, not become dictionaries.

---

# When Not to Add a Term

Do not add a term when:

- It is obvious from common English.
- It appears only once.
- It is temporary brainstorming language.
- It is implementation-specific and belongs in a technical document.
- It is vendor-specific and not part of Athena vocabulary.

---

# Glossary Ownership

Each glossary must have an owner.

Recommended ownership:

| Glossary | Owner |
|---------|-------|
| Global Glossary | Athena Core Team |
| Book Glossary | Book Owner |
| Domain Glossary | Domain Owner |
| Security Glossary | Security Team |
| AI Glossary | AI Team |

---

# Review Requirements

Glossary changes require review when:

- A new official term is introduced.
- A term definition changes.
- A term is deprecated.
- A synonym is rejected.
- A domain boundary is affected.
- A security or AI meaning is affected.

Major terminology changes may require an ADR.

---

# Glossary Versioning

Glossaries follow the Athena Documentation Versioning Standard.

Examples:

| Change | Version |
|-------|---------|
| Typo fix | PATCH |
| Add new term | MINOR |
| Redefine core term | MAJOR |
| Deprecate important term | MINOR or MAJOR depending on impact |

---

# Cross-Reference Rules

Documents should link to glossary terms when:

- The term is introduced for the first time.
- The term has a specialized Athena meaning.
- The term is security-sensitive.
- The term affects architecture.
- The term affects AI behavior.

Example:

```md
Athena treats [Workspace](../GLOSSARY.md#workspace) as an operational boundary for users, data, workflows, and permissions.
```

---

# AI-Readability

Glossaries are especially important for AI coding assistants.

To improve AI-readability:

- Use explicit definitions.
- Avoid vague synonyms.
- Keep terms stable.
- Explain relationships between terms.
- Include aliases when necessary.
- Mark deprecated terms clearly.

AI tools should be able to infer consistent meaning from the glossary.

---

# Security-Sensitive Terms

Security-sensitive terms must be defined carefully.

Examples:

- Tenant
- Workspace
- Permission
- Role
- Policy
- Authentication
- Authorization
- Secret
- Audit Log
- Personal Data
- Customer Data
- Restricted Data

Definitions should avoid ambiguity because ambiguity can lead to insecure implementations.

---

# AI-Sensitive Terms

AI-sensitive terms must also be defined carefully.

Examples:

- AI Agent
- Context
- Memory
- Knowledge
- Tool Calling
- Human Oversight
- Model Gateway
- AI Evaluation
- AI Governance

Definitions should clarify boundaries and avoid implying unrestricted AI autonomy.

---

# Glossary Maintenance Checklist

Before merging glossary changes, verify:

- [ ] Term uses Title Case.
- [ ] Definition is clear.
- [ ] Definition is not too implementation-specific.
- [ ] Related terms are linked when useful.
- [ ] Deprecated aliases are marked.
- [ ] Preferred term is obvious.
- [ ] No duplicate meaning already exists.
- [ ] Security impact is considered.
- [ ] AI impact is considered when relevant.
- [ ] Version is updated when required.
- [ ] Changelog is updated when required.

---

# Anti-Patterns

Avoid:

- Using multiple names for the same concept.
- Redefining global terms inside book glossaries.
- Removing old terms without deprecation.
- Defining terms with implementation details.
- Using acronyms without expansion.
- Creating overly long definitions.
- Adding ordinary words that do not need definition.
- Letting product, engineering, and security use different terms for the same concept.

---

# Example Glossary Structure

```text
docs/
├── GLOSSARY.md
│
├── BOOK-01-The-Foundation/
│   └── GLOSSARY.md
│
├── BOOK-02-Master-Blueprint/
│   └── GLOSSARY.md
│
└── BOOK-03-Architecture/
    └── GLOSSARY.md
```

---

# Final Rule

When terminology is unclear, architecture becomes unclear.

When architecture is unclear, implementation becomes inconsistent.

Athena protects clarity by protecting its vocabulary.

---

# Navigation

**Related Standards:**

- `ADS.md`
- `STYLE-GUIDE.md`
- `NAMING-CONVENTION.md`
- `CROSS-REFERENCE-STANDARD.md` (future)
- `VERSIONING-STANDARD.md`
