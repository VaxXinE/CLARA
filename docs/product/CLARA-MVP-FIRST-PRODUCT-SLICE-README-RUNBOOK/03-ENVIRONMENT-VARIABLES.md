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


# 03 — Environment Variables

> *"Configuration should make unsafe environments hard to start."*

---

# Purpose

This document defines environment variable direction for MVP.

Exact variable names can be finalized during implementation, but the safety rules should remain.

---

# Required Environment Groups

```text
application
database
auth
AI
send adapter
logging
security
demo mode
```

---

# Example `.env.example`

```bash
# Application
APP_ENV=development
APP_NAME=clara
APP_PORT=3000
APP_BASE_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://clara:clara_dev_password@localhost:5432/clara_dev

# Auth
AUTH_MODE=mock
MOCK_AUTH_ENABLED=true
DEFAULT_DEMO_USER=agent

# AI
AI_PROVIDER=mock
AI_MOCK_ENABLED=true
AI_DRAFT_PROMPT_VERSION=mvp_reply_draft_v1

# Send Adapter
SEND_ADAPTER=simulated
SIMULATED_SEND_ENABLED=true

# Logging
LOG_LEVEL=debug
LOG_REDACT_SECRETS=true

# Security
REQUIRE_WORKSPACE_SCOPE=true
DISABLE_DEBUG_ERRORS=true

# Demo
DEMO_MODE=true
SEED_DEMO_DATA=true
```

---

# Production-Like Safety Requirements

Production-like environment must not allow:

```bash
AUTH_MODE=mock
MOCK_AUTH_ENABLED=true
AI_MOCK_ENABLED=true
SEND_ADAPTER=simulated
DEMO_MODE=true
SEED_DEMO_DATA=true
LOG_LEVEL=debug
```

unless explicitly approved for isolated demo.

---

# Secret Rules

Never commit real values for:

```text
DATABASE_URL with real password
JWT secret
session secret
AI provider key
OAuth token
webhook secret
API key
private key
```

---

# Required Validation

Application startup should validate:

```text
APP_ENV exists
DATABASE_URL exists when DB required
AUTH_MODE valid
AI_PROVIDER valid
SEND_ADAPTER valid
production does not use mock auth
production does not use demo data by default
LOG_REDACT_SECRETS enabled in production-like env
```

---

# Safe Config Failure

If config is invalid, app should fail fast:

```text
clear local error
no secret printed
safe logs
non-zero exit
```

---

# Environment Rule

```text
Unsafe production configuration should fail at startup, not during an incident.
```
