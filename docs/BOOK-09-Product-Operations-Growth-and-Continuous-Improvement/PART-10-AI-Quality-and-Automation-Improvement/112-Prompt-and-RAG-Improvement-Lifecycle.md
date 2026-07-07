---
book: "Book IX — Product Operations, Growth & Continuous Improvement"
part: "PART-10 — AI Quality and Automation Improvement"
chapter: "112"
title: "Prompt and RAG Improvement Lifecycle"
version: "1.0.0"
status: "official"
owner: "CLARA AI Quality and Automation Operations Team"
last_updated: "2026-07-07"
classification: "ai-quality-automation-improvement"
previous: "111-Human-Review-Analytics.md"
next: "113-AI-Safety-and-Guardrail-Review.md"
project: "CLARA"
---

# Prompt and RAG Improvement Lifecycle

> *"Defines lifecycle for prompt templates, prompt versions, retrieval sources, context quality, evaluation sets, rollout, rollback, and documentation."*

---

# Purpose

Defines lifecycle for prompt templates, prompt versions, retrieval sources, context quality, evaluation sets, rollout, rollback, and documentation.

---

# AI and Automation Problem

Unversioned prompt and retrieval changes make AI behavior unpredictable and hard to debug.

---

# AI and Automation Decision

## Decision

CLARA prompt and RAG improvements should be versioned, evaluated, reviewed, safely rolled out, and monitored after release.

## Status

Accepted.

---

# AI Quality Rule

Every CLARA AI or automation improvement should connect:

```text
Signal -> Quality/Safety Classification -> Human Review Evidence -> Prompt/RAG/Automation Change -> Evaluation -> Rollout -> Monitoring -> Rollback Path -> Documentation
```

An AI or automation operation is not mature if it cannot answer:

```text
what quality or safety issue exists
what workflow/customer segment is affected
what human review evidence exists
what prompt/RAG/model/automation version is involved
what guardrail or fallback applies
how cost and latency are affected
how rollback works
how success will be validated
what customer/support communication is needed
```

---

# Recommended AI Improvement Flow

```mermaid
sequenceDiagram
    participant User as User/Customer
    participant AI as AI Gateway/Automation
    participant Review as Human Review
    participant Metrics as AI Analytics
    participant Product as Product Ops
    participant Eng as Engineering/AI Owner
    participant Support as Support/Success

    User->>AI: Uses AI-assisted workflow
    AI->>Review: Sends output for review if needed
    Review->>Metrics: Records approval/edit/rejection reason
    Metrics->>Product: Reports quality/safety/cost signals
    Product->>Eng: Prioritizes prompt/RAG/automation improvement
    Eng->>AI: Ships versioned improvement with rollback
    Support->>Product: Adds customer feedback and support themes
```

---

# Production-Ready Checklist

- [ ] AI quality signal is captured.
- [ ] Human review data is structured.
- [ ] Prompt/RAG version is identifiable.
- [ ] Safety guardrails are reviewed.
- [ ] Automation failure modes are known.
- [ ] Cost and latency are monitored.
- [ ] Rollback and kill switch exist.
- [ ] Customer trust/explainability is considered.
- [ ] Metrics validate improvement.
- [ ] Documentation and support guidance are updated.

---

# Acceptance Criteria

- [ ] AI quality is measurable.
- [ ] Automation failures are detectable.
- [ ] High-impact actions have guardrails.
- [ ] Prompt/RAG changes are versioned.
- [ ] Rollback paths exist.
- [ ] Cost and latency are controlled.
- [ ] Customer trust is preserved.
- [ ] AI coding assistants can apply this safely.

---

# Anti-patterns

Avoid:

- Automating before measuring.
- No human review for risky actions.
- Unversioned prompt changes.
- No RAG source quality review.
- Ignoring hallucination reports.
- Measuring AI only by usage volume.
- No kill switch.
- No rollback.
- Over-collecting sensitive data for AI context.
- Provider/model changes without evaluation.
- Cost increases hidden from product review.

---

# Related Documents

- ../../BOOK-04-Data-API-AI-and-Integration-Design/
- ../../BOOK-06-Security-Governance-and-Compliance/
- ../../BOOK-07-Operations-Observability-and-Reliability/
- ../../BOOK-08-Implementation-Delivery-and-Production-Launch/
- ../PART-06-Analytics-and-Product-Insights/README.md
- ../PART-09-Continuous-Reliability-and-Performance-Improvement/README.md

---

# Navigation

**Previous:** `111-Human-Review-Analytics.md`

**Next:** `113-AI-Safety-and-Guardrail-Review.md`

---

# Prompt Lifecycle States

Use:

```text
draft
evaluation
limited_rollout
active
deprecated
rolled_back
archived
```

---

# Prompt Version Record

Track:

```text
prompt_id
version
use case
owner
change summary
evaluation set
approval evidence
rollout percentage
rollback version
known limitations
created_at
deprecated_at
```

---

# RAG Improvement Areas

Review:

```text
source freshness
source permissions
retrieval relevance
chunk quality
missing documents
incorrect context
stale knowledge
tenant/workspace scoping
citation/source explainability
```

---

# Prompt/RAG Rule

Prompt and RAG changes should be versioned, evaluated, and reversible.
