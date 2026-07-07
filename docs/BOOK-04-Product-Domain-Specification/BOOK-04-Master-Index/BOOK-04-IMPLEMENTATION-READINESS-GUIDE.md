---
book: "Book IV — Product & Domain Specification"
document: "Implementation Readiness Guide"
version: "1.0.0"
status: "official"
owner: "CLARA Product Architecture Team"
last_updated: "2026-07-07"
classification: "product-domain-master-index"
---

# BOOK IV — Implementation Readiness Guide

> *"Do not code a domain until product behavior, permissions, scope, and MVP boundaries are clear."*

---

# Purpose

This guide explains how to turn Book IV into implementation artifacts.

Book IV is not code.

Book IV is the product-domain source of truth that should generate:

```text
PRD
TDD
UX Flow
Wireframe
API Spec
Database Migration Spec
Security Checklist
Test Plan
Backlog
Runbook
Demo Script
```

---

# Implementation Gate

Before coding any module, verify:

- [ ] Product domain is defined in Book IV.
- [ ] Target users are known.
- [ ] MVP scope is clear.
- [ ] Non-goals are documented.
- [ ] Domain objects are listed.
- [ ] Permissions are named.
- [ ] Organization/workspace scope is defined.
- [ ] Audit events are identified.
- [ ] AI behavior is constrained where relevant.
- [ ] Integration boundaries are clear where relevant.
- [ ] Security risks are documented.
- [ ] Test scenarios can be derived.

---

# Domain-to-Artifact Map

| Book IV Domain | Required Next Artifacts |
|---|---|
| Roles & Permissions | RBAC PRD, API Spec, DB Spec, Security Checklist |
| Organization & Workspace | Tenant PRD, API Spec, DB Spec, Test Plan |
| Customer CRM | CRM PRD, UX Flow, API Spec, DB Spec |
| Conversations & Inbox | Inbox PRD, Channel Spec, API Spec, Test Plan |
| Ticketing | Ticketing PRD, State Machine Spec, API Spec |
| Knowledge Base | KB PRD, RAG Grounding Spec, Search Spec |
| AI Assistant | AI Product PRD, AI Safety Spec, Evaluation Plan |
| Workflow Automation | Workflow PRD, Execution Spec, Audit Spec |
| Integrations & Channels | Integration PRD, Adapter Spec, Webhook Spec |
| Billing & Admin | Admin PRD, Entitlement Spec, Billing Spec |
| Analytics/Audit/Settings | Analytics PRD, Audit Taxonomy, Settings Spec |

---

# Recommended Build Order

```text
Phase 0 — Repo/docs hygiene and AGENTS.md alignment
Phase 1 — Auth, Organization, Workspace, Roles
Phase 2 — Customer CRM
Phase 3 — Conversations and Inbox with one channel
Phase 4 — Knowledge Base
Phase 5 — AI Reply Drafting
Phase 6 — Ticketing
Phase 7 — Admin Console and Audit
Phase 8 — Workflow Automation baseline
Phase 9 — Integrations hardening
Phase 10 — Analytics, settings, and production readiness
```

---

# Secure-by-Design Rules

For every implementation:

- Enforce authorization in backend.
- Include organization_id and workspace_id on tenant-scoped records.
- Validate all external input.
- Escape/sanitize all user-generated output in UI.
- Never hard-code secrets.
- Keep sensitive logs redacted.
- Audit sensitive actions.
- Use idempotency for external events.
- Treat AI output as untrusted until reviewed.
- Add tests for unauthorized access and cross-tenant leakage.

---

# AI Coding Assistant Instructions

When using Codex/Cursor/AI coding agents:

```text
Read Book IV domain docs first.
Do not invent product behavior.
Do not bypass permissions.
Do not create global unscoped records.
Do not auto-send AI-generated replies.
Do not store secrets in code.
Do not add features outside MVP without explicit approval.
```

---

# Navigation

**Previous:** `BOOK-04-AI-GOVERNANCE-MAP.md`

**Next:** `BOOK-04-CROSS-REFERENCE.md`
