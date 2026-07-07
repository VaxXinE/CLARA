---
book: "Book IV — Product & Domain Specification"
part: "PART-02 — User Roles and Permissions"
chapter: "19"
title: "Developer Integrator Role"
version: "1.0.0"
status: "official"
owner: "Clara Product Architecture Team"
last_updated: "2026-07-07"
classification: "product-domain-specification"
previous: "18-Knowledge-Manager-Role.md"
next: "20-System-Service-Actors.md"
---

# Developer Integrator Role

> *"Defines the role responsible for API keys, webhooks, integrations, connector setup, developer settings, and technical operations."*

---

# Purpose

Defines the role responsible for API keys, webhooks, integrations, connector setup, developer settings, and technical operations.

---

# User / Product Problem

Technical users need to connect Clara to other systems, but integration permissions can expose high-risk credentials and data flows.

---

# Product Decision

## Decision

Clara Developer/Integrator should manage technical integration surfaces with strict secrets handling, scoped access, and audit logging.

## Status

Accepted.

## Reason

- Keeps user access understandable.
- Prevents accidental privilege escalation.
- Protects customer and organization data.
- Makes product behavior easier to test.
- Gives frontend, backend, and AI assistant implementation a clear permission baseline.
- Supports enterprise readiness later without overcomplicating MVP.

## Product Trade-offs

| Direction | Benefit | Trade-off |
|---|---|---|
| Predefined roles first | Faster MVP and safer defaults | Less flexibility than custom roles |
| Explicit permission keys | Easier security review | More upfront modeling |
| Scoped permissions | Stronger tenant isolation | More implementation discipline |
| Role-based UX | Easier onboarding | Must avoid treating UI as security |
| Service actors defined | Better automation auditability | Requires service identity model |

---

# Primary Users / Actors

- Developer
- Integrator
- Automation Engineer
- Technical Admin

---

# Domain Objects

- API Key
- Webhook
- Connector
- OAuth Connection
- Integration Log
- Secret Reference

---

# Permission Baseline

| Permission | Meaning | Availability |
|---|---|---|
| `integration:read` | Product action permission | MVP/Future based on module |
| `integration:connect` | Product action permission | MVP/Future based on module |
| `webhook:manage` | Product action permission | MVP/Future based on module |
| `api_key:manage` | Product action permission | MVP/Future based on module |
| `developer_settings:update` | Product action permission | MVP/Future based on module |
| `integration.logs:read` | Product action permission | MVP/Future based on module |

---

# Role / Permission Flow

```mermaid
flowchart TD
    Actor[Actor] --> Membership[Organization / Workspace Membership]
    Membership --> Role[Role Assignment]
    Role --> Permissions[Permission Set]
    Permissions --> Scope[Organization / Workspace / Resource Scope]
    Scope --> Decision[Allow or Deny]
    Decision --> Audit[Audit if Sensitive]
```

---

# Access Evaluation Sequence

```mermaid
sequenceDiagram
    participant User as Actor
    participant UI as Clara UI
    participant API as Clara API
    participant Auth as AuthN/AuthZ
    participant Module as Product Module
    participant Audit as Audit Log

    User->>UI: Attempts action
    UI->>API: Sends request with session
    API->>Auth: Validate identity
    Auth->>Auth: Evaluate permission and scope
    Auth-->>API: Allow or deny
    API->>Module: Execute protected behavior
    Module->>Audit: Record sensitive action if required
    API-->>UI: Return safe result
```

---

# MVP Behavior

MVP should support basic integration setup, webhook configuration, and developer settings behind admin-approved access.

---

# Future Behavior

Future versions may support sandbox environments, connector certification, scoped API tokens, and integration health dashboards.

---

# Product Requirements

## Functional Requirements

- Role behavior must be understandable to an Admin.
- Permission behavior must be enforceable by backend services.
- UI must reflect allowed actions without becoming the final security layer.
- Role assignment must be auditable when sensitive.
- Permission denial must produce safe, understandable user feedback.
- System/service actors must be distinguishable from human users.

## Non-Functional Requirements

- Authorization checks must be deterministic.
- Permission keys must be stable.
- Access decisions must include Organization scope.
- Workspace-scoped actions must include Workspace scope.
- Sensitive access changes must be auditable.
- Permission evaluation must not depend on frontend-only state.

---

# UX Expectations

- Users should only see actions that are relevant to their role where practical.
- Denied actions should not expose sensitive resource details.
- Admin screens should explain what each role can do.
- Role assignment should clearly show scope.
- Dangerous role changes should require confirmation.
- AI-assisted actions must clearly show whether AI is suggesting or executing.

---

# Security and Privacy Considerations

- Backend must enforce all permissions.
- Frontend role checks are only usability helpers.
- Cross-tenant access must be denied by default.
- Service actors must have least privilege.
- Temporary/elevated access must expire in future enterprise model.
- Role changes should be logged.
- Permission failures should not leak whether protected resources exist.
- AI tools must inherit actor permission boundaries.

---

# Acceptance Criteria

- [ ] Target actor is defined.
- [ ] Role behavior is clear.
- [ ] Relevant permissions are named.
- [ ] Organization scope is considered.
- [ ] Workspace scope is considered where applicable.
- [ ] Sensitive actions are auditable.
- [ ] MVP behavior is separated from future behavior.
- [ ] UI expectation is documented.
- [ ] Backend enforcement is required.
- [ ] AI/tool behavior follows actor permissions.

---

# Anti-patterns

Avoid:

- Giving Admin the same power as Owner without reason.
- Treating frontend visibility as final authorization.
- Creating custom roles before predefined roles are stable.
- Using vague permissions like `manage_everything`.
- Allowing service actors to run with human owner privileges.
- Letting AI tools execute actions without checking user permission.
- Returning sensitive resource details in permission-denied errors.
- Mixing Organization-scope and Workspace-scope behavior without clarity.

---

# Related Book III References

- ../../BOOK-03-Implementation-Architecture/PART-07-Security-Implementation/README.md
- ../../BOOK-03-Implementation-Architecture/PART-11-Product-Implementation-Architecture/210-Role-Permission-Module.md
- ../../BOOK-03-Implementation-Architecture/APPENDIX/APPENDIX-C-Security-Checklist.md
- ../../BOOK-03-Implementation-Architecture/APPENDIX/APPENDIX-F-Code-Review-Checklist.md

---

# Navigation

**Previous:** `18-Knowledge-Manager-Role.md`

**Next:** `20-System-Service-Actors.md`
