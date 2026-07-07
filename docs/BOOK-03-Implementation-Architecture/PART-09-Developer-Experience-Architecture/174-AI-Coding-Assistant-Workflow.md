---
book: "Book III — Implementation Architecture"
part: "PART-09 — Developer Experience Architecture"
chapter: "174"
title: "AI Coding Assistant Workflow"
version: "1.0.0"
status: "official"
owner: "Clara Developer Experience Team"
last_updated: "2026-07-07"
classification: "implementation-architecture"
previous: "./173-Documentation-Workflow.md"
next: "./175-Code-Generation-Standards.md"
---

# AI Coding Assistant Workflow

> *"Defines safe use of AI coding assistants including context files, prompt rules, review requirements, and forbidden patterns."*

---

# Purpose

Defines safe use of AI coding assistants including context files, prompt rules, review requirements, and forbidden patterns.

---

# Motivation

Developer experience directly affects production quality.

If the right workflow is hard, developers and AI coding assistants will drift toward shortcuts: inconsistent structure, missing tests, unsafe secrets handling, weak authorization checks, poor documentation, and fragile releases.

Clara must design developer experience so secure and production-ready engineering becomes the default path.

This chapter defines how **AI Coding Assistant Workflow** should be implemented consistently.

---

# Architecture Decision

## Decision

Clara AI coding assistants should operate from documented architecture context and generated code must be reviewed as untrusted contribution.

## Status

Accepted.

## Reason

- Reduces developer friction.
- Improves onboarding speed.
- Makes architecture easier to follow.
- Helps human and AI contributors produce consistent code.
- Improves security and quality through automation.
- Reduces production risk from workflow mistakes.

## Trade-offs

| Benefit | Trade-off |
|---|---|
| Faster onboarding | More tooling to maintain |
| More consistent code | More conventions to learn |
| Safer AI-generated code | More prompt and review discipline |
| Better quality gates | Longer CI if unmanaged |
| Better documentation | Requires documentation ownership |

---

# Reference Architecture

```mermaid
flowchart TD
    Contributor[Contributor] --> Setup[Local Setup]
    Setup --> Repo[Monorepo]
    Repo --> Tooling[Developer Tooling]
    Tooling --> Scaffold[Scaffolding]
    Tooling --> Validate[Validation]
    Validate --> Tests[Tests]
    Tests --> PR[Pull Request]
    PR --> Review[Review]
    Review --> CI[CI Quality Gates]
    CI --> Merge[Merge]
    Merge --> Release[Release Workflow]
    Contributor --> Docs[Architecture Docs]
    Contributor --> AI[AI Assistant]
    AI --> Rules[AGENTS / Standards / Docs]
```

---

# Sequence Diagram

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Docs as Architecture Docs
    participant CLI as Developer CLI
    participant AI as AI Assistant
    participant PR as Pull Request
    participant CI as CI Pipeline
    participant Review as Reviewers

    Dev->>Docs: Read relevant architecture
    Dev->>CLI: Scaffold or validate work
    Dev->>AI: Generate or refactor with rules
    AI-->>Dev: Proposed code
    Dev->>CLI: Run local quality checks
    CLI-->>Dev: Feedback
    Dev->>PR: Submit change
    PR->>CI: Run quality/security gates
    PR->>Review: Request review
    Review-->>PR: Approve or request changes
    CI-->>PR: Pass or fail
```

---

# Recommended Folder Structure

```text
repo/
├── apps/
├── packages/
├── docs/
│   ├── BOOK-01-Clara-Foundation/
│   ├── BOOK-02-Master-Blueprint/
│   └── BOOK-03-Implementation-Architecture/
│
├── tooling/
│   ├── cli/
│   ├── generators/
│   ├── validators/
│   ├── mock-api/
│   └── quality/
│
├── scripts/
│   ├── setup/
│   ├── dev/
│   ├── test/
│   └── release/
│
├── .github/
│   ├── workflows/
│   └── pull_request_template.md
│
├── AGENTS.md
└── README.md
```

---

# Code Skeleton

```markdown
# AI Assistant Prompt Pattern

