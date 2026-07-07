# Clara Global Glossary

> *"Shared language creates shared understanding."*

---

## Purpose

The **Clara Global Glossary** is the single source of truth for terminology used across the Clara Engineering Library.

Every official document—including Books, ADRs, PRDs, TDDs, API Specifications, Security Specifications, AI Specifications, and Runbooks—should reference these definitions instead of redefining terms.

---

# Objectives

- Maintain consistent terminology.
- Eliminate duplicate definitions.
- Improve communication between engineering, product, security, AI, and operations.
- Improve AI assistant understanding.
- Reduce documentation drift.

---

# Structure

```text
docs/
└── glossary/
    ├── README.md
    ├── Organization.md
    ├── Workspace.md
    ├── User.md
    ├── Role.md
    ├── Permission.md
    ├── Domain.md
    ├── Service.md
    ├── Event.md
    ├── Workflow.md
    ├── Context.md
    ├── Knowledge.md
    ├── Memory.md
    ├── Agent.md
    ├── Conversation.md
    ├── Customer.md
    ├── Lead.md
    ├── Ticket.md
    ├── Plugin.md
    ├── Model.md
    └── ...
```

---

# Glossary Categories

## Business

- Organization
- Customer
- Lead
- Ticket
- Conversation
- Workspace

## Architecture

- Domain
- Service
- Event
- Workflow
- Adapter
- Gateway

## Security

- Authentication
- Authorization
- Permission
- Role
- Secret
- Audit Log

## AI

- Agent
- Context
- Memory
- Knowledge
- Prompt
- Tool Calling
- Model Gateway
- Evaluation

## Platform

- Plugin
- Integration
- Queue
- Scheduler
- Storage
- Event Bus

---

# Entry Format

Each glossary entry should follow this structure:

```md
# <Term>

## Definition

Short and precise definition.

## Purpose

Why the concept exists.

## Usage

Where it is used in Clara.

## Related Terms

- Term A
- Term B

## References

- Book II
- ADR-0001
```

---

# Naming Rules

- One official term for one concept.
- Use Title Case for filenames.
- Avoid synonyms unless documented as aliases.
- Deprecated terms must remain documented and point to replacements.

---

# Governance

Changes to glossary entries require:

- Documentation review
- Architecture review (if applicable)
- Security review (if applicable)
- AI review (if applicable)

Refer to:

- `docs/standards/GLOSSARY-STANDARD.md`
- `docs/standards/REVIEW-CHECKLIST.md`

---

# Contribution Workflow

1. Identify a new shared concept.
2. Check if it already exists.
3. Create or update the glossary entry.
4. Link related documents.
5. Submit for review.

---

# Future Expansion

The glossary is expected to grow alongside Clara and become the canonical vocabulary for all books and engineering artifacts.

---

# Navigation

**Related Documents**

- ../standards/GLOSSARY-STANDARD.md
- ../standards/STYLE-GUIDE.md
- ../standards/NAMING-CONVENTION.md
- ../templates/chapter-template.md
