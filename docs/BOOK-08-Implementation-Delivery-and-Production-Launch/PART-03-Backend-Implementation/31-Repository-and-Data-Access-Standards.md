---
book: "Book VIII — Implementation, Delivery & Production Launch"
part: "PART-03 — Backend Implementation"
chapter: "31"
title: "Repository and Data Access Standards"
version: "1.0.0"
status: "official"
owner: "CLARA Backend Engineering Team"
last_updated: "2026-07-07"
classification: "backend-implementation"
previous: "30-Domain-Logic-Standards.md"
next: "32-Authentication-Implementation.md"
project: "CLARA"
---

# Repository and Data Access Standards

> *"Defines repository patterns, query boundaries, transactions, pagination, tenant/workspace scoping, data mapping, and safe database access."*

---

# Purpose

Defines repository patterns, query boundaries, transactions, pagination, tenant/workspace scoping, data mapping, and safe database access.

---

# Backend Problem

Data access bugs can become critical security issues when tenant/workspace boundaries are not enforced consistently.

---

# Backend Decision

## Decision

CLARA data access should be scoped, parameterized, observable, transaction-aware, and protected against injection and cross-tenant access.

## Status

Accepted.

---

# Backend Implementation Rule

Every backend capability should be implemented as:

```text
Route/Controller -> Validation DTO -> Authentication Context -> Authorization Policy -> Application Service -> Domain Logic -> Repository/Adapter -> Observability -> Tests
```

A backend change is not production-ready if it cannot answer:

```text
what input is accepted
how input is validated
who is authenticated
what authorization is enforced
what business rule is applied
what data is accessed
how tenant/workspace scope is enforced
what error is returned
what is logged/measured
what tests prove the behavior
```

---

# Recommended Backend Flow

```mermaid
sequenceDiagram
    participant Client as Client
    participant Controller as Controller
    participant Validator as Validator/DTO
    participant Auth as Authn/Authz
    participant App as Application Service
    participant Domain as Domain Logic
    participant Repo as Repository/Adapter
    participant Obs as Observability

    Client->>Controller: HTTP request
    Controller->>Validator: Parse and validate input
    Controller->>Auth: Resolve identity and permissions
    Auth->>App: Authorized use case request
    App->>Domain: Apply business rules
    App->>Repo: Read/write scoped data or call adapter
    App->>Obs: Emit logs/metrics/audit events
    App-->>Controller: Safe result DTO
    Controller-->>Client: HTTP response
```

---

# Production-Ready Checklist

- [ ] Boundary validation exists.
- [ ] DTOs are explicit.
- [ ] Authentication context is resolved safely.
- [ ] Authorization policy is enforced.
- [ ] Business logic is testable.
- [ ] Data access is scoped.
- [ ] External calls have timeout/failure handling.
- [ ] Errors are safe and consistent.
- [ ] Logs/metrics/audit events are safe.
- [ ] Unit/integration/security tests exist.

---

# Acceptance Criteria

- [ ] Backend layer responsibility is clear.
- [ ] Security controls are explicit.
- [ ] Data boundaries are protected.
- [ ] Error and observability behavior is defined.
- [ ] Testing expectations are clear.
- [ ] AI coding assistants can apply this safely.

---

# Anti-patterns

Avoid:

- Fat controllers.
- Business logic inside database queries only.
- Repository methods that skip tenant/workspace scope.
- Authorization only in frontend.
- Returning raw database entities.
- Logging full request bodies by default.
- Throwing raw provider/database errors to clients.
- Retrying unsafe mutations.
- Tests that only cover happy paths.
- Adding endpoints without observability.

---

# Related Documents

- ../PART-01-Implementation-Foundation/README.md
- ../PART-02-Repository-and-Module-Implementation/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/BOOK-06-Master-Index/README.md
- ../../BOOK-07-Operations-Observability-and-Reliability/BOOK-07-Master-Index/README.md
- ../../BOOK-04-Data-API-AI-and-Integration-Design/README.md

---

# Navigation

**Previous:** `30-Domain-Logic-Standards.md`

**Next:** `32-Authentication-Implementation.md`

---

# Repository Responsibilities

Repositories should:

```text
encapsulate database access
enforce tenant/workspace scope in queries
use parameterized queries/ORM safe APIs
support transaction context where needed
return domain/application data shapes
avoid leaking ORM-specific models unnecessarily
emit query metrics where useful
```

---

# Data Access Security Checklist

- [ ] Query is parameterized.
- [ ] Tenant/workspace scope is enforced.
- [ ] Authorization-sensitive data is filtered.
- [ ] Pagination/limit exists for lists.
- [ ] Sensitive columns are excluded unless required.
- [ ] Transaction boundary is clear.
- [ ] Error handling avoids leaking SQL/provider details.

---

# Cross-Tenant Rule

Every query touching tenant/workspace-owned data must include an explicit scope unless it is a documented admin/system operation.
