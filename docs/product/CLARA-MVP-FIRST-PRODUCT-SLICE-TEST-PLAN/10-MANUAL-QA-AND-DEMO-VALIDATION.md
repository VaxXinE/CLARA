---
project: "CLARA"
artifact: "MVP First Product Slice Test Plan"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA QA, Engineering, Security, Product, AI, and Product Operations Team"
last_updated: "2026-07-08"
classification: "test-plan"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-UX-UI-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-DATABASE-MIGRATION-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/"
source_of_truth:
  - "SECURITY.md"
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-07-Operations-Observability-and-Reliability/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 10 — Manual QA and Demo Validation

> *"Manual QA verifies the product feels coherent, not just that endpoints return JSON."*

---

# Purpose

This document defines manual QA and demo validation steps.

---

# Manual QA Setup

Use:

```text
demo organization
demo workspace
owner user
agent user
viewer user
fake customers
fake conversations
mock AI provider
simulated send adapter
```

---

# QA Scenario 1 — Agent Reply with AI Draft

Steps:

```text
1. Login as Agent.
2. Open conversation workspace.
3. Select Budi conversation.
4. Review customer profile.
5. Click Generate AI Draft.
6. Verify AI draft label.
7. Edit draft.
8. Click Send Reply.
9. Verify outgoing message appears.
10. Verify activity timeline shows AI draft and reply sent.
```

Pass if:

```text
workflow completes
draft is editable
send is manual
activity updates
no unsafe error shown
```

---

# QA Scenario 2 — Manual Reply Without AI

Steps:

```text
1. Login as Agent.
2. Open Sari conversation.
3. Type manual reply.
4. Send reply.
5. Verify sent message and activity.
```

Pass if:

```text
AI is not required
reply sends/simulates successfully
activity updates
```

---

# QA Scenario 3 — Viewer Access

Steps:

```text
1. Login as Viewer.
2. Open conversation.
3. Confirm messages/profile visible.
4. Confirm AI/send actions unavailable.
5. Try direct API if manual testing tools available.
```

Pass if:

```text
viewer cannot draft/send
backend blocks forbidden action
```

---

# QA Scenario 4 — AI Failure

Steps:

```text
1. Enable mock AI failure.
2. Login as Agent.
3. Click Generate AI Draft.
4. Verify safe error.
5. Write manual reply.
6. Send reply.
```

Pass if:

```text
manual path works despite AI failure
draft/composer not destroyed
```

---

# QA Scenario 5 — Send Failure

Steps:

```text
1. Enable simulated send failure.
2. Write reply.
3. Click Send.
4. Verify safe error.
5. Verify draft preserved.
```

---

# Demo Validation Flow

Demo should show:

```text
login
inbox
conversation detail
customer sidebar
AI draft
human edit
manual send
activity timeline
viewer cannot send
```

---

# Demo Readiness Checklist

Confirm all items before presenting the MVP:

```text
repository structure validation passed
API typecheck/test/build passed
dashboard typecheck/test/build passed
API production dependency audit passed
dashboard production dependency audit passed
viewer cannot generate AI draft
viewer cannot send reply
owner/agent can generate AI draft
owner/agent can send reply
cross-workspace access returns 404
safe errors do not expose stack traces or raw provider payloads
AI draft remains draft-only until a human clicks Send Reply
```

---

# Demo Talk Track

Key message:

```text
CLARA helps the team respond faster with customer context and AI draft assistance, but the human stays in control.
```

---

# Manual QA Rule

```text
If the demo makes AI look autonomous, the UX is not ready.
```

Known limitation:

```text
Only mock AI draft and simulated reply send are available. No real WhatsApp/Instagram/TikTok/email integration exists in this MVP slice yet.
```
