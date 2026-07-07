---
project: "CLARA"
artifact: "MVP First Product Slice Backlog / Task Breakdown"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Product, Engineering, Security, QA, AI, Data, and Product Operations Team"
last_updated: "2026-07-07"
classification: "backlog-task-breakdown"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-UX-UI-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-DATABASE-MIGRATION-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TEST-PLAN/"
source_of_truth:
  - "SECURITY.md"
  - "AGENTS.md"
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-05-Engineering-Execution-Plan/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 04 — Engineering Task Breakdown

> *"Engineering tasks should be small enough to review and connected to acceptance criteria."*

---

# Task ID Format

Use:

```text
ENG-###
```

---

# ENG-001 — Create Repository Skeleton

Priority: P0  
Epic: EPIC-01  
Owner: Engineering

Tasks:

```text
create apps/
create services/
create workers/
create packages/
create infra/
create scripts/
create tests/
create tools/
add README.md in each major folder
```

Acceptance:

```text
folders exist
responsibility documented
no product logic added
```

---

# ENG-002 — Create API Service Bootstrap

Priority: P0  
Epic: EPIC-02

Tasks:

```text
create services/api
add service README
add service AGENTS.md
add basic application entry
add health endpoint
add safe error handler
add config loader
add correlation id middleware
```

Acceptance:

```text
API starts locally
GET /health works
correlation id returned
safe error shape exists
```

---

# ENG-003 — Add Config Validation

Priority: P0  
Epic: EPIC-02

Tasks:

```text
define env schema
validate required env
block unsafe production defaults
add .env.example
```

Acceptance:

```text
invalid env fails safely
production cannot use mock auth accidentally
secrets not hard-coded
```

---

# ENG-004 — Add Auth Context

Priority: P0  
Epic: EPIC-03

Tasks:

```text
implement dev/mock current user
define user context type
resolve organization_id/workspace_id/role
protect all MVP routes
```

Acceptance:

```text
unauthenticated requests blocked
mock auth gated to local/demo
/me returns safe context
```

---

# ENG-005 — Add Authorization Policy

Priority: P0  
Epic: EPIC-03

Tasks:

```text
define role permissions
implement can_view_conversation
implement can_generate_ai_draft
implement can_send_reply
implement can_view_activity
add tests
```

Acceptance:

```text
owner/agent allowed to draft/send
viewer blocked from draft/send
unknown role denied
```

---

# ENG-006 — Add Workspace Scope Helper

Priority: P0  
Epic: EPIC-03

Tasks:

```text
create scope builder
ensure organization_id/workspace_id included
apply to repositories
add tests
```

Acceptance:

```text
business queries cannot run without scope
cross-workspace tests fail closed
```

---

# ENG-007 — Implement Migrations

Priority: P0  
Epic: EPIC-04

Tasks:

```text
create identity/workspace tables
create customer/conversation/message tables
create draft/AI event tables
create activity event table
create indexes
```

Acceptance:

```text
migrations run cleanly
constraints exist
indexes exist
```

---

# ENG-008 — Implement Demo Seed Data

Priority: P0  
Epic: EPIC-04

Tasks:

```text
seed demo org/workspace
seed owner/agent/viewer
seed customers
seed conversations/messages
seed cross-workspace fixture
make seed idempotent
```

Acceptance:

```text
seed can run twice
no real data
fixtures support tests/demo
```

---

# ENG-009 — Implement Conversation Repository

Priority: P0  
Epic: EPIC-05

Tasks:

```text
list scoped conversations
get scoped conversation detail
get scoped messages
handle pagination/filtering
```

Acceptance:

```text
workspace scope applied
inbox query works
detail query works
```

---

# ENG-010 — Implement Customer Repository

Priority: P0  
Epic: EPIC-05

Tasks:

```text
get scoped customer profile
support customer sidebar fields
```

Acceptance:

```text
customer lookup workspace scoped
profile response supports UI
```

---

# ENG-011 — Implement AI Draft Service

Priority: P0  
Epic: EPIC-06

Tasks:

```text
build conversation context
minimize AI context
add mock AI provider
create reply draft
create AI draft event
create activity event
```

Acceptance:

```text
draft created
requires human review
no outbound message created
AI failure safe
```

---

# ENG-012 — Implement Reply Send Service

Priority: P0  
Epic: EPIC-07

Tasks:

```text
validate reply body
verify draft ownership/scope
add simulated send adapter
create outbound message
update draft status
create activity event
```

Acceptance:

```text
agent can send simulated reply
viewer blocked
send failure safe
```

---

# ENG-013 — Implement Activity Service

Priority: P0  
Epic: EPIC-08

Tasks:

```text
create activity event helper
list scoped activity timeline
sanitize metadata
```

Acceptance:

```text
activity endpoint works
metadata safe
events sorted correctly
```

---

# ENG-014 — Add API Controllers/Routes

Priority: P0  
Epic: EPIC-05/06/07/08

Tasks:

```text
GET /me
GET /conversations
GET /conversations/{id}
GET /customers/{id}
POST /conversations/{id}/ai-draft
POST /conversations/{id}/reply
GET /conversations/{id}/activity
```

Acceptance:

```text
all routes match API Spec
standard error envelope used
contract tests pass
```
