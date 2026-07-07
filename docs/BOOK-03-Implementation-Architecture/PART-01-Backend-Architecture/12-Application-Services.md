---
book: "Book III — Implementation Architecture"
part: "PART-01 — Backend Architecture"
stage: "Stage 03 — Application Logic"
chapter: "12"
title: "Application Services"
version: "1.0.0"
status: "official"
owner: "Clara Architecture Team"
last_updated: "2026-07-06"
classification: "implementation-architecture"
previous: "./11-Domain-Services.md"
next: "./13-Domain-Events.md"
---

# Application Services

> *"Defines application services for orchestration that coordinates use cases, infrastructure ports, authorization, transactions, and platform services."*

---

# Purpose

Defines application services for orchestration that coordinates use cases, infrastructure ports, authorization, transactions, and platform services.

---

# Motivation

Clara backend must separate **business truth** from **application orchestration**.

If this separation is not clear, code becomes difficult to test, business rules become scattered, and infrastructure side effects become mixed with domain behavior.

This chapter defines how **Application Services** should be implemented consistently across Clara backend modules.

---

# Architecture Decision

## Decision

Clara backend uses application services for orchestration, not domain decision-making.

## Status

Accepted.

## Reason

- Keeps domain logic separate from workflow orchestration.
- Makes authorization, transactions, and side effects explicit.
- Provides stable entry points for controllers, jobs, and message handlers.
- Keeps infrastructure interactions outside the Domain layer.

## Trade-offs

| Benefit | Trade-off |
|---|---|
| Clearer responsibility boundaries | More explicit structure |
| Better testability | Requires discipline |
| Safer business behavior | More upfront modeling |
| Better AI-generated code | Requires consistent prompts and docs |

---

# Reference Architecture

```mermaid
flowchart TD
    Controller[Controller / Handler] --> Application[Application Logic]
    Application --> Authorization[Authorization]
    Application --> Domain[Domain Model]
    Application --> Repository[Repository Port]
    Application --> Platform[Platform Services]
    Repository --> Infrastructure[Infrastructure Adapter]
    Platform --> Audit[Audit]
    Platform --> EventBus[Event Bus]
```

---

# Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Handler
    participant Application
    participant Authorization
    participant Domain
    participant Repository
    participant Platform

    Client->>Handler: Request
    Handler->>Application: DTO / Command / Query
    Application->>Authorization: Check permission
    Authorization-->>Application: Allowed
    Application->>Repository: Load data
    Repository-->>Application: Domain object
    Application->>Domain: Execute business behavior
    Application->>Repository: Persist changes
    Application->>Platform: Audit / Event / Notification
    Application-->>Handler: Result
    Handler-->>Client: Response
```

---

# Recommended Folder Structure

```text
module/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── services/
│   └── events/
│
├── application/
│   ├── commands/
│   ├── queries/
│   ├── use-cases/
│   ├── services/
│   ├── dto/
│   └── ports/
│
├── infrastructure/
│   ├── persistence/
│   ├── event-handlers/
│   └── mappers/
│
└── presentation/
    ├── controllers/
    └── routes/
```

---

# Code Skeleton

```ts
// customer/application/services/CustomerMergeApplicationService.ts
export class CustomerMergeApplicationService {
  constructor(
    private readonly authorization: AuthorizationService,
    private readonly customerRepository: CustomerRepository,
    private readonly customerMergePolicy: CustomerMergePolicy,
    private readonly unitOfWork: UnitOfWork,
    private readonly eventBus: EventBus,
    private readonly audit: AuditService,
  ) {}

  async merge(input: MergeCustomerInput): Promise<MergeCustomerOutput> {
    await this.authorization.assertCan(input.actor, "customer:merge", {
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
    });

    return this.unitOfWork.transaction(async () => {
      const primary = await this.customerRepository.findById(input.primaryCustomerId);
      const duplicate = await this.customerRepository.findById(input.duplicateCustomerId);

      if (!primary || !duplicate) {
        throw new NotFoundError("Customer not found");
      }

      const event = this.customerMergePolicy.merge(primary, duplicate);

      await this.customerRepository.save(primary);
      await this.customerRepository.archive(duplicate.id);

      await this.eventBus.publish(event);
      await this.audit.record({
        action: "customer.merged",
        actorId: input.actor.id,
        resourceId: primary.id,
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
      });

      return { customerId: primary.id };
    });
  }
}

```

---

# Implementation Guidelines

- Keep controllers thin.
- Put orchestration in use cases or application services.
- Put business rules in domain entities, value objects, or domain services.
- Use domain events for meaningful business facts.
- Keep transaction boundaries explicit.
- Do not call external services directly from domain models.
- Do not publish integration events before persistence is safe.
- Use repository interfaces instead of direct ORM access in application logic.

---

# Production Checklist

- [ ] Responsibility boundaries are clear.
- [ ] Application logic does not contain domain invariants that belong in domain models.
- [ ] Domain logic does not depend on infrastructure.
- [ ] Authorization is enforced server-side.
- [ ] Transaction boundary is explicit.
- [ ] Side effects are safe and auditable.
- [ ] Events are published safely.
- [ ] Tests cover success and failure scenarios.
- [ ] Code follows Book III layer architecture.

---

# Security Checklist

- [ ] Actor identity is passed explicitly.
- [ ] Permission checks happen before protected action.
- [ ] Organization and Workspace scopes are validated.
- [ ] Sensitive actions create audit records.
- [ ] Errors do not leak sensitive data.
- [ ] External side effects are controlled.
- [ ] Domain events do not contain secrets.
- [ ] AI or plugin-triggered actions use the same authorization path.

---

# Performance Checklist

- [ ] Avoid unnecessary domain object loading.
- [ ] Avoid N+1 query patterns.
- [ ] Use projections for read-heavy paths.
- [ ] Keep transactions short.
- [ ] Avoid long external calls inside database transactions.
- [ ] Use asynchronous processing for slow side effects.
- [ ] Measure before optimizing.

---

# Anti-patterns

Avoid:

- Domain services that become generic utility classes.
- Application services that contain all business rules.
- Events that are commands disguised as events.
- CQRS everywhere without need.
- Long transactions around external API calls.
- Controllers coordinating multiple repositories directly.
- AI-generated code that skips authorization or transactions.
- Event publishing before persistence is committed.

---

# Testing Strategy

Recommended tests:

- Unit tests for domain services.
- Unit tests for application services with mocked ports.
- Integration tests for transaction behavior.
- Event publishing tests.
- Authorization failure tests.
- CQRS read/write separation tests where applicable.
- Regression tests for known business edge cases.

---

# AI Coding Guidelines

When using Codex, Cursor, Claude Code, Gemini CLI, or another AI coding assistant:

- Tell the AI which layer it is editing.
- Ask the AI to preserve domain/application/infrastructure boundaries.
- Require authorization checks in use cases.
- Require transaction boundaries for write operations.
- Require tests for permission-denied cases.
- Do not accept generated code that puts ORM logic in domain models.
- Do not accept generated code that publishes events without safe persistence.
- Do not accept generated code that mixes query models with write models without reason.

---

# Related Documents

- ../STAGE-01/02-Clean-Architecture.md
- ../STAGE-01/03-Domain-Driven-Design.md
- ../STAGE-02/09-Use-Cases.md
- ../STAGE-02/10-Repositories.md
- ../../BOOK-02-Master-Blueprint/PART-05-Platform-Services/59-Event-Bus.md

---

# Navigation

**Previous:** ./11-Domain-Services.md

**Next:** ./13-Domain-Events.md
