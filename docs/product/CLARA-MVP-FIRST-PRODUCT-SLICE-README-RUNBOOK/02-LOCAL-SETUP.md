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

# 02 — Local Setup

> _"Local setup should be boring, repeatable, and safe."_

---

# Prerequisites

Required baseline:

```text
Git
Node.js LTS
npm
Docker
Docker Compose
PostgreSQL local runtime
```

---

# Clone Repository

```bash
git clone https://github.com/VaxXinE/CLARA.git
cd CLARA
```

---

# Read Required Docs

Before coding:

```text
README.md
AGENTS.md
SECURITY.md
docs/README.md
docs/CLARA-MASTER-DOCUMENTATION-INDEX/CLARA-MASTER-INDEX.md
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/
docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/
```

---

# Install Dependencies

```bash
cd services/api
npm install

cd ../../apps/dashboard
npm install
```

---

# Copy Environment Files

```bash
cd services/api
cp .env.example .env

cd ../../apps/dashboard
cp .env.example .env.local
```

Never commit:

```text
.env
.env.local
.env.production
```

# Database Setup

```bash
cd infra/local
docker compose up -d

cd ../../services/api
npm run db:check
npm run db:ready
npm run db:migrate
npm run db:seed
```

Use a safe local PostgreSQL `DATABASE_URL` only. Do not use production credentials.

---

# Run API and Dashboard Together

Terminal 1:

```bash
cd services/api
npm run dev
```

Terminal 2:

```bash
cd apps/dashboard
npm run dev
```

Open:

```text
API: http://127.0.0.1:3000
Dashboard: http://127.0.0.1:5173
```

---

# Local Setup Checklist

- [ ] Repository cloned.
- [ ] Dependencies installed.
- [ ] `services/api/.env` created from `.env.example`.
- [ ] `apps/dashboard/.env.local` created from `.env.example`.
- [ ] Local PostgreSQL running.
- [ ] `infra/local/docker-compose.yml` or equivalent safe local runtime is available.
- [ ] No production secrets used.
- [ ] Mock auth configured for local only.
- [ ] Mock AI provider configured.
- [ ] Simulated send adapter configured.

---

# Setup Rule

```text
Local setup must not require production credentials.
```
