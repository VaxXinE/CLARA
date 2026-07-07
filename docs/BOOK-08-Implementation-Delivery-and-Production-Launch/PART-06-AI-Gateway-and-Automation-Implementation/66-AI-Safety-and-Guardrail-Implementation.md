---
book: "Book VIII — Implementation, Delivery & Production Launch"
part: "PART-06 — AI Gateway and Automation Implementation"
chapter: "66"
title: "AI Safety and Guardrail Implementation"
version: "1.0.0"
status: "official"
owner: "CLARA AI Engineering Team"
last_updated: "2026-07-07"
classification: "ai-gateway-automation-implementation"
previous: "65-Context-and-RAG-Implementation.md"
next: "67-Human-Review-and-Approval-Workflow-Implementation.md"
project: "CLARA"
---

# AI Safety and Guardrail Implementation

> *"Defines AI safety guardrails for input filtering, output validation, policy checks, prompt injection defense, sensitive data controls, refusal/escalation, and safe action boundaries."*

---

# Purpose

Defines AI safety guardrails for input filtering, output validation, policy checks, prompt injection defense, sensitive data controls, refusal/escalation, and safe action boundaries.

---

# AI/Automation Problem

AI systems can leak data, hallucinate, follow malicious instructions, or trigger unsafe actions if guardrails are missing.

---

# AI/Automation Decision

## Decision

CLARA AI workflows should enforce safety checks before and after model calls and prevent AI from taking unsafe actions without approval.

## Status

Accepted.

---

# AI Gateway Implementation Rule

Every CLARA AI or automation capability should be implemented as:

```text
Use Case -> Policy Check -> Context Assembly -> Prompt Template -> AI Gateway -> Provider Adapter -> Guardrails -> Review/Approval -> Action/Response -> Telemetry -> Audit -> Tests
```

An AI/automation change is not production-ready if it cannot answer:

```text
what user/business workflow it supports
what model/provider it uses
what prompt/template version it uses
what context it can access
how tenant/workspace scope is enforced
what safety checks run before and after the model call
whether human review is required
what action can be taken automatically
how cost is tracked
how output quality is evaluated
how the feature can be disabled
what tests prove safe behavior
```

---

# Recommended AI Workflow

```mermaid
sequenceDiagram
    participant App as Application Service
    participant Policy as Policy/Permission
    participant Context as Context/RAG
    participant Prompt as Prompt Template
    participant Gateway as AI Gateway
    participant Provider as Provider Adapter
    participant Guard as Guardrails
    participant Review as Human Review
    participant Obs as Telemetry/Audit

    App->>Policy: Verify actor/resource/action
    Policy->>Context: Request scoped context
    Context->>Prompt: Build prompt variables
    Prompt->>Gateway: Submit AI request
    Gateway->>Provider: Call selected model/provider
    Provider-->>Gateway: Return model output
    Gateway->>Guard: Validate output
    Guard->>Review: Route to human review if required
    Review-->>App: Approved/rejected/edited result
    App->>Obs: Emit cost/quality/safety/audit events
```

---

# Production-Ready Checklist

- [ ] AI call goes through AI Gateway.
- [ ] Provider adapter is isolated.
- [ ] Prompt template is versioned.
- [ ] Context is tenant/workspace scoped.
- [ ] Prompt injection risk is reviewed.
- [ ] Sensitive data exposure is minimized.
- [ ] Output guardrails exist.
- [ ] Human review exists where needed.
- [ ] Cost/token tracking exists.
- [ ] Fallback/kill switch exists.
- [ ] Tests cover failure and abuse cases.
- [ ] Runbook/operational notes exist.

---

# Acceptance Criteria

- [ ] AI workflow boundary is explicit.
- [ ] Safety controls are implemented.
- [ ] Cost and quality can be measured.
- [ ] Human review and approval are supported.
- [ ] Automation is idempotent and auditable.
- [ ] Failure modes degrade safely.
- [ ] AI coding assistants can apply this safely.

---

# Anti-patterns

Avoid:

- Calling AI providers directly from random modules.
- Hard-coding prompts in controllers.
- Sending unscoped customer data to AI.
- Trusting model output without validation.
- Letting AI execute high-impact actions without approval.
- Logging raw prompts/responses containing sensitive data.
- No model/provider timeout.
- No cost tracking.
- No kill switch.
- No prompt/version history.
- No adversarial/prompt injection tests.

---

# Related Documents

- ../PART-03-Backend-Implementation/README.md
- ../PART-05-Database-and-Migration-Implementation/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/BOOK-06-Master-Index/README.md
- ../../BOOK-07-Operations-Observability-and-Reliability/PART-02-Observability-Strategy/README.md
- ../../BOOK-07-Operations-Observability-and-Reliability/PART-05-Reliability-Engineering/README.md

---

# Navigation

**Previous:** `65-Context-and-RAG-Implementation.md`

**Next:** `67-Human-Review-and-Approval-Workflow-Implementation.md`

---

# Guardrail Types

Implement guardrails for:

```text
input safety
context access
prompt injection
output validation
sensitive data leakage
policy compliance
action eligibility
confidence thresholds
human review routing
```

---

# Output Validation Examples

Validate:

```text
JSON/schema shape
allowed action names
resource IDs belong to workspace
no forbidden content category
no secret/token pattern
no unsupported claim without evidence
confidence threshold
```

---

# Safe Action Boundary

AI may suggest actions.

AI should not execute high-impact actions automatically unless:

```text
policy allows it
risk is low
idempotency exists
audit is emitted
rollback/compensation exists
human approval is not required
```

---

# Guardrail Rule

Model output is untrusted until validated.