You are editing Clara.
Read:
- docs/BOOK-03-Implementation-Architecture/PART-01-Backend-Architecture/
- relevant module docs
- AGENTS.md

Rules:
- Preserve architecture boundaries.
- Add tests.
- Do not hard-code secrets.
- Enforce authorization.
- Enforce tenant scope.
- Do not bypass quality gates.
```

---

# Implementation Guidelines

- Automate repetitive development workflows.
- Keep local setup reproducible.
- Keep documentation close to implementation.
- Use templates for repeated architecture patterns.
- Make quality checks easy to run locally.
- Make CI gates match local developer checks.
- Use AI assistants with explicit project rules.
- Review AI-generated code as untrusted code.
- Keep secrets out of local and repository defaults.
- Prefer synthetic test data.
- Track developer friction and improve it.

---

# Production Checklist

- [ ] Workflow is documented.
- [ ] Local setup is reproducible.
- [ ] Quality checks can run locally.
- [ ] CI quality gates exist.
- [ ] Architecture docs are linked.
- [ ] AI assistant rules are documented.
- [ ] Code generation produces tests.
- [ ] Dependency policy exists.
- [ ] PR review checklist exists.
- [ ] Security-sensitive changes require review.

---

# Security Checklist

- [ ] No secrets are committed.
- [ ] Local development uses safe dummy credentials.
- [ ] AI prompts do not include real secrets.
- [ ] Generated code is reviewed for authorization and tenant isolation.
- [ ] Dependency additions are scanned.
- [ ] Mock APIs do not expose real customer data.
- [ ] Debugging workflows avoid sensitive production data.
- [ ] PR checklist includes security impact.
- [ ] DevSecOps gates block unsafe changes.

---

# Performance Checklist

- [ ] Local setup is fast enough for daily work.
- [ ] CI duration is monitored.
- [ ] Slow tests are separated from fast PR checks.
- [ ] Tooling caches dependencies safely.
- [ ] Code generation reduces repetitive work.
- [ ] Mock APIs reduce dependency on slow external systems.
- [ ] Developer metrics identify bottlenecks.
- [ ] Documentation is easy to find.

---

# Anti-patterns

Avoid:

- Manual setup steps that are not documented.
- CI checks that cannot be reproduced locally.
- AI-generated code accepted without review.
- Generated modules without tests.
- PRs too large to review safely.
- Documentation updated only after implementation drifts.
- Real production data in local development.
- Secrets in examples or screenshots.
- Dependency additions without review.
- Quality gates that can be bypassed silently.

---

# Testing Strategy

Recommended tests:

- CLI command tests.
- Generator output tests.
- Architecture validation tests.
- Documentation link checks.
- PR template validation.
- Dependency policy tests.
- Mock API contract tests.
- Local setup smoke tests.
- CI workflow validation.
- Security scan checks.

---

# AI Coding Guidelines

When using Codex, Cursor, Claude Code, Gemini CLI, or another AI coding assistant:

- Provide relevant Book III chapter context.
- Provide AGENTS.md and module-specific rules.
- Ask for tests with every implementation.
- Ask for architecture boundaries to be preserved.
- Ask for authorization and tenant isolation checks.
- Ask it to avoid secrets, real tokens, and production data.
- Reject generated code that bypasses quality gates.
- Reject generated code that invents architecture not documented.
- Reject generated code that only implements happy paths.
- Review all generated code like code from an unknown contributor.

---

# Related Documents

- ../PART-01-Backend-Architecture/README.md
- ../PART-02-Frontend-Architecture/README.md
- ../PART-07-Security-Implementation/README.md
- ../PART-08-Testing-Quality-Architecture/README.md
- ../../BOOK-01-Clara-Foundation/README.md
- ../../BOOK-02-Master-Blueprint/README.md

---

# Navigation

**Previous:** ./173-Documentation-Workflow.md

**Next:** ./175-Code-Generation-Standards.md
