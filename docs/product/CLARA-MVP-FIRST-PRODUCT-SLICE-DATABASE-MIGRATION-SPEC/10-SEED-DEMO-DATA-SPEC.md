---
project: "CLARA"
artifact: "MVP First Product Slice Database Migration Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Backend, Data, Security, Product, and Product Operations Team"
last_updated: "2026-07-07"
classification: "database-migration-specification"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-UX-UI-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/"
source_of_truth:
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-04-Product-Domain-Specification/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-07-Operations-Observability-and-Reliability/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 10 — Seed Demo Data Spec

> *"Demo data should tell the product story without risking real customer privacy."*

---

# Purpose

This document defines safe demo seed data for MVP validation.

---

# Seed Data Rules

Seed data must:

```text
use fake names
use fake contact identifiers
use fake messages
avoid real phone numbers/emails
avoid real customer data
be idempotent
be local/dev/demo only
```

---

# Demo Organization

```text
id: org_demo
name: Demo Organization
status: active
```

---

# Demo Workspace

```text
id: wks_demo_sales
organization_id: org_demo
name: Demo Sales Workspace
status: active
```

---

# Demo Users

## Owner

```text
id: usr_demo_owner
email: owner@example.test
display_name: Owner Demo
role: owner
```

## Agent

```text
id: usr_demo_agent
email: agent@example.test
display_name: Agent Demo
role: agent
```

## Viewer

```text
id: usr_demo_viewer
email: viewer@example.test
display_name: Viewer Demo
role: viewer
```

Use `.test` domain.

---

# Demo Customers

## Customer 1

```text
id: cust_demo_budi
display_name: Budi Santoso
contact_identifier: +620000000001
source: whatsapp_demo
status: new
notes_summary: Interested in product availability.
```

## Customer 2

```text
id: cust_demo_sari
display_name: Sari Wijaya
contact_identifier: sari@example.test
source: web_chat_demo
status: active
notes_summary: Asked about order follow-up.
```

---

# Demo Conversations

## Conversation 1

```text
id: conv_demo_budi_stock
customer_id: cust_demo_budi
source: whatsapp_demo
status: open
assigned_user_id: usr_demo_agent
```

Messages:

```text
inbound: Halo, apakah stok produk ini masih tersedia?
outbound: Halo Budi, kami bantu cek ya.
inbound: Kalau tersedia, saya ingin pesan hari ini.
```

## Conversation 2

```text
id: conv_demo_sari_followup
customer_id: cust_demo_sari
source: web_chat_demo
status: pending
assigned_user_id: usr_demo_agent
```

Messages:

```text
inbound: Saya ingin tanya status pesanan saya.
outbound: Baik Sari, kami bantu cek status pesanannya.
```

---

# Demo AI Draft

Optional seed:

```text
draft text: Hi Budi, terima kasih sudah menunggu. Produk tersebut masih tersedia dan kami bisa bantu proses pesanannya hari ini.
source: ai
status: draft
```

---

# Demo Activity Events

Examples:

```text
ai_draft_generated
reply_sent
```

---

# Idempotency Requirement

Seed script should support rerun safely.

Strategies:

```text
use fixed IDs
upsert by ID
skip if exists
```

---

# Seed Rule

```text
Demo data must never use real customer identity or real private conversation content.
```
