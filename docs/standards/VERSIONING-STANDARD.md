# Clara Documentation Versioning Standard

> *"Versioning protects trust by making change visible, intentional, and traceable."*

---

## Document Information

| Field | Value |
|------|-------|
| Document | Clara Documentation Versioning Standard |
| Version | 1.0.0 |
| Status | Official |
| Owner | Clara Core Team |
| Scope | Clara Engineering Library |
| Last Updated | 2026-07-06 |

---

# Purpose

This standard defines how official Clara documents should be versioned.

Versioning helps contributors understand:

- Whether a document changed.
- How significant the change is.
- Whether meaning changed.
- Whether implementation may be affected.
- Whether an Architecture Decision Record (ADR) is needed.
- Whether the changelog must be updated.

Clara documentation is treated as an engineering artifact.

Therefore, changes to official documents must be traceable.

---

# Versioning Format

Clara documentation follows semantic versioning.

```text
MAJOR.MINOR.PATCH
```

Example:

```text
1.0.0
```

---

# Version Components

## MAJOR

Increment the MAJOR version when the document introduces breaking conceptual changes.

Examples:

- Changing a core principle.
- Replacing a mission statement.
- Redefining a domain boundary.
- Changing architecture direction.
- Replacing a security model.
- Changing AI governance principles.
- Removing or rewriting official guidance.

Example:

```text
1.4.2 → 2.0.0
```

---

## MINOR

Increment the MINOR version when the document adds meaningful new content without breaking the existing meaning.

Examples:

- Adding a new section.
- Adding a new supported workflow.
- Adding a new domain responsibility.
- Adding clarifications.
- Adding examples.
- Expanding glossary terms.
- Adding security considerations.
- Adding diagrams.

Example:

```text
1.4.2 → 1.5.0
```

---

## PATCH

Increment the PATCH version when the document changes without changing meaning.

Examples:

- Typo fixes.
- Formatting improvements.
- Broken link fixes.
- Heading corrections.
- Table formatting.
- Minor wording improvements.
- Grammar fixes.

Example:

```text
1.4.2 → 1.4.3
```

---

# Initial Version

New official documents should begin at:

```text
1.0.0
```

Draft documents may begin at:

```text
0.1.0
```

Use `0.x.x` while the document is not yet official.

---

# Draft Versioning

Draft documents may use:

```text
0.1.0
0.2.0
0.3.0
```

Use draft versions while the document is still evolving heavily.

When approved as official, promote to:

```text
1.0.0
```

---

# Status and Version Relationship

| Status | Version Pattern | Meaning |
|------|-----------------|---------|
| draft | 0.x.x | Work in progress |
| review | 0.x.x or 1.0.0-rc | Under review |
| official | 1.x.x+ | Approved reference |
| deprecated | Existing version | No longer recommended |
| archived | Existing version | Historical reference |

---

# Release Candidate Versions

For important documents, release candidate notation may be used during review.

```text
1.0.0-rc.1
1.0.0-rc.2
```

Use release candidates only when helpful.

Most documentation can move from draft to official without release candidate notation.

---

# When to Update Version

Update the document version when:

- The meaning changes.
- A new section is added.
- An official principle changes.
- A domain or service responsibility changes.
- A security requirement changes.
- An architecture boundary changes.
- A document becomes official.
- A document is deprecated.

Do not update the version for purely internal review comments that are not merged.

---

# When Not to Update Version

A version update may not be necessary when:

- The document is still an unmerged draft.
- The change is a comment-only review note.
- The change is a local experiment.
- The change is not committed to the official repository.

---

# Changelog Requirement

The changelog must be updated for:

- MAJOR changes.
- MINOR changes.
- Official publication.
- Deprecation.
- Archival.

PATCH changes may be grouped when they are small.

Example:

```md
## [1.1.0] - 2026-07-06

### Added

- Added security review requirements.

### Changed

- Clarified document lifecycle states.
```

---

# ADR Requirement

An Architecture Decision Record (ADR) should be created or updated when a documentation change affects:

- Architecture direction.
- Domain boundaries.
- Data ownership.
- Service responsibility.
- Security model.
- AI governance.
- Integration strategy.
- Deployment strategy.
- Long-term platform constraints.

Not every documentation version change requires an ADR.

But every major architectural change should be traceable.

---

# Versioning by Document Type

## Foundation Documents

Examples:

- Book I chapters.
- Mission.
- Values.
- Architecture Principles.
- Security Philosophy.

Rules:

- MAJOR changes should be rare.
- Changes require strong justification.
- Changelog required.
- ADR recommended for principle-impacting changes.

---

## Blueprint Documents

Examples:

- Book II chapters.
- Domain blueprints.
- Platform service blueprints.

Rules:

- MINOR changes are expected during product evolution.
- MAJOR changes indicate conceptual redesign.
- Dependencies should be reviewed when version changes.

---

## Architecture Documents

Examples:

- Book III documents.
- Service architecture.
- Data architecture.

Rules:

- MAJOR changes require ADR.
- MINOR changes require changelog.
- Security impact should be reviewed.

---

## API Documents

Rules:

- Breaking API contract change: MAJOR.
- New endpoint or optional field: MINOR.
- Description or example fix: PATCH.

---

## Runbooks

Rules:

- Dangerous operational change: MAJOR or MINOR depending on impact.
- New procedure: MINOR.
- Typo or command formatting: PATCH.

---

## Templates

Rules:

- Required section added or removed: MAJOR or MINOR.
- Optional section added: MINOR.
- Formatting fix: PATCH.

---

# Version Frontmatter

Every versioned document must include:

```yaml
version: "1.0.0"
status: "official"
last_updated: "2026-07-06"
```

Example:

```yaml
---
title: "Executive Overview"
version: "1.0.0"
status: "official"
owner: "Clara Core Team"
last_updated: "2026-07-06"
classification: "blueprint"
---
```

---

# Deprecation Versioning

When a document is deprecated, keep its existing version and update status:

```yaml
version: "1.3.0"
status: "deprecated"
```

Add a deprecation note:

```md
> **Deprecated**
>
> This document is replaced by `../new-document.md`.
> It remains available for historical reference.
```

Deprecation itself should be recorded in the changelog.

---

# Archived Versioning

Archived documents preserve their final version.

```yaml
version: "1.3.0"
status: "archived"
```

Archived documents should not receive new feature updates.

Only correction notes may be added when necessary.

---

# Version Comparison Examples

## Example 1 — Typo Fix

Change:

```text
Correct spelling mistakes.
```

Version:

```text
1.0.0 → 1.0.1
```

---

## Example 2 — Add Diagram

Change:

```text
Add a Mermaid diagram explaining the domain flow.
```

Version:

```text
1.0.0 → 1.1.0
```

---

## Example 3 — Change Domain Ownership

Change:

```text
Move customer ownership from CRM Domain to Customer Domain.
```

Version:

```text
1.2.0 → 2.0.0
```

ADR:

```text
Required
```

---

## Example 4 — Add Security Section

Change:

```text
Add explicit authorization and audit requirements.
```

Version:

```text
1.0.0 → 1.1.0
```

Security review:

```text
Required
```

---

# Version Review Checklist

Before merging a versioned document change, verify:

- [ ] Version number is updated correctly.
- [ ] `last_updated` is updated.
- [ ] Status is correct.
- [ ] Changelog is updated when required.
- [ ] ADR is added when required.
- [ ] Related documents are checked.
- [ ] Navigation is not broken.
- [ ] Security impact is reviewed when relevant.
- [ ] The change type matches MAJOR, MINOR, or PATCH rules.

---

# Anti-Patterns

Avoid:

- Updating content without updating version.
- Using arbitrary versions like `vFinal`.
- Using dates as the only version.
- Using `latest` as a version.
- Changing official principles without changelog.
- Making architecture changes without ADR.
- Deprecating documents without replacement guidance.
- Keeping outdated documents marked as official.

---

# Final Rule

Version numbers are not decoration.

They communicate trust.

A reader should be able to understand the significance of a change by looking at the version history.

---

# Navigation

**Related Standards:**

- `ADS.md`
- `DOCUMENT-LIFECYCLE.md`
- `CHANGELOG-STANDARD.md` (future)
- `ADR-STANDARD.md` (future)
