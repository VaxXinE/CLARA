---
book: "Book III — Implementation Architecture"
appendix: "I"
title: "Release Gate Checklist"
version: "1.0.0"
status: "official"
owner: "Athena Release Engineering Team"
last_updated: "2026-07-07"
classification: "release-gate-checklist"
---

# APPENDIX I — Release Gate Checklist

> *"A release gate protects customers from our optimism."*

---

# Purpose

Use this checklist before releasing Athena changes to staging, beta, or production.

---

# Release Information

```text
Release Name:
Release Version:
Release Owner:
Release Date:
Environment: staging / beta / production
Risk Level: low / medium / high / critical
Related PRs:
Related ADRs:
Related Tickets:
```

---

# Pre-Release Gate

- [ ] All required PRs are merged.
- [ ] CI pipeline passed.
- [ ] Unit tests passed.
- [ ] Integration tests passed.
- [ ] Contract tests passed.
- [ ] Security tests passed.
- [ ] Secret scan passed.
- [ ] Dependency scan passed.
- [ ] Container scan passed where applicable.
- [ ] Migration review completed.
- [ ] Feature flags reviewed.
- [ ] Release notes prepared.
- [ ] Rollback plan prepared.

---

# Security Gate

- [ ] No open critical vulnerability.
- [ ] No open high vulnerability without approved exception.
- [ ] Tenant isolation tests passed.
- [ ] Authorization tests passed.
- [ ] Secrets are not exposed.
- [ ] Production access plan is reviewed.
- [ ] Audit logs are in place for sensitive changes.
- [ ] Security reviewer approved high-risk changes.

---

# Data Gate

- [ ] Migration is backward-compatible or rollout plan exists.
- [ ] Backfill plan exists where needed.
- [ ] Rollback/forward fix plan exists.
- [ ] Backup exists before destructive change.
- [ ] Data validation query exists.
- [ ] Search/vector/cache rebuild plan exists where relevant.
- [ ] Data privacy impact is reviewed.

---

# AI Gate

Use when release changes AI behavior.

- [ ] Prompt changes reviewed.
- [ ] Evaluation dataset passed.
- [ ] Tool calling authorization tested.
- [ ] RAG metadata filters tested.
- [ ] Cost impact reviewed.
- [ ] Guardrail tests passed.
- [ ] Human-in-the-loop path exists where required.

---

# Integration Gate

Use when release changes integrations.

- [ ] Webhook signature verification tested.
- [ ] OAuth/token storage reviewed.
- [ ] Credential vault path reviewed.
- [ ] Idempotency tested.
- [ ] Retry/backoff tested.
- [ ] Provider error mapping tested.
- [ ] Integration telemetry exists.

---

# Operations Gate

- [ ] Dashboard exists.
- [ ] Alerts exist for critical path.
- [ ] Runbook exists.
- [ ] On-call owner is aware.
- [ ] Support team is aware for customer-facing release.
- [ ] Production verification plan exists.
- [ ] Rollback trigger thresholds are defined.
- [ ] Status page/customer communication plan exists where needed.

---

# Deployment Gate

- [ ] Staging deployment succeeded.
- [ ] Staging smoke tests passed.
- [ ] Canary plan exists for high-risk release.
- [ ] Maintenance window exists if needed.
- [ ] Deployment owner is available.
- [ ] Rollback owner is available.
- [ ] Monitoring owner is available.

---

# Post-Deployment Gate

- [ ] Production smoke tests passed.
- [ ] Error rate is normal.
- [ ] Latency is normal.
- [ ] Logs show no unexpected failures.
- [ ] Metrics show expected behavior.
- [ ] Alerts are quiet.
- [ ] Customer support reports no major issue.
- [ ] Release is marked complete.

---

# Release Decision

```text
[ ] Approved for release
[ ] Approved with conditions
[ ] Blocked

Conditions:
- ...

Approvers:
- Release Owner:
- Engineering:
- Security:
- Operations:
- Product:
```

---

# Navigation

**Back:** README.md
