# Athena Documentation Review Checklist

> *"A document is ready when it helps future contributors make better decisions."*

---

## Document Information

| Field | Value |
|------|-------|
| Document | Athena Documentation Review Checklist |
| Version | 1.0.0 |
| Status | Official |
| Owner | Athena Core Team |
| Scope | Athena Engineering Library |
| Last Updated | 2026-07-06 |

---

# Purpose

This checklist defines the review standard for Athena documentation.

It should be used before merging any official documentation into the repository.

The goal is to ensure every document is:

- Clear.
- Consistent.
- Secure.
- Maintainable.
- Navigable.
- Reviewable.
- Aligned with Athena principles.
- Useful for both humans and AI coding assistants.

---

# When to Use This Checklist

Use this checklist for:

- Book chapters.
- Blueprint documents.
- Architecture documents.
- Product requirements.
- Technical design documents.
- API specifications.
- Security documents.
- Runbooks.
- ADRs.
- Standards.
- Templates.
- Contributor guides.

Small typo fixes may not require the full checklist, but all meaningful documentation changes should be reviewed against it.

---

# 1. Metadata Review

Verify that the document includes complete metadata.

- [ ] YAML frontmatter exists.
- [ ] `title` is present.
- [ ] `version` is present.
- [ ] `status` is present.
- [ ] `owner` is present.
- [ ] `last_updated` is present.
- [ ] `classification` is present when required.
- [ ] `previous` and `next` are included for chapter documents.
- [ ] Metadata values match the document location and purpose.

---

# 2. Naming Review

Verify naming consistency.

- [ ] File name follows `NAMING-CONVENTION.md`.
- [ ] Folder name follows `NAMING-CONVENTION.md`.
- [ ] Chapter numbering is correct.
- [ ] Names use kebab-case where required.
- [ ] Official terms match `GLOSSARY.md`.
- [ ] No vague names are used, such as `misc`, `stuff`, `new`, or `final`.

---

# 3. Structure Review

Verify that the document follows ADS.

- [ ] H1 title exists.
- [ ] Opening quote exists for major documents.
- [ ] Purpose section exists.
- [ ] Goals section exists where appropriate.
- [ ] Scope section exists where appropriate.
- [ ] Overview section exists.
- [ ] Main content is organized clearly.
- [ ] Dependencies are listed.
- [ ] Future Evolution is included for major documents.
- [ ] Key Takeaways are included.
- [ ] Related Documents are linked.
- [ ] Navigation is included.

---

# 4. Writing Quality Review

Verify writing quality using `STYLE-GUIDE.md`.

- [ ] Sentences are clear.
- [ ] Paragraphs are short.
- [ ] The tone is professional.
- [ ] No unnecessary hype is present.
- [ ] No ambiguous claims are made.
- [ ] Acronyms are defined on first use.
- [ ] Technical terms are explained when needed.
- [ ] The document is understandable by a new contributor.
- [ ] The document avoids unnecessary vendor-specific assumptions.
- [ ] The document avoids implementation detail when it belongs elsewhere.

---

# 5. Scope Review

Verify that the document stays within its intended scope.

- [ ] The document explains what it covers.
- [ ] The document explains what it does not cover when necessary.
- [ ] Blueprint documents avoid low-level implementation.
- [ ] Architecture documents explain boundaries and trade-offs.
- [ ] Runbooks remain procedural and actionable.
- [ ] Security documents include concrete risk considerations.
- [ ] AI documents preserve human authority and data boundaries.
- [ ] Product documents focus on outcomes, not only features.

---

# 6. Consistency Review

Verify consistency with existing Athena documentation.

- [ ] The document aligns with Book I principles.
- [ ] The document does not contradict related documents.
- [ ] Terminology matches `GLOSSARY.md`.
- [ ] Naming matches `NAMING-CONVENTION.md`.
- [ ] Style matches `STYLE-GUIDE.md`.
- [ ] Structure matches `ADS.md`.
- [ ] Diagrams match `DIAGRAM-STANDARD.md`.
- [ ] Similar documents use similar section patterns.

---

# 7. Architecture Review

For architecture or blueprint documents, verify:

- [ ] Business domain boundaries are clear.
- [ ] Responsibilities are explicit.
- [ ] Dependencies are listed.
- [ ] Ownership is clear.
- [ ] Data ownership is not ambiguous.
- [ ] Integration boundaries are clear.
- [ ] Failure modes are considered where relevant.
- [ ] Observability is considered.
- [ ] Future evolution is considered.
- [ ] Trade-offs are documented.

---

# 8. Security Review

Verify security considerations.

