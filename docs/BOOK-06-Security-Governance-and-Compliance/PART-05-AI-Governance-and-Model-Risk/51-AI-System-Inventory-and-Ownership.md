---
book: "Book VI — Security, Governance & Compliance"
part: "PART-05 — AI Governance and Model Risk"
chapter: "51"
title: "AI System Inventory and Ownership"
version: "1.0.0"
status: "official"
owner: "CLARA Security Governance Team"
last_updated: "2026-07-07"
classification: "ai-governance-model-risk"
previous: "50-AI-Feature-Risk-Classification.md"
next: "52-Prompt-Governance.md"
project: "CLARA"
---

# AI System Inventory and Ownership

> *"Defines governance for inventorying AI features, providers, prompts, context sources, data categories, owners, usage, and dependencies."*

---

# Purpose

Defines governance for inventorying AI features, providers, prompts, context sources, data categories, owners, usage, and dependencies.

---

# Governance Problem

Untracked AI features become shadow AI and are hard to secure, evaluate, debug, or explain.

---

# Governance Decision

## Decision

CLARA should maintain an AI inventory so every AI capability has an owner, purpose, input/output data map, risk level, and review cadence.

## Status

Accepted.

---

# AI Governance Rule

Every CLARA AI feature must be governed as:

```text
AI Feature -> Risk Classification -> Owner -> Data/Context Sources -> Review Control -> Evaluation -> Audit Evidence -> Kill Switch
```

No AI feature should ship without:

```text
purpose
owner
risk level
permission boundary
data handling rule
evaluation evidence
human review rule
fallback/disable path
audit metadata
```

---

# Recommended Governance Flow

```mermaid
sequenceDiagram
    participant Feature as AI Feature Owner
    participant Sec as Security/Privacy Review
    participant AI as AI Engineering
    participant QA as AI Evaluation
    participant Ops as Operations
    participant Audit as Audit Evidence

    Feature->>Sec: Proposes AI feature and data use
    Sec-->>Feature: Classifies risk and required controls
    Feature->>AI: Implements governed AI flow
    AI->>QA: Runs eval, safety, context tests
    QA-->>Ops: Provides release evidence
    Ops->>Audit: Records monitoring, review, and kill-switch readiness
```

---

# Secure-by-Design Checklist

- [ ] AI feature owner is assigned.
- [ ] AI risk level is assigned.
- [ ] Data/context sources are identified.
- [ ] Authorization boundary is enforced.
- [ ] Prompt template is versioned.
- [ ] RAG/knowledge eligibility is defined.
- [ ] Human review rule is defined.
- [ ] Output safety rules are defined.
- [ ] Provider risk is considered.
- [ ] Evaluation evidence exists.
- [ ] Audit metadata is defined.
- [ ] Kill switch/fallback exists.

---

# Acceptance Criteria

- [ ] Governance scope is clear.
- [ ] AI feature risk is clear.
- [ ] Context and data rules are clear.
- [ ] Human review expectations are clear.
- [ ] Evaluation and monitoring expectations are clear.
- [ ] Incident/disable path is clear.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Direct AI calls from UI.
- Sending full raw data by default.
- Using unauthorized context.
- Treating prompt text as unreviewed implementation detail.
- Auto-sending AI replies in MVP.
- No AI evaluation before release.
- No kill switch.
- No provider risk review.
- Logging full prompts/outputs without justification.
- Leaving AI behavior unexplained during incident investigation.

---

# Related Documents

- ../PART-04-Data-Protection-and-Privacy-Governance/42-AI-Data-Privacy-and-Context-Governance.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-06-AI-Implementation-Plan/README.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-08-Security-Implementation-Plan/140-AI-Security-Controls.md
- ../../BOOK-05-Engineering-Execution-Plan/PART-09-Testing-and-QA-Execution/154-AI-Evaluation-and-Testing.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-AI-GOVERNANCE-MAP.md

---

# Navigation

**Previous:** `50-AI-Feature-Risk-Classification.md`

**Next:** `52-Prompt-Governance.md`

---

# AI Inventory Fields

Track:

```text
AI feature name
purpose
owner
risk level
model/provider
prompt template id/version
input data categories
context sources
RAG source eligibility
output type
customer-visible yes/no
human review rule
audit events
evaluation set
monitoring metrics
kill switch
```

---

# Ownership Rules

Every AI feature needs:

```text
product owner
engineering owner
security/privacy reviewer where high-risk
operations owner for monitoring/fallback
```

---

# Shadow AI Rule

No CLARA module should call model providers outside the approved AI Gateway.
