---
book: "Book VIII — Implementation, Delivery & Production Launch"
part: "PART-08 — Testing and Quality Implementation"
chapter: "94"
title: "CI Quality Gates and Coverage Policy"
version: "1.0.0"
status: "official"
owner: "CLARA Quality Engineering Team"
last_updated: "2026-07-07"
classification: "testing-quality-implementation"
previous: "93-Test-Data-Fixture-and-Mock-Strategy.md"
next: "95-Release-Quality-and-Regression-Strategy.md"
project: "CLARA"
---

# CI Quality Gates and Coverage Policy

> *"Defines CI quality gates, coverage expectations, lint/typecheck/security checks, migration checks, test selection, blocking rules, and evidence reporting."*

---

# Purpose

Defines CI quality gates, coverage expectations, lint/typecheck/security checks, migration checks, test selection, blocking rules, and evidence reporting.

---

# Quality Problem

Quality gates that do not block risky changes become documentation instead of protection.

---

# Quality Decision

## Decision

CLARA CI should block unsafe code through automated quality gates while producing clear evidence for reviewers and release decisions.

## Status

Accepted.

---

# Testing Implementation Rule

Every CLARA production feature should be protected by the smallest useful set of tests across:

```text
unit
integration
contract
end-to-end
security
performance
AI quality/safety where applicable
release regression
```

A feature is not production-ready if it cannot answer:

```text
what critical behavior is tested
what failure cases are tested
what authorization cases are tested
what tenant/workspace isolation cases are tested
what contract is protected
what performance expectation exists
what security abuse case is covered
what test data is used
what CI gate blocks unsafe changes
```

---

# Recommended Quality Flow

```mermaid
sequenceDiagram
    participant Dev as Developer/AI Assistant
    participant Unit as Unit Tests
    participant Int as Integration/Contract Tests
    participant Sec as Security/Performance/AI Tests
    participant CI as CI Quality Gates
    participant Release as Release Regression
    participant Prod as Production Monitoring

    Dev->>Unit: Validate local logic
    Unit->>Int: Validate module boundaries
    Int->>Sec: Validate risk scenarios
    Sec->>CI: Produce gate evidence
    CI->>Release: Approve release candidate
    Release->>Prod: Validate production behavior
    Prod-->>Dev: Feed defects/regressions back to tests
```

---

# Production-Ready Checklist

- [ ] Critical business rules are tested.
- [ ] Important failure paths are tested.
- [ ] Authorization is tested.
- [ ] Tenant/workspace isolation is tested.
- [ ] Contracts are tested.
- [ ] Security abuse cases are tested.
- [ ] Performance risks are considered.
- [ ] AI safety/quality is tested where relevant.
- [ ] Test data is safe and deterministic.
- [ ] CI gate blocks unsafe changes.
- [ ] Release regression is defined.

---

# Acceptance Criteria

- [ ] Quality strategy is layered.
- [ ] Tests map to production risks.
- [ ] CI gates are actionable.
- [ ] Security and reliability are included.
- [ ] Test data is safe.
- [ ] Release readiness is measurable.
- [ ] AI coding assistants can apply this safely.

---

# Anti-patterns

Avoid:

- Only testing happy paths.
- Tests that require real production credentials.
- Tests that depend on execution order without reason.
- Snapshot-only frontend testing.
- Contract changes without contract tests.
- Authorization tests only for admin users.
- Performance assumptions from tiny seed data.
- AI prompt demos without adversarial tests.
- Non-blocking CI gates for critical failures.
- Using real customer data in test fixtures.

---

# Related Documents

- ../PART-03-Backend-Implementation/README.md
- ../PART-04-Frontend-and-Client-Implementation/README.md
- ../PART-05-Database-and-Migration-Implementation/README.md
- ../PART-06-AI-Gateway-and-Automation-Implementation/README.md
- ../PART-07-Integration-and-Webhook-Implementation/README.md
- ../../BOOK-06-Security-Governance-and-Compliance/BOOK-06-Master-Index/README.md
- ../../BOOK-07-Operations-Observability-and-Reliability/BOOK-07-Master-Index/README.md

---

# Navigation

**Previous:** `93-Test-Data-Fixture-and-Mock-Strategy.md`

**Next:** `95-Release-Quality-and-Regression-Strategy.md`

---

# CI Quality Gates

Recommended required gates:

```text
install/dependency integrity
format check
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
```

---

# Conditional Gates

Run as needed:

```text
performance smoke for hot paths
AI quality regression for prompt changes
integration sandbox tests for provider changes
frontend accessibility tests
visual regression tests
container/image vulnerability scan
```

---

# Coverage Policy

Coverage should be used as a signal, not vanity metric.

Track coverage for:

```text
domain logic
authorization policies
critical workflows
security-sensitive modules
integration adapters
AI guardrails
```

---

# CI Rule

A gate that detects production-critical failure must block merge or release.
