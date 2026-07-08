---
project: "CLARA"
artifact: "MVP First Product Slice README / Runbook"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering, DevOps, Security, QA, Product, and AI Team"
last_updated: "2026-07-07"
classification: "readme-runbook"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-UX-UI-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-DATABASE-MIGRATION-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TEST-PLAN/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-BACKLOG-TASK-BREAKDOWN/"
source_of_truth:
  - "README.md"
  - "AGENTS.md"
  - "SECURITY.md"
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-07-Operations-Observability-and-Reliability/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
---

# 12 — Developer Workflow with AI

> _"AI coding assistants should accelerate implementation without inventing architecture or weakening security."_

---

# Purpose

This document defines how developers should use Codex/Cursor/AI assistant safely for MVP implementation.

---

# Required Reading for AI Assistant

Before coding, instruct AI assistant to read:

```text
AGENTS.md
SECURITY.md
docs/README.md
docs/CLARA-MASTER-DOCUMENTATION-INDEX/CLARA-MASTER-INDEX.md
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-DATABASE-MIGRATION-SPEC/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TEST-PLAN/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-BACKLOG-TASK-BREAKDOWN/
```

---

# AI Prompt Template for Coding Tasks

Use:

```text
Task:
Relevant docs:
Files allowed:
Files forbidden:
Security requirements:
Tests required:
Acceptance criteria:
Output expected:
```

---

# Example Prompt

```text
Task:
Implement POST /api/v1/conversations/{conversation_id}/ai-draft using mock AI provider.

Relevant docs:
- API Spec: 07-AI-DRAFT-ENDPOINTS.md
- Security Checklist: 07-AI-SAFETY-AND-PROMPT-INJECTION-CHECKLIST.md
- Test Plan: 08-AI-DRAFT-TEST-PLAN.md

Security requirements:
- Must enforce authentication.
- Must enforce ai_draft:create permission.
- Must scope conversation/customer by organization_id and workspace_id.
- Must not send reply.
- Must not expose hidden prompt or provider raw error.

Tests required:
- Agent can generate draft.
- Viewer blocked.
- Cross-workspace blocked.
- AI provider failure safe.
- No outbound message created.
```

---

# AI Assistant Must Not

```text
invent undocumented endpoints
hard-code secrets
remove workspace scope
use frontend-only authorization
call AI provider from frontend
auto-send AI draft
log raw prompts/secrets
ignore tests
change schema without migration spec update
```

---

# Review AI Output For

```text
auth/authz
workspace scope
input validation
safe errors
safe logging
tests
docs alignment
maintainability
```

---

# AI Workflow Rule

```text
AI output is a draft. Human review and tests are mandatory before merge.
```
