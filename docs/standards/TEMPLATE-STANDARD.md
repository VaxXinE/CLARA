# Athena Template Standard

> *"Consistency begins with a shared template."*

---

## Document Information

| Field | Value |
|---|---|
| Document | Athena Template Standard |
| Version | 1.0.0 |
| Status | Official |
| Owner | Athena Core Team |
| Scope | Athena Engineering Library |
| Last Updated | 2026-07-06 |

---

# Purpose

This standard defines how reusable documentation templates are designed, organized, maintained, and applied throughout the Athena Engineering Library.

Templates reduce cognitive load, improve consistency, and ensure every document starts with the same engineering quality baseline.

---

# Objectives

Every official template should:

- Follow ADS.
- Follow the Style Guide.
- Follow Naming Convention.
- Be easy to copy.
- Be easy to review.
- Be AI-readable.
- Be suitable for long-term maintenance.

---

# Template Categories

The official template library should include:

```text
docs/
└── templates/
    ├── chapter-template.md
    ├── part-template.md
    ├── domain-template.md
    ├── service-template.md
    ├── api-template.md
    ├── architecture-template.md
    ├── ai-template.md
    ├── security-template.md
    ├── prd-template.md
    ├── tdd-template.md
    ├── runbook-template.md
    ├── test-plan-template.md
    ├── adr-template.md
    └── changelog-template.md
```

---

# Required Frontmatter

All major templates should include a YAML frontmatter scaffold.

Example:

```yaml
---
title: ""
version: "0.1.0"
status: "draft"
owner: ""
last_updated: "YYYY-MM-DD"
classification: ""
---
```

---

# Required Core Sections

Unless intentionally specialized, templates should contain:

1. Purpose
2. Goals
3. Scope
4. Overview
5. Main Content
6. Dependencies
7. Security Considerations
8. Future Evolution
9. Key Takeaways
10. Related Documents
11. Navigation

---

# Template Design Rules

- Templates should contain placeholders, not project-specific content.
- Use TODO markers sparingly and consistently.
- Include guidance comments only where they add value.
- Keep templates concise.
- Avoid implementation-specific assumptions.

---

# Placeholder Convention

Use descriptive placeholders.

Good:

```text
<Team Name>
<Domain Name>
<Business Capability>
```

Avoid:

```text
XXX
TBD
asdf
```

---

# Versioning

Templates follow the Documentation Versioning Standard.

- Breaking template structure → MAJOR
- New optional section → MINOR
- Formatting correction → PATCH

---

# Review Checklist

Before publishing a template:

- [ ] ADS compliant.
- [ ] Style Guide compliant.
- [ ] Naming Convention compliant.
- [ ] Sections ordered consistently.
- [ ] Placeholders are meaningful.
- [ ] No project-specific examples remain.
- [ ] Security section exists where appropriate.
- [ ] Navigation included where appropriate.

---

# Anti-Patterns

Avoid:

- Templates with inconsistent headings.
- Hard-coded technology choices.
- Empty files with no guidance.
- Multiple templates solving the same purpose.
- Templates that contradict ADS.

---

# Future Template Library

Future reusable templates may include:

- Incident Report
- Postmortem
- Threat Model
- Data Contract
- Integration Specification
- UX Specification
- Wireframe Specification
- Migration Plan
- Release Plan

---

# Final Rule

Templates should remove repetitive work without removing engineering thinking.

Every template should encourage better documentation, not merely faster documentation.

---

# Navigation

Related Standards:

- ADS.md
- STYLE-GUIDE.md
- REVIEW-CHECKLIST.md
- VERSIONING-STANDARD.md
- ADR-STANDARD.md
