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


# 10 — Demo Mode

> *"Demo mode should show realistic product value without using real customer data or real provider credentials."*

---

# Purpose

This document defines how to run MVP demo mode safely.

---

# Demo Mode Defaults

Recommended:

```bash
APP_ENV=development
DEMO_MODE=true
AUTH_MODE=mock
MOCK_AUTH_ENABLED=true
AI_PROVIDER=mock
AI_MOCK_ENABLED=true
SEND_ADAPTER=simulated
SIMULATED_SEND_ENABLED=true
SEED_DEMO_DATA=true
```

---

# Demo Users

```text
Owner Demo
Agent Demo
Viewer Demo
```

---

# Demo Flow

```text
1. Login/open as Agent.
2. Open conversation inbox.
3. Select Budi conversation.
4. Review message history.
5. Review customer profile sidebar.
6. Generate AI draft.
7. Edit draft.
8. Send simulated reply.
9. Show activity timeline.
10. Switch to Viewer.
11. Show Viewer cannot draft/send.
```

---

# Demo Data

Use only:

```text
fake names
.test emails
dummy phone numbers
fake conversations
```

Do not use:

```text
real customer chats
real screenshots
real phone numbers
real provider tokens
```

---

# Demo Validation Checklist

Before demo:

- [ ] API starts.
- [ ] Dashboard starts.
- [ ] Demo seed loaded.
- [ ] Agent can draft/send.
- [ ] Viewer cannot draft/send.
- [ ] AI failure fallback tested.
- [ ] Send failure fallback tested.
- [ ] Activity timeline updates.
- [ ] No `.env` staged in git.
- [ ] No secrets visible in UI/logs.

---

# Demo Failure Fallbacks

## AI Fails

Say:

```text
This demonstrates the safe fallback: CLARA does not block the human. The agent can still reply manually.
```

## Send Fails

Say:

```text
The draft is preserved so the agent does not lose work.
```

## Viewer Can Send

Stop demo.

This is a P0 security issue.

---

# Demo Rule

```text
The demo should prove human-in-control AI, not autonomous AI.
```
