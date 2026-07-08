---
project: "CLARA"
artifact: "MVP First Product Slice README / Runbook"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering, DevOps, Security, QA, Product, and AI Team"
last_updated: "2026-07-08"
classification: "readme-runbook"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-UX-UI-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-DATABASE-MIGRATION-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TEST-PLAN/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-BACKLOG-TASK-BREAKDOWN/"
source_of_truth:
  - "README.md"
  - "AGENTS.md"
  - "SECURITY.md"
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-07-Operations-Observability-and-Reliability/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
---

# 04 — Running Services

> _"The first operational goal is simple: API starts, UI starts, and the workflow can be exercised safely."_

---

# Purpose

This document defines how to run MVP services locally.

---

# Expected Services

```text
API Service
Dashboard UI
Database
Optional local tools
```

---

# Prepare Database

```bash
cd infra/local
docker compose up -d

cd ../../services/api
npm run db:check
npm run db:ready
npm run db:migrate
npm run db:seed
```

---

# Start API Service

```bash
cd services/api
npm run dev
```

Expected:

```text
API listening on local port
health endpoint available
mock auth enabled for local
mock AI provider enabled for local
simulated send adapter enabled for local
```

---

# Check API Health

```bash
curl http://localhost:3000/health
```

Expected safe response:

```json
{
  "status": "ok",
  "service": "clara-api",
  "environment": "development"
}
```

Do not expose:

```text
database password
auth secret
AI provider key
stack trace
```

---

# Start Dashboard UI

```bash
cd apps/dashboard
npm run dev
```

Expected:

```text
Dashboard available locally
Conversation workspace route available
Demo user can access MVP flow
```

---

# Local URLs

Recommended defaults:

```text
API: http://127.0.0.1:3000
Dashboard: http://127.0.0.1:5173
Database: localhost:5432
```

---

# Service Run Checklist

- [ ] Database running.
- [ ] API health works.
- [ ] `GET /api/v1/me` works with mock auth headers.
- [ ] Dashboard loads.
- [ ] `/me` returns demo user.
- [ ] Inbox loads demo conversations.
- [ ] AI draft uses mock provider.
- [ ] Reply uses simulated send adapter.

---

# Running Rule

```text
A local MVP should run without real AI keys or real channel provider credentials.
```