- [ ] Authentication is considered where relevant.
- [ ] Authorization is considered where relevant.
- [ ] Least privilege is considered.
- [ ] Sensitive data is identified.
- [ ] Data access boundaries are clear.
- [ ] Auditability is considered.
- [ ] Secrets are not exposed.
- [ ] Threat assumptions are documented where relevant.
- [ ] Abuse cases are considered where relevant.
- [ ] The document does not recommend insecure defaults.

---

# 9. AI Safety and Governance Review

For AI-related documents, verify:

- [ ] Human oversight is defined where required.
- [ ] AI access to data is authorized.
- [ ] Context boundaries are clear.
- [ ] AI outputs are auditable where relevant.
- [ ] Explainability is considered.
- [ ] Evaluation is considered.
- [ ] Provider independence is preserved where possible.
- [ ] Sensitive data exposure is avoided.
- [ ] Tool usage boundaries are defined.
- [ ] Failure handling is considered.

---

# 10. Data Review

For data-related documents, verify:

- [ ] Source of truth is clear.
- [ ] Data ownership is clear.
- [ ] Data lifecycle is described where relevant.
- [ ] Retention or archiving is considered where relevant.
- [ ] Data quality is considered.
- [ ] Privacy is considered.
- [ ] Audit or lineage is considered.
- [ ] Data portability is considered where relevant.
- [ ] No critical data is hidden inside vague `metadata` fields without reason.

---

# 11. Diagram Review

If the document includes diagrams, verify:

- [ ] Mermaid is used where possible.
- [ ] Diagram syntax renders correctly.
- [ ] Diagram has a clear purpose.
- [ ] Diagram is readable.
- [ ] Labels are meaningful.
- [ ] Arrows are clear.
- [ ] Security boundaries are visible where relevant.
- [ ] Data ownership is visible where relevant.
- [ ] AI authorization boundaries are visible where relevant.
- [ ] Diagram does not duplicate text without adding clarity.

---

# 12. Navigation Review

Verify that readers can move through the documentation.

- [ ] Previous link works.
- [ ] Next link works.
- [ ] Related documents are listed.
- [ ] Relative paths are correct.
- [ ] README or parent document links to this document.
- [ ] Table of Contents is updated when required.
- [ ] Metadata navigation is updated when required.

---

# 13. Repository Readiness Review

Verify that the document is ready for Git.

- [ ] Markdown formatting is valid.
- [ ] File path is correct.
- [ ] No temporary notes remain.
- [ ] No placeholder text remains.
- [ ] No duplicate files exist.
- [ ] No secrets are included.
- [ ] No copyrighted material is copied without permission.
- [ ] Changelog is updated when required.
- [ ] Version is updated when required.

---

# 14. Pull Request Review

Before merging a documentation pull request, verify:

- [ ] PR title is clear.
- [ ] PR scope is focused.
- [ ] PR description explains the change.
- [ ] Related issues or tasks are linked.
- [ ] Screenshots or rendered previews are included when useful.
- [ ] Reviewers are assigned.
- [ ] Required standards are referenced.
- [ ] Changes are not mixed with unrelated work.

---

# 15. Final Approval Checklist

A document can be approved when:

- [ ] It follows ADS.
- [ ] It follows the Style Guide.
- [ ] It follows Naming Convention.
- [ ] It follows Diagram Standard when diagrams exist.
- [ ] It aligns with Book I.
- [ ] It is clear enough for a new contributor.
- [ ] It is safe enough for production-oriented documentation.
- [ ] It preserves context for future maintainers.
- [ ] It improves the Athena Engineering Library.

---

# Recommended Review Labels

Use these labels for documentation reviews:

```text
docs
documentation-standard
needs-review
approved
needs-revision
security-review
architecture-review
ai-review
product-review
operations-review
```

---

# Review Severity

Use severity levels when giving review feedback.

## Required

Must be fixed before merge.

Examples:

- Missing security consideration.
- Broken navigation.
- Contradiction with Book I.
- Insecure recommendation.
- Incorrect terminology.

## Recommended

Should be fixed, but may not block merge.

Examples:

- Better wording.
- More specific example.
- Improved diagram label.

## Optional

Nice-to-have improvement.

Examples:

- Add extra diagram.
- Add supporting quote.
- Improve formatting.

---

# Reviewer Guidance

Good reviews should be:

- Specific.
- Respectful.
- Actionable.
- Principle-based.
- Focused on the document, not the author.

## Good Review Comment

```text
Required: This section should define authorization boundaries before describing AI tool access. Without this, the document may imply that agents can access all workspace data.
```

## Poor Review Comment

```text
This is bad.
```

---

# Final Rule

A document should not be merged because it is finished.

It should be merged because it is useful, clear, safe, and aligned with Athena's long-term principles.

---

# Navigation

**Related Standards:**

- `ADS.md`
- `STYLE-GUIDE.md`
- `NAMING-CONVENTION.md`
- `DIAGRAM-STANDARD.md`
