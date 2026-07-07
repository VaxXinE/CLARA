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


# 06 — Mock Auth, Mock AI, and Simulated Send

> *"Mock dependencies let us test product behavior without unsafe production integrations."*

---

# Purpose

This document defines local/demo behavior for mock auth, mock AI, and simulated send.

---

# Mock Auth

Mock auth is allowed only in:

```text
development
local demo
CI tests
```

Mock auth must be disabled in:

```text
production
production-like staging unless explicitly isolated
```

---

# Demo Users

Recommended demo users:

```text
owner@example.test
agent@example.test
viewer@example.test
```

Switching demo user can use:

```text
DEFAULT_DEMO_USER=agent
```

Allowed values:

```text
owner
agent
viewer
```

---

# Mock Auth Acceptance

- [ ] `/me` returns selected demo user.
- [ ] Owner/Agent/Viewer roles behave correctly.
- [ ] Mock auth cannot run in production.
- [ ] Mock user is clearly labeled in UI if needed.

---

# Mock AI Provider

Mock AI provider should return deterministic draft text.

Example output:

```text
Hi Budi, terima kasih sudah menghubungi kami. Produk tersebut masih tersedia dan kami bisa bantu proses pesanannya hari ini.
```

Mock AI modes:

```text
success
timeout
provider_error
malformed_output
safety_refusal
```

Suggested env:

```bash
AI_PROVIDER=mock
AI_MOCK_MODE=success
```

---

# Mock AI Acceptance

- [ ] Success returns editable draft.
- [ ] Failure returns safe error.
- [ ] Manual reply remains available.
- [ ] No real provider key required.
- [ ] AI draft endpoint does not send reply.

---

# Simulated Send Adapter

Simulated send is the MVP-safe default.

Suggested env:

```bash
SEND_ADAPTER=simulated
SIMULATED_SEND_MODE=success
```

Modes:

```text
success
failure
timeout
```

---

# Simulated Send Acceptance

- [ ] Success creates outbound message.
- [ ] Success creates activity event.
- [ ] Failure preserves draft.
- [ ] Failure returns safe error.
- [ ] No real channel provider required.

---

# Safety Rule

```text
Mock auth may identify a user, mock AI may draft a reply, but only explicit human send may create an outbound message.
```
