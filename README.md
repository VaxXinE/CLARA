# Clara

> "A great platform is built not only with code, but with shared understanding."

---

# Purpose

Clara is an AI-native Business Operating System designed to unify business operations, customer relationships, communication, knowledge, workflow automation, artificial intelligence, platform services, security, integrations, analytics, operations, and continuous product improvement.

This repository is the official engineering library and future implementation workspace for Clara.

It contains the documentation, architecture, standards, templates, governance, implementation references, security rules, operations model, and product operations playbooks used to design, build, operate, and evolve Clara.

---

# Repository Status

```text
Status: MVP slice runnable locally
Current focus: conversation workspace MVP hardening and runbook accuracy
Next focus: P5.1 legacy UI upgrade track and production auth rollout
```

Current MVP implementation:

```text
services/api: runnable local API with mock auth, workspace scope, seeded demo data, conversation/customer/activity read APIs, mock AI draft, and simulated reply send
apps/dashboard: runnable local React dashboard for the conversation workspace flow
production-oriented Docker build baseline now exists for services/api and apps/dashboard
multi-channel registry/account foundation now exposes safe read-only Gmail metadata, Webchat inbound/reply visibility, WhatsApp official inbound plus simulated outbound boundary, and decision-only Instagram/TikTok metadata
P4.5 extension bridge contract is documented for future operator-visible active conversation sync
P4.5 extension snapshot intake is implemented for authenticated WhatsApp, Instagram, and TikTok extension bridge snapshots
apps/extension now contains the local TypeScript auto-sync engine for visible active-conversation snapshots
apps/extension now contains ChatGPT Companion safe context preview/copy/open helpers without ChatGPT token storage or auto-submit
P4.5 Extension Bridge final regression/runbook coverage is now documented for operator-assisted active-conversation workflows
P5 production auth foundation is now documented as the next fail-closed provider-mode contract before real login/workspace UX
P5.1 now positions CLARA v2 as the production-ready upgrade of project_Clara and documents the legacy UI audit, route map, role/navigation map, design system contract, and UI migration security rules
P5.1 Workspace Shell Upgrade now gives the dashboard a dark/gold operator shell with left sidebar, topbar, grouped navigation, and mobile menu behavior
```

Start here for local usage:

```text
services/api/README.md
apps/dashboard/README.md
docs/product/CLARA-P2-DEPLOYMENT-CONFIG-RUNBOOK.md
docs/product/CLARA-P2-STAGING-SMOKE-RUNBOOK.md
docs/product/CLARA-P2-RELEASE-CHECKLIST.md
docs/product/CLARA-P3-FINAL-SECURITY-REGRESSION-RUNBOOK.md
docs/product/CLARA-P4-MULTICHANNEL-FOUNDATION-SPEC.md
docs/product/CLARA-P4-WHATSAPP-OFFICIAL-WEBHOOK-INBOUND-SPEC.md
docs/product/CLARA-P4-WHATSAPP-OUTBOUND-ROUTING-SPEC.md
docs/product/CLARA-P4-SOCIAL-DM-PROVIDER-DECISION-SPEC.md
docs/product/CLARA-P4-MULTICHANNEL-AUDIT-PRIVACY-HARDENING-SPEC.md
docs/product/CLARA-P4-FINAL-REGRESSION-RUNBOOK.md
docs/product/CLARA-P45-EXTENSION-BRIDGE-CONTRACT-SPEC.md
docs/product/CLARA-P45-EXTENSION-BRIDGE-SECURITY-SPEC.md
docs/product/CLARA-P45-CHATGPT-COMPANION-SPEC.md
docs/product/CLARA-P45-EXTENSION-SNAPSHOT-INTAKE-SPEC.md
docs/product/CLARA-P45-EXTENSION-AUTO-SYNC-ENGINE-SPEC.md
docs/product/CLARA-P45-CHATGPT-COMPANION-SAFE-CONTEXT-SPEC.md
docs/product/CLARA-P45-FINAL-REGRESSION-RUNBOOK.md
docs/product/CLARA-P45-EXTENSION-BRIDGE-FINAL-SECURITY-CHECKLIST.md
docs/product/CLARA-P45-EXTENSION-BRIDGE-OPERATOR-RUNBOOK.md
docs/product/CLARA-P5-PRODUCTION-AUTH-FOUNDATION-SPEC.md
docs/product/CLARA-P5-DASHBOARD-PROVIDER-AUTH-UX-SPEC.md
docs/product/CLARA-P5-WORKSPACE-MEMBERSHIP-BOOTSTRAP-SPEC.md
docs/product/CLARA-P51-LEGACY-UI-UPGRADE-POSITIONING.md
docs/product/CLARA-P51-LEGACY-UI-AUDIT.md
docs/product/CLARA-P51-DESIGN-SYSTEM-CONTRACT.md
docs/product/CLARA-P51-ROUTE-MIGRATION-MAP.md
docs/product/CLARA-P51-ROLE-NAVIGATION-MIGRATION-MAP.md
docs/product/CLARA-P51-UI-MIGRATION-SECURITY-RULES.md
docs/product/CLARA-P51-DASHBOARD-SHELL-ACCEPTANCE-CRITERIA.md
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-README-RUNBOOK/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-DEMO-SCRIPT/
docs/product/CLARA-P3-EMAIL-PROVIDER-INTEGRATION-DECISION.md
```

---

# Repository Structure

