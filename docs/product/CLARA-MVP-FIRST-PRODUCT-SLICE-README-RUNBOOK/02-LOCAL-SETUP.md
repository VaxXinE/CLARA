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


# 02 — Local Setup

> *"Local setup should be boring, repeatable, and safe."*

---

# Prerequisites

Final tooling depends on the implementation stack.

Recommended baseline:

```text
Git
Node.js LTS
Package manager: npm, pnpm, or yarn
Docker / Docker Compose
PostgreSQL local or containerized
```

Optional depending stack:

```text
Turborepo/Nx
Prisma/Drizzle/TypeORM
Playwright/Vitest/Jest
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

Template command:

```bash
# choose one based on final stack
npm install
# or
pnpm install
# or
yarn install
```

---

# Copy Environment File

```bash
cp .env.example .env.local
```

Never commit:

```text
.env
.env.local
.env.production
```

---

# Start Local Infrastructure

Template:

```bash
docker compose -f infra/local/docker-compose.yml up -d
```

If local infra is not implemented yet, create it from the Repository Skeleton and Backend Bootstrap milestones.

---

# Verify Database Connection

Template:

```bash
# final command depends on selected stack
npm run db:status
```

---

# Local Setup Checklist

- [ ] Repository cloned.
- [ ] Dependencies installed.
- [ ] `.env.local` created from `.env.example`.
- [ ] Local database running.
- [ ] No production secrets used.
- [ ] Mock auth configured for local only.
- [ ] Mock AI provider configured.
- [ ] Simulated send adapter configured.

---

# Setup Rule

```text
Local setup must not require production credentials.
```
