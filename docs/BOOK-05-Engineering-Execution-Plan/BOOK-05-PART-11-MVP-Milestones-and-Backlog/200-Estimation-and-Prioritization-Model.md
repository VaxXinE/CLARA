---
book: "Book V — Engineering Execution Plan"
part: "PART-11 — MVP Milestones and Backlog"
chapter: "200"
title: "Estimation and Prioritization Model"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan"
previous: "199-Task-Template-and-Definition-of-Ready.md"
next: "201-Sprint-and-Execution-Planning.md"
project: "CLARA"
---

# Estimation and Prioritization Model

> *"Defines how CLARA backlog items should be estimated and prioritized."*

---

# Purpose

Defines how CLARA backlog items should be estimated and prioritized.

---

# Execution Problem

Prioritizing by excitement instead of dependency and risk can delay MVP and increase complexity.

---

# Milestone Decision

## Decision

CLARA should prioritize dependency-critical, security-critical, and vertical-slice-enabling work before nice-to-have features.

## Status

Accepted.

---

# Backlog Implementation Rule

Every backlog item must be designed as:

```text
Document Reference -> User/Technical Goal -> Scope -> Acceptance Criteria -> Security/Test Gates -> Demo Evidence
```

A task is not ready if it cannot be tested, reviewed, and connected to a documented CLARA domain.

---

# Recommended Backlog Flow

```mermaid
sequenceDiagram
    participant Docs as Book IV/V Docs
    participant PO as Product/Engineering Lead
    participant Issue as Backlog Item
    participant Dev as Developer
    participant CI as CI/QA
    participant Demo as Demo/Validation

    PO->>Docs: Select milestone scope
    PO->>Issue: Create traceable backlog item
    Dev->>Issue: Confirm Definition of Ready
    Dev->>CI: Implement and run checks
    CI-->>Dev: Pass or fail
    Dev->>Demo: Provide milestone evidence
    Demo-->>PO: Accept, reject, or request follow-up
```

---

# Secure-by-Design Checklist

- [ ] Related Book IV domain is referenced.
- [ ] Related Book V execution plan is referenced.
- [ ] Authentication/authorization impact is considered.
- [ ] Organization/workspace scope is considered.
- [ ] Input validation is considered.
- [ ] Output safety is considered.
- [ ] Audit/security event need is considered.
- [ ] Test expectations are defined.
- [ ] Rollback/disable strategy is considered for risky work.
- [ ] Demo evidence is defined.

---

# Acceptance Criteria

- [ ] Milestone scope is clear.
- [ ] MVP vs post-MVP boundary is clear.
- [ ] Dependencies are identified.
- [ ] Backlog items can be created from this chapter.
- [ ] Security and QA gates are included.
- [ ] Demo/validation evidence is clear.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Backlog items like “build CRM” or “add AI”.
- Building modules out of dependency order.
- Marking a milestone complete without tests.
- Treating AI-generated code as reviewed.
- Skipping docs updates.
- Adding features outside MVP without explicit decision.
- Ignoring security and quality gates.
- Leaving acceptance criteria vague.
- Completing isolated screens without end-to-end workflow.

---

# Related Documents

- ../PART-01-Execution-Strategy/README.md
- ../PART-02-Repository-and-Development-Workflow/README.md
- ../PART-03-Backend-Implementation-Plan/README.md
- ../PART-04-Frontend-Implementation-Plan/README.md
- ../PART-08-Security-Implementation-Plan/README.md
- ../PART-09-Testing-and-QA-Execution/README.md
- ../PART-10-DevOps-and-Release-Execution/README.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-MVP-SCOPE-MAP.md

---

# Navigation

**Previous:** `199-Task-Template-and-Definition-of-Ready.md`

**Next:** `201-Sprint-and-Execution-Planning.md`

---

# Prioritization Model

Prioritize by:

```text
dependency criticality
security criticality
MVP vertical slice value
risk reduction
user workflow impact
implementation complexity
```

---

# Priority Levels

| Priority | Meaning |
|---|---|
| P0 | Blocks MVP or security foundation |
| P1 | Required for core vertical slice |
| P2 | Important but not blocking early MVP |
| P3 | Nice-to-have/post-MVP |
| P4 | Explicitly deferred |

---

# Estimation Buckets

Use simple buckets:

```text
S = small
M = medium
L = large
XL = split before implementation
```
