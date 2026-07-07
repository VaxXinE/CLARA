---
book: "Book V — Engineering Execution Plan"
part: "PART-10 — DevOps and Release Execution"
chapter: "174"
title: "Staging and Production Gates"
version: "1.0.0"
status: "official"
owner: "CLARA Platform Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan"
previous: "173-Database-Migration-Release-Execution.md"
next: "175-Deployment-Strategy.md"
project: "CLARA"
---

# Staging and Production Gates

> *"Defines staging validation, production approval, smoke tests, security checks, and release gates."*

---

# Purpose

Defines staging validation, production approval, smoke tests, security checks, and release gates.

---

# Operations Problem

Skipping staging and production gates lets broken, insecure, or unverified changes reach users.

---

# DevOps Decision

## Decision

CLARA should require staging validation and production release approval before changes reach production.

## Status

Accepted.

---

# DevOps Implementation Rule

Every production-facing change must be designed as:

```text
Build -> Test -> Package -> Configure -> Deploy -> Validate -> Monitor -> Rollback/Recover
```

Do not treat deployment as file copying.

Do not treat CI passing as proof that production is healthy.

Do not deploy features that cannot be observed, disabled, or recovered.

---

# Recommended Release Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant CI as CI Pipeline
    participant Stage as Staging
    participant Prod as Production
    participant Obs as Observability
    participant Ops as Operator

    Dev->>CI: Merge approved change
    CI->>CI: Build, test, scan
    CI->>Stage: Deploy staging artifact
    Stage->>Stage: Run migrations and smoke tests
    Stage-->>Ops: Staging validation result
    Ops->>Prod: Approve production release
    Prod->>Prod: Apply safe migration/deploy
    Prod->>Obs: Emit logs/metrics/traces
    Obs-->>Ops: Alert or healthy signal
    Ops->>Prod: Rollback/disable if needed
```

---

# Secure-by-Design Checklist

- [ ] Environment separation is clear.
- [ ] Secrets are environment-specific.
- [ ] Production secrets are not in code/docs/logs.
- [ ] CI gates run before merge/deploy.
- [ ] Build artifact is reproducible.
- [ ] Migrations are tested.
- [ ] Deployment has rollback or forward-fix path.
- [ ] Monitoring and alerts exist for critical paths.
- [ ] Logs are redacted.
- [ ] Backups exist and restore is tested.
- [ ] Incident response owner is clear.
- [ ] Release notes are prepared where needed.

---

# Acceptance Criteria

- [ ] Deployment behavior is clear.
- [ ] Security requirements are explicit.
- [ ] Operational ownership is defined.
- [ ] Monitoring expectations are included.
- [ ] Rollback/recovery expectations are included.
- [ ] MVP and future maturity are separated.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Manual production changes without tracking.
- Same secrets across dev/staging/prod.
- Deploying untested migrations.
- Running production with debug mode.
- Logging secrets or raw sensitive payloads.
- Relying on screenshots instead of smoke tests.
- No rollback plan.
- No backup restore test.
- Alerts that nobody owns.
- Runbooks that are never updated.

---

# Related Documents

- ../PART-02-Repository-and-Development-Workflow/README.md
- ../PART-05-Database-and-Migration-Plan/README.md
- ../PART-08-Security-Implementation-Plan/README.md
- ../PART-09-Testing-and-QA-Execution/README.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-MVP-SCOPE-MAP.md

---

# Navigation

**Previous:** `173-Database-Migration-Release-Execution.md`

**Next:** `175-Deployment-Strategy.md`

---

# Staging Gate

Before production:

- [ ] CI passes.
- [ ] Deployment to staging succeeds.
- [ ] Migrations succeed in staging.
- [ ] Smoke tests pass.
- [ ] Critical E2E flows pass where required.
- [ ] Security-sensitive changes reviewed.
- [ ] Known bugs triaged.
- [ ] Rollback/disable plan exists.

---

# Production Gate

Before final deploy:

- [ ] Release owner assigned.
- [ ] Monitoring dashboard ready.
- [ ] Incident channel known.
- [ ] Backup status verified for risky releases.
- [ ] Feature flags configured.
- [ ] Release notes ready where needed.
