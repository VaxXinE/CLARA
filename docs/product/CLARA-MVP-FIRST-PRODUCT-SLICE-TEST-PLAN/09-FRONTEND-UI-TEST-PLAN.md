---
project: "CLARA"
artifact: "MVP First Product Slice Test Plan"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA QA, Engineering, Security, Product, AI, and Product Operations Team"
last_updated: "2026-07-07"
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


# 09 — Frontend UI Test Plan

> *"Frontend tests should prove that the user can complete the workflow and cannot easily misuse AI."*

---

# Purpose

This document defines frontend UI tests for the MVP.

---

# Screen Coverage

Test:

```text
App Shell
Top Bar
Conversation Inbox
Conversation Detail
Customer Profile Sidebar
Reply Composer
AI Draft Button/States
Send Button/States
Activity Timeline
Empty/Loading/Error States
Permission States
```

---

# Happy Path UI Test

Given:

```text
agent logged in
conversations loaded
```

Steps:

```text
open conversation workspace
select Budi conversation
verify messages visible
verify customer profile visible
click Generate AI Draft
wait for draft
edit draft
click Send Reply
verify outgoing message appears
verify activity event appears
```

---

# Viewer UI Test

Given:

```text
viewer logged in
conversation visible
```

Assert:

```text
conversation visible
customer profile visible
reply composer hidden/read-only
AI draft button hidden/disabled
send button hidden/disabled
view-only notice visible
```

---

# AI Loading State Test

Assert:

```text
Generate button changes to loading
draft area shows generating state
screen remains usable
manual composer not permanently blocked
```

---

# AI Error State Test

Assert:

```text
safe AI error shown
manual composer available
try again action visible
no sent message appears
```

---

# Send Failure UI Test

Assert:

```text
safe send error shown
draft text preserved
send can be retried
composer not cleared
```

---

# Empty State Tests

Assert:

```text
empty inbox message visible
no conversation selected state visible
no customer selected state visible
```

---

# Accessibility Smoke Tests

Check:

```text
buttons have accessible names
textarea has label
focus visible
conversation row selectable with keyboard
error text readable
color not only indicator
```

---

# XSS Rendering Tests

Use message body:

```html
<script>alert("xss")</script>
```

Expected:

```text
rendered as text or safely escaped
script does not execute
```

---

# Frontend Test Rule

```text
The UI should make unsafe actions unavailable, but tests must still rely on backend to enforce security.
```
