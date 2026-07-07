---
project: "CLARA"
artifact: "CLARA Master Documentation Index"
title: "CLARA Coding Reference Map"
version: "1.0.0"
status: "official"
owner: "CLARA Engineering, Product, Security, Operations and Product Operations Leadership"
last_updated: "2026-07-07"
classification: "coding-reference-map"
scope: "BOOK I–IX"
---


# CLARA Coding Reference Map

> *"This file tells developers and AI coding assistants what documentation to read before editing code."*

---

# Purpose

This document provides task-based routing for coding work.

---

# Universal Pre-Coding Rule

Before coding:

```text
1. Read root AGENTS.md after it exists.
2. Read CLARA-MASTER-INDEX.md.
3. Identify work type from this file.
4. Read the required books/parts.
5. Implement only within documented boundaries.
```

---

# Task Routing

## Backend API

Read:

```text
BOOK III — Architecture & Engineering
BOOK IV — Data, API, AI & Integration Design
BOOK VI — Security, Governance & Compliance
BOOK VII — Operations, Observability & Reliability
BOOK VIII — PART-03 Backend Implementation
BOOK VIII — PART-08 Testing and Quality Implementation
BOOK VIII — PART-09 CI/CD and Environment Implementation
```

## Frontend / Client

Read:

```text
BOOK II — Product & Domain
BOOK VI — Security, Governance & Compliance
BOOK VIII — PART-04 Frontend and Client Implementation
BOOK VIII — PART-08 Testing and Quality Implementation
BOOK IX — PART-02 Customer Onboarding and Success
```

## Database / Migration

Read:

```text
BOOK IV — Data, API, AI & Integration Design
BOOK VI — Security, Governance & Compliance
BOOK VII — Backup Restore and DR
BOOK VIII — PART-05 Database and Migration Implementation
```

## AI Gateway / Automation

Read:

```text
BOOK IV — Data, API, AI & Integration Design
BOOK VI — Security, Governance & Compliance
BOOK VII — Operations, Observability & Reliability
BOOK VIII — PART-06 AI Gateway and Automation Implementation
BOOK IX — PART-10 AI Quality and Automation Improvement
```

## Integration / Webhook

Read:

```text
BOOK IV — Data, API, AI & Integration Design
BOOK VI — Security, Governance & Compliance
BOOK VII — Observability and Reliability
BOOK VIII — PART-07 Integration and Webhook Implementation
BOOK IX — PART-09 Continuous Reliability and Performance Improvement
```

## Billing / Entitlement

Read:

```text
BOOK VI — Security, Governance & Compliance
BOOK VIII — Backend/Frontend/Database Implementation
BOOK IX — PART-05 Billing Packaging and Monetization Operations
```

## Analytics / Product Events

Read:

```text
BOOK VI — Privacy/Data Handling
BOOK VIII — Frontend/Backend Implementation
BOOK IX — PART-06 Analytics and Product Insights
```

## Security-Sensitive Change

Read:

```text
BOOK VI — Security, Governance & Compliance
BOOK VII — Operational Security
BOOK VIII — Secure Coding and Implementation
BOOK IX — PART-08 Continuous Security and Compliance Operations
```

---

# AI Assistant Guardrails

AI coding assistants must not:

```text
invent undocumented architecture
hard-code secrets
skip authorization
trust client-side enforcement
log secrets or sensitive customer data
change DB schema without migration docs
add AI behavior without safety/quality metrics
add analytics events containing raw sensitive data
modify billing/entitlements without server-side enforcement
ship production changes without tests and observability
```

---

# Code Review Checklist

For every PR:

```text
documentation referenced?
security impact reviewed?
data access scoped?
input validation included?
tests added?
observability added?
rollback/degraded mode considered?
product operations impact considered?
```
