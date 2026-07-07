---
project: "CLARA"
artifact: "MVP First Product Slice UX Flow + UI Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Product Design, Product, Engineering, Security, and AI Team"
last_updated: "2026-07-07"
classification: "ux-flow-ui-specification"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
source_of_truth:
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-02-Master-Blueprint/"
  - "docs/BOOK-04-Product-Domain-Specification/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 06 — AI Draft UX Spec

> *"The AI draft UX must make review feel natural and auto-send feel impossible."*

---

# Purpose

This document defines how AI-assisted reply draft should appear and behave.

---

# AI Draft Entry Point

Button:

```text
Generate AI Draft
```

Placement:

```text
inside reply composer area
near manual reply textarea
```

---

# AI Draft States

```text
idle
generating
draft_ready
draft_failed
regenerating
permission_denied
```

---

# Idle State

Display:

```text
[Generate AI Draft]
```

Helper text optional:

```text
AI will draft a reply using this conversation and customer context.
```

---

# Generating State

Display:

```text
Generating AI draft...
```

Behavior:

```text
show spinner/progress
disable Generate button
keep manual composer available if possible
do not disable entire conversation screen
```

---

# Draft Ready State

Display label:

```text
AI-assisted draft · Review before sending
```

Composer:

```text
editable textarea containing generated draft
```

Actions:

```text
Regenerate Draft
Send Reply
Clear Draft
```

---

# Draft Failed State

Display:

```text
AI draft is unavailable right now. You can still write a manual reply.
```

Actions:

```text
Try AI Again
Write Manually
```

---

# Permission Denied State

For Viewer role:

```text
AI draft unavailable for view-only users.
```

Prefer hiding the AI button, but direct API attempts must be blocked server-side.

---

# AI Draft Microcopy

Use clear language:

```text
AI-assisted draft
Review before sending
You are responsible for the final message
This draft may need edits
```

Avoid:

```text
AI replied
Auto reply sent
Guaranteed answer
Approved response
```

---

# Regenerate Behavior

When user clicks Regenerate:

```text
if current composer has unsaved edits, ask confirmation
or preserve previous draft in draft history if implemented later
```

MVP can use confirmation:

```text
Replace current draft with a new AI draft?
```

---

# Human Review Guardrail

The send button must always require explicit click.

No auto-send flow in MVP.

---

# Prompt Injection UX Note

Users do not need to see prompt injection details.

But if AI output seems blocked by safety checks, show safe copy:

```text
AI could not generate a safe draft for this conversation. Please reply manually or escalate.
```

---

# AI Draft UX Rule

```text
The UI must never present AI text as already sent, approved, or guaranteed correct.
```
