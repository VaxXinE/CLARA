---
project: "CLARA"
artifact: "MVP First Product Slice Test Plan"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA QA, Engineering, Security, Product, AI, and Product Operations Team"
last_updated: "2026-07-07"
classification: "test-plan"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-UX-UI-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-DATABASE-MIGRATION-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/"
source_of_truth:
  - "SECURITY.md"
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-07-Operations-Observability-and-Reliability/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 02 — Test Environments and Data

> *"Good test data proves product behavior without exposing real customer information."*

---

# Purpose

This document defines MVP test environments and test data requirements.

---

# Test Environments

## Local Development

Purpose:

```text
developer iteration
unit tests
integration tests
manual smoke testing
```

Allowed:

```text
mock auth
mock AI provider
simulated send adapter
fake seed data
```

Not allowed:

```text
real production secrets
real customer data
```

---

## CI Environment

Purpose:

```text
repeatable validation on PR
```

Should use:

```text
test database
mock AI provider
simulated send adapter
fake test fixtures
```

---

## Demo Environment

Purpose:

```text
internal product demo
```

Should use:

```text
fake but realistic customer scenarios
safe auth/demo users
simulated or mock integrations
```

---

# Required Personas

## Owner

```text
id: usr_demo_owner
role: owner
```

Expected:

```text
can view
can generate AI draft
can send reply
```

## Agent

```text
id: usr_demo_agent
role: agent
```

Expected:

```text
can view
can generate AI draft
can send reply
```

## Viewer

```text
id: usr_demo_viewer
role: viewer
```

Expected:

```text
can view
cannot generate AI draft
cannot send reply
```

---

# Required Workspace Fixtures

## Workspace A

```text
organization_id: org_demo
workspace_id: wks_demo_sales
```

## Workspace B

```text
organization_id: org_demo_other
workspace_id: wks_demo_other
```

Workspace B is required for tenant isolation tests.

---

# Required Customer Fixtures

```text
cust_demo_budi
cust_demo_sari
cust_other_workspace
```

---

# Required Conversation Fixtures

```text
conv_demo_budi_stock
conv_demo_sari_followup
conv_other_workspace_secret
```

---

# Required AI Fixtures

```text
mock_ai_success
mock_ai_timeout
mock_ai_provider_error
mock_ai_malformed_output
```

---

# Required Send Fixtures

```text
simulated_send_success
simulated_send_failure
```

---

# Seed Data Safety Checklist

- [ ] Fake names only.
- [ ] `.test` emails only.
- [ ] Dummy phone numbers only.
- [ ] No real customer message copied.
- [ ] No real screenshots.
- [ ] No production secrets.
- [ ] Seed can be rerun safely.

---

# Test Environment Rule

```text
Tests must not require real provider credentials to pass.
```
