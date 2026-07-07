---
book: "Book IV — Product & Domain Specification"
document: "Book IV Master Index"
version: "1.0.0"
status: "official"
owner: "CLARA Product Architecture Team"
last_updated: "2026-07-07"
classification: "product-domain-master-index"
---

# BOOK IV — Master Index

> *"Book IV defines CLARA as a product before CLARA becomes implementation."*

---

# Purpose

This Master Index closes **Book IV — Product & Domain Specification**.

Book IV defines the product and domain baseline for CLARA:

- What the product does.
- Who uses it.
- What domains exist.
- What each domain owns.
- What is included in MVP.
- What must be protected by permissions.
- What AI is allowed to assist with.
- What requires auditability.
- What should be deferred for future releases.

---

# Book IV Part Map

| Part | Title | Chapters | Focus |
|---|---|---:|---|
| PART-01 | Product Vision and Scope | 01–10 | Defines CLARA product identity, target users, MVP scope, non-goals, and product risks. |
| PART-02 | User Roles and Permissions | 11–25 | Defines users, roles, permissions, actor model, and access scope. |
| PART-03 | Organization and Workspace | 26–40 | Defines tenant model, workspace model, membership, settings, and visibility. |
| PART-04 | Customer CRM | 41–60 | Defines customer profile, contact points, timeline, notes, tags, privacy, and AI context. |
| PART-05 | Conversations and Inbox | 61–80 | Defines omnichannel conversations, messages, assignment, reply workflow, and AI drafts. |
| PART-06 | Ticketing and Case Management | 81–100 | Defines tickets, case lifecycle, assignment, SLA, collaboration, and AI assistance. |
| PART-07 | Knowledge Base | 101–120 | Defines articles, lifecycle, visibility, search, RAG grounding, and knowledge quality. |
| PART-08 | AI Assistant Product | 121–140 | Defines AI use cases, context policy, safety, human review, audit, and analytics. |
| PART-09 | Workflow Automation | 141–160 | Defines triggers, conditions, actions, approvals, execution logs, and automation governance. |
| PART-10 | Integrations and Channels | 161–180 | Defines connectors, channels, credentials, webhooks, sync, security, and observability. |
| PART-11 | Billing and Admin | 181–200 | Defines admin console, plans, subscriptions, entitlements, quotas, and governance controls. |
| PART-12 | Analytics, Audit, and Settings | 201–220 | Defines dashboards, metrics, audit logs, reports, settings, privacy, and Book IV closure. |

---

# How To Use This Index

Use this folder as the navigation layer for Book IV.

Recommended order:

```text
1. Read BOOK-04-PART-MAP.md
2. Read BOOK-04-DOMAIN-DEPENDENCY-MAP.md
3. Read BOOK-04-MVP-SCOPE-MAP.md
4. Read BOOK-04-PERMISSION-MAP.md
5. Read BOOK-04-AI-GOVERNANCE-MAP.md
6. Read BOOK-04-IMPLEMENTATION-READINESS-GUIDE.md
7. Use BOOK-04-CROSS-REFERENCE.md when building PRDs/TDD/API specs
8. Continue to BOOK-04-NEXT-STEPS-TO-BOOK-05.md
```

---

# Master Rule

Book IV should be treated as the product-domain source of truth.

Any PRD, UX spec, API spec, database migration, test plan, or backlog item should be traceable back to one or more Book IV product domains.

---

# Navigation

**Next:** `BOOK-04-PART-MAP.md`
