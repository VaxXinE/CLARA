---
project: "CLARA"
artifact: "CLARA Docs Import Plan — Book VI–IX + Master Index"
version: "1.0.0"
status: "official"
owner: "CLARA Documentation and Architecture Team"
last_updated: "2026-07-07"
classification: "documentation-import-plan"
repository: "https://github.com/VaxXinE/CLARA"
---


# 07 — Conflict Resolution Guide

> *"When documents disagree, resolve by source-of-truth priority instead of personal preference."*

---

# Purpose

This guide explains how to handle conflicts while importing Book VI–IX and CLARA Master Documentation Index.

---

# Common Conflict Types

## 1. Folder Naming Conflict

Example:

```text
Generated docs use one title.
Repo already uses another folder name.
```

Resolution:

```text
Preserve existing repo path for Book I–V.
Use planned canonical paths for Book VI–IX.
Update master index links to match actual repo paths.
```

---

## 2. README Status Conflict

Example:

```text
README says current focus is Book I–III.
Repo now includes Book I–IX.
```

Resolution:

```text
Update README status to documentation-system-expansion.
Mention Book I–IX.
Do not delete historical context unless obsolete.
```

---

## 3. AGENTS Routing Conflict

Example:

```text
AGENTS only references Book I–III.
New docs require Book I–IX routing.
```

Resolution:

```text
Replace with expanded routing.
Keep strict security and documentation rules.
Add CLARA Master Documentation Index as required reading.
```

---

## 4. Security Policy Conflict

Example:

```text
SECURITY.md is too generic.
Book VI defines stronger rules.
```

Resolution:

```text
Root SECURITY.md should summarize strict policy.
Book VI remains deeper source of truth.
```

---

## 5. Duplicate Concepts

Example:

```text
Security docs exist in docs/security and Book VI.
Operations docs exist in docs/operations and Book VII.
```

Resolution:

```text
Book VI/VII are canonical long-form books.
docs/security and docs/operations can be quick references and indexes.
```

---

# Source-of-Truth Priority

Use this order:

```text
1. Security/privacy/compliance constraints
2. Existing official repo structure
3. CLARA Master Documentation Index
4. Book-specific README/Master Index
5. Chapter-level documents
6. Root convenience docs
```

---

# Do Not Do

Do not:

```text
rename Book I–V in this import PR
delete existing docs without review
collapse Book VI–IX into one folder
put Book IX parts outside Book IX folder
commit generated ZIP files into docs
commit .env or .DS_Store
```

---

# When Unsure

Create a note in PR:

```text
Open question:
Decision needed:
Recommended option:
Risk:
```

Then resolve before merge.
