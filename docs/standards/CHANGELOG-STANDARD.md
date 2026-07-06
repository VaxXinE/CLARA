# Athena Changelog Standard

> *"Every meaningful change deserves a history."*

---

## Document Information

| Field | Value |
|---|---|
| Document | Athena Changelog Standard |
| Version | 1.0.0 |
| Status | Official |
| Owner | Athena Core Team |
| Scope | Athena Engineering Library |
| Last Updated | 2026-07-06 |

---

# Purpose

This standard defines how changes are recorded across Athena documentation, architecture, standards, templates, and engineering artifacts.

A changelog provides a trustworthy history of evolution.

It helps contributors understand:

- What changed.
- Why it changed.
- When it changed.
- Who approved the change.
- Whether additional actions are required.

---

# Core Principles

- Every meaningful change should be traceable.
- Changelogs describe user-visible or contributor-visible changes.
- Keep entries concise and factual.
- Do not use the changelog as a commit log.
- Link to ADRs or related documents when appropriate.

---

# Scope

Apply this standard to:

- Books
- Standards
- Templates
- PRDs
- TDDs
- Architecture documents
- API specifications
- Runbooks
- ADRs
- Major repository documentation

---

# Changelog Location

Preferred locations:

```text
CHANGELOG.md
```

Repository-wide:

```text
docs/CHANGELOG.md
```

Book-specific:

```text
docs/BOOK-02-Master-Blueprint/CHANGELOG.md
```

---

# Version Relationship

Changelog entries must align with the document version.

Example:

```text
Version 1.2.0
↓

CHANGELOG entry for 1.2.0
```

See `VERSIONING-STANDARD.md`.

---

# Standard Format

```md
# Changelog

All notable changes to this document will be recorded here.

The format follows the Athena Changelog Standard.

## [1.2.0] - YYYY-MM-DD

### Added

-

### Changed

-

### Fixed

-

### Deprecated

-

### Removed

-

### Security

-
```

---

# Change Categories

## Added

New content or capabilities.

Examples:

- New chapter
- New section
- New diagram
- New glossary term

---

## Changed

Meaningful updates without removal.

Examples:

- Expanded guidance
- Updated architecture
- Refined workflow
- Improved explanation

---

## Fixed

Corrections.

Examples:

- Broken links
- Typos
- Incorrect examples
- Formatting issues

---

## Deprecated

Items that remain available but should no longer be used.

Include replacement guidance.

---

## Removed

Content intentionally deleted.

Explain why when relevant.

---

## Security

Security-related improvements.

Examples:

- Added authorization guidance.
- Updated threat assumptions.
- Improved secrets management guidance.

---

# Writing Rules

Good entry:

```md
### Added

- Added AI governance review checklist.
```

Avoid:

```md
- Updated stuff.
- Misc fixes.
- Improvements.
```

Entries should be understandable months later.

---

# ADR References

When a change is driven by an architecture decision:

```md
### Changed

- Updated event architecture following ADR-0007.
```

---

# Documentation Lifecycle

Update the changelog when:

- Publishing an official document.
- Increasing MINOR version.
- Increasing MAJOR version.
- Deprecating a document.
- Archiving a document.

PATCH updates may be grouped.

---

# Review Checklist

Before merging:

- [ ] Version matches changelog.
- [ ] Date is correct.
- [ ] Categories used correctly.
- [ ] Entries are concise.
- [ ] ADR referenced when needed.
- [ ] Security changes recorded.
- [ ] Deprecated items include replacement guidance.

---

# Anti-Patterns

Avoid:

- Copying commit messages.
- Listing internal review comments.
- Writing vague entries.
- Forgetting version numbers.
- Mixing unrelated changes under one entry.
- Omitting breaking conceptual changes.

---

# Example

```md
## [2.0.0] - 2026-08-01

### Changed

- Redesigned Organization Layer blueprint.

### Added

- New AI governance section.

### Deprecated

- Legacy tenant terminology.

### Security

- Added mandatory authorization review guidance.
```

---

# Final Rule

A changelog is a communication tool.

Readers should understand the evolution of Athena without reading every commit.

---

# Navigation

Related Standards:

- ADS.md
- VERSIONING-STANDARD.md
- DOCUMENT-LIFECYCLE.md
- REVIEW-CHECKLIST.md
- ADR-STANDARD.md
