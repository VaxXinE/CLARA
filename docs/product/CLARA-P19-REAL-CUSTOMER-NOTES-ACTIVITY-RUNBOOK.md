---
project: "CLARA"
artifact: "P19 Real Customer Notes Activity Runbook"
status: "current"
classification: "operator-runbook"
---

# P19 Real Customer Notes/Activity Runbook

Customer notes/activity are real workspace-scoped CRM workflows.

Operators may add concise internal notes when backend permission allows it.
Activity timeline shows safe events such as customer created, customer updated,
customer.note.created, status updates, owner assignment, and follow-up task
changes.

Do not store secrets, tokens, Authorization headers, raw provider payloads, raw
HTML, raw DOM, raw prompts, or payment data in notes or activity summaries.
Missing/inactive membership fails closed.
