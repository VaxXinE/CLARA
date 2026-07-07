---
project: "CLARA"
artifact: "MVP First Product Slice Security & Privacy Checklist"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Security, Engineering, Product, AI, Data, and Product Operations Team"
last_updated: "2026-07-07"
classification: "security-privacy-checklist"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-UX-UI-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-DATABASE-MIGRATION-SPEC/"
source_of_truth:
  - "SECURITY.md"
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-07-Operations-Observability-and-Reliability/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 09 — Frontend Security and UX Safety Checklist

> *"The frontend should guide users into safe behavior, while backend enforces the rules."*

---

# Permission UX Checklist

- [ ] Owner can see AI draft button.
- [ ] Agent can see AI draft button.
- [ ] Viewer cannot use AI draft action.
- [ ] Owner can see send button.
- [ ] Agent can see send button.
- [ ] Viewer cannot use send action.
- [ ] Viewer sees view-only explanation.
- [ ] Buttons do not flash visible before permissions load.

---

# AI Draft UX Checklist

- [ ] AI draft is labeled `AI-assisted draft`.
- [ ] UI shows `Review before sending`.
- [ ] Draft is editable.
- [ ] Send requires explicit click.
- [ ] AI loading state exists.
- [ ] AI error state exists.
- [ ] Manual reply is available if AI fails.
- [ ] Regenerate does not silently discard user edits.

---

# Output Rendering Checklist

- [ ] Message body rendered as text, not raw HTML.
- [ ] Reply draft rendered safely.
- [ ] Customer notes rendered safely.
- [ ] Activity metadata rendered safely.
- [ ] No `dangerouslySetInnerHTML` or equivalent without sanitization.
- [ ] Links, if auto-linked in future, are sanitized.

---

# Error Display Checklist

Do not show:

```text
stack trace
SQL error
raw provider error
API key
token
internal file path
hidden prompt
```

Show safe messages:

```text
AI draft is unavailable right now. You can still write manually.
Reply could not be sent. Your draft is still here.
You do not have permission to perform this action.
```

---

# Draft Preservation Checklist

- [ ] Draft remains if send fails.
- [ ] Draft remains if network error occurs.
- [ ] User confirms before replacing edited draft with regenerated AI draft.
- [ ] Composer does not clear until success.

---

# CSRF/XSS Direction

Depending auth mode:

```text
cookie session -> CSRF protection required
bearer token -> protect token storage and avoid XSS exposure
```

Frontend must avoid:

```text
storing long-lived sensitive tokens in localStorage if avoidable
rendering untrusted HTML
logging sensitive data to console
```

---

# Browser Console Checklist

- [ ] No token logged.
- [ ] No API key logged.
- [ ] No full customer message logged in production.
- [ ] No hidden prompt logged.
- [ ] Dev logs gated by environment.

---

# Frontend Rule

```text
Frontend may reduce user mistakes, but backend must prevent unauthorized actions.
```
