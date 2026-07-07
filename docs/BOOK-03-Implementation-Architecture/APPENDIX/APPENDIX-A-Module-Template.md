---
book: "Book III — Implementation Architecture"
appendix: "A"
title: "Module Template"
version: "1.0.0"
status: "official"
owner: "Clara Architecture Team"
last_updated: "2026-07-07"
classification: "implementation-template"
---

# APPENDIX A — Module Template

> *"Every module should be understandable before it is editable."*

---

# Purpose

This template defines the minimum structure and documentation required for every Clara module.

Use it for:

- Product modules.
- Platform modules.
- Internal service modules.
- AI capability modules.
- Integration connector modules.

---

# Module README Template

```markdown
# <Module Name>

## Purpose

Explain what this module does and what user/system problem it solves.

## Scope

### In Scope

- ...

### Out of Scope

- ...

## Owner

- Domain Owner:
- Engineering Owner:
- Security Reviewer:
- Operational Owner:

## Architecture References

- Book III Part:
- Related ADR:
- Related Product Spec:
- Related API Spec:

## Domain Model

Describe entities, value objects, domain services, and domain events.

## Permissions

| Permission | Description | Risk |
|---|---|---|
| module:read | Read module data | medium |
| module:update | Update module data | high |

## Data Ownership

| Data | Source of Truth | Classification | Retention |
|---|---|---|---|
| ... | ... | ... | ... |

## APIs

| Method | Path | Purpose |
|---|---|---|
| GET | /v1/... | ... |

## Events

| Event | Producer | Consumer | Purpose |
|---|---|---|---|
| ... | ... | ... | ... |

## Audit Rules

| Action | Audit Required | Reason |
|---|---:|---|
| ... | yes | ... |

## Tests

- Unit:
- Integration:
- Contract:
- Security:
- E2E:

## Operations

- Dashboard:
- Alerts:
- Runbook:
- SLO:
```

---

# Recommended Folder Structure

```text
modules/
└── <module-name>/
    ├── README.md
    ├── domain/
    │   ├── entities/
    │   ├── value-objects/
    │   ├── services/
    │   └── events/
    ├── application/
    │   ├── use-cases/
    │   ├── commands/
    │   ├── queries/
    │   ├── dto/
    │   └── ports/
    ├── infrastructure/
    │   ├── persistence/
    │   ├── mappers/
    │   ├── projections/
    │   └── integrations/
    ├── presentation/
    │   ├── controllers/
    │   ├── routes/
    │   └── presenters/
    ├── frontend/
    │   ├── pages/
    │   ├── components/
    │   ├── controllers/
    │   └── repositories/
    └── tests/
        ├── unit/
        ├── integration/
        ├── contract/
        └── security/
```

---

# Minimum Module Checklist

- [ ] Purpose is documented.
- [ ] Scope is documented.
- [ ] Owner is defined.
- [ ] Domain model is defined.
- [ ] Permissions are defined.
- [ ] Data ownership is defined.
- [ ] API contract is defined.
- [ ] Events are defined where needed.
- [ ] Audit rules are defined.
- [ ] Tests are defined.
- [ ] Operational owner is defined.
- [ ] Runbook exists for critical module.

---

# Security Requirements

Every protected module must:

- Enforce authentication.
- Enforce authorization server-side.
- Enforce tenant scope server-side.
- Validate all external input.
- Avoid leaking sensitive data.
- Record audit logs for sensitive actions.
- Avoid direct access to secrets.
- Treat AI output and integration payloads as untrusted.

---

# AI Assistant Prompt

```text
Create or update this Clara module using the Module Template.

Rules:
- Follow Book III architecture.
- Keep domain logic out of controllers and UI widgets.
- Define permissions before protected actions.
- Enforce tenant scope server-side.
- Add unit and security tests.
- Update module README.
- Do not hard-code secrets.
```

---

# Navigation

**Back:** README.md
