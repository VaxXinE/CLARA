---
project: "CLARA"
artifact: "MVP First Product Slice UX Flow + UI Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Product Design, Product, Engineering, Security, and AI Team"
last_updated: "2026-07-07"
classification: "ux-flow-ui-specification"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
source_of_truth:
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-02-Master-Blueprint/"
  - "docs/BOOK-04-Product-Domain-Specification/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 04 — Wireframes

> *"Wireframes make the product concrete before design polish distracts the team."*

---

# Desktop Workspace Wireframe

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ CLARA                         Workspace: Demo Sales        User: Agent A     │
├──────────────────────┬──────────────────────────────────────┬────────────────┤
│ Conversations         │ Conversation with Budi               │ Customer        │
│ ┌──────────────────┐ │ ┌──────────────────────────────────┐ │ ┌────────────┐ │
│ │ Search...         │ │ │ Budi: Halo, saya mau tanya...    │ │ │ Budi       │ │
│ └──────────────────┘ │ │ Agent: Baik, ada yang bisa...     │ │ │ WhatsApp   │ │
│ [Open] [Pending]     │ │ Budi: Apakah stok masih ada?      │ │ │ Status: New│ │
│                      │ │                                  │ │ └────────────┘ │
│ > Budi               │ │ ───────────────────────────────── │ │ Activity       │
│   WhatsApp · Open    │ │ Reply                             │ │ - AI draft     │
│   "Apakah stok..."  │ │ ┌────────────────────────────────┐ │ │ - Reply sent   │
│                      │ │ │ Hi Budi, terima kasih...       │ │ │              │
│   Sari               │ │ └────────────────────────────────┘ │ │              │
│   Web Chat · Pending │ │ [Generate AI Draft] [Send Reply]  │ │              │
└──────────────────────┴──────────────────────────────────────┴────────────────┘
```

---

# Empty Inbox Wireframe

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ CLARA                                                                        │
├──────────────────────┬──────────────────────────────────────┬────────────────┤
│ Conversations         │                                      │ Customer        │
│ ┌──────────────────┐ │       No conversation selected        │ No customer     │
│ │ Search...         │ │                                      │ selected        │
│ └──────────────────┘ │       Select a conversation           │                │
│                      │       from the inbox to begin.        │                │
│ No conversations     │                                      │                │
│ yet.                 │                                      │                │
│                      │                                      │                │
│ Import demo data or  │                                      │                │
│ connect a channel.   │                                      │                │
└──────────────────────┴──────────────────────────────────────┴────────────────┘
```

---

# AI Generating State Wireframe

```text
Reply
┌────────────────────────────────────────────┐
│                                            │
│ Generating AI draft...                     │
│ You can still write manually if needed.    │
│                                            │
└────────────────────────────────────────────┘
[Generating...] [Send Reply disabled until text exists]
```

---

# AI Draft Ready Wireframe

```text
Reply
AI-assisted draft · Review before sending

┌────────────────────────────────────────────┐
│ Hi Budi, terima kasih sudah menghubungi... │
│                                            │
│ [editable text]                            │
└────────────────────────────────────────────┘

[Regenerate Draft] [Send Reply]
```

---

# AI Error State Wireframe

```text
Reply
┌────────────────────────────────────────────┐
│ AI draft is unavailable right now.          │
│ You can still write a manual reply.         │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Type your reply...                         │
└────────────────────────────────────────────┘

[Try AI Again] [Send Reply]
```

---

# Viewer Permission Wireframe

```text
Reply
┌────────────────────────────────────────────┐
│ You have view-only access to this          │
│ conversation.                              │
└────────────────────────────────────────────┘

[Generate AI Draft hidden]
[Send Reply hidden]
```

---

# Mobile/Small Width Deferment

Mobile optimization is out of MVP.

If viewport is narrow:

```text
show inbox first
conversation opens as single panel
profile available as drawer/tab
```

This can be P2.

---

# Wireframe Rule

```text
Every reply screen must visually separate draft state from sent message state.
```
