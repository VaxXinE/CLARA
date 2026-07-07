---
book: "Book III — Implementation Architecture"
appendix: "G"
title: "ADR Template"
version: "1.0.0"
status: "official"
owner: "Athena Architecture Team"
last_updated: "2026-07-07"
classification: "architecture-decision-record"
---

# APPENDIX G — ADR Template

> *"Architecture decisions should be remembered by the system, not only by the person who made them."*

---

# Purpose

Use this template for Architecture Decision Records in Athena.

Create an ADR when a decision:

- Affects architecture boundaries.
- Changes infrastructure.
- Introduces new storage or provider.
- Changes security model.
- Changes AI behavior.
- Changes integration pattern.
- Creates long-term operational consequences.

---

# ADR File Naming

```text
ADR-YYYY-MM-DD-short-decision-title.md
```

Example:

```text
ADR-2026-07-07-use-ai-gateway-for-model-provider-access.md
```

---

# ADR Template

```markdown
---
adr: "ADR-YYYY-MM-DD-short-title"
title: "<Decision Title>"
status: "proposed"
owner: "<Team>"
date: "YYYY-MM-DD"
related:
  - "../BOOK-03-Implementation-Architecture/PART-XX/README.md"
---

# ADR — <Decision Title>

## Status

Proposed | Accepted | Deprecated | Superseded

## Context

Explain the situation, constraints, and problem.

## Decision

State the decision clearly.

## Reasoning

Explain why this option is selected.

## Alternatives Considered

### Option A

Pros:
- ...

Cons:
- ...

### Option B

Pros:
- ...

Cons:
- ...

## Consequences

### Positive

- ...

### Negative

- ...

## Security Impact

- Authentication:
- Authorization:
- Tenant isolation:
- Secrets:
- Data exposure:
- Audit:

## Data Impact

- Source of truth:
- Migration:
- Retention:
- Backup:
- Privacy:

## Operational Impact

- Monitoring:
- Alerting:
- Runbook:
- Incident impact:
- Rollback:

## Testing Impact

- Unit:
- Integration:
- Contract:
- Security:
- E2E:

## Rollout Plan

1. ...
2. ...
3. ...

## Rollback Plan

1. ...
2. ...
3. ...

## Related Documents

- ...
```

---

# ADR Review Checklist

- [ ] Problem is clear.
- [ ] Decision is clear.
- [ ] Alternatives are documented.
- [ ] Security impact is considered.
- [ ] Data impact is considered.
- [ ] Operational impact is considered.
- [ ] Testing impact is considered.
- [ ] Rollout plan exists.
- [ ] Rollback plan exists.
- [ ] Related documents are linked.

---

# Navigation

**Back:** README.md
