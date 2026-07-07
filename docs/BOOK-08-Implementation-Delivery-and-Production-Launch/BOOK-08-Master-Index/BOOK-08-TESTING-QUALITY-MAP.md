---
book: "Book VIII — Implementation, Delivery & Production Launch"
artifact: "BOOK-08 Master Index"
title: "BOOK-08 Testing Quality Map"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering Leadership Team"
last_updated: "2026-07-07"
classification: "book-08-master-index"
project: "CLARA"
---


# BOOK-08 Testing Quality Map

> *"Quality is not one test type. Quality is a layered defense against production failure."*

---

# Purpose

This document maps the testing and quality system across Book VIII.

---

# Quality System Map

```mermaid
flowchart TD
    Feature[Feature Change] --> Unit[Unit Tests]
    Feature --> Integration[Integration Tests]
    Feature --> Contract[Contract Tests]
    Feature --> E2E[E2E Tests]
    Feature --> Security[Security Tests]
    Feature --> Performance[Performance Tests]
    Feature --> AI[AI Quality Safety Tests]

    Unit --> CI[CI Quality Gates]
    Integration --> CI
    Contract --> CI
    E2E --> CI
    Security --> CI
    Performance --> CI
    AI --> CI

    CI --> Release[Release Regression]
    Release --> Monitor[Post-Release Monitoring]
    Monitor --> Hardening[Hardening Backlog]
```

---

# Test Layer Responsibilities

```text
unit tests protect business rules
integration tests protect module/dependency behavior
contract tests protect boundaries
e2e tests protect critical user journeys
security tests protect abuse cases
performance tests protect budgets and capacity
AI quality tests protect prompts, RAG, guardrails, and cost
release regression protects launch confidence
```

---

# Required Quality Gates

```text
format
lint
typecheck
unit tests
integration tests
contract tests
migration check
security scan
secret scan
build
selected e2e smoke
AI regression where prompt/AI behavior changes
```

---

# Quality Rule

A gate that protects production-critical behavior must be blocking.
