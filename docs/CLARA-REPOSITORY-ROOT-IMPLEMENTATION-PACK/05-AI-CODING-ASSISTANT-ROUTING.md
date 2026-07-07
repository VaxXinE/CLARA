---
project: "CLARA"
artifact: "CLARA Repository Root Implementation Pack"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering, Architecture, Security and Product Operations Team"
last_updated: "2026-07-07"
classification: "repository-implementation-planning"
repository: "https://github.com/VaxXinE/CLARA"
---


# 05 — AI Coding Assistant Routing

> *"AI assistants are productive only when they are forced to use the right source of truth."*

---

# Purpose

This document defines how Codex, Cursor, or other AI coding assistants should route themselves through CLARA documentation before making changes.

---

# Required Reading Order

Every AI assistant should read:

```text
1. AGENTS.md
2. SECURITY.md
3. docs/README.md
4. docs/CLARA-MASTER-DOCUMENTATION-INDEX/CLARA-MASTER-INDEX.md
5. docs/CLARA-MASTER-DOCUMENTATION-INDEX/CLARA-CODING-REFERENCE-MAP.md
6. Relevant Book I–IX docs
```

---

# Task Routing Table

| Task | Required Docs |
|---|---|
| Product/domain behavior | Book II, Book IV |
| Architecture | Book III |
| API/data/AI/integration design | Book IV |
| Backlog/execution | Book V |
| Security/compliance | Book VI |
| Operations/reliability | Book VII |
| Implementation/launch | Book VIII |
| Product operations/growth | Book IX |
| AI quality/automation | Book IV, Book VI, Book IX Part 10 |
| Billing/entitlement | Book VI, Book IX Part 05 |
| Analytics/events | Book VI, Book IX Part 06 |
| Roadmap/prioritization | Book IX Part 07 |
| Security review | SECURITY.md, Book VI, Book IX Part 08 |
| Reliability review | Book VII, Book IX Part 09 |

---

# AI Assistant Boundary Rules

AI assistants must not:

```text
invent undocumented architecture
ignore security controls
hard-code secrets
create frontend-only authorization
bypass tenant/workspace scope
add AI behavior without guardrails
add automation without rollback
add analytics events with raw sensitive data
modify docs without updating navigation
```

---

# AI Implementation Prompt Pattern

Use this pattern when asking an AI assistant to code:

```text
Task:
Relevant docs:
Constraints:
Security requirements:
Tests required:
Files allowed:
Files forbidden:
Expected output:
```

Example:

```text
Task:
Create backend health endpoint.

Relevant docs:
- AGENTS.md
- SECURITY.md
- CLARA-CODING-REFERENCE-MAP.md
- Book VIII implementation docs
- Book VII operations docs

Constraints:
- No business feature logic yet.
- No database dependency for liveness.
- Include structured response.

Security requirements:
- No secrets in response.
- No debug info in production response.

Tests required:
- health endpoint returns 200
- response does not expose env secrets
```

---

# AI Review Checklist

Review AI output for:

```text
documentation alignment
security constraints
authorization logic
tenant scoping
input validation
secret safety
test coverage
error handling
observability
maintainability
```

---

# AI Routing Rule

```text
AI coding assistant output is a draft. Human review remains mandatory.
```
