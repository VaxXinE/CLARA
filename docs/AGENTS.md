# docs/AGENTS.md — Clara Documentation Instructions

You are editing Clara documentation.

---

# Required Rules

- Keep documentation consistent with Book I–IX.
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
docs/CLARA-MASTER-DOCUMENTATION-INDEX/CLARA-MASTER-INDEX.md
docs/standards/
docs/templates/
docs/glossary/
```

For architecture docs:

```text
docs/BOOK-03-Implementation-Architecture/
docs/adr/
```

For security docs:

```text
docs/BOOK-06-Security-Governance-and-Compliance/
docs/security/
```

For operations docs:

```text
docs/BOOK-07-Operations-Observability-and-Reliability/
docs/operations/
```

For implementation docs:

```text
docs/BOOK-08-Implementation-Delivery-and-Production-Launch/
```

For product operations docs:

```text
docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/
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
- Add fake references or fake citations.
