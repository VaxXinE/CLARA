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


# 09 — Responsive, Accessibility, and Copy

> *"Good MVP UX is not fancy. It is clear, usable, and hard to misuse."*

---

# Responsive Scope

MVP is:

```text
desktop-first
tablet-tolerant
mobile deferred
```

---

# Desktop Width

Recommended:

```text
>= 1200px
```

Layout:

```text
three panels
```

---

# Tablet Width

Recommended behavior:

```text
left inbox collapsible
profile panel collapsible
conversation detail remains primary
```

---

# Mobile Width

Out of MVP.

Acceptable MVP behavior:

```text
show unsupported/simplified view
or single-column layout if easy
```

Do not block MVP on mobile polish.

---

# Accessibility Requirements

Minimum:

```text
keyboard navigable conversation rows
focus visible on buttons/inputs
buttons have clear labels
loading states announced through text
error messages visible near action
color not the only status signal
textarea has accessible label
```

---

# Keyboard Interaction

Conversation row:

```text
Enter selects conversation
Arrow navigation optional P2
```

Composer:

```text
textarea supports normal typing
Send button explicit click
Ctrl/Cmd+Enter send optional P2
```

Do not add keyboard send shortcut in MVP unless clearly communicated.

---

# Button Labels

Use:

```text
Generate AI Draft
Try AI Again
Send Reply
Clear Draft
Regenerate Draft
```

Avoid:

```text
Magic Reply
Auto Send
AI Send
Instant Reply
```

---

# AI Copy

Use:

```text
AI-assisted draft
Review before sending
This draft may need edits
```

Avoid:

```text
AI has answered
Approved response
Guaranteed reply
```

---

# Error Copy

Use:

```text
AI draft is unavailable right now. You can still write manually.
Reply could not be sent. Your draft is still here.
You do not have permission to perform this action.
```

---

# Privacy Copy

Where needed:

```text
Only use customer context that is visible in this workspace.
```

---

# Copy Rule

```text
Copy should reduce over-trust in AI while keeping the workflow friendly.
```
