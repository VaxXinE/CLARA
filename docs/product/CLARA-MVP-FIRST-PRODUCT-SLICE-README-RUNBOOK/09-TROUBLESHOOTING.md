---
project: "CLARA"
artifact: "MVP First Product Slice README / Runbook"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering, DevOps, Security, QA, Product, and AI Team"
last_updated: "2026-07-07"
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


# 09 — Troubleshooting

> *"A good runbook helps junior developers recover without guessing."*

---

# API Does Not Start

Check:

```bash
cat .env.local
```

Common causes:

```text
missing DATABASE_URL
invalid APP_ENV
mock auth disabled in local by mistake
port already in use
database not running
```

Fix:

```bash
docker compose -f infra/local/docker-compose.yml up -d postgres
npm run dev --workspace services/api
```

---

# Health Endpoint Fails

Check:

```bash
curl http://localhost:3000/health
```

If failing:

```text
confirm API port
check service logs
check config validation error
check database dependency if readiness endpoint is used
```

---

# Database Connection Fails

Check:

```bash
docker compose -f infra/local/docker-compose.yml ps
```

Common causes:

```text
postgres container stopped
wrong DATABASE_URL
database not created
password mismatch
```

---

# Migrations Fail

Common causes:

```text
partial migration
existing table
wrong database
invalid SQL
migration order wrong
```

Fix local only:

```bash
npm run db:reset
npm run db:migrate
npm run db:seed:demo
```

Never reset production-like DB casually.

---

# Inbox Empty

Check:

```text
demo seed has run
current demo user belongs to workspace
conversation fixtures exist
status filter not hiding results
workspace scope uses correct workspace_id
```

---

# Viewer Can Send Reply

This is a P0 security bug.

Immediate action:

```text
stop demo/release
check frontend permission UX
check backend authorization guard
check tests
fix before continuing
```

---

# Cross-Workspace Data Visible

This is a critical security bug.

Immediate action:

```text
stop demo/release
check repository queries
check scope helper
check API service resource lookup
add failing test before fix
```

---

# AI Draft Fails

Check:

```text
AI_PROVIDER=mock
AI_MOCK_MODE=success
conversation exists
user has ai_draft:create permission
context builder scope
```

Expected fallback:

```text
manual composer remains usable
safe error shown
```

---

# Send Fails

Check:

```text
SEND_ADAPTER=simulated
SIMULATED_SEND_MODE=success
reply body not empty
user has reply:send permission
draft belongs to same conversation/workspace
```

Expected fallback:

```text
draft remains in composer
safe error shown
```

---

# Troubleshooting Rule

```text
When debugging security-sensitive issues, add the failing test before applying the fix.
```
