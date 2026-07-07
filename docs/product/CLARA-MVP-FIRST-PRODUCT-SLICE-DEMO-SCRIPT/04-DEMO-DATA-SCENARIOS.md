---
project: "CLARA"
artifact: "MVP First Product Slice Demo Script"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Product, Engineering, Security, QA, AI, and Product Operations Team"
last_updated: "2026-07-07"
classification: "demo-script"
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
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-README-RUNBOOK/"
source_of_truth:
  - "README.md"
  - "AGENTS.md"
  - "SECURITY.md"
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 04 — Demo Data Scenarios

> *"Demo data should feel realistic without being real."*

---

# Demo Organization

```text
Organization: Demo Organization
Workspace: Demo Sales Workspace
```

---

# Demo Users

```text
Agent Demo:
email: agent@example.test
role: agent
can draft/send: yes

Viewer Demo:
email: viewer@example.test
role: viewer
can draft/send: no
```

---

# Customer 1 — Budi Santoso

```text
id: cust_demo_budi
display_name: Budi Santoso
contact_identifier: +620000000001
source: whatsapp_demo
status: new
notes_summary: Interested in product availability and wants to order today.
```

Conversation:

```text
Budi:
Halo, apakah stok produk ini masih tersedia?

Agent:
Halo Budi, kami bantu cek ya.

Budi:
Kalau tersedia, saya ingin pesan hari ini.
```

Suggested AI draft:

```text
Hi Budi, terima kasih sudah menunggu. Produk tersebut masih tersedia dan kami bisa bantu proses pesanannya hari ini. Kalau Budi berkenan, kami bisa lanjutkan ke detail pengiriman dan pembayaran.
```

---

# Customer 2 — Sari Wijaya

```text
id: cust_demo_sari
display_name: Sari Wijaya
contact_identifier: sari@example.test
source: web_chat_demo
status: active
notes_summary: Asked about order follow-up.
```

Conversation:

```text
Sari:
Saya ingin tanya status pesanan saya.

Agent:
Baik Sari, kami bantu cek status pesanannya.
```

---

# Failure Scenario Data

```text
AI_MOCK_MODE=provider_error
SIMULATED_SEND_MODE=failure
```

---

# Rule

```text
All demo data must be fake, reproducible, and safe to show on screen.
```
