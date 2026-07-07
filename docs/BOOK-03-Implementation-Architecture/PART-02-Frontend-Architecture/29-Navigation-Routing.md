---
book: "Book III — Implementation Architecture"
part: "PART-02 — Frontend Architecture"
chapter: "29"
title: "Navigation Routing"
version: "1.0.0"
status: "official"
owner: "Clara Architecture Team"
last_updated: "2026-07-07"
classification: "implementation-architecture"
previous: "./28-Project-Structure.md"
next: "./30-State-Management.md"
---

# Navigation Routing

> *"Defines frontend navigation, routing, route protection, deep links, and user flow consistency."*

---

# Purpose

Defines frontend navigation, routing, route protection, deep links, and user flow consistency.

---

# Motivation

Clara frontend must support many users, workflows, modules, and AI-assisted experiences.

Without clear frontend architecture, UI code can become tightly coupled, difficult to test, inconsistent, inaccessible, and insecure.

This chapter defines how **Navigation Routing** should be implemented consistently across Clara client applications.

---

# Architecture Decision

## Decision

Clara frontend should use centralized typed routing with route guards for authentication, authorization, workspace context, and feature availability.

## Status

Accepted.

## Reason

- Improves consistency across product surfaces.
- Keeps UI code maintainable.
- Supports secure frontend behavior.
- Improves developer and AI coding assistant productivity.
- Reduces duplication across feature modules.

## Trade-offs

| Benefit | Trade-off |
|---|---|
| More consistent frontend code | More conventions to follow |
| Easier testing | More upfront structure |
| Better UX consistency | Requires design system discipline |
| Better AI-generated code | Requires explicit architecture guidance |

---

# Reference Architecture

```mermaid
flowchart TD
    App[App Shell] --> Feature[Feature Module]
    Feature --> Presentation[Presentation]
    Feature --> State[State Controller]
    State --> Repository[Repository]
    Repository --> ApiClient[API Client]
    Presentation --> DesignSystem[Design System]
    State --> LocalStorage[Local Storage if needed]
    ApiClient --> Backend[Backend API]
```

---

# Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Widget
    participant Controller
    participant Repository
    participant ApiClient
    participant Backend

    User->>Widget: Interact
    Widget->>Controller: Dispatch intent
    Controller->>Repository: Request data/action
    Repository->>ApiClient: API call
    ApiClient->>Backend: HTTP request
    Backend-->>ApiClient: Response
    ApiClient-->>Repository: Typed DTO
    Repository-->>Controller: Result
    Controller-->>Widget: State update
    Widget-->>User: Render UI
```

---

# Recommended Folder Structure

```text
lib/
├── app/
│   ├── app.dart
│   ├── router.dart
│   └── bootstrap.dart
│
├── core/
│   ├── errors/
│   ├── result/
│   ├── validation/
│   └── utils/
│
├── design_system/
│   ├── components/
│   ├── tokens/
│   └── theme/
│
├── features/
│   └── <feature>/
│       ├── domain/
│       ├── application/
│       ├── data/
│       └── presentation/
│
└── platform/
    ├── api/
    ├── auth/
    ├── storage/
    ├── localization/
    └── observability/
```

---

# Code Skeleton

```dart
final appRouter = GoRouter(
  routes: [
    GoRoute(
      path: '/customers',
      builder: (context, state) => const CustomerListPage(),
      redirect: authGuard,
    ),
  ],
);

String? authGuard(BuildContext context, GoRouterState state) {
  final session = context.read<SessionController>().state;
  return session.isAuthenticated ? null : '/login';
}

```

---

# Implementation Guidelines

- Keep widgets focused on rendering.
- Put state transitions in controllers.
- Put API calls behind repositories or API clients.
- Use shared design system components.
- Avoid hard-coded colors, spacing, and text.
- Avoid calling backend APIs directly from widgets.
- Map backend errors into safe user-facing messages.
- Keep permission-aware UI separate from backend authorization.
- Write tests for state, rendering, and failure cases.

---

# Production Checklist

- [ ] UI follows design system.
- [ ] State is explicit and testable.
- [ ] API access is typed.
- [ ] Loading, empty, success, and error states exist.
- [ ] Sensitive data is not stored insecurely.
- [ ] User-facing text supports localization.
- [ ] Accessibility basics are covered.
- [ ] Feature works across expected screen sizes.
- [ ] Tests cover critical flows.

---

# Security Checklist

- [ ] Backend remains source of truth for authorization.
- [ ] Tokens are stored only in secure storage.
- [ ] Sensitive data is not logged.
- [ ] Local cache is scoped and classified.
- [ ] Permission UI does not replace server-side checks.
- [ ] Error messages do not expose internals.
- [ ] External links are handled safely.
- [ ] User input is validated before submission.

---

# Performance Checklist

- [ ] Avoid unnecessary rebuilds.
- [ ] Use lazy lists for large collections.
- [ ] Avoid blocking UI thread.
- [ ] Cache only where justified.
- [ ] Optimize images and assets.
- [ ] Paginate large data sets.
- [ ] Avoid repeated API calls on rebuild.
- [ ] Measure before optimizing.

---

# Anti-patterns

Avoid:

- Business logic inside widgets.
- Raw HTTP calls inside UI components.
- Hard-coded colors and spacing.
- Hard-coded user-facing strings.
- Treating hidden buttons as authorization.
- Storing tokens in plain preferences.
- Ignoring loading and error states.
- Giant widgets with multiple responsibilities.
- AI-generated UI that bypasses architecture boundaries.

---

# Testing Strategy

Recommended tests:

- Widget tests for important UI states.
- Unit tests for state controllers.
- Unit tests for validators.
- Repository tests with mocked API clients.
- Golden tests for design system components where useful.
- Integration tests for critical flows.
- Accessibility checks for key screens.

---

# AI Coding Guidelines

When using Codex, Cursor, Claude Code, Gemini CLI, or another AI coding assistant:

- Tell the AI which feature module it is editing.
- Require separation between widget, controller, repository, and API client.
- Require loading, empty, error, and success states.
- Require tests for state controllers and important widgets.
- Do not accept generated UI with hard-coded secrets or tokens.
- Do not accept generated UI that treats frontend permission checks as final authorization.
- Do not accept raw HTTP calls directly from widgets.
- Ask the AI to reuse design system components.

---

# Related Documents

- ../PART-01-Backend-Architecture/README.md
- ../../BOOK-02-Master-Blueprint/PART-02-Organization-Layer/README.md
- ../../BOOK-02-Master-Blueprint/PART-07-Security-Platform/README.md

---

# Navigation

**Previous:** ./28-Project-Structure.md

**Next:** ./30-State-Management.md
