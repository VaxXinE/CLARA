# docs/AGENTS.md — Athena Documentation Instructions

You are editing Athena documentation.

---

# Required Rules

- Keep documentation consistent with Book I, Book II, and Book III.
- Use frontmatter for official documents where appropriate.
- Define owner, version, status, last updated date, and classification.
- Use clear headings.
- Use Mermaid for diagrams where possible.
- Cross-link related documents.
- Do not duplicate canonical definitions from glossary unless necessary.
- Do not include secrets, customer data, private tokens, or sensitive screenshots.

---

# Required Reading

```text
docs/README.md
docs/standards/
docs/templates/
docs/glossary/
docs/BOOK-03-Implementation-Architecture/README.md
docs/BOOK-03-Implementation-Architecture/APPENDIX/
```

---

# Writing Style

- Be precise.
- Be production-aware.
- Be security-aware.
- Explain trade-offs.
- Prefer checklists for implementation review.
- Prefer diagrams for architecture flows.
- Keep navigation links updated.

---

# Forbidden

Do not:

- Invent product decisions that conflict with existing books.
- Add vendor lock-in without ADR.
- Add security-sensitive docs without security checklist.
- Add AI capability docs without guardrails, evaluation, and privacy notes.
- Copy copyrighted external content into the repository.