```text
Clara/
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
├── AGENTS.md
├── CODEOWNERS
├── docs/
│   ├── README.md
│   ├── CLARA-MASTER-DOCUMENTATION-INDEX/
│   ├── CLARA-DOCS-INGESTION-PLAN.md
│   ├── standards/
│   ├── templates/
│   ├── glossary/
│   ├── adr/
│   ├── diagrams/
│   ├── assets/
│   ├── references/
│   ├── onboarding/
│   ├── playbooks/
│   ├── examples/
│   ├── operations/
│   ├── security/
│   ├── ai/
│   ├── product/
│   ├── engineering/
│   ├── BOOK-01-The-Foundation/
│   ├── BOOK-02-Master-Blueprint/
│   ├── BOOK-03-Implementation-Architecture/
│   ├── BOOK-04-Product-Domain-Specification/
│   ├── BOOK-05-Engineering-Execution-Plan/
│   ├── BOOK-06-Security-Governance-and-Compliance/
│   ├── BOOK-07-Operations-Observability-and-Reliability/
│   ├── BOOK-08-Implementation-Delivery-and-Production-Launch/
│   └── BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/
└── .github/
    ├── pull_request_template.md
    └── workflows/
```

---

# Documentation Books

## Book I — The Foundation

Defines why Clara exists.

Path:

```text
docs/BOOK-01-The-Foundation/
```

## Book II — Master Blueprint

Defines what Clara will build.

Path:

```text
docs/BOOK-02-Master-Blueprint/
```

## Book III — Implementation Architecture

Defines how Clara should be implemented.

Path:

```text
docs/BOOK-03-Implementation-Architecture/
```

## Book IV — Product Domain Specification

Defines Clara product/domain behavior and product specification.

Path:

```text
docs/BOOK-04-Product-Domain-Specification/
```

## Book V — Engineering Execution Plan

Defines implementation planning, engineering execution, backlog, and delivery sequencing.

Path:

```text
docs/BOOK-05-Engineering-Execution-Plan/
```

## Book VI — Security, Governance & Compliance

Defines secure-by-design controls, governance, privacy, compliance, risk, and trust evidence.

Path:

```text
docs/BOOK-06-Security-Governance-and-Compliance/
```

## Book VII — Operations, Observability & Reliability

Defines production operations, observability, incident response, reliability, SLOs, backup/restore, and runbooks.

Path:

```text
docs/BOOK-07-Operations-Observability-and-Reliability/
```

## Book VIII — Implementation, Delivery & Production Launch

Defines implementation standards, repository structure, CI/CD, launch, hardening, and production delivery.

Path:

```text
docs/BOOK-08-Implementation-Delivery-and-Production-Launch/
```

## Book IX — Product Operations, Growth & Continuous Improvement

Defines post-launch product operations, customer success, support loop, growth, monetization, analytics, roadmap, continuous trust, reliability, AI quality, business cadence, and handover.

Path:

```text
docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/
```

---

# Master Documentation Index

Start here:

```text
docs/CLARA-MASTER-DOCUMENTATION-INDEX/README.md
docs/CLARA-MASTER-DOCUMENTATION-INDEX/CLARA-MASTER-INDEX.md
```

---

# Recommended Reading Path

## New Contributor

```text
1. README.md
2. docs/README.md
3. docs/CLARA-MASTER-DOCUMENTATION-INDEX/CLARA-MASTER-INDEX.md
4. docs/BOOK-01-The-Foundation/README.md
5. docs/standards/README.md
6. docs/templates/README.md
```

## Engineer

```text
1. AGENTS.md
2. SECURITY.md
3. docs/CLARA-MASTER-DOCUMENTATION-INDEX/CLARA-CODING-REFERENCE-MAP.md
4. Relevant Book I–IX docs
5. Relevant module README when implementation folders exist
```

## Security Reviewer

```text
1. SECURITY.md
2. docs/security/README.md
3. docs/BOOK-06-Security-Governance-and-Compliance/
4. docs/BOOK-08-Implementation-Delivery-and-Production-Launch/
5. docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/PART-08-Continuous-Security-and-Compliance-Operations/
```

## AI Coding Assistant

```text
1. AGENTS.md
2. docs/AGENTS.md
3. docs/CLARA-MASTER-DOCUMENTATION-INDEX/CLARA-CODING-REFERENCE-MAP.md
4. Relevant Book I–IX docs
5. Relevant implementation docs when codebase exists
```

---

# Core Rules

- Documentation is architecture.
- If it is not documented, it cannot be consistently built.
- Security is part of implementation, not a final review step.
- AI-generated code must be reviewed as untrusted contribution.
- Tenant isolation must be preserved in every implementation path.
- Production readiness requires evidence, not optimism.
- Product operations continue after launch.

---

# Security Notice

Do not commit:

- API keys.
- Passwords.
- Tokens.
- Private credentials.
- Production secrets.
- Customer data.
- Unredacted personal data.
- Sensitive screenshots.

See:

```text
SECURITY.md
docs/security/README.md
docs/BOOK-06-Security-Governance-and-Compliance/
```

---

# Current Milestones

```text
✅ Book I — The Foundation
✅ Documentation Standards
✅ Official Template Library
✅ Global Glossary
✅ Book II — Master Blueprint
✅ Book III — Implementation Architecture
✅ Book IV — Product Domain Specification
✅ Book V — Engineering Execution Plan
⏳ Book VI — Security, Governance & Compliance
⏳ Book VII — Operations, Observability & Reliability
⏳ Book VIII — Implementation, Delivery & Production Launch
⏳ Book IX — Product Operations, Growth & Continuous Improvement
⏳ CLARA Master Documentation Index
⏳ Repository implementation foundation
```

---

# Final Principle

Clara is built through shared understanding first, then production code.

This repository preserves that understanding.
