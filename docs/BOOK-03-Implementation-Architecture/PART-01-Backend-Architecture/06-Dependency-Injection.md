---
book: "Book III — Implementation Architecture"
part: "PART-01 — Backend Architecture"
stage: "Stage 02 — Core Backend Pattern"
chapter: "06"
title: "Dependency Injection"
version: "1.1.0"
status: "official"
owner: "Clara Architecture Team"
last_updated: "2026-07-06"
classification: "implementation-architecture"
previous: "./README.md"
next: "./07-Configuration.md"
---

# Dependency Injection

> *"Defines dependency injection, composition root, service registration, lifecycle management, and inversion of control in Clara backend."*

---

# Purpose

Defines dependency injection, composition root, service registration, lifecycle management, and inversion of control in Clara backend.

---

# Motivation

Clara backend will contain many modules and many contributors, including human engineers and AI coding assistants.

Without a consistent pattern for **Dependency Injection**, implementation can become inconsistent, insecure, hard to test, and difficult to refactor.

This chapter defines the production-grade pattern that every backend module should follow.

---

# Architecture Decision

## Decision

Clara backend uses constructor-based dependency injection with explicit composition roots per module.

## Status

Accepted.

## Reason

- Keeps business logic independent from concrete infrastructure.
- Makes use cases easier to test.
- Allows infrastructure providers to be replaced safely.
- Improves AI coding assistant consistency by making dependencies explicit.

## Trade-offs

| Benefit | Trade-off |
|---|---|
| More explicit implementation | More files and structure |
| Easier testing | Requires discipline |
| Safer refactoring | Slightly more upfront design |
| Better AI-generated code | Requires consistent documentation |

---

# Reference Architecture

```mermaid
flowchart TD
    Presentation[Presentation Layer] --> Application[Application Layer]
    Application --> Domain[Domain Layer]
    Infrastructure[Infrastructure Layer] --> Application
    Infrastructure --> Domain
    Application --> Platform[Platform Services]
    Platform --> Audit[Audit]
    Platform --> Events[Event Bus]
```

---

# Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant UseCase
    participant Domain
    participant Repository
    participant Platform

    Client->>Controller: Request
    Controller->>UseCase: Validated DTO
    UseCase->>UseCase: Authorization check
    UseCase->>Domain: Execute business rule
    UseCase->>Repository: Persist or read data
    UseCase->>Platform: Audit / Event / Notification
    UseCase-->>Controller: Application result
    Controller-->>Client: Safe response
```

---

# Recommended Folder Structure

```text
module/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── events/
│   └── services/
│
├── application/
│   ├── use-cases/
│   ├── dto/
│   └── ports/
│
├── infrastructure/
│   ├── persistence/
│   ├── config/
│   ├── external/
│   └── mappers/
│
└── presentation/
    ├── controllers/
    ├── routes/
    └── presenters/
```

---

# Code Skeleton

```ts
// customer/application/use-cases/CreateCustomerUseCase.ts
export interface CustomerRepository {
  save(customer: Customer): Promise<void>;
}

export interface AuditService {
  record(event: AuditEvent): Promise<void>;
}

export class CreateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly auditService: AuditService,
  ) {}

  async execute(input: CreateCustomerInput): Promise<CreateCustomerOutput> {
    const customer = Customer.create({
      name: input.name,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
    });

    await this.customerRepository.save(customer);

    await this.auditService.record({
      action: "customer.created",
      resourceId: customer.id,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
    });

    return { customerId: customer.id };
  }
}

// customer/customer.module.ts
export function buildCustomerModule(container: Container): void {
  container.register("CustomerRepository", PrismaCustomerRepository);
  container.register("AuditService", AuditServiceImpl);
  container.register("CreateCustomerUseCase", CreateCustomerUseCase);
}

```

---

# Implementation Guidelines

- Keep business rules out of controllers.
- Keep domain logic independent from framework and infrastructure.
- Prefer explicit dependencies over hidden global state.
- Use interfaces for boundaries that cross layers.
- Keep input and output DTOs explicit.
- Validate external input before executing use cases.
- Enforce authorization inside use cases for protected actions.
- Record audit events for sensitive operations.

---

# Production Checklist

- [ ] Pattern is applied consistently.
- [ ] Dependencies are explicit.
- [ ] No framework dependency leaks into domain.
- [ ] Errors are handled consistently.
- [ ] Logs are structured.
- [ ] Sensitive operations are audited.
- [ ] Tests cover success and failure paths.
- [ ] Implementation follows Book II blueprint boundaries.

---

# Security Checklist

- [ ] Authentication is enforced before protected access.
- [ ] Authorization is checked server-side.
- [ ] Organization ID is validated server-side.
- [ ] Workspace ID is validated server-side.
- [ ] Input is validated.
- [ ] Sensitive output is filtered.
- [ ] Secrets are not hard-coded.
- [ ] Audit events are recorded where required.
- [ ] Error messages do not leak sensitive data.

---

# Performance Checklist

- [ ] Avoid unnecessary database calls.
- [ ] Avoid N+1 query patterns.
- [ ] Use pagination for list endpoints.
- [ ] Use indexes for common filters.
- [ ] Cache only when invalidation is understood.
- [ ] Avoid blocking I/O in request flow.
- [ ] Measure before optimizing.

---

# Anti-patterns

Avoid:

- Business logic in controllers.
- Direct ORM usage inside domain entities.
- Hidden singleton dependencies.
- Unvalidated environment variables.
- Use cases that skip authorization.
- Repository methods returning raw persistence models.
- Logging secrets or sensitive customer data.
- AI-generated code that ignores architecture boundaries.

---

# Testing Strategy

Recommended tests:

- Unit tests for domain behavior.
- Unit tests for use cases with mocked dependencies.
- Integration tests for repository adapters.
- Configuration validation tests.
- Authorization failure tests.
- Security-sensitive audit tests.
- Regression tests for known edge cases.

---

# AI Coding Guidelines

When using Codex, Cursor, Claude Code, Gemini CLI, or another AI coding assistant:

- Always reference this chapter before generating backend code.
- Ask the AI to preserve Clean Architecture dependency direction.
- Ask the AI to create interfaces before infrastructure implementations.
- Ask the AI to include authorization and validation paths.
- Ask the AI to write tests for success, failure, and permission-denied scenarios.
- Do not accept generated code that places business logic in controllers.
- Do not accept generated code that hard-codes secrets.
- Do not accept generated code that bypasses audit for sensitive actions.

---

# Related Documents

- 01-System-Architecture.md
- 02-Clean-Architecture.md
- 03-Domain-Driven-Design.md
- 04-Project-Structure.md
- 05-Layer-Architecture.md
- ../../BOOK-02-Master-Blueprint/PART-07-Security-Platform/README.md

---

# Navigation

**Previous:** ./README.md

**Next:** ./07-Configuration.md
