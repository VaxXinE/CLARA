---
book: "Book V — Engineering Execution Plan"
part: "PART-04 — Frontend Implementation Plan"
chapter: "54"
title: "API Client and Error Handling"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan"
previous: "53-State-Management-and-Data-Fetching.md"
next: "55-Forms-Validation-and-UX.md"
project: "CLARA"
---

# API Client and Error Handling

> *"Defines frontend API client structure, typed contracts, request behavior, error mapping, and user-facing error handling."*

---

# Purpose

Defines frontend API client structure, typed contracts, request behavior, error mapping, and user-facing error handling.

---

# Execution Problem

Direct fetch calls scattered across components make error handling inconsistent and increase security and maintenance risk.

---

# Engineering Decision

## Decision

CLARA frontend should use a centralized typed API client and consistent error-handling layer.

## Status

Accepted.

---

# Frontend Implementation Rule

Every frontend feature must be designed as:

```text
Route/Page -> Permission-aware UI -> Data Fetching -> Safe Rendering -> User Action -> API Call -> Loading/Error/Success State
```

Frontend may improve usability with permission-aware visibility and disabled states.

Frontend must not be the final authorization layer.

Backend remains the source of truth for access control.

---

# Recommended Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as Frontend UI
    participant Perm as Permission UI Helper
    participant APIClient as Typed API Client
    participant Backend as Backend API

    User->>UI: Opens page or performs action
    UI->>Perm: Check local permission/entitlement hints
    Perm-->>UI: Show, hide, disable, or explain action
    UI->>APIClient: Fetch or mutate data
    APIClient->>Backend: Send authenticated request
    Backend-->>APIClient: Return safe DTO or safe error
    APIClient-->>UI: Map response/error
    UI-->>User: Render loading, success, empty, or error state
```

---

# Secure-by-Design Checklist

- [ ] No secrets are exposed in frontend code.
- [ ] Backend authorization is still required.
- [ ] User-generated content is safely rendered.
- [ ] Dangerous actions use confirmation.
- [ ] AI-generated output is labeled.
- [ ] AI-generated output is editable/rejectable where customer-visible.
- [ ] Loading, empty, error, and success states are handled.
- [ ] Forms validate obvious input client-side.
- [ ] Server validation errors are displayed safely.
- [ ] Permission-denied states are safe and understandable.
- [ ] Tests cover critical user interactions.
- [ ] Accessibility basics are considered.

---

# Acceptance Criteria

- [ ] Implementation direction is clear.
- [ ] UX behavior is consistent with Book IV.
- [ ] Frontend responsibilities are separated from backend responsibilities.
- [ ] Permission-aware UI is defined without replacing backend authorization.
- [ ] Testing expectations are included.
- [ ] Security and accessibility expectations are included.
- [ ] AI coding assistants can follow this chapter safely.

---

# Anti-patterns

Avoid:

- Hiding buttons and assuming that means authorization.
- Calling APIs directly from random deeply nested components.
- Rendering raw HTML from user/customer/AI content without sanitization.
- Putting API keys or secrets in frontend environment variables.
- Duplicating table/form/modal logic across modules.
- Showing generic broken UI for every error state.
- Treating AI output as normal human-written text.
- Building complex UI builders before simple workflows work.

---

# Related Documents

- ../PART-01-Execution-Strategy/README.md
- ../PART-02-Repository-and-Development-Workflow/README.md
- ../PART-03-Backend-Implementation-Plan/README.md
- ../../BOOK-04-Product-Domain-Specification/README.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-PERMISSION-MAP.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-AI-GOVERNANCE-MAP.md

---

# Navigation

**Previous:** `53-State-Management-and-Data-Fetching.md`

**Next:** `55-Forms-Validation-and-UX.md`

---

# API Client Responsibilities

Central API client should handle:

```text
Base URL
Authentication credentials/cookies
Request IDs if needed
JSON parsing
Error mapping
Typed response contracts
Retry policy where safe
```

---

# Error UX Mapping

| Backend Error | UI Behavior |
|---|---|
| 400 Validation | Show field/global validation message |
| 401 Unauthenticated | Redirect/login/session expired |
| 403 Permission denied | Show access denied or disabled action |
| 404 Not found | Show safe not-found page/state |
| 409 Conflict | Show conflict resolution message |
| 429 Rate limit | Show retry later message |
| 500 Internal | Show safe generic error with request ID |
