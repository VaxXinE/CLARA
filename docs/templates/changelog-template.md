# Clara Changelog Template

> Use this template to record meaningful changes to an Clara document, book, service, product, or release.

```yaml
---
title: "<Changelog Title>"
version: "0.1.0"
status: "draft"
owner: "<Owner>"
classification: "changelog"
last_updated: "YYYY-MM-DD"
related_document: ""
---
```

# <Changelog Title>

All notable changes to this document, module, service, or release should be recorded here.

This changelog follows the Clara Changelog Standard.

---

## Versioning Policy

This changelog follows semantic versioning:

```text
MAJOR.MINOR.PATCH
```

- **MAJOR**: Breaking conceptual, architectural, API, or behavioral changes.
- **MINOR**: Meaningful additions that do not break existing meaning or behavior.
- **PATCH**: Corrections, formatting fixes, typo fixes, and non-semantic changes.

---

## Changelog Categories

Use the following categories where applicable:

```md
### Added

### Changed

### Fixed

### Deprecated

### Removed

### Security
```

---

## [Unreleased]

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

---

## [0.1.0] - YYYY-MM-DD

### Added

- Initial changelog created.

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

---

## Entry Writing Rules

Good changelog entries are concise, factual, and useful.

### Good

```md
- Added authorization requirements for customer record access.
- Updated roadmap phases to include AI evaluation milestone.
- Deprecated legacy `Account` terminology in favor of `Organization`.
```

### Avoid

```md
- Updated stuff.
- Fixed things.
- Misc changes.
```

---

## ADR References

When a change is related to an Architecture Decision Record, reference it.

Example:

```md
### Changed

- Updated event processing strategy based on ADR-0007.
```

---

## Security Entries

Security changes should be placed under `Security`.

Example:

```md
### Security

- Added webhook signature verification requirement.
- Updated secrets handling guidance for external integrations.
```

---

## Deprecation Entries

Deprecation entries should include replacement guidance.

Example:

```md
### Deprecated

- Deprecated `Account` terminology. Use `Organization` instead.
```

---

## Removal Entries

Removal entries should explain impact where relevant.

Example:

```md
### Removed

- Removed legacy manual sync process. Use scheduled sync strategy instead.
```

---

## Review Checklist

Before publishing a changelog update:

- [ ] Version matches the related document.
- [ ] Date is correct.
- [ ] Categories are used correctly.
- [ ] Entries are clear and factual.
- [ ] ADRs are referenced when applicable.
- [ ] Security changes are recorded.
- [ ] Deprecated items include replacement guidance.
- [ ] No vague entries remain.

---

## Related Standards

- `CHANGELOG-STANDARD.md`
- `VERSIONING-STANDARD.md`
- `DOCUMENT-LIFECYCLE.md`
- `ADR-STANDARD.md`

---

# Navigation

Previous:

Next:
