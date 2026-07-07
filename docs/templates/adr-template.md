# Clara ADR Template

> Use this template to record significant architecture decisions in Clara.

```yaml
---
adr: "ADR-XXXX"
title: "<Decision Title>"
version: "0.1.0"
status: "proposed"
owner: "<Owner>"
date: "YYYY-MM-DD"
classification: "adr"
supersedes: ""
superseded_by: ""
related_documents:
  - ""
---
```

# ADR-XXXX — <Decision Title>

> *"A decision without context becomes technical debt."*

---

## Document Information

| Field | Value |
|---|---|
| ADR | ADR-XXXX |
| Title | <Decision Title> |
| Status | Proposed |
| Owner | <Owner> |
| Date | YYYY-MM-DD |

---

# Status

Choose one:

```text
proposed
review
accepted
rejected
superseded
archived
```

Current status:

```text
proposed
```

---

# Context

Explain the background that led to this decision.

Include:

- Business context.
- Technical context.
- Current limitations.
- Constraints.
- Relevant history.
- Related previous decisions.

---

# Problem Statement

Describe the problem clearly.

A good problem statement explains:

- What needs to be decided.
- Why the decision matters.
- What happens if no decision is made.
- Who is affected by the decision.

---

# Decision Drivers

List the forces influencing this decision.

Examples:

- Security.
- Scalability.
- Maintainability.
- Performance.
- Cost.
- Developer experience.
- Operational simplicity.
- AI readiness.
- Vendor independence.
- Long-term evolution.

---

# Considered Options

## Option 1 — <Option Name>

### Description

Explain the option.

### Benefits

- Benefit 1
- Benefit 2

### Drawbacks

- Drawback 1
- Drawback 2

---

## Option 2 — <Option Name>

### Description

Explain the option.

### Benefits

- Benefit 1
- Benefit 2

### Drawbacks

- Drawback 1
- Drawback 2

---

## Option 3 — <Option Name>

### Description

Explain the option.

### Benefits

- Benefit 1
- Benefit 2

### Drawbacks

- Drawback 1
- Drawback 2

---

# Decision

State the selected option clearly.

```text
We will adopt <selected option>.
```

Explain why this option was chosen over the alternatives.

---

# Rationale

Connect the decision back to Clara principles.

Examples:

- Book I — Architecture Principles.
- Book I — Security Philosophy.
- Book II — Master Blueprint.
- Clara Documentation Standards.

---

# Consequences

## Positive Consequences

- Positive consequence 1
- Positive consequence 2

## Negative Consequences

- Negative consequence 1
- Negative consequence 2

## Neutral Consequences

- Neutral consequence 1
- Neutral consequence 2

---

# Trade-Offs

| Trade-Off | Accepted Reason |
|---|---|
| | |

---

# Security Considerations

Document security implications.

Consider:

- Authentication.
- Authorization.
- Data isolation.
- Secrets.
- Auditability.
- Abuse cases.
- Compliance.

---

# Privacy Considerations

Document privacy implications if personal, customer, tenant, or organizational data is involved.

---

# Operational Considerations

Document:

- Deployment impact.
- Monitoring impact.
- Incident response.
- Backup or recovery.
- Runbook updates.

---

# Migration Plan

If this decision changes an existing system, describe:

- Migration steps.
- Compatibility plan.
- Rollback plan.
- Data migration.
- Risk mitigation.

---

# Impacted Documents

List documents that must be updated.

- Book II chapter
- Book III architecture document
- API specification
- Security checklist
- Runbook
- TDD

---

# Open Questions

- Question 1
- Question 2

---

# Review Notes

| Reviewer | Area | Status | Notes |
|---|---|---|---|
| | Architecture | Pending | |
| | Security | Pending | |
| | Product | Pending | |

---

# Final Decision Date

```text
YYYY-MM-DD
```

---

# Changelog

## 0.1.0 - YYYY-MM-DD

### Added

- Initial ADR proposal.

---

# References

- Related standard
- Related ADR
- External reference

---

# Navigation

**Previous ADR:** <Previous ADR>

**Next ADR:** <Next ADR>
