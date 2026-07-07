---
book: "Book IV — Product & Domain Specification"
document: "Cross Reference"
version: "1.0.0"
status: "official"
owner: "CLARA Product Architecture Team"
last_updated: "2026-07-07"
classification: "product-domain-master-index"
---

# BOOK IV — Cross Reference

> *"Use this document to connect product decisions across domains."*

---

# Domain Cross-Reference

| Product Concern | Primary Domain | Related Domains |
|---|---|---|
| Tenant isolation | PART-03 Organization and Workspace | PART-02, PART-12 |
| User access | PART-02 User Roles and Permissions | PART-03, PART-11 |
| Customer identity | PART-04 Customer CRM | PART-05, PART-10 |
| Customer communication | PART-05 Conversations and Inbox | PART-04, PART-08, PART-10 |
| Issue tracking | PART-06 Ticketing | PART-04, PART-05, PART-07 |
| Trusted answers | PART-07 Knowledge Base | PART-08, PART-12 |
| AI reply drafting | PART-08 AI Assistant Product | PART-05, PART-07 |
| Automation | PART-09 Workflow Automation | PART-05, PART-06, PART-10 |
| External channels | PART-10 Integrations and Channels | PART-05, PART-09 |
| Plan access | PART-11 Billing and Admin | PART-02, PART-08, PART-10 |
| Dashboards | PART-12 Analytics Audit Settings | PART-04, PART-05, PART-06, PART-08 |
| Audit | PART-12 Analytics Audit Settings | All sensitive domains |
| Settings | PART-12 Analytics Audit Settings | PART-03, PART-11 |

---

# Critical Cross-Domain Rules

## Customer + Conversation

A conversation should link to a customer whenever reliable identity exists.

If customer identity is uncertain, CLARA must support review and manual correction.

## Conversation + Ticket

A ticket may be created from a conversation when an issue needs durable tracking.

Ticketing should not replace conversation history.

## Knowledge + AI

AI should use only eligible, scoped knowledge.

Draft or archived knowledge should not become trusted AI grounding by default.

## AI + Workflow

AI may suggest workflows.

AI must not create active high-risk workflows without human approval.

## Integration + Inbox

Channels deliver external messages into the inbox.

External payloads must be validated, normalized, and idempotent.

## Admin + Entitlements

Product modules must check entitlements server-side.

UI feature hiding is not enough.

## Analytics + Privacy

Analytics should aggregate by default.

Raw customer content should not appear in dashboards unless explicitly authorized and justified.

---

# Book IV to Book III References

| Product Domain | Implementation Architecture Area |
|---|---|
| Roles & Permissions | Security Implementation, Product Implementation Architecture |
| Organization & Workspace | Data Architecture, Security Implementation |
| Customer CRM | Data Architecture, Backend Architecture |
| Conversations & Inbox | Integration Architecture, Backend Architecture |
| Ticketing | Backend Architecture, Testing Architecture |
| Knowledge Base | AI Architecture, Data Architecture |
| AI Assistant | AI Architecture, Security Implementation |
| Workflow Automation | Backend Architecture, Operations Architecture |
| Integrations & Channels | Integration Architecture, Security Implementation |
| Billing & Admin | Product Implementation Architecture |
| Analytics/Audit/Settings | Operations Architecture, Data Architecture |

---

# Navigation

**Previous:** `BOOK-04-IMPLEMENTATION-READINESS-GUIDE.md`

**Next:** `BOOK-04-NEXT-STEPS-TO-BOOK-05.md`
