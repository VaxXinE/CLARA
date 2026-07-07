---
book: "Book IV — Product & Domain Specification"
part: "PART-09 — Workflow Automation"
chapter: "155"
title: "Workflow Permissions and Risk Levels"
version: "1.0.0"
status: "official"
owner: "CLARA Product Architecture Team"
last_updated: "2026-07-07"
classification: "product-domain-specification"
previous: "154-AI-Assisted-Workflow-Automation.md"
next: "156-Workflow-Audit-and-Traceability.md"
---

# Workflow Permissions and Risk Levels

> *"Defines access control and risk classification for workflow actions."*

---

# Purpose

Defines access control and risk classification for workflow actions.

---

# User / Product Problem

Not all automations are equally risky. Adding a tag is low-risk; sending a customer message or exporting data is high-risk.

---

# Product Decision

## Decision

CLARA should classify workflow actions by risk level and require stronger permissions or approvals for higher-risk actions.

## Status

Accepted.

## Reason

- Reduces repetitive operational work.
- Keeps automation visible and explainable.
- Prevents unsafe hidden side effects.
- Supports consistent business workflows.
- Gives managers and admins operational control.
- Creates a safe foundation for integrations and AI-assisted automation.

## Product Trade-offs

| Direction | Benefit | Trade-off |
|---|---|---|
| Simple rules first | Faster MVP and safer delivery | Less flexible than full builder |
| Low-risk actions first | Safer automation adoption | Less powerful initially |
| Explicit execution logs | Better trust and debugging | More storage and UI design |
| Approval for risky actions | Better accountability | More operational friction |
| AI as assistant first | Safer AI adoption | Less autonomous automation |

---

# Primary Users / Actors

- Admin
- Security Reviewer
- Manager
- Workflow Automation Service

---

# Domain Objects

- Risk Level
- Permission Requirement
- Approval Requirement
- Action Category
- Policy

---

# Permission Baseline

| Permission | Meaning | Enforcement |
|---|---|---|
| `workflow_policy:read` | Product action permission | Protected by backend authorization |
| `workflow_policy:update` | Product action permission | Protected by backend authorization |
| `workflow:execute` | Product action permission | Protected by backend authorization |

---

# Product Flow

```mermaid
flowchart TD
    Owner[Workflow Owner] --> Config[Workflow Configuration]
    Config --> Trigger[Trigger]
    Trigger --> Condition[Condition Evaluation]
    Condition --> Action[Action Execution]
    Action --> Result[Execution Result]
    Result --> Log[Execution Log]
    Log --> Audit[Audit if Sensitive]
    Log --> Analytics[Workflow Analytics]
```

---

# Workflow Execution Sequence

```mermaid
sequenceDiagram
    participant Event as Product Event
    participant Engine as Workflow Engine
    participant Auth as Authorization
    participant Action as Action Executor
    participant Audit as Audit Log
    participant User as Admin / Manager

    Event->>Engine: Trigger workflow
    Engine->>Engine: Load active workflow
    Engine->>Auth: Check workflow scope and action permissions
    Auth-->>Engine: Allow or deny
    Engine->>Engine: Evaluate conditions
    Engine->>Action: Execute allowed action
    Action-->>Engine: Return result
    Engine->>Audit: Record execution and sensitive changes
    User->>Engine: Reviews execution log
```

---

# MVP Behavior

MVP should allow only low-risk or medium-risk automation actions unless manually confirmed.

---

# Future Behavior

Future versions may support policy-based risk scoring, custom approval rules, and tenant-level workflow governance.

---

# Product Requirements

## Functional Requirements

- Workflows must belong to an Organization and Workspace.
- Workflows must have enabled/disabled status.
- Workflows must define trigger, conditions, and actions.
- Workflow actions must be permission-checked.
- Workflow executions must be logged.
- Failed executions must be visible.
- Sensitive actions must be auditable.
- High-risk actions must require approval or be deferred.
- AI-created workflows must not become active automatically in MVP.

## Non-Functional Requirements

- Workflow execution must be idempotent where side effects are possible.
- Workflow engine must avoid duplicate side effects.
- Execution logs must include trigger, status, and result.
- Workflow errors must be safe and diagnosable.
- Automation must not block core product workflows unexpectedly.
- Workflow conditions must be deterministic.
- Workflow configuration must be validated before activation.
- Logs must avoid storing unnecessary sensitive data.

---

# UX Expectations

- Admins should understand what a workflow does before enabling it.
- Workflow actions should be previewable where practical.
- Risky actions should be visually marked.
- Failed executions should be easy to find.
- Users should understand why a workflow ran.
- Users should be able to pause or disable workflows.
- Approval-required actions should clearly show pending decision state.
- AI-suggested workflows must be labeled and reviewable.

---

# Security and Privacy Considerations

- Do not let workflow actions bypass user permissions.
- Do not execute high-risk actions silently.
- Do not allow external webhook actions without validation and secret handling.
- Do not allow AI to activate workflows without human approval.
- Do not store sensitive payloads in execution logs unnecessarily.
- Do not execute workflows across workspace boundaries by default.
- Audit workflow creation, updates, activation, deactivation, approvals, and executions.
- Treat external event payloads as untrusted input.

---

# Acceptance Criteria

- [ ] Workflow scope is defined.
- [ ] Trigger behavior is defined.
- [ ] Condition behavior is defined.
- [ ] Action behavior is defined.
- [ ] Primary users are defined.
- [ ] Permissions are named.
- [ ] Risk level is considered.
- [ ] Audit behavior is considered.
- [ ] MVP behavior is clear.
- [ ] Future behavior is separated from MVP.

---

# Anti-patterns

Avoid:

- Building a full workflow builder before simple automation works.
- Allowing workflows to run without execution logs.
- Allowing automation to send customer messages silently.
- Allowing AI-generated workflows to activate automatically.
- Running workflow actions without permission checks.
- Ignoring duplicate events and idempotency.
- Hiding failed executions from admins.
- Storing sensitive event payloads in logs without policy.

---

# Related Book III References

- ../../BOOK-03-Implementation-Architecture/PART-05-Integration-Architecture/README.md
- ../../BOOK-03-Implementation-Architecture/PART-07-Security-Implementation/README.md
- ../../BOOK-03-Implementation-Architecture/PART-10-Operations-Architecture/README.md
- ../../BOOK-03-Implementation-Architecture/PART-11-Product-Implementation-Architecture/216-Workflow-Automation-Module.md
- ../../BOOK-03-Implementation-Architecture/APPENDIX/APPENDIX-C-Security-Checklist.md

---

# Navigation

**Previous:** `154-AI-Assisted-Workflow-Automation.md`

**Next:** `156-Workflow-Audit-and-Traceability.md`
